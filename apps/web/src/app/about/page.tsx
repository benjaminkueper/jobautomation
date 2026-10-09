import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "NewJob Guru is an AI-powered job application automation platform. Learn about our mission, how the system works, and the principles behind it.",
  alternates: { canonical: "https://www.newjob.guru/about" },
};

const STATS = [
  { value: "1", label: "Unified pipeline", detail: "Jobs, contacts, interviews, and documents in one place." },
  { value: "24/7", label: "Automations running", detail: "Intake, follow-ups, and reminders on autopilot." },
  { value: "100%", label: "Your data, your control", detail: "Connect and revoke integrations at any time." },
];

const PRINCIPLES = [
  {
    title: "Automate the busywork, not the decision",
    body: "NewJob Guru handles intake, follow-ups, and reminders so you can focus on the parts of a job search that need a human: the judgment, the story, and the relationship.",
  },
  {
    title: "Transparency by default",
    body: "Every automation has a visible log. You can see exactly what ran, when, and why — and pause any rule in a single click.",
  },
  {
    title: "Your data stays yours",
    body: "We request only the Google scopes shown on the consent screen, store tokens encrypted per workspace, and never sell your data. Disconnect an integration and access is removed immediately.",
  },
  {
    title: "One workspace, end to end",
    body: "Instead of juggling spreadsheets, inboxes, and notes apps, the whole search — from saved to offer — lives in a single, coherent workspace.",
  },
];

const SYSTEM = [
  {
    title: "Capture",
    body: "Add roles manually, import a CSV, or let email intake turn job alerts and replies into pipeline items automatically.",
  },
  {
    title: "Organize",
    body: "A drag-and-drop board tracks every application from Saved → Applied → Interview → Offer, with contacts and notes attached.",
  },
  {
    title: "Prepare",
    body: "Generate tailored CVs and cover letters, then score them against the job description to catch ATS gaps before you apply.",
  },
  {
    title: "Follow up",
    body: "Automations schedule follow-ups, reminders, and interview prep so nothing slips through the cracks.",
  },
  {
    title: "Measure",
    body: "Insights show where applications stall and which sources convert, with exportable reports you can share.",
  },
];

export default function AboutPage() {
  return (
    <PublicPageShell
      section="company"
      eyebrow="About"
      title="About NewJob Guru"
      subtitle="An AI-powered job application automation platform built to make a high-quality job search faster, calmer, and more consistent."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]}
    >
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Our mission</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          Searching for a job is a full-time job on its own — dozens of applications, endless follow-ups, and documents
          that need to be tailored every single time. NewJob Guru was built to take the repetitive weight off that
          process. We believe the best outcomes come from applying well, not applying blindly, so the product is designed
          to remove the busywork and leave you the meaningful work.
        </p>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{stat.value}</div>
            <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{stat.label}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{stat.detail}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">How the system works</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          NewJob Guru is organized around a workspace that follows an application through its whole life cycle.
        </p>
        <ol className="mt-6 space-y-4">
          {SYSTEM.map((step, i) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">What we believe</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Built for job seekers who care about quality</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Whether you are running a focused search for one role or casting a wider net, NewJob Guru keeps every
          application organized, on time, and personalized.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 dark:bg-blue-500"
          >
            Get started free
          </Link>
          <Link
            href="/help"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
          >
            Visit the Help Center
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
