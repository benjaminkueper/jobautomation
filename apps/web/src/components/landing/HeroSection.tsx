"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { HighlightPill } from "./HighlightPill";
import { LP } from "./landing-theme";

const STATS = [
  { value: "10K+", label: "Jobs tracked" },
  { value: "95%", label: "Success rate" },
  { value: "4.8/5", label: "Rating from users" },
  { value: "10+", label: "Job sites supported" },
];

const AVATARS = ["#cbd5e1", "#64748b", "#bfdbfe", "#0f172a"];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pb-14 pt-[72px] sm:pb-16 sm:pt-[76px] lg:min-h-[640px]"
      style={{ background: LP.bg }}
    >
      {/* Full-bleed hero photo — on desktop it lives in a right-side zone,
          clearly separated from the headline (left edge fades via mask, so no
          photo corner can ever show a hard seam) */}
      <div
        className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto md:top-[68px] md:w-[min(66%,1000px)] md:[mask-image:linear-gradient(90deg,transparent,black_16%)]"
        aria-hidden
      >
        <Image
          src="/heroside.png?v=2"
          alt=""
          fill
          priority
          className="object-cover object-[85%_22%] md:object-[100%_22%]"
          sizes="100vw"
        />
        {/* Readability wash: heavy vertical wash on phones only; on md+ just a
            slim feather on the photo's left edge so it stays fully visible */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.15) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.75) 6%, rgba(255,255,255,0.15) 11%, rgba(255,255,255,0) 16%)",
          }}
        />
        {/* Soft top wash so the photo zone dissolves below the fixed nav */}
        <div
          className="absolute inset-x-0 top-0 h-16 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 hidden h-24 md:block"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 100%)",
          }}
        />
        {/* Soft floor fade so the stats card sits clean on the photo */}
        <div
          className="absolute inset-x-0 bottom-0 h-28"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl lg:flex lg:min-h-[520px] lg:flex-col lg:justify-center"
        >
          <span
            className="mb-3 inline-flex self-start items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
            style={{ background: LP.mint, color: LP.mintText }}
          >
            New: Multi-Platform Support
          </span>

          <h1 className="text-[2.2rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.7rem] lg:text-[3.1rem]" style={{ color: LP.ink }}>
            <span className="block">Your AI-powered</span>
            <span className="block">job search</span>
            <HighlightPill variant="yellow" className="mt-1.5 text-[0.9em]">
              command center
            </HighlightPill>
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: LP.green }}
            >
              Get started
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2.5 text-sm font-semibold"
              style={{ color: LP.ink }}
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: LP.mint, color: LP.mintText }}
              >
                <Play size={12} fill="currentColor" />
              </span>
              Watch video
            </a>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((color, i) => (
                <span
                  key={color}
                  className="inline-block h-8 w-8 rounded-full border-2"
                  style={{ background: color, borderColor: LP.surface, zIndex: AVATARS.length - i }}
                />
              ))}
            </div>
            <p className="text-sm font-medium" style={{ color: LP.muted }}>
              <span className="font-bold" style={{ color: LP.ink }}>20k+</span> users joined the revolution.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.45 }}
        className="relative z-10 mx-auto -mb-9 mt-7 max-w-5xl px-5 sm:-mb-10 sm:mt-8 sm:px-8"
      >
        <div
          className="grid grid-cols-2 gap-4 rounded-2xl px-4 py-3.5 sm:grid-cols-4 sm:gap-3 sm:px-6 sm:py-4"
          style={{
            background: LP.panel,
            boxShadow: LP.shadowLg,
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: LP.heading }}>
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium sm:text-xs" style={{ color: LP.muted }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
