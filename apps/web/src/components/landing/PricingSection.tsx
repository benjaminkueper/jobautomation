"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { HighlightPill } from "./HighlightPill";
import { LP } from "./landing-theme";

const PLANS = [
  {
    name: "Starter",
    badge: "Free forever",
    price: "$0",
    description: "Perfect for getting organized.",
    cta: "Get started free",
    href: "/register",
    featured: false,
    features: [
      "Track up to 50 applications",
      "Gmail job alert import",
      "5 AI cover letters / month",
      "Basic pipeline view",
    ],
  },
  {
    name: "Professional",
    badge: "Most popular",
    price: "$29",
    description: "The full automation suite for active seekers.",
    cta: "Start free trial",
    href: "/register",
    featured: true,
    features: [
      "Unlimited applications",
      "Unlimited AI cover letters",
      "Apply Assistant on mobile",
      "Match scores & reminders",
      "Secure document storage",
    ],
  },
  {
    name: "Enterprise",
    badge: "Teams",
    price: "$79",
    description: "For coaches, bootcamps and placement teams.",
    cta: "Contact sales",
    href: "mailto:hello@newjob.guru",
    featured: false,
    features: [
      "Everything in Professional",
      "Multiple seeker profiles",
      "Team dashboard & reporting",
      "Dedicated account manager",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-10 md:py-14" style={{ background: LP.panelSoft }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ borderColor: LP.line, background: LP.surface, color: LP.muted }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: LP.yellow }} />
            Pricing
          </span>

          <h2
            className="text-[1.75rem] font-extrabold tracking-tight sm:text-3xl lg:text-[2.4rem]"
            style={{ color: LP.heading }}
          >
            Start free. <HighlightPill variant="outline">Scale</HighlightPill> when ready.
          </h2>
          <p className="mt-3 text-sm sm:text-base" style={{ color: LP.muted }}>
            No hidden fees. No credit card to start. Cancel or downgrade anytime.
          </p>
        </div>

        <div className="grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`flex h-full flex-col rounded-[1.5rem] p-5 sm:p-6 ${plan.featured ? "lg:-mt-2 lg:mb-0 lg:py-7" : ""}`}
              style={{
                background: plan.featured ? LP.green : LP.surface,
                color: plan.featured ? "#fff" : LP.ink,
                boxShadow: plan.featured
                  ? "0 20px 44px rgba(1,59,42,0.28)"
                  : LP.shadow,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className="text-base font-extrabold"
                  style={{ color: plan.featured ? "#fff" : LP.heading }}
                >
                  {plan.name}
                </p>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{
                    background: plan.featured ? LP.yellow : LP.chip,
                    color: plan.featured ? LP.onYellow : LP.muted,
                  }}
                >
                  {plan.badge}
                </span>
              </div>

              <div className="mt-4 flex items-end gap-1">
                <span
                  className="text-4xl font-extrabold tracking-tight"
                  style={{ color: plan.featured ? "#fff" : LP.heading }}
                >
                  {plan.price}
                </span>
                <span className="mb-1 text-sm" style={{ opacity: 0.7 }}>
                  / month
                </span>
              </div>

              <p
                className="mt-2 text-sm"
                style={{
                  opacity: plan.featured ? 0.85 : 0.75,
                  color: plan.featured ? undefined : LP.heading,
                }}
              >
                {plan.description}
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: plan.featured ? LP.yellow : "transparent",
                        color: plan.featured ? LP.onYellow : LP.heading,
                      }}
                    >
                      <Check size={plan.featured ? 12 : 16} strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="mt-6 inline-flex items-center justify-center rounded-full py-3 text-sm font-bold"
                style={
                  plan.featured
                    ? { background: LP.yellow, color: LP.onYellow }
                    : { background: "transparent", color: LP.heading, border: `1.5px solid ${LP.heading}` }
                }
              >
                {plan.cta}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
