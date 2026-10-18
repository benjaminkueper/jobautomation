"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Smartphone, TrendingUp } from "lucide-react";
import { HighlightPill } from "./HighlightPill";
import { LP } from "./landing-theme";

type Board =
  | {
      kind: "service";
      name: string;
      sub: string;
      initial: string;
      color: string;
    }
  | { kind: "center" }
  | {
      kind: "icon";
      name: string;
      sub: string;
      icon: "doc" | "phone";
      accent: string;
    };

const CELLS: Board[] = [
  { kind: "service", name: "Gmail", sub: "Alert import", initial: "G", color: "#FDA201" },
  { kind: "service", name: "LinkedIn", sub: "Job alerts", initial: "in", color: "#5B6B7A" },
  { kind: "service", name: "Indeed", sub: "Job alerts", initial: "I", color: "#013B2A" },
  { kind: "service", name: "Glassdoor", sub: "Job alerts", initial: "G", color: "#013B2A" },
  { kind: "center" },
  { kind: "service", name: "ZipRecruiter", sub: "Job alerts", initial: "Z", color: "#013B2A" },
  { kind: "service", name: "Wellfound", sub: "Startup jobs", initial: "W", color: "#013B2A" },
  { kind: "icon", name: "Your résumé", sub: "PDF or DOCX", icon: "doc", accent: "#013B2A" },
  { kind: "icon", name: "Mobile", sub: "Apply Assistant", icon: "phone", accent: "#FDA201" },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="py-10 md:py-14" style={{ background: LP.panelSoft }}>
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ borderColor: LP.line, background: LP.surface, color: LP.heading }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: LP.yellow }} />
            Integrations
          </span>

          <h2
            className="text-[1.75rem] font-extrabold tracking-tight sm:text-3xl lg:text-[2.35rem]"
            style={{ color: LP.heading }}
          >
            Connects to the boards you{" "}
            <HighlightPill variant="green">already use</HighlightPill>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed sm:text-[15px]" style={{ color: LP.muted }}>
            Keep your job alerts exactly where they are. NewJob Guru reads them from Gmail and brings every listing into one pipeline.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white"
            style={{ background: LP.green }}
          >
            Connect your inbox
            <ArrowRight size={16} style={{ color: LP.yellow }} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:ml-auto lg:mr-0 lg:max-w-[400px]"
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {CELLS.map((cell, i) => {
              if (cell.kind === "center") {
                return (
                  <div
                    key="center"
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[0.9rem] p-2 text-center"
                    style={{ background: LP.green, boxShadow: "0 8px 18px rgba(1,59,42,0.2)" }}
                  >
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8"
                      style={{ background: LP.surface, color: LP.yellow }}
                    >
                      <TrendingUp size={15} strokeWidth={2.5} />
                    </span>
                    <p className="text-[10px] font-extrabold leading-tight text-white sm:text-[11px]">
                      NewJob <span style={{ color: LP.yellow }}>Guru</span>
                    </p>
                  </div>
                );
              }

              if (cell.kind === "icon") {
                const Icon = cell.icon === "doc" ? FileText : Smartphone;
                return (
                  <div
                    key={cell.name}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[0.9rem] p-2 text-center"
                    style={{ background: LP.surface, boxShadow: LP.shadow }}
                  >
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8"
                      style={{
                        background: cell.icon === "phone" ? LP.yellowSoft : LP.mint,
                        color: cell.accent === "#FDA201" ? LP.onYellow : LP.mintText,
                      }}
                    >
                      <Icon size={13} />
                    </span>
                    <p className="text-[10px] font-bold leading-tight sm:text-[11px]" style={{ color: LP.ink }}>
                      {cell.name}
                    </p>
                    <p className="text-[9px] leading-tight" style={{ color: LP.muted }}>
                      {cell.sub}
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={`${cell.name}-${i}`}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[0.9rem] p-2 text-center"
                  style={{ background: LP.surface, boxShadow: LP.shadow }}
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold text-white sm:h-8 sm:w-8 sm:text-[11px]"
                    style={{ background: cell.color }}
                  >
                    {cell.initial}
                  </span>
                  <p className="text-[10px] font-bold leading-tight sm:text-[11px]" style={{ color: LP.ink }}>
                    {cell.name}
                  </p>
                  <p className="text-[9px] leading-tight" style={{ color: LP.muted }}>
                    {cell.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
