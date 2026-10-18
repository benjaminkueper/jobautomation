"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { HighlightPill } from "./HighlightPill";
import { LP } from "./landing-theme";

const TRUST = ["Free forever plan", "No credit card", "Set up in 5 minutes"];

const STEPS = [
  { label: "Saved", done: true, accent: false },
  { label: "Applied", done: true, accent: false },
  { label: "Interview", done: true, accent: false },
  { label: "Offer", done: true, accent: true },
];

export function CTASection() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : "";
    router.push(`/register${q}`);
  }

  return (
    <section className="py-8 md:py-12" style={{ background: LP.bg }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className="overflow-hidden rounded-[2rem] px-5 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pt-12"
          style={{ background: LP.creamWarm }}
        >
          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center pb-8 sm:pb-10 lg:pb-12"
            >
              <h2
                className="text-[1.75rem] font-extrabold tracking-tight sm:text-3xl lg:text-[2.4rem]"
                style={{ color: LP.heading }}
              >
                Start automating your <HighlightPill variant="green">job search</HighlightPill> today
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed sm:text-[15px]" style={{ color: LP.body }}>
                Stop juggling spreadsheets. Let NewJob Guru handle the busywork while you focus on landing the role.
              </p>

              <form
                onSubmit={onSubmit}
                className="mt-6 flex items-center gap-2 rounded-full p-1.5 pl-4 shadow-md"
                style={{ background: LP.surface }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-60"
                  style={{ color: LP.ink }}
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full px-5 py-2.5 text-sm font-bold text-white"
                  style={{ background: LP.green }}
                >
                  Start free
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {TRUST.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold sm:text-[13px]"
                    style={{ color: LP.heading }}
                  >
                    <span
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full text-white"
                      style={{ background: LP.yellow }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto flex w-full max-w-[340px] flex-col lg:mx-0 lg:ml-auto lg:max-w-[360px]"
            >
              <div
                className="relative flex h-full min-h-[320px] flex-col items-center px-6 pb-6 pt-8"
                style={{
                  background: LP.surface,
                  borderRadius: "999px 999px 0 0",
                  boxShadow: LP.shadow,
                }}
              >
                <span
                  className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: LP.green, color: LP.yellow }}
                >
                  <Mail size={18} />
                </span>

                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: LP.muted }}>
                  Offer received
                </p>
                <p className="mt-1 text-2xl font-extrabold" style={{ color: LP.heading }}>
                  You&apos;re hired!
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: LP.heading }}>
                  Design Lead · Harbor &amp; Co.
                </p>

                <div className="mt-6 w-full px-1">
                  <div className="relative flex items-start justify-between">
                    <div
                      className="absolute left-[12%] right-[12%] top-[11px] h-[2px]"
                      style={{ background: LP.green }}
                    />
                    {STEPS.map((step) => (
                      <div key={step.label} className="relative z-10 flex flex-1 flex-col items-center gap-1.5">
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white"
                          style={{
                            background: step.accent ? LP.yellow : LP.green,
                            color: step.accent ? LP.onYellow : "#fff",
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="text-[10px] font-semibold" style={{ color: LP.heading }}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="mt-auto flex w-full items-center justify-between rounded-full px-3.5 py-2 text-[11px] font-semibold"
                  style={{ background: LP.mint, color: LP.heading }}
                >
                  <span>Found via LinkedIn alert</span>
                  <span style={{ color: LP.muted }}>23 days</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
