"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { LP } from "./landing-theme";

const FAQS = [
  {
    q: "How does the Gmail integration work?",
    a: "You grant read access to job alert emails. NewJob Guru scans new alerts, extracts the job details and adds them to your pipeline. Disconnect anytime.",
  },
  {
    q: "Does it auto-apply to jobs for me?",
    a: "No. NewJob Guru focuses on assisted apply — preparing documents and answers so you can submit quickly and accurately. Cloud auto-apply stays optional and off by default.",
  },
  {
    q: "How do you secure my data and documents?",
    a: "Your workspace is tenant-isolated. Documents and integration credentials are encrypted where required, and you control which accounts you connect or disconnect.",
  },
  {
    q: "How good are the AI cover letters?",
    a: "Letters are generated from your profile and the job description, then left fully editable. Most users review, tweak a few lines, and send — without starting from a blank page.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Start free with no card required. Upgrade, downgrade, or cancel whenever you want — no lock-in contracts.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-10 md:py-14" style={{ background: LP.bg }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.2fr] lg:gap-12">
        <div>
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ borderColor: LP.line, background: LP.panelSoft, color: LP.muted }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: LP.yellow }} />
            FAQ
          </span>

          <h2
            className="max-w-[14ch] text-[1.75rem] font-extrabold tracking-tight sm:text-3xl lg:text-[2.4rem]"
            style={{ color: LP.heading }}
          >
            Everything you need to know
          </h2>

          <div className="mt-6 rounded-[1.35rem] p-5" style={{ background: LP.green }}>
            <p className="text-base font-extrabold text-white">Still have questions?</p>
            <p className="mt-1 text-sm text-white/70">Our team replies within 24 hours.</p>
            <a
              href="mailto:hello@newjob.guru"
              className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-bold"
              style={{ background: LP.yellow, color: LP.onYellow }}
            >
              Email us
            </a>
          </div>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="rounded-[1.15rem] px-4 py-1 sm:px-5"
                style={{ background: LP.panel }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
                >
                  <span className="text-sm font-bold sm:text-[15px]" style={{ color: LP.heading }}>
                    {item.q}
                  </span>
                  <span
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{ background: LP.yellow, color: LP.onYellow }}
                  >
                    {isOpen ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 pr-10 text-sm leading-relaxed" style={{ color: LP.muted }}>
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
