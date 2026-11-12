import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/errors";
import { assertTenantId } from "../services/baseTenant.service";
import {
  createUnipileEmailConnectLink,
  decodeUnipileConnectName,
  disconnectUnipileEmail,
  getUnipileEmailStatus,
  processUnipileMailWebhook,
  reconcileUnipileConnection,
  resolveUnipileScanFolders,
  scanUnipileEmailsForTenant,
  testUnipileConnection,
  upsertUnipileEmailConnection,
} from "../services/unipile-email.service";

/** POST /integrations/unipile/connect — returns hosted auth URL */
export const createUnipileConnectHandler = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = assertTenantId(req.tenantId);
  const userId = req.user?.id;
  if (!userId) throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");

  const forwardedProto = req.header("x-forwarded-proto");
  const forwardedHost = req.header("x-forwarded-host") || req.header("host");
  const apiPublicOrigin =
    forwardedProto && forwardedHost ? `${forwardedProto}://${forwardedHost}` : undefined;

  // The browser origin tells us where to send the user back after hosted auth.
  // Without it, APP_URL may still be localhost on production and the user lands
  // on an unreachable page (so the connection never gets linked).
  const webPublicOrigin = requestWebOrigin(req);

  const result = await createUnipileEmailConnectLink({
    tenantId,
    userId,
    apiPublicOrigin,
    webPublicOrigin,
  });
  return successResponse(res, result, "Unipile connect link created");
});

function requestWebOrigin(req: Request): string | undefined {
  const origin = req.header("origin");
  if (origin && /^https?:\/\//i.test(origin)) return origin.replace(/\/$/, "");
  const referer = req.header("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.protocol === "http:" || url.protocol === "https:") return url.origin;
    } catch {
      // ignore malformed Referer
    }
  }
  return undefined;
}

/** GET /integrations/unipile/status */
export const getUnipileStatusHandler = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = assertTenantId(req.tenantId);
  const status = await getUnipileEmailStatus(tenantId);
  return successResponse(res, status, "Unipile status");
});

/** GET /integrations/unipile/health — confirm Unipile credentials work */
export const testUnipileHandler = asyncHandler(async (_req: Request, res: Response) => {
  const result = await testUnipileConnection();
  return successResponse(res, result, result.message);
});

/** POST /integrations/unipile/reconcile — link account after hosted auth (no server webhook needed) */
export const reconcileUnipileHandler = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = assertTenantId(req.tenantId);
  const userId = req.user?.id ?? "system";
  const accountId =
    typeof req.body?.accountId === "string" && req.body.accountId.trim()
      ? req.body.accountId.trim()
      : undefined;
  const result = await reconcileUnipileConnection({ tenantId, userId, accountId });
  return successResponse(res, result, result.linked ? "Unipile account linked" : "No matching Unipile account");
});

/** GET /integrations/unipile/folders — list folders/labels (debug) */
export const listUnipileFoldersHandler = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = assertTenantId(req.tenantId);
  const status = await getUnipileEmailStatus(tenantId);
  const accountId = "accountId" in status ? status.accountId : null;
  if (!accountId) throw new ApiError("Connect Unipile email first", 422, "INTEGRATION_NOT_CONNECTED");
  const folders = await resolveUnipileScanFolders(String(accountId));
  return successResponse(res, folders, "Unipile folders");
});

/** DELETE /integrations/unipile/disconnect */
export const disconnectUnipileHandler = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = assertTenantId(req.tenantId);
  const userId = req.user?.id ?? "system";
  await disconnectUnipileEmail({ tenantId, userId });
  return successResponse(res, { disconnected: true }, "Unipile email disconnected");
});

/** POST /integrations/unipile/scan — pull recent emails and run intake */
export const scanUnipileHandler = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = assertTenantId(req.tenantId);
  const userId = req.user?.id ?? "system";
  const limit = typeof req.body?.limit === "number" ? req.body.limit : undefined;
  const forceAll = req.body?.forceAll === true;
  const result = await scanUnipileEmailsForTenant({ tenantId, userId, limit, forceAll });
  return successResponse(res, result, "Unipile scan completed");
});

/**
 * POST /integrations/unipile/notify — hosted auth callback (public).
 * Payload: { status, account_id, name }
 */
export const unipileNotifyHandler = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as { status?: string; account_id?: string; name?: string };
  const status = String(body.status ?? "");
  const accountId = String(body.account_id ?? "").trim();
  const name = String(body.name ?? "").trim();

  if (!accountId || !name) {
    throw new ApiError("Invalid Unipile notify payload", 422, "VALIDATION_ERROR");
  }
  if (status && !["CREATION_SUCCESS", "RECONNECTED"].includes(status)) {
    return successResponse(res, { ignored: true, status }, "Ignored notify status");
  }

  const decoded = decodeUnipileConnectName(name);
  if (!decoded) {
    // Unipile usually replaces the hosted-link `name` with the mailbox address,
    // so it cannot always identify the tenant. The Settings card reconciles the
    // account on return; acknowledge instead of failing the callback.
    console.warn("[unipile] notify ignored — name is not a tenant marker", { accountId, name });
    return successResponse(res, { ignored: true, reason: "unmapped_name" }, "Unipile account acknowledged");
  }

  await upsertUnipileEmailConnection({
    tenantId: decoded.tenantId,
    userId: decoded.userId,
    accountId,
  });

  console.info("[unipile] account linked", {
    tenantId: decoded.tenantId,
    accountId,
    status: status || "CREATION_SUCCESS",
  });

  return successResponse(res, { linked: true, accountId }, "Unipile account linked");
});

/** POST /integrations/unipile/webhook — email events (public) */
export const unipileWebhookHandler = asyncHandler(async (req: Request, res: Response) => {
  const secret = process.env.UNIPILE_WEBHOOK_SECRET?.trim();
  if (secret) {
    const header =
      req.header("x-unipile-webhook-secret") ||
      req.header("x-webhook-secret") ||
      req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (header !== secret) {
      throw new ApiError("Invalid webhook secret", 401, "UNAUTHORIZED");
    }
  }

  const result = await processUnipileMailWebhook((req.body ?? {}) as Record<string, unknown>);
  console.info("[unipile] webhook processed", result);
  return successResponse(res, result, "Webhook processed");
});
