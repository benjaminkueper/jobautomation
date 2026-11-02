"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, FileText, Lock } from "lucide-react";
import { LP } from "./landing-theme";

const PIPELINE = [
  { role: "Product Designer", company: "Northwind", status: "Saved", tone: "muted" as const, initial: "N", iconBg: "#1d4ed8" },
  { role: "Senior UI Designer", company: "Brightline", status: "Applied", tone: "mint" as const, initial: "B", iconBg: "#2563eb" },
  { role: "Staff Designer", company: "Kestrel AI", status: "Interview", tone: "yellow" as const, initial: "K", iconBg: "#3b82f6", highlight: true },
  { role: "Design Manager", company: "Harbor & Co.", status: "Offer", tone: "green" as const, initial: "H", iconBg: "#475569" },
];

const DOCS = [
  "Resume_2026.pdf",
  "Cover_letter_Northwind.docx",
  "Portfolio.pdf",
];

export function ToolsBentoSection() {
  const statusTone = {
    muted: { bg: LP.chip, color: LP.muted },
    mint: { bg: LP.mint, color: LP.mintText },
    yellow: { bg: LP.yellowSoft, color: LP.onYellow },
    green: { bg: LP.green, color: "#fff" },
  } as const;

  return (
    <section className="py-10 md:py-12" style={{ background: LP.greenDeep }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-5 flex flex-col gap-2 text-center sm:mb-6 md:flex-row md:items-end md:justify-between md:text-left"
        >
          <h2 className="mx-auto max-w-md text-[1.6rem] font-extrabold tracking-tight text-white sm:text-[1.9rem] md:mx-0 lg:text-[2.15rem]">
            Powerful tools.{" "}
            <span style={{ color: LP.yellow }}>Zero busywork.</span>
          </h2>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-white/70 md:mx-0 md:text-right">
            Everything works together, so your search runs itself while you prepare for interviews.
          </p>
        </motion.div>

        <div className="grid items-stretch gap-2.5 md:grid-cols-2 lg:grid-cols-[0.9fr_1.05fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex h-full flex-col rounded-[1.15rem] p-4 md:col-span-2 lg:col-span-1"
            style={{ background: LP.surface }}
          >
            <p className="text-[15px] font-extrabold" style={{ color: LP.heading }}>
              Pipeline tracking
            </p>
            <p className="mt-0.5 text-xs" style={{ color: LP.muted }}>
              Every role from saved to offer, in one view.
            </p>

            <div className="mt-3 flex-1 space-y-1.5">
              {PIPELINE.map((item) => {
                const tone = statusTone[item.tone];
                return (
                  <div
                    key={item.role}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5"
                    style={{
                      background: item.highlight ? LP.panelSoft : "transparent",
                      border: item.highlight ? `1.5px solid ${LP.green}` : "1.5px solid transparent",
                    }}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
                      style={{ background: item.iconBg }}
                    >
                      {item.initial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold" style={{ color: LP.ink }}>
                        {item.role}
                      </p>
                      <p className="truncate text-[10px]" style={{ color: LP.muted }}>
                        {item.company}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: tone.bg, color: tone.color }}
                    >
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex h-10 items-end gap-1 px-0.5">
              {[20, 32, 42, 26].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: h,
                    background:
                      i === 0 ? LP.chip : i === 1 ? "#94a3b8" : i === 2 ? LP.green : "#93c5fd",
                  }}
                />
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col gap-2.5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 }}
              className="flex flex-1 items-center gap-3 rounded-[1.15rem] p-4"
              style={{ background: LP.greenMid }}
            >
              <div
                className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(${LP.yellow} 0% 92%, rgba(255,255,255,0.15) 92% 100%)`,
                }}
              >
                <div
                  className="flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-full text-lg font-extrabold text-white"
                  style={{ background: LP.greenMid }}
                >
                  92%
                </div>
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-white">Smart match scores</p>
                <p className="mt-0.5 text-xs leading-snug text-white/70">
                  Know which jobs fit before you spend time applying.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="flex flex-1 flex-col justify-between rounded-[1.15rem] p-4"
              style={{ background: LP.surface }}
            >
              <ul className="space-y-1.5">
                {DOCS.map((doc) => (
                  <li
                    key={doc}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5"
                    style={{ background: LP.panel }}
                  >
                    <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold" style={{ color: LP.ink }}>
                      <FileText size={13} style={{ color: LP.muted }} />
                      <span className="truncate">{doc}</span>
                    </span>
                    <Lock size={12} style={{ color: LP.muted }} />
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-start gap-2.5">
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: LP.green, color: LP.yellow }}
                >
                  <Lock size={14} />
                </span>
                <div>
                  <p className="text-xs font-extrabold" style={{ color: LP.heading }}>
                    Secure document storage
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug" style={{ color: LP.muted }}>
                    Résumés, letters & portfolios, encrypted
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-2.5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="relative flex min-h-[128px] flex-col justify-between rounded-[1.15rem] p-4"
              style={{ background: LP.yellow, color: LP.onYellow }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold">Apply Assistant</p>
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ background: LP.green, color: "#fff" }}
                >
                  <ArrowUpRight size={12} />
                </span>
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none">3 taps</p>
                <p className="mt-1 text-xs font-semibold">from alert to applied</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-1 flex-col rounded-[1.15rem] p-4"
              style={{ background: LP.greenMid }}
            >
              <p className="text-[15px] font-extrabold text-white">Follow-up reminders</p>
              <p className="mt-0.5 text-[11px] leading-snug text-white/70">
                Never let a promising lead go quiet.
              </p>
              <div className="mt-3 space-y-1.5">
                <div
                  className="rounded-xl px-2.5 py-2 text-[11px] font-semibold"
                  style={{ background: LP.surface, color: LP.ink }}
                >
                  <span style={{ color: LP.green }}>• </span>
                  Follow up with Brightline today
                </div>
                <div
                  className="rounded-xl px-2.5 py-2 text-[11px] font-medium text-white/85"
                  style={{ background: "rgba(0,0,0,0.18)" }}
                >
                  <span style={{ color: "#93c5fd" }}>• </span>
                  Thank-you note to Kestrel AI
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
