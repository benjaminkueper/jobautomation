import { apiFetch } from "./client";

export type UnipileStatus = {
  connected: boolean;
  configured?: boolean;
  status?: string;
  connectedEmail?: string | null;
  accountName?: string | null;
  accountId?: string | null;
  lastSyncAt?: string | null;
};

export function getUnipileStatus() {
  return apiFetch<UnipileStatus>("/integrations/unipile/status");
}

export function createUnipileConnectLink() {
  return apiFetch<{ url: string; expiresInMinutes: number }>("/integrations/unipile/connect", {
    method: "POST",
    body: {},
  });
}

export function reconcileUnipile() {
  return apiFetch<{
    linked: boolean;
    accountId?: string;
    userId?: string;
    matchedBy?: "name" | "single_account";
    reason?: string;
    accounts?: Array<{ id?: string; name?: string; type?: string }>;
  }>("/integrations/unipile/reconcile", { method: "POST", body: {} });
}

export function getUnipileHealth() {
  return apiFetch<{ ok: boolean; configured: boolean; accounts: number; message: string }>(
    "/integrations/unipile/health"
  );
}

export function getUnipileFolders() {
  return apiFetch<{
    inbox: { id?: string; name?: string; role?: string } | null;
    jobLabel: { id?: string; name?: string; provider_id?: string } | null;
    jobLabelName: string | null;
  }>("/integrations/unipile/folders");
}

export function disconnectUnipile() {
  return apiFetch<{ disconnected: boolean }>("/integrations/unipile/disconnect", {
    method: "DELETE",
  });
}

export function scanUnipileEmails(input?: { limit?: number; forceAll?: boolean }) {
  return apiFetch<{
    listed: number;
    processed: number;
    skipped: number;
    created: number;
    folders?: { inbox: string | null; jobLabel: string | null; jobLabelFound: boolean };
    errors: string[];
  }>("/integrations/unipile/scan", {
    method: "POST",
    body: input ?? {},
  });
}
