import { IntegrationConnectionModel } from "@jobflow/database/models";
import { isRealJobOpportunity } from "@jobflow/integrations/ai/ai.service";
import type { JobIntakeEmailPayload } from "@jobflow/shared/types/job";
import { env } from "../config/env";
import { ApiError } from "../utils/errors";
import { assertTenantId } from "./baseTenant.service";
import { processJobIntakeEmail } from "./job-intake.service";
import {
  createUnipileHostedAuthLink,
  ensureUnipileEmailWebhook,
  getUnipileAccount,
  getUnipileEmail,
  listUnipileAccounts,
  listUnipileEmails,
  listUnipileFolders,
  unipileConfigured,
  type UnipileAccount,
  type UnipileEmail,
  type UnipileFolder,
} from "./unipile.client";

export const UNIPILE_EMAIL_PROVIDER = "Unipile Email";

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<(br|\/p|\/div|\/tr|\/li|\/h[1-6])[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function encodeUnipileConnectName(tenantId: string, userId: string): string {
  return `${tenantId}|${userId}`;
}

export function decodeUnipileConnectName(name: string): { tenantId: string; userId: string } | null {
  const parts = name.split("|");
  if (parts.length < 2) return null;
  const tenantId = parts[0]?.trim();
  const userId = parts.slice(1).join("|").trim();
  if (!tenantId || !userId) return null;
  return { tenantId, userId };
}

function publicApiBase(reqOrigin?: string): string {
  const fromEnv = (env.apiPublicUrl || process.env.API_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const fromReq = (reqOrigin ?? "").replace(/\/$/, "");
  if (fromReq) return fromReq;
  throw new ApiError(
    "API_PUBLIC_URL is required for Unipile callbacks. Set it on Railway to your API URL (e.g. https://jobautomation-production.up.railway.app).",
    500,
    "CONFIG_ERROR"
  );
}

function webAppBase(): string {
  return (env.appUrl || process.env.WEB_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

let webhookEnsurePromise: Promise<void> | null = null;

/** Best-effort: register Unipile mail_received webhook once per process. */
export async function ensureUnipileWebhookRegistered(apiPublicOrigin?: string): Promise<void> {
  if (!unipileConfigured()) return;
  if (webhookEnsurePromise) return webhookEnsurePromise;

  webhookEnsurePromise = (async () => {
    try {
      const apiBase = publicApiBase(apiPublicOrigin);
      if (!apiBase || /localhost|127\.0\.0\.1/.test(apiBase)) {
        console.info("[unipile] skip webhook register — API_PUBLIC_URL not a public host");
        return;
      }
      const requestUrl = `${apiBase}/integrations/unipile/webhook`;
      const secret = process.env.UNIPILE_WEBHOOK_SECRET?.trim() || undefined;
      const result = await ensureUnipileEmailWebhook({ requestUrl, secret });
      console.info("[unipile] webhook ensure", { requestUrl, ...result });
    } catch (err) {
      webhookEnsurePromise = null;
      const message = err instanceof Error ? err.message : String(err);
      console.warn("[unipile] webhook ensure failed", { message });
    }
  })();

  return webhookEnsurePromise;
}

/**
 * Pre-filter before spending AI credits. Uses the same rule-based classifier
 * as the intake service, so LinkedIn connection/PYMK notifications are never
 * treated as jobs just because the word "linkedin" appears in the body.
 */
export function looksLikeJobAlertEmail(input: { from: string; subject: string; bodyText: string }): boolean {
  return isRealJobOpportunity({
    provider: "unipile",
    providerMessageId: "prefilter",
    providerThreadId: undefined,
    from: input.from,
    subject: input.subject,
    bodyText: input.bodyText,
    receivedAt: new Date().toISOString(),
    labels: undefined,
    raw: undefined,
  }).isJob;
}

/**
 * Job-alert label name. Order: UNIPILE_JOB_LABEL, then the label parsed from
 * GMAIL_JOB_QUERY (`label:job-alerts`) or GMAIL_JOB_ALERT_QUERY.
 */
export function resolveJobLabelName(): string | null {
  const explicit = (process.env.UNIPILE_JOB_LABEL ?? "").trim();
  if (explicit) return explicit;
  for (const raw of [process.env.GMAIL_JOB_QUERY, process.env.GMAIL_JOB_ALERT_QUERY]) {
    const value = (raw ?? "").trim();
    if (!value) continue;
    const match = value.match(/label:("([^"]+)"|'([^']+)'|(\S+))/i);
    const name = (match?.[2] ?? match?.[3] ?? match?.[4] ?? "").replace(/^[-\\/]/, "").trim();
    if (name) return name;
  }
  return null;
}

function normalizeFolderName(name: string): string {
  return name.trim().toLowerCase();
}

function folderRef(folder: UnipileFolder): string {
  return String(folder.provider_id ?? folder.id ?? "").trim();
}

/** Resolve the inbox folder and the job-alert label folder for an account. */
export async function resolveUnipileScanFolders(accountId: string): Promise<{
  inbox: UnipileFolder | null;
  jobLabel: UnipileFolder | null;
  jobLabelName: string | null;
}> {
  const jobLabelName = resolveJobLabelName();
  let folders: UnipileFolder[] = [];
  try {
    const res = await listUnipileFolders({ accountId });
    folders = res.items ?? res.data ?? [];
  } catch {
    folders = [];
  }
  const inbox = folders.find((f) => String(f.role ?? "").toLowerCase() === "inbox") ?? null;
  let jobLabel: UnipileFolder | null = null;
  if (jobLabelName) {
    const wanted = normalizeFolderName(jobLabelName);
    jobLabel =
      folders.find((f) => normalizeFolderName(String(f.name ?? "")) === wanted) ??
      folders.find((f) => String(f.provider_id ?? "") === jobLabelName) ??
      null;
  }
  return { inbox, jobLabel, jobLabelName };
}

async function listFolderEmails(
  accountId: string,
  folder: UnipileFolder | null,
  limit: number
): Promise<UnipileEmail[]> {
  const all: UnipileEmail[] = [];
  const pageSize = Math.min(100, Math.max(1, limit));
  let cursor: string | undefined;

  for (let page = 0; page < 50; page++) {
    const res = await listUnipileEmails({
      accountId,
      limit: pageSize,
      folder: folder ? folderRef(folder) || undefined : undefined,
      cursor,
    });
    const batch = res.items ?? res.data ?? [];
    all.push(...batch);
    cursor = res.cursor;
    if (!cursor || batch.length === 0 || all.length >= limit) break;
  }

  return all.slice(0, limit);
}

export function mapUnipileEmailToIntakePayload(email: UnipileEmail): JobIntakeEmailPayload {
  const from =
    email.from_attendee?.identifier ||
    email.from_attendee?.display_name ||
    "unknown@unknown";
  const subject = String(email.subject ?? "").trim() || "(no subject)";
  const bodyRaw = String(email.body_plain || email.body || "").trim();
  const bodyText = bodyRaw.includes("<") ? stripHtml(bodyRaw) : bodyRaw;
  const providerMessageId = String(
    email.id || email.email_id || email.message_id || email.provider_id || `${from}:${subject}:${email.date ?? ""}`
  );

  return {
    provider: "unipile",
    providerMessageId,
    providerThreadId: email.message_id ? String(email.message_id) : undefined,
    from,
    subject,
    bodyText: bodyText || subject,
    receivedAt: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
    labels: email.folders ?? (email.role ? [email.role] : undefined),
    raw: email as unknown as Record<string, unknown>,
  };
}

export async function createUnipileEmailConnectLink(input: {
  tenantId: string;
  userId: string;
  /** Optional public API origin override from the incoming request */
  apiPublicOrigin?: string;
}): Promise<{ url: string; expiresInMinutes: number }> {
  if (!unipileConfigured()) {
    throw new ApiError(
      "Unipile is not configured on the server. Set UNIPILE_DSN and UNIPILE_API_KEY on Railway.",
      503,
      "UNIPILE_NOT_CONFIGURED"
    );
  }
  const tenantId = assertTenantId(input.tenantId);
  const apiBase = publicApiBase(input.apiPublicOrigin);
  const webBase = webAppBase();
  const expiresInMinutes = 30;

  try {
    const res = await createUnipileHostedAuthLink({
      name: encodeUnipileConnectName(tenantId, input.userId),
      notifyUrl: `${apiBase}/integrations/unipile/notify`,
      successRedirectUrl: `${webBase}/settings?section=Integrations&unipile=connected`,
      failureRedirectUrl: `${webBase}/settings?section=Integrations&unipile=failed`,
      providers: ["GOOGLE"],
      expiresInMinutes,
    });

    if (!res.url) throw new ApiError("Unipile did not return a connect URL", 502, "UNIPILE_ERROR");
    return { url: res.url, expiresInMinutes };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[unipile] create connect link failed", { message, apiBase });
    throw new ApiError(`Unipile connect failed: ${message}`, 502, "UNIPILE_ERROR");
  }
}

export async function upsertUnipileEmailConnection(input: {
  tenantId: string;
  userId: string;
  accountId: string;
  status?: "Connected" | "Needs Attention";
}) {
  const tenantId = assertTenantId(input.tenantId);
  let connectedEmail = "";
  let accountName = "Gmail via Unipile";
  try {
    const account = await getUnipileAccount(input.accountId);
    connectedEmail = String(
      account.email ||
        account.username ||
        (account as { connection_params?: { mail?: { username?: string } } }).connection_params?.mail?.username ||
        ""
    );
    accountName = connectedEmail || String(account.name || accountName);
  } catch {
    // Account fetch is best-effort
  }

  await IntegrationConnectionModel.findOneAndUpdate(
    { tenantId, provider: UNIPILE_EMAIL_PROVIDER },
    {
      tenantId,
      provider: UNIPILE_EMAIL_PROVIDER,
      status: input.status ?? "Connected",
      connectedEmail: connectedEmail || undefined,
      accountName,
      metadata: {
        unipileAccountId: input.accountId,
        connectedAt: new Date().toISOString(),
        source: "unipile-hosted-auth",
      },
      syncStatus: "OK",
      errorMessage: undefined,
      updatedBy: input.userId,
      createdBy: input.userId,
    },
    { upsert: true, new: true }
  );

  // Register global email webhook so new mail can push into intake (Scan now remains fallback)
  void ensureUnipileWebhookRegistered();
}

export async function getUnipileEmailStatus(tenantId: string) {
  const row = (await IntegrationConnectionModel.findOne({
    tenantId: assertTenantId(tenantId),
    provider: UNIPILE_EMAIL_PROVIDER,
  }).lean()) as Record<string, unknown> | null;

  if (!row) {
    return {
      connected: false as const,
      configured: unipileConfigured(),
    };
  }

  const meta = (row.metadata as Record<string, unknown>) ?? {};
  return {
    connected: row.status === "Connected",
    configured: unipileConfigured(),
    status: String(row.status ?? ""),
    connectedEmail: row.connectedEmail ? String(row.connectedEmail) : null,
    accountName: row.accountName ? String(row.accountName) : null,
    accountId: meta.unipileAccountId ? String(meta.unipileAccountId) : null,
    lastSyncAt: row.lastSyncAt ? String(row.lastSyncAt) : null,
  };
}

export async function disconnectUnipileEmail(input: { tenantId: string; userId: string }) {
  await IntegrationConnectionModel.findOneAndUpdate(
    { tenantId: assertTenantId(input.tenantId), provider: UNIPILE_EMAIL_PROVIDER },
    {
      status: "Disabled",
      syncStatus: "Disconnected",
      updatedBy: input.userId,
      $unset: { "metadata.unipileAccountId": 1 },
    }
  );
}

async function loadConnectedAccount(tenantId: string): Promise<{ accountId: string; userId: string } | null> {
  const row = (await IntegrationConnectionModel.findOne({
    tenantId: assertTenantId(tenantId),
    provider: UNIPILE_EMAIL_PROVIDER,
    status: "Connected",
  }).lean()) as Record<string, unknown> | null;
  if (!row) return null;
  const meta = (row.metadata as Record<string, unknown>) ?? {};
  const accountId = String(meta.unipileAccountId ?? "").trim();
  if (!accountId) return null;
  return { accountId, userId: String(row.updatedBy || row.createdBy || "system") };
}

export async function scanUnipileEmailsForTenant(input: {
  tenantId: string;
  userId?: string;
  limit?: number;
  forceAll?: boolean;
}) {
  const intakeEnabled = process.env.UNIPILE_EMAIL_INTAKE_ENABLED !== "false";
  if (!intakeEnabled) {
    throw new ApiError("Unipile email intake is disabled", 503, "UNIPILE_INTAKE_DISABLED");
  }
  if (!unipileConfigured()) {
    throw new ApiError("Unipile is not configured", 503, "UNIPILE_NOT_CONFIGURED");
  }

  const connected = await loadConnectedAccount(input.tenantId);
  if (!connected) throw new ApiError("Connect Unipile email first", 422, "INTEGRATION_NOT_CONNECTED");

  void ensureUnipileWebhookRegistered();

  const limit = Math.min(1000, Math.max(1, input.limit ?? 200));
  const { inbox, jobLabel, jobLabelName } = await resolveUnipileScanFolders(connected.accountId);

  // Scan the whole inbox AND the job-alerts label (when it exists), then de-dupe.
  const [inboxEmails, labelEmails] = await Promise.all([
    listFolderEmails(connected.accountId, inbox, limit),
    jobLabel ? listFolderEmails(connected.accountId, jobLabel, limit) : Promise.resolve([]),
  ]);

  const seen = new Set<string>();
  const items: UnipileEmail[] = [];
  for (const item of [...labelEmails, ...inboxEmails]) {
    const key = String(item.id || item.email_id || item.message_id || "").trim();
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    items.push(item);
  }

  let processed = 0;
  let skipped = 0;
  let created = 0;
  let duplicates = 0;
  const errors: string[] = [];

  for (const item of items) {
    try {
      const emailId = String(item.id || item.email_id || "").trim();
      let full = item;
      if (emailId) {
        try {
          full = await getUnipileEmail({ emailId, accountId: connected.accountId });
        } catch {
          full = item;
        }
      }
      const payload = mapUnipileEmailToIntakePayload(full);
      if (!input.forceAll && !looksLikeJobAlertEmail(payload)) {
        skipped++;
        continue;
      }
      const result = await processJobIntakeEmail({
        tenantId: input.tenantId,
        userId: input.userId || connected.userId,
        payload,
      });
      processed++;
      if (result.status === "created") created++;
      else if (result.status === "duplicate") duplicates++;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }

  await IntegrationConnectionModel.updateOne(
    { tenantId: input.tenantId, provider: UNIPILE_EMAIL_PROVIDER },
    { lastSyncAt: new Date(), syncStatus: "OK" }
  );

  return {
    accountId: connected.accountId,
    listed: items.length,
    processed,
    skipped,
    created,
    duplicates,
    folders: {
      inbox: inbox ? String(inbox.name ?? inbox.id) : null,
      jobLabel: jobLabel ? String(jobLabel.name ?? jobLabel.provider_id) : jobLabelName,
      jobLabelFound: Boolean(jobLabel),
    },
    errors: errors.slice(0, 5),
  };
}

/** Best-effort: link the tenant to a Unipile account created by hosted auth. */
export async function reconcileUnipileConnection(input: { tenantId: string; userId?: string }) {
  if (!unipileConfigured()) {
    throw new ApiError("Unipile is not configured on the server", 503, "UNIPILE_NOT_CONFIGURED");
  }
  const tenantId = assertTenantId(input.tenantId);
  let accounts: UnipileAccount[] = [];
  try {
    const res = await listUnipileAccounts({ limit: 100 });
    accounts = res.items ?? res.data ?? [];
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    throw new ApiError(`Unipile reconcile failed: ${message}`, 502, "UNIPILE_ERROR");
  }

  const matches = accounts.filter((acc) => {
    const decoded = decodeUnipileConnectName(String(acc.name ?? ""));
    return decoded?.tenantId === tenantId;
  });

  let account: UnipileAccount | undefined;
  let matchedBy: "name" | "single_account" = "name";

  if (matches.length > 0) {
    matches.sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
    account = matches[0];
  } else if (accounts.length === 1) {
    // Fallback: a single Unipile account and no name match — assume it's theirs
    // (covers providers that don't echo the hosted-link `name`).
    account = accounts[0];
    matchedBy = "single_account";
  }

  if (!account) {
    return {
      linked: false,
      reason: "no_matching_account",
      accounts: accounts.map((a) => ({ id: a.id, name: a.name, type: a.type })),
    };
  }

  const decoded = decodeUnipileConnectName(String(account.name ?? ""));
  const userId = decoded?.userId || input.userId || "system";

  await upsertUnipileEmailConnection({ tenantId, userId, accountId: account.id });

  return { linked: true, accountId: account.id, userId, matchedBy };
}

/** Confirm the configured Unipile credentials actually work. */
export async function testUnipileConnection(): Promise<{
  ok: boolean;
  configured: boolean;
  accounts: number;
  message: string;
}> {
  if (!unipileConfigured()) {
    return {
      ok: false,
      configured: false,
      accounts: 0,
      message: "Unipile is not configured (UNIPILE_DSN / UNIPILE_API_KEY missing)",
    };
  }
  try {
    const res = await listUnipileAccounts({ limit: 25 });
    const items = res.items ?? res.data ?? [];
    return {
      ok: true,
      configured: true,
      accounts: items.length,
      message: `Unipile API OK — ${items.length} account(s) linked`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, configured: true, accounts: 0, message };
  }
}

export async function processUnipileMailWebhook(body: Record<string, unknown>) {
  const event = String(body.event || body.type || "").toLowerCase();
  if (event && !["mail_received", "email.new", "mail_moved"].includes(event) && body.email_id == null && !body.email) {
    return { ignored: true, reason: `event:${event || "unknown"}` };
  }

  // Ignore outbound sent mail for job intake
  if (event === "mail_sent") return { ignored: true, reason: "mail_sent" };

  const accountId = String(body.account_id ?? "").trim();
  if (!accountId) return { ignored: true, reason: "missing_account_id" };

  const row = (await IntegrationConnectionModel.findOne({
    provider: UNIPILE_EMAIL_PROVIDER,
    status: "Connected",
    "metadata.unipileAccountId": accountId,
  }).lean()) as Record<string, unknown> | null;

  if (!row) return { ignored: true, reason: "unknown_account" };

  const tenantId = String(row.tenantId);
  const userId = String(row.updatedBy || row.createdBy || "system");

  let email: UnipileEmail;
  if (body.email && typeof body.email === "object") {
    email = body.email as UnipileEmail;
  } else if (body.body || body.subject || body.email_id) {
    email = body as UnipileEmail;
  } else {
    return { ignored: true, reason: "no_email_payload" };
  }

  // Prefer full fetch when only id is present
  const emailId = String(email.id || email.email_id || body.email_id || "").trim();
  if (emailId && !email.body && !email.body_plain) {
    try {
      email = await getUnipileEmail({ emailId, accountId });
    } catch {
      // keep partial
    }
  }

  const payload = mapUnipileEmailToIntakePayload({ ...email, account_id: accountId });
  if (!looksLikeJobAlertEmail(payload)) {
    return { ignored: true, reason: "not_job_alert", subject: payload.subject };
  }

  if (process.env.UNIPILE_EMAIL_INTAKE_ENABLED === "false") {
    return { ignored: true, reason: "intake_disabled" };
  }

  const result = await processJobIntakeEmail({ tenantId, userId, payload });
  await IntegrationConnectionModel.updateOne(
    { _id: row._id },
    { lastSyncAt: new Date(), syncStatus: "OK" }
  );

  return {
    ignored: false,
    tenantId,
    jobId: result.jobId,
    status: result.status,
  };
}
