"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { HighlightPill } from "./HighlightPill";
import { LP } from "./landing-theme";

const STEPS = [
  {
    n: "01",
    title: "Connect Gmail",
    body: "Alerts are picked up as they arrive",
    active: true,
  },
  {
    n: "02",
    title: "AI extracts & analyzes",
    body: "Parsed, deduplicated and scored",
    active: false,
  },
  {
    n: "03",
    title: "Pipeline organizes itself",
    body: "Sorted by stage, reminders built in",
    active: false,
  },
  {
    n: "04",
    title: "Apply with Apply Assistant",
    body: "Review and submit from your phone",
    active: false,
  },
];

const CHECKLIST = [
  { title: "Connect Gmail", detail: "you@gmail.com · read-only access to job alerts", done: true },
  { title: "Upload your résumé", detail: "Resume_2026.pdf", done: true },
  { title: "Set job preferences", detail: "Product Design · Remote · $120k+", done: true },
  { title: "Scanning your alerts", detail: "Building your pipeline...", done: false },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-10 md:py-14" style={{ background: LP.bg }}>
      <div className="mx-auto grid max-w-7xl items-start gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ borderColor: LP.line, background: LP.panelSoft, color: LP.ink }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: LP.yellow }} />
            How it works
          </span>

          <h2
            className="text-[1.75rem] font-extrabold tracking-tight sm:text-3xl lg:text-[2.35rem]"
            style={{ color: LP.heading }}
          >
            Up and running in <HighlightPill variant="yellow">5 minutes</HighlightPill>.
          </h2>
          <p className="mt-2.5 max-w-md text-sm sm:text-[15px]" style={{ color: LP.muted }}>
            Connect your accounts once and let the automation handle everything else.
          </p>

          <div className="mt-6 space-y-2.5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl border px-3.5 py-3"
                style={{
                  background: LP.surface,
                  borderColor: step.active ? LP.green : LP.line,
                  borderWidth: step.active ? 1.5 : 1,
                }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold"
                  style={{
                    background: step.active ? LP.green : LP.yellowSoft,
                    color: step.active ? "#fff" : LP.onYellow,
                  }}
                >
                  {step.n}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold" style={{ color: LP.heading }}>
                    {step.title}
                  </p>
                  <p className="text-xs" style={{ color: LP.muted }}>
                    {step.body}
                  </p>
                </div>
                <ArrowRight size={15} className="shrink-0" style={{ color: LP.muted }} />
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <div className="rounded-[1.35rem] p-5" style={{ background: LP.panel }}>
            <span
              className="mb-4 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: LP.green }}
            >
              Setup takes under 5 minutes
            </span>

            <ul className="space-y-2.5">
              {CHECKLIST.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl px-3.5 py-3"
                  style={{ background: LP.surface }}
                >
                  {item.done ? (
                    <span
                      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: LP.green }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                  ) : (
                    <span
                      className="mt-0.5 inline-flex h-6 w-6 shrink-0 rounded-full border-2"
                      style={{ borderColor: LP.yellow }}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold" style={{ color: LP.ink }}>
                      {item.title}
                    </p>
                    <p className="text-xs" style={{ color: LP.muted }}>
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 h-2 overflow-hidden rounded-full" style={{ background: LP.progress }}>
              <div className="h-full w-3/4 rounded-full" style={{ background: LP.yellow }} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.15rem] p-4" style={{ background: LP.panel }}>
              <p className="text-sm font-medium leading-snug" style={{ color: LP.muted }}>
                Ever wondered how much time tracking costs you?
              </p>
              <a
                href="#features"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold"
                style={{ color: LP.heading }}
              >
                See how it works
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="relative rounded-[1.15rem] p-4" style={{ background: LP.yellow }}>
              <p className="pr-8 text-sm font-bold leading-snug" style={{ color: LP.onYellow }}>
                Ready to stop tracking by hand?
              </p>
              <Link
                href="/register"
                className="mt-3 inline-flex items-center gap-2 text-base font-extrabold"
                style={{ color: LP.onYellow }}
              >
                Start free
              </Link>
              <Link
                href="/register"
                aria-label="Start free"
                className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
                style={{ background: LP.green }}
              >
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
