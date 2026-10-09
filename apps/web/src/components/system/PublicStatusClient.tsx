"use client";

import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/config/env";

type HealthResponse = {
  success?: boolean;
  service?: string;
  status?: string;
  version?: string;
  environment?: string;
  uptime?: number;
  database?: { status?: string };
  queue?: { mode?: string };
};

type State = "operational" | "degraded" | "down" | "unknown";

const STATE_STYLES: Record<State, { label: string; dot: string; badge: string }> = {
  operational: {
    label: "Operational",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  degraded: {
    label: "Degraded",
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  down: {
    label: "Down",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
  unknown: {
    label: "Unknown",
    dot: "bg-slate-300",
    badge: "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400",
  },
};

function formatUptime(seconds?: number): string {
  if (typeof seconds !== "number" || seconds <= 0) return "—";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function StatusBadge({ state }: { state: State }) {
  const cfg = STATE_STYLES[state];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ServiceRow({ name, detail, state }: { name: string; detail?: string; state: State }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 py-3.5 last:border-0 dark:border-white/10">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{name}</p>
        {detail ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{detail}</p> : null}
      </div>
      <StatusBadge state={state} />
    </div>
  );
}

export function PublicStatusClient() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
      const json = (await res.json()) as HealthResponse;
      setData(json);
      setError(!res.ok);
    } catch {
      setData(null);
      setError(true);
    } finally {
      setCheckedAt(new Date());
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  const apiState: State = error ? "down" : data?.status === "ok" ? "operational" : "unknown";
  const dbConnected = data?.database?.status === "connected";
  const dbState: State = error ? "unknown" : dbConnected ? "operational" : data ? "degraded" : "unknown";
  const queueMode = data?.queue?.mode;
  const queueState: State =
    error ? "unknown" : queueMode === "bullmq" ? "operational" : queueMode === "memory" ? "degraded" : "unknown";

  const overall: State =
    error || apiState === "down"
      ? "down"
      : apiState === "operational" && dbConnected
        ? "operational"
        : data
          ? "degraded"
          : "unknown";

  const overallCopy =
    overall === "operational"
      ? "All systems operational"
      : overall === "degraded"
        ? "Partial service disruption"
        : overall === "down"
          ? "Service disruption detected"
          : "Checking system status";

  return (
    <div className="space-y-6">
      <div
        className={`flex flex-col gap-1 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
          overall === "operational"
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
            : overall === "down"
              ? "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
              : "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`h-3 w-3 rounded-full ${
              loading ? "bg-slate-300" : overall === "operational" ? "bg-emerald-500" : overall === "down" ? "bg-red-500" : "bg-amber-400"
            } ${loading ? "animate-pulse" : ""}`}
          />
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{loading ? "Checking system status" : overallCopy}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          {checkedAt ? <span>Last checked {checkedAt.toLocaleTimeString()}</span> : null}
          <button
            type="button"
            onClick={() => void check()}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-3 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Services</h2>
        <div className="mt-3">
          <ServiceRow name="Web application" detail="Marketing site and dashboard" state="operational" />
          <ServiceRow
            name="API"
            detail={data?.version ? `Version ${data.version} · uptime ${formatUptime(data.uptime)}` : "REST API"}
            state={apiState}
          />
          <ServiceRow name="Database" detail="MongoDB" state={dbState} />
          <ServiceRow
            name="Automation queue"
            detail={queueMode ? `Mode: ${queueMode}` : "Background jobs and workers"}
            state={queueState}
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We couldn’t reach the status endpoint right now. The page will retry when you refresh. If issues persist,
          email{" "}
          <a href="mailto:info@benjaminkueper.com" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            info@benjaminkueper.com
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}