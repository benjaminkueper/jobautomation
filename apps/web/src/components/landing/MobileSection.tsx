"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Calendar, Check, TrendingUp } from "lucide-react";
import { LP } from "./landing-theme";

const FEATURES = [
  {
    icon: Bell,
    title: "Instant match alerts",
    body: "Know about high-scoring roles first.",
  },
  {
    icon: Check,
    title: "Review and submit in seconds",
    body: "Apply Assistant has everything ready.",
  },
  {
    icon: Calendar,
    title: "Interview reminders",
    body: "Never miss a call or follow-up.",
  },
];

const READY = ["Résumé attached", "Cover letter ready", "Answers pre-filled"];

const TAGS = ["Design systems", "Research", "Figma"];

export function MobileSection() {
  return (
    <section
      className="relative overflow-x-clip py-12 md:py-16"
      style={{ background: LP.green }}
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/20 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: LP.yellow }} />
            On the go
          </span>

          <h2 className="text-[1.75rem] font-extrabold tracking-tight text-white sm:text-3xl lg:text-[2.4rem]">
            Your job search,{" "}
            <span style={{ color: LP.yellow }}>in your pocket.</span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-[15px]">
            Great roles don&apos;t wait until you&apos;re at your desk. Get notified the moment a strong match lands and apply right from your phone.
          </p>

          <ul className="mt-6 space-y-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-start gap-3">
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "rgba(0,0,0,0.22)", color: LP.yellow }}
                >
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-xs text-white/65 sm:text-[13px]">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-bold"
            style={{ background: LP.yellow, color: LP.onYellow }}
          >
            Get started on mobile
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white"
              style={{ background: LP.green }}
            >
              <ArrowRight size={15} />
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto w-full max-w-[420px] lg:ml-auto"
        >
          <div
            className="rounded-[1.75rem] px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10"
            style={{ background: LP.surface }}
          >
            <div
              className="relative mx-auto w-full max-w-[260px] rounded-[1.75rem] border-[7px] p-3.5"
              style={{ borderColor: LP.greenDeep, background: LP.panelSoft }}
            >
              <div className="mb-3 flex justify-center">
                <span className="h-1 w-14 rounded-full bg-black/15" />
              </div>

              <div
                className="mb-3 flex items-start gap-2 rounded-2xl px-2.5 py-2 text-[10px] leading-snug text-white"
                style={{ background: LP.green }}
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/15">
                  <TrendingUp size={11} style={{ color: LP.yellow }} />
                </span>
                <div>
                  <p className="font-semibold opacity-80">NewJob Guru · now</p>
                  <p className="text-[11px] font-bold">New 94% match: UX Lead</p>
                </div>
              </div>

              <p className="text-lg font-extrabold" style={{ color: LP.heading }}>
                UX Lead
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: LP.muted }}>
                Fieldstone · Remote · $130k–$150k
              </p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={{ background: LP.tag, color: LP.tagText }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 space-y-1.5 rounded-2xl px-3 py-2.5" style={{ background: LP.mint }}>
                {READY.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[11px] font-medium" style={{ color: LP.ink }}>
                    <span
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full"
                      style={{ background: LP.yellow, color: LP.onYellow }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-3.5 w-full rounded-full py-2.5 text-xs font-bold"
                style={{ background: LP.yellow, color: LP.onYellow }}
              >
                Apply with Assistant
              </button>
            </div>
          </div>

          <div
            className="absolute left-0 top-4 z-20 w-[158px] px-3 py-2.5 sm:-left-3 sm:top-6"
            style={{
              background: LP.yellow,
              color: LP.onYellow,
              borderRadius: 18,
              boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wide">NEW MATCH · 94%</p>
            <p className="mt-0.5 text-[12px] font-extrabold leading-snug">UX Lead at Fieldstone</p>
          </div>

          <div
            className="absolute bottom-2 right-0 z-20 flex w-[178px] items-start gap-2.5 px-3 py-2.5 sm:-right-2 sm:bottom-3"
            style={{
              background: LP.surface,
              borderRadius: 18,
              boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
            }}
          >
            <span
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ background: LP.green, color: LP.yellow }}
            >
              <Check size={12} strokeWidth={3} />
            </span>
            <div>
              <p className="text-[11px] font-extrabold leading-snug" style={{ color: LP.ink }}>
                Application submitted
              </p>
              <p className="text-[10px]" style={{ color: LP.muted }}>
                2 taps · just now
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
