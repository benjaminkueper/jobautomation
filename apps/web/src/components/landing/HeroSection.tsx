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

const AVATARS = ["#C4A484", "#8B7355", "#D4B896", "#A08060"];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pb-14 pt-[72px] sm:pb-16 sm:pt-[76px]"
      style={{
        background:
          "radial-gradient(ellipse 85% 75% at 72% 18%, #0A5A42 0%, #013B2A 48%, #01281D 100%)",
      }}
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-5 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <span
            className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
            style={{ background: LP.yellow, color: LP.onYellow }}
          >
            New: Multi-Platform Support
          </span>

          <h1 className="text-[2.2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[2.7rem] lg:text-[3.1rem]">
            <span className="block">Your AI-powered</span>
            <span className="block">job search</span>
            <HighlightPill variant="yellow" className="mt-1.5 text-[0.9em]">
              command center
            </HighlightPill>
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
              style={{ background: LP.yellow, color: LP.onYellow }}
            >
              Get started
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.12)" }}
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
                  style={{ background: color, borderColor: LP.green, zIndex: AVATARS.length - i }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-white/80">
              <span className="font-bold text-white">20k+</span> users joined the revolution.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:ml-auto lg:mr-2 lg:max-w-[360px]"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: "rgba(253, 162, 1, 0.14)" }}
          />
          <div className="relative mx-auto aspect-[3/4] w-full max-h-[420px] overflow-hidden rounded-[1.5rem]">
            <Image
              src="/heroside.png"
              alt="Job seeker using NewJob Guru"
              fill
              priority
              className="object-cover object-[center_18%]"
              sizes="360px"
            />
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
            background: LP.surface,
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
