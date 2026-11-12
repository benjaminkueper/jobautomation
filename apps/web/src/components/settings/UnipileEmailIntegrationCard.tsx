"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/useTranslation";
import {
  createUnipileConnectLink,
  disconnectUnipile,
  getUnipileHealth,
  getUnipileStatus,
  reconcileUnipile,
  scanUnipileEmails,
  type UnipileAccountCandidate,
  type UnipileStatus,
} from "@/lib/api/unipile.api";
import { ApiError } from "@/lib/api/client";
import { showError, showSuccess } from "@/lib/ui/toast";

export function UnipileEmailIntegrationCard({
  onConnectionChange,
}: {
  onConnectionChange?: () => void;
}) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<UnipileStatus | null>(null);
  const [candidates, setCandidates] = useState<UnipileAccountCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [testing, setTesting] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoReconcileTried = useRef(false);
  const reconcileInFlight = useRef(false);
  const returnToastShown = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const s = await getUnipileStatus();
      setStatus(s);
    } catch {
      setStatus({ connected: false, configured: false });
    }
  }, []);

  const runReconcile = useCallback(
    async (opts?: { accountId?: string; notify?: boolean }) => {
      if (reconcileInFlight.current) return null;
      reconcileInFlight.current = true;
      try {
        const res = await reconcileUnipile(opts?.accountId ? { accountId: opts.accountId } : undefined);
        if (res.candidates?.length) setCandidates(res.candidates);
        if (res.linked) {
          setError(null);
          await refresh();
          onConnectionChange?.();
          if (opts?.notify) showSuccess(t("integrations.unipile.connectedToast"));
        }
        return res;
      } catch (e) {
        if (opts?.accountId) {
          const message = e instanceof Error ? e.message : t("integrations.unipile.connectFailed");
          setError(message);
          showError(message);
        }
        return null;
      } finally {
        reconcileInFlight.current = false;
      }
    },
    [refresh, t, onConnectionChange]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Self-heal only when there is a reason to: a "Connect" click is pending or
  // the user just returned from hosted auth. Refreshing an existing healthy link
  // is harmless and fills the mailbox switcher. A manual disconnect is respected.
  const returnedFromConnect = searchParams.get("unipile") === "connected";
  useEffect(() => {
    if (!status || status.configured === false) return;
    if (!status.pendingConnect && !status.connected && !returnedFromConnect) return;
    if (autoReconcileTried.current) return;
    autoReconcileTried.current = true;
    void runReconcile();
  }, [status, returnedFromConnect, runReconcile]);

  // Toast once when the user returns from the hosted-auth flow.
  useEffect(() => {
    const flag = searchParams.get("unipile");
    if (flag === "failed") {
      showError(t("integrations.unipile.failedToast"));
      setError(t("integrations.unipile.failedToast"));
      return;
    }
    if (flag === "connected" && status?.connected && !returnToastShown.current) {
      returnToastShown.current = true;
      showSuccess(t("integrations.unipile.connectedToast"));
    }
  }, [searchParams, status?.connected, t]);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    try {
      const res = await createUnipileConnectLink();
      if (!res.url) throw new Error(t("integrations.unipile.connectFailed"));
      window.location.assign(res.url);
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : t("integrations.unipile.connectFailed");
      setError(message);
      showError(message);
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    setError(null);
    try {
      await disconnectUnipile();
      showSuccess(t("integrations.unipile.disconnectedToast"));
      setCandidates([]);
      await refresh();
      onConnectionChange?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : t("integrations.unipile.disconnectFailed");
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSwitch(accountId: string) {
    setSwitching(accountId);
    setError(null);
    try {
      await runReconcile({ accountId, notify: true });
    } finally {
      setSwitching(null);
    }
  }

  const handleScan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const res = await scanUnipileEmails({ limit: 200 });
      const label = res.folders?.jobLabel
        ? `${res.folders.jobLabel}${res.folders.jobLabelFound ? "" : " (not found)"}`
        : "-";
      showSuccess(
        `${t("integrations.unipile.scanSuccess")}: ${res.processed} processed, ${res.created} new jobs, ${res.duplicates ?? 0} duplicates · inbox + ${label}`
      );
      await refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : t("integrations.unipile.scanFailed");
      setError(message);
      showError(message);
    } finally {
      setScanning(false);
    }
  }, [refresh, t]);

  async function handleTest() {
    setTesting(true);
    setError(null);
    try {
      const res = await getUnipileHealth();
      if (res.ok) {
        showSuccess(res.message);
      } else {
        setError(res.message);
        showError(res.message);
      }
      await refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : t("integrations.unipile.connectFailed");
      setError(message);
      showError(message);
    } finally {
      setTesting(false);
    }
  }

  const connected = Boolean(status?.connected);
  const configured = status?.configured !== false;
  const switchable = configured && candidates.length > 1;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">{t("integrations.unipile.title")}</CardTitle>
        <CardDescription>{t("integrations.unipile.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm">
        <p className="text-muted-foreground">{t("integrations.unipile.body")}</p>

        {!configured ? (
          <p className="rounded-md border border-[var(--rose-ring)] bg-[var(--rose-bg)] px-3 py-2 text-xs">
            {t("integrations.unipile.notConfigured")}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-md border border-[var(--rose-ring)] bg-[var(--rose-bg)] px-3 py-2 text-xs text-[var(--text-2)]">
            {error}
          </p>
        ) : null}

        {connected ? (
          <p className="text-xs text-emerald-600">
            {t("integrations.unipile.connected")}
            {status?.connectedEmail ? ` — ${status.connectedEmail}` : ""}
            {status?.lastSyncAt ? ` · ${new Date(status.lastSyncAt).toLocaleString()}` : ""}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {switchable
              ? t("integrations.unipile.choosePrompt")
              : t("integrations.unipile.notConnected")}
          </p>
        )}

        {switchable ? (
          <div className="rounded-md border border-[var(--border-default)] bg-[var(--surface-2)] px-3 py-2">
            <p className="mb-2 text-xs text-muted-foreground">
              {connected
                ? t("integrations.unipile.switchEmail")
                : t("integrations.unipile.chooseEmail")}
            </p>
            <div className="flex flex-wrap gap-2">
              {candidates.map((c) => {
                const currentEmail = (status?.connectedEmail ?? "").trim().toLowerCase();
                const current =
                  connected &&
                  ((c.email ?? "").trim().toLowerCase() === currentEmail || c.id === status?.accountId);
                const label = c.email || c.name || c.id;
                return (
                  <Button
                    key={c.id}
                    type="button"
                    size="sm"
                    variant={current ? "default" : "outline"}
                    disabled={current || switching !== null}
                    onClick={() => void handleSwitch(c.id)}
                  >
                    {switching === c.id
                      ? t("integrations.unipile.switching")
                      : current
                        ? `${label} ✓`
                        : label}
                  </Button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 [&>button]:min-w-[88px]">
          {!connected ? (
            <Button type="button" size="sm" disabled={loading || !configured} onClick={() => void handleConnect()}>
              {loading ? t("integrations.unipile.connecting") : t("integrations.unipile.connect")}
            </Button>
          ) : (
            <>
              <Button type="button" size="sm" disabled={scanning} onClick={() => void handleScan()}>
                {scanning ? t("integrations.unipile.scanning") : t("integrations.unipile.scanNow")}
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={loading} onClick={() => void handleDisconnect()}>
                {t("integrations.unipile.disconnect")}
              </Button>
            </>
          )}
          <Button type="button" size="sm" variant="outline" disabled={testing || !configured} onClick={() => void handleTest()}>
            {testing ? t("integrations.unipile.testing") : t("integrations.unipile.testConnection")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
