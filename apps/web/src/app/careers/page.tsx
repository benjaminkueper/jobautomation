import type { Metadata } from "next";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team building NewJob Guru — an AI-powered job application automation platform. See open roles and how to apply.",
  alternates: { canonical: "https://www.newjob.guru/careers" },
};

const VALUES = [
  {
    title: "Remote-first, async-friendly",
    body: "We work where we do our best work and default to written, asynchronous communication with clear ownership.",
  },
  {
    title: "Ship, then refine",
    body: "Small, frequent improvements over big, infrequent launches. We value momentum and honest feedback.",
  },
  {
    title: "Users before metrics",
    body: "We build for the person in the middle of a stressful job search. Their outcome is the metric that matters.",
  },
  {
    title: "Craft over shortcuts",
    body: "We sweat the details — in the product, the docs, and how we treat each other and our users.",
  },
];

const AREAS = [
  { title: "Engineering", body: "Full-stack, platform, and AI/data engineers building the automation backbone." },
  { title: "Product & Design", body: "Designers and PMs shaping a calm, coherent job-search workspace." },
  { title: "Growth & Content", body: "Marketers and writers who can explain a product clearly and honestly." },
  { title: "Customer Success", body: "People who love turning a confused user into a confident one." },
];

export default function CareersPage() {
  return (
    <PublicPageShell
      section="company"
      eyebrow="Careers"
      title="Careers at NewJob Guru"
      subtitle="We're a small, focused team on a mission to make the job search dramatically less painful. If that sounds like your kind of problem, we'd love to hear from you."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Careers", href: "/careers" }]}
    >
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            No open positions right now
          </span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Open roles</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          We don't have any advertised openings at the moment, but we're growing and always keen to meet thoughtful
          people. Send a speculative application and tell us what you'd want to work on.
        </p>
        <a
          href="mailto:info@benjaminkueper.com?subject=Careers%20at%20NewJob%20Guru"
          className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 dark:bg-blue-500"
        >
          Send a speculative application
        </a>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">What we look for</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {AREAS.map((area) => (
            <div key={area.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{area.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{area.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">How we work</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{value.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Questions?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Reach us any time at{" "}
          <a href="mailto:info@benjaminkueper.com" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            info@benjaminkueper.com
          </a>
          . We read every message.
        </p>
      </section>
    </PublicPageShell>
  );
}
