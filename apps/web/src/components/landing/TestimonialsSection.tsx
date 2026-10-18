"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { HighlightPill } from "./HighlightPill";
import { LP } from "./landing-theme";

const TESTIMONIALS = [
  {
    quote:
      "I used to lose half my week to job boards and spreadsheets. With NewJob Guru, alerts land in one inbox and I finally know what I applied to — and when to follow up.",
    name: "Amelia Hart",
    role: "Product Designer",
    company: "Northwind Labs",
    initial: "A",
    highlight: false,
  },
  {
    quote:
      "Apply Assistant got me from ‘interesting role’ to submitted application in a few minutes on my phone. I landed three interviews the same month I switched.",
    name: "Ben Okonkwo",
    role: "Frontend Engineer",
    company: "Brightline",
    initial: "B",
    highlight: true,
  },
  {
    quote:
      "The AI cover letters alone paid for itself. I stopped rewriting the same letter for every posting and started getting replies within a week.",
    name: "Chloe Nguyen",
    role: "Marketing Manager",
    company: "Harbor & Co.",
    initial: "C",
    highlight: false,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-10 md:py-14" style={{ background: LP.panelSoft }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
              style={{ borderColor: LP.line, background: LP.surface, color: LP.heading }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: LP.yellow }} />
              Testimonials
            </span>
            <h2
              className="text-[1.75rem] font-extrabold tracking-tight sm:text-3xl lg:text-[2.35rem]"
              style={{ color: LP.heading }}
            >
              Loved by <HighlightPill variant="green">job seekers</HighlightPill>
            </h2>
          </div>

          <div
            className="inline-flex items-center gap-3 self-start rounded-2xl border px-4 py-3 sm:self-auto"
            style={{ borderColor: LP.line, background: LP.surface }}
          >
            <span className="text-2xl font-extrabold" style={{ color: LP.heading }}>
              [4.9]
            </span>
            <div>
              <div className="flex gap-0.5" style={{ color: LP.yellow }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-0.5 text-xs font-medium" style={{ color: LP.muted }}>
                Average rating from 2,400+ reviews
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex h-full flex-col rounded-[1.35rem] p-5 sm:p-6"
              style={{
                background: item.highlight ? LP.green : LP.surface,
                color: item.highlight ? "#fff" : LP.ink,
                boxShadow: item.highlight ? "none" : LP.shadow,
              }}
            >
              <p className="text-3xl font-serif leading-none" style={{ color: LP.yellow }}>
                ”
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed sm:text-[15px]">
                {item.quote}
              </p>

              <div
                className="mt-5 border-t pt-4"
                style={{ borderColor: item.highlight ? "rgba(255,255,255,0.15)" : LP.line }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: item.highlight ? LP.yellow : LP.green,
                      color: item.highlight ? LP.onYellow : "#fff",
                    }}
                  >
                    {item.initial}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs" style={{ opacity: item.highlight ? 0.7 : 0.65 }}>
                      {item.role} · hired at {item.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
