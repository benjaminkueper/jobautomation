"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/config/env";

type Status = "connected" | "mock" | "offline";

type ApiStatusLabels = Partial<Record<Status, string>>;

export function ApiStatusIndicator({
  usingMock,
  labels,
}: {
  usingMock?: boolean;
  labels?: ApiStatusLabels;
}) {
  const [status, setStatus] = useState<Status>(usingMock ? "mock" : "offline");

  useEffect(() => {
    if (usingMock) {
      setStatus("mock");
      return;
    }
    let mounted = true;
    fetch(`${API_URL}/health`)
      .then((res) => {
        if (!mounted) return;
        setStatus(res.ok ? "connected" : "offline");
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("offline");
      });
    return () => {
      mounted = false;
    };
  }, [usingMock]);

  const copy =
    status === "connected"
      ? { text: labels?.connected ?? "Connected", className: "bg-[var(--emerald-bg)] text-[var(--emerald)]" }
      : status === "mock"
        ? { text: labels?.mock ?? "Using Mock Data", className: "bg-[var(--amber-bg)] text-[var(--amber)]" }
        : { text: labels?.offline ?? "API Offline", className: "bg-[var(--rose-bg)] text-[var(--rose)]" };

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${copy.className}`}>{copy.text}</span>;
}
