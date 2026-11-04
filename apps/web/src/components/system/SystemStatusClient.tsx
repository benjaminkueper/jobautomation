"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSystemStatus, type ServiceStatus, type SystemStatusResponse } from "@/lib/api/system.api";
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { API_URL } from "@/config/env";

// ── Status helpers ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ServiceStatus, { label: string; dot: string; badge: string }> = {
  healthy: {
    label: "system.statusHealthy",
    dot: "bg-[var(--emerald)]",
    badge: "bg-[var(--emerald-bg)] text-[var(--emerald)]",
  },
  warning: {
    label: "system.statusWarning",
    dot: "bg-[var(--amber)]",
    badge: "bg-[var(--amber-bg)] text-[var(--amber)]",
  },
  needs_attention: {
    label: "system.statusNeedsAttention",
    dot: "bg-[var(--amber)]",
    badge: "bg-[var(--amber-bg)] text-[var(--amber)]",
  },
  not_configured: {
    label: "system.statusNotConfigured",
    dot: "bg-[var(--text-5)]",
    badge: "bg-[var(--surface-3)] text-[var(--text-3)]",
  },
  offline: {
    label: "system.statusOffline",
    dot: "bg-[var(--rose)]",
    badge: "bg-[var(--rose-bg)] text-[var(--rose)]",
  },
  disabled: {
    label: "system.statusDisabled",
    dot: "bg-[var(--text-5)]",
    badge: "bg-[var(--surface-3)] text-[var(--text-3)]",
  },
};

function StatusBadge({ status, t }: { status: ServiceStatus; t: (k: string) => string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.not_configured;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", cfg.badge)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {t(cfg.label)}
    </span>
  );
}

function OverallBanner({ status, failedLast24h, t }: { status: ServiceStatus; failedLast24h: number; t: (k: string) => string }) {
  const isGood = status === "healthy";
  const isOffline = status === "offline";
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        isGood
          ? "border-[var(--border-default)] bg-[var(--emerald-bg)]"
          : isOffline
            ? "border-[var(--border-default)] bg-[var(--rose-bg)]"
            : "border-[var(--border-default)] bg-[var(--amber-bg)]",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "h-3 w-3 rounded-full",
            isGood ? "bg-[var(--emerald)]" : isOffline ? "bg-[var(--rose)]" : "bg-[var(--amber)]",
          )}
        />
        <span className="font-semibold text-sm text-[var(--text-1)]">
          {isGood ? t("system.allSystemsOperational") : t("system.systemNeedsAttention")}
        </span>
      </div>
      {failedLast24h > 0 && (
        <span className="text-xs text-[var(--text-3)]">
          {failedLast24h} {t("system.failuresLast24h")}
        </span>
      )}
    </div>
  );
}

function ServiceRow({ name, label, status, detail, t }: {
  name: string;
  label: string;
  status: ServiceStatus;
  detail?: string;
  t: (k: string) => string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-1)] truncate">{label}</p>
        {detail && (
          <p className="mt-0.5 text-xs text-[var(--text-3)] truncate max-w-[260px]">{detail}</p>
        )}
      </div>
      <StatusBadge status={status} t={t} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function SystemStatusClient() {
  const { t } = useTranslation();
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);
  const [queueMode, setQueueMode] = useState<string | null>(null);

  const system = useApiQuery(() => getSystemStatus(), { enabled: true });
  const payload = system.data as SystemStatusResponse | undefined;

  // Fetch public /health for API reachability (no auth needed)
  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
        const json = await res.json() as { queue?: { mode?: string } };
        setApiReachable(res.ok);
        setQueueMode(json?.queue?.mode ?? null);
      } catch {
        setApiReachable(false);
      }
    })();
  }, []);

  const services = payload?.services ?? {};
  const serviceKeys = [
    "api", "database", "queue", "worker",
    "googleCalendar",
    "aiProvider", "resend", "telegram", "slack",
  ];

  // Compute overall status locally from public /health if system endpoint not yet loaded
  const overallHealth: ServiceStatus = payload?.overallHealth ??
    (apiReachable === false ? "offline" : "not_configured");

  const failedLast24h = payload?.failedLogsLast24h ?? 0;
  const recentFailedLogs = payload?.recentFailedLogs ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("system.title")}
        description={t("system.description")}
      />

      {/* Overall health banner */}
      {(payload || apiReachable === false) && (
        <OverallBanner status={overallHealth} failedLast24h={failedLast24h} t={t} />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Services checklist */}
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{t("system.servicesTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {system.loading && !payload ? (
              <p className="text-sm text-[var(--text-3)] py-4">{t("system.loadingHealth")}</p>
            ) : system.error && !payload ? (
              <p className="text-sm text-[var(--amber)] py-2">{t("system.signInForFullStatus")}</p>
            ) : (
              <div>
                {/* API reachable row — from public /health */}
                <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border">
                  <p className="text-sm font-medium text-[var(--text-1)]">{t("system.apiHealth")}</p>
                  <StatusBadge
                    status={apiReachable === null ? "not_configured" : apiReachable ? "healthy" : "offline"}
                    t={t}
                  />
                </div>
                {queueMode && (
                  <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border">
                    <p className="text-sm font-medium text-[var(--text-1)]">{t("system.queueMode")}</p>
                    <StatusBadge
                      status={queueMode === "bullmq" ? "healthy" : queueMode === "memory" ? "warning" : "disabled"}
                      t={t}
                    />
                  </div>
                )}
                {serviceKeys.map((key) => {
                  const svc = services[key];
                  if (!svc) return null;
                  return (
                    <ServiceRow
                      key={key}
                      name={key}
                      label={svc.label}
                      status={svc.status}
                      detail={svc.detail}
                      t={t}
                    />
                  );
                })}
                {Object.keys(services).length === 0 && !system.loading && (
                  <p className="py-4 text-sm text-[var(--text-3)]">{t("system.signInForFullStatus")}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Integration summary + plan */}
        <div className="space-y-4">
          <Card className="border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{t("system.integrationHealth")}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {payload ? (
                <div className="space-y-2">
                  <IntegrationSummaryRow label={t("system.connected")} count={payload.integrationHealth.connected} variant="green" />
                  <IntegrationSummaryRow label={t("system.needsAttention")} count={payload.integrationHealth.needsAttention} variant="amber" />
                  <IntegrationSummaryRow label={t("system.notConnected")} count={payload.integrationHealth.notConnected} variant="gray" />
                  {payload.integrationHealth.expired > 0 && (
                    <IntegrationSummaryRow label={t("system.expired")} count={payload.integrationHealth.expired} variant="amber" />
                  )}
                  {payload.integrationHealth.disabled > 0 && (
                    <IntegrationSummaryRow label={t("system.disabledCount")} count={payload.integrationHealth.disabled} variant="gray" />
                  )}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-3)]">{t("system.noData")}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{t("system.accountInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2 text-sm">
              {payload ? (
                <>
                  <InfoRow label={t("system.plan")} value={payload.billing.displayName} />
                  <InfoRow label={t("system.billingStatus")} value={payload.billing.billingStatus} />
                  <InfoRow label={t("system.role")} value={payload.currentUserRole || "—"} />
                  <InfoRow label={t("system.automationModules")} value={String(payload.automation.moduleCount)} />
                </>
              ) : (
                <p className="text-[var(--text-3)]">{t("system.noData")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent failed logs */}
      <Card className="border shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{t("system.recentFailedLogs")}</CardTitle>
            {failedLast24h > 0 && (
              <span className="rounded-full bg-[var(--rose-bg)] px-2 py-0.5 text-xs font-medium text-[var(--rose)]">
                {failedLast24h} {t("system.failuresLast24h")}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {recentFailedLogs.length === 0 ? (
            <p className="text-sm text-[var(--text-3)]">
              {system.loading ? t("system.loadingHealth") : t("system.noRecentFailures")}
            </p>
          ) : (
            <ul className="space-y-2">
              {recentFailedLogs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-lg border border-[var(--rose)] bg-[var(--rose-bg)] px-3 py-2 text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-[var(--rose)]">{log.moduleName}</span>
                    {log.createdAt && (
                      <span className="shrink-0 text-xs text-[var(--rose)]">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-2)]">{log.message}</p>
                  {log.error && (
                    <p className="mt-1 font-mono text-[10px] text-[var(--text-3)] truncate">{log.error}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function IntegrationSummaryRow({ label, count, variant }: { label: string; count: number; variant: "green" | "amber" | "gray" }) {
  const colors = {
    green: "text-[var(--emerald)]",
    amber: "text-[var(--amber)]",
    gray: "text-[var(--text-3)]",
  };
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--text-2)]">{label}</span>
      <span className={cn("font-semibold tabular-nums", colors[variant])}>{count}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[var(--text-3)]">{label}</span>
      <span className="text-[var(--text-1)] font-medium text-right">{value}</span>
    </div>
  );
}
