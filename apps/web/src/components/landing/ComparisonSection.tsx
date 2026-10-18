"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { HighlightPill } from "./HighlightPill";
import { LP } from "./landing-theme";

const WITHOUT = [
  "Scattered job alerts",
  "Copy-pasting applications",
  "Forgetting to follow up",
  "Rewriting cover letters",
];

const WITH = [
  "All alerts in one place",
  "Pipeline updates automatically",
  "Tailored cover letters in seconds",
  "Reminders before leads go cold",
];

export function ComparisonSection() {
  return (
    <section className="pb-10 pt-16 md:pb-12 md:pt-20" style={{ background: LP.bg }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mb-8 max-w-3xl text-center"
        >
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ borderColor: LP.line, background: LP.surface, color: LP.ink }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: LP.yellow }} />
            Why NewJob Guru
          </span>

          <h2
            className="text-[1.75rem] font-extrabold tracking-tight sm:text-3xl lg:text-[2.4rem]"
            style={{ color: LP.heading }}
          >
            Job hunting shouldn&apos;t feel like a{" "}
            <HighlightPill variant="yellow">second job</HighlightPill>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base" style={{ color: LP.muted }}>
            Most job seekers lose hours every week to admin. Here&apos;s the difference automation makes.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          <motion.article
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[1.5rem] p-4 sm:p-5"
            style={{ background: LP.panel }}
          >
            <span
              className="mb-4 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm"
              style={{ background: LP.surface, color: LP.ink }}
            >
              Without NewJob Guru
            </span>

            <div className="grid items-center gap-4 sm:grid-cols-[0.95fr_1.05fr] sm:gap-5">
              <div className="relative aspect-square overflow-hidden rounded-[1.15rem]">
                <Image
                  src="/without-newjobguru.jpg"
                  alt="Stressed job seeker without NewJob Guru"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 280px"
                />
              </div>
              <ul className="space-y-2.5">
                {WITHOUT.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-full px-3 py-2.5 text-sm font-medium shadow-sm"
                    style={{ background: LP.surface, color: LP.ink }}
                  >
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                      <X size={11} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-base font-extrabold sm:text-lg" style={{ color: LP.heading }}>
              Scattered, manual and exhausting
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[1.5rem] p-4 sm:p-5"
            style={{ background: LP.green }}
          >
            <span
              className="mb-4 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: LP.yellow, color: LP.onYellow }}
            >
              With NewJob Guru
            </span>

            <div className="grid items-center gap-4 sm:grid-cols-[0.95fr_1.05fr] sm:gap-5">
              <div className="relative aspect-square overflow-hidden rounded-[1.15rem]">
                <Image
                  src="/with-newjobguru.jpg"
                  alt="Calm job seeker with NewJob Guru"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 280px"
                />
              </div>
              <ul className="space-y-2.5">
                {WITH.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-full px-3 py-2.5 text-sm font-medium shadow-sm"
                    style={{ background: LP.surface, color: LP.ink }}
                  >
                    <span
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: LP.mint, color: LP.mintText }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-base font-extrabold text-white sm:text-lg">
              Organized, automatic and calm
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
