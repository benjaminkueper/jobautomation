"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPinIcon } from "@/components/icons";
import { invalidateApiCache } from "@/lib/api/client";
import { getReviewQueue, listJobs } from "@/lib/api/jobs.api";
import { normalizeListResponse } from "@/lib/api/normalizeResource";
import type { ReviewableJob, ReviewQueueResponse } from "@/types/job";
import { normalizeJobForUi } from "@/lib/utils/resource";
import { formatDate } from "@/lib/utils";
import { jobSourceDisplayLabel } from "@/i18n/job-filters";
import { useTranslation } from "@/i18n/useTranslation";
function EmptyQueue({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-16 text-center">
      <span className="text-5xl">✅</span>
      <div>
        <h2 className="text-xl font-bold text-[var(--text-1)]">All caught up!</h2>
        <p className="mt-1 text-sm text-[var(--text-3)]">
          No new jobs to review right now. Check back after your next job import.
        </p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-1)] transition-colors hover:bg-[var(--border)]"
      >
        Go to Dashboard
      </button>
    </div>
  );
}

function extractReviewQueuePayload(payload: unknown): { jobs: unknown[]; total: number } {
  if (!payload || typeof payload !== "object") return { jobs: [], total: 0 };
  const r = payload as Record<string, unknown>;
  if (Array.isArray(r.jobs)) return { jobs: r.jobs, total: Number(r.total) || r.jobs.length };
  if (Array.isArray(r.items)) return { jobs: r.items, total: Number(r.total) || r.items.length };
  const nested = r.data;
  if (nested && typeof nested === "object") {
    const d = nested as Record<string, unknown>;
    if (Array.isArray(d.jobs)) return { jobs: d.jobs, total: Number(d.total) || d.jobs.length };
    if (Array.isArray(d.items)) return { jobs: d.items, total: Number(d.total) || d.items.length };
  }
  return { jobs: [], total: 0 };
}

/** Drop LinkedIn tracking / query-string junk from card previews. */
function cleanPreviewText(raw?: string | null): string {
  if (!raw) return "";
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (/^[a-z0-9_.-]+=/i.test(text) || text.includes("l=eml-") || text.includes("trk=")) return "";
  if (/^https?:\/\//i.test(text) && text.length > 120) return "";
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

function ReviewJobCard({ job }: { job: ReviewableJob }) {
  const { t } = useTranslation();
  const preview = cleanPreviewText(job.aiSummary) || cleanPreviewText(job.description);
  const href = `/jobs/${job.id}`;

  return (
    <Link
      href={href}
      className="group flex min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface-1)] p-4 shadow-sm transition-all hover:border-[var(--accent-ring)] hover:shadow-md"
    >
      <div className="min-w-0 space-y-1">
        <p className="truncate text-[13px] font-semibold text-[var(--accent)]">
          {job.company || "Company"}
        </p>
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[var(--text-1)] group-hover:text-[var(--accent)]">
          {job.position || job.title || "Untitled role"}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[var(--text-3)]">
        {job.location ? (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPinIcon size={12} className="shrink-0" />
            <span className="truncate">
              {job.location}
              {job.remote ? ` · ${t("jobs.remote")}` : ""}
            </span>
          </span>
        ) : null}
        {job.source ? (
          <span className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[11px]">
            {jobSourceDisplayLabel(job.source, t)}
          </span>
        ) : null}
        {job.salaryRange ? (
          <span className="rounded-full bg-[var(--emerald-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--emerald)]">
            {job.salaryRange}
          </span>
        ) : null}
      </div>

      {preview ? (
        <p className="line-clamp-3 text-[13px] leading-relaxed text-[var(--text-2)]">{preview}</p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-[11px] text-[var(--text-4)]">
        <span>
          {t("jobs.dateFound")}: {formatDate(job.dateFound)}
        </span>
        <span className="font-semibold text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
          Open details →
        </span>
      </div>
    </Link>
  );
}

export function ReviewPageClient() {
  const router = useRouter();
  const [jobs, setJobs] = useState<ReviewableJob[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      invalidateApiCache("/jobs");
      const payload = (await getReviewQueue(100)) as ReviewQueueResponse & { items?: unknown[] };
      let { jobs: rawList, total: rawTotal } = extractReviewQueuePayload(payload);

      if (rawList.length === 0) {
        const listed = await listJobs({ status: "New", limit: 100, page: 1 });
        rawList = Array.isArray(listed) ? listed : normalizeListResponse(listed);
        rawTotal = rawList.length;
      }

      const normalized = rawList
        .map((j) => {
          const base = normalizeJobForUi(j);
          const extra =
            typeof j === "object" && j !== null ? (j as Record<string, unknown>) : {};
          return { ...base, ...extra, id: base.id || String(extra.id ?? extra._id ?? "") } as ReviewableJob;
        })
        .filter((j) => Boolean(j.id));

      setJobs(normalized);
      setTotal(typeof rawTotal === "number" && rawTotal > 0 ? rawTotal : normalized.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load review queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => router.push("/today")}
            className="mb-1 flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--text-2)]"
          >
            ← Dashboard
          </button>
          <h1 className="text-xl font-bold text-[var(--text-1)] sm:text-2xl">Quick Review</h1>
          <p className="mt-1 text-sm text-[var(--text-3)]">
            All scanned jobs ready for review. Click a card to open full details.
          </p>
        </div>
        {total > 0 ? (
          <span
            className="rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
          >
            {total} to review
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--accent)]" />
          <p className="text-sm text-[var(--text-3)]">Loading your jobs…</p>
        </div>
      ) : null}

      {error ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button type="button" onClick={() => void load()} className="text-xs text-[var(--accent)] underline">
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && jobs !== null ? (
        jobs.length === 0 ? (
          <EmptyQueue onBack={() => router.push("/today")} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <ReviewJobCard key={job.id} job={job} />
            ))}
          </div>
        )
      ) : null}
    </div>
  );
}
