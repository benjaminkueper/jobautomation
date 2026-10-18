"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { HighlightPill } from "./HighlightPill";
import { LP } from "./landing-theme";

const TABS = [
  {
    id: "gmail",
    label: "Gmail Import",
    title: "Every job alert, collected automatically.",
    body: "Connect Gmail once. Alerts from every board become clean, deduplicated job entries scored against your profile.",
    points: [
      "Title, salary and location extracted",
      "Duplicates across boards merged",
      "Works with LinkedIn, Indeed, Glassdoor & more",
    ],
    cta: "Connect Gmail",
    href: "/register",
    inboxLabel: "Inbox · label: job alerts",
    jobs: [
      { source: "LinkedIn", initial: "in", color: "#0A66C2", role: "Senior Product Designer", company: "Northwind", meta: "Remote", status: "Imported", tone: "green" as const },
      { source: "Indeed", initial: "I", color: "#2164F3", role: "Product Designer", company: "Lumen Health", meta: "Austin", status: "Imported", tone: "green" as const },
      { source: "Glassdoor", initial: "G", color: "#0CAA41", role: "UX Designer", company: "Brightline", meta: "NYC", status: "Merged", tone: "yellow" as const },
      { source: "ZipRecruiter", initial: "Z", color: "#1A73E8", role: "Design Lead", company: "Orbit", meta: "Hybrid", status: "Imported", tone: "green" as const },
    ],
    summary: [
      { role: "Frontend Engineer · Northwind", detail: "LinkedIn alert · $120k–$145k · Remote" },
      { role: "Data Analyst · Lumen Health", detail: "Indeed alert · Austin" },
    ],
  },
  {
    id: "cover",
    label: "AI Cover Letters",
    title: "Tailored cover letters in seconds.",
    body: "Generate role-specific cover letters from your profile and the job description — ready to review before you send.",
    points: [
      "Matched to the role and company voice",
      "Editable before you apply",
      "Saved to your document library",
    ],
    cta: "Generate a letter",
    href: "/register",
    inboxLabel: "Documents · cover letters",
    jobs: [
      { source: "Stripe", initial: "S", color: "#635BFF", role: "Product Designer", company: "Stripe", meta: "Draft ready", status: "Ready", tone: "green" as const },
      { source: "Notion", initial: "N", color: "#111111", role: "Design Engineer", company: "Notion", meta: "Drafting", status: "Draft", tone: "yellow" as const },
      { source: "Linear", initial: "L", color: "#5E6AD2", role: "Senior Designer", company: "Linear", meta: "Saved", status: "Ready", tone: "green" as const },
      { source: "Figma", initial: "F", color: "#F24E1E", role: "Product Designer", company: "Figma", meta: "Exported", status: "Ready", tone: "green" as const },
    ],
    summary: [
      { role: "Cover letter · Stripe", detail: "AI draft · 312 words · Ready to edit" },
      { role: "Cover letter · Linear", detail: "AI draft · Saved to library" },
    ],
  },
  {
    id: "apply",
    label: "Apply Assistant",
    title: "Apply with answers ready on every form.",
    body: "Your CV, cover letter, and common answers stay prepared so mobile and desktop applications take minutes, not hours.",
    points: [
      "Document readiness before you start",
      "AI answers for common questions",
      "Mark applied and keep your pipeline clean",
    ],
    cta: "Open Apply Assistant",
    href: "/register",
    inboxLabel: "Apply queue · ready jobs",
    jobs: [
      { source: "Airbnb", initial: "A", color: "#FF5A5F", role: "Product Designer", company: "Airbnb", meta: "Ready", status: "Ready", tone: "green" as const },
      { source: "Spotify", initial: "S", color: "#1DB954", role: "UX Researcher", company: "Spotify", meta: "Docs OK", status: "Ready", tone: "green" as const },
      { source: "Shopify", initial: "S", color: "#95BF47", role: "Senior Designer", company: "Shopify", meta: "In progress", status: "Draft", tone: "yellow" as const },
      { source: "Adobe", initial: "A", color: "#FF0000", role: "Design Manager", company: "Adobe", meta: "Applied", status: "Done", tone: "green" as const },
    ],
    summary: [
      { role: "Apply Assistant · Airbnb", detail: "CV + cover letter ready · 4 answers prepared" },
      { role: "Apply Assistant · Spotify", detail: "Documents ready · Start apply" },
    ],
  },
] as const;

export function FeatureShowcaseSection() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("gmail");
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  const statusStyle = {
    green: { bg: LP.mint, color: LP.mintText },
    yellow: { bg: LP.yellowSoft, color: LP.onYellow },
  } as const;

  return (
    <section id="features" className="py-10 md:py-14" style={{ background: LP.bg }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-7 max-w-3xl text-center">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ borderColor: LP.line, background: LP.surface, color: LP.ink }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: LP.yellow }} />
            Features
          </span>

          <h2
            className="text-[1.75rem] font-extrabold tracking-tight sm:text-3xl lg:text-[2.4rem]"
            style={{ color: LP.heading }}
          >
            The complete job search <HighlightPill variant="outline">automation</HighlightPill> platform.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base" style={{ color: LP.muted }}>
            Every tool you need to automate your job search, built into one intelligent platform.
          </p>
        </div>

        <div className="mx-auto mb-6 flex max-w-2xl flex-wrap justify-center gap-2">
          {TABS.map((item) => {
            const on = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className="rounded-full border px-4 py-2 text-sm font-semibold transition-all sm:px-5"
                style={{
                  background: on ? LP.green : LP.surface,
                  color: on ? "#fff" : LP.muted,
                  borderColor: on ? LP.green : LP.line,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid items-center gap-6 rounded-[1.5rem] p-5 sm:p-6 lg:grid-cols-2 lg:gap-8 lg:p-8"
            style={{ background: LP.panel }}
          >
            <div>
              <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: LP.heading }}>
                {tab.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed sm:text-[15px]" style={{ color: LP.muted }}>
                {tab.body}
              </p>
              <ul className="mt-5 space-y-3">
                {tab.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm font-medium" style={{ color: LP.ink }}>
                    <span
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: LP.yellow, color: LP.onYellow }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={tab.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
                style={{ background: LP.green }}
              >
                {tab.cta}
                <ArrowRight size={15} />
              </Link>
            </div>

            <div
              className="overflow-hidden rounded-[1.25rem] border p-4 sm:p-5"
              style={{
                background: LP.surface,
                borderColor: LP.line,
                boxShadow: LP.shadow,
              }}
            >
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: LP.ink }}>
                  <Mail size={15} style={{ color: LP.muted }} />
                  {tab.inboxLabel}
                </p>
                <span className="text-[11px] font-medium" style={{ color: LP.muted }}>
                  Scanned just now
                </span>
              </div>

              <div className="space-y-2.5">
                {tab.jobs.map((job) => {
                  const tone = statusStyle[job.tone];
                  return (
                    <div
                      key={`${job.source}-${job.role}`}
                      className="flex items-center gap-3 rounded-2xl border px-3 py-2.5"
                      style={{ borderColor: LP.line, background: LP.panelSoft }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                        style={{ background: job.color }}
                      >
                        {job.initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold" style={{ color: LP.ink }}>
                          {job.source}
                        </p>
                        <p className="truncate text-xs" style={{ color: LP.muted }}>
                          {job.role} · {job.company} · {job.meta}
                        </p>
                      </div>
                      <span
                        className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
                        style={{ background: tone.bg, color: tone.color }}
                      >
                        {job.tone === "green" ? <Check size={11} strokeWidth={3} /> : null}
                        {job.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2 border-t pt-3" style={{ borderColor: LP.line }}>
                {tab.summary.map((row) => (
                  <div key={row.role} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold" style={{ color: LP.ink }}>
                        {row.role}
                      </p>
                      <p className="truncate text-xs" style={{ color: LP.muted }}>
                        {row.detail}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold"
                      style={{ background: LP.yellowSoft, color: LP.onYellow }}
                    >
                      Imported
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
