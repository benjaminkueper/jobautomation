import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Learn how to set up NewJob Guru, connect Gmail and Google Drive, manage applications, and automate your job search end to end.",
  alternates: { canonical: "https://www.newjob.guru/docs" },
};

const CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting started",
    blurb: "Create your workspace and import your first roles in a few minutes.",
  },
  {
    id: "integrations",
    title: "Integrations",
    blurb: "Connect Gmail, Google Drive, Calendar, and third-party job sources.",
  },
  {
    id: "pipeline",
    title: "Applications & pipeline",
    blurb: "Track every application from saved to offer on a single board.",
  },
  {
    id: "documents",
    title: "Documents & AI",
    blurb: "Generate tailored CVs and cover letters, then score them for ATS.",
  },
  {
    id: "automations",
    title: "Automations",
    blurb: "Let follow-ups, reminders, and intake run on autopilot.",
  },
  {
    id: "reports",
    title: "Reports & insights",
    blurb: "Understand your funnel and export shareable reports.",
  },
];

const SECTIONS: { id: string; title: string; intro: string; steps: string[] }[] = [
  {
    id: "getting-started",
    title: "Getting started",
    intro:
      "NewJob Guru organizes everything around a workspace (tenant): your jobs, contacts, documents, and automations all live there.",
    steps: [
      "Create an account and complete your profile with your target roles and locations.",
      "Import jobs manually, from a CSV, or by connecting a job source in Settings.",
      "Open the pipeline to move applications from Saved → Applied → Interview → Offer.",
    ],
  },
  {
    id: "integrations",
    title: "Connecting integrations",
    intro:
      "Integrations are optional and safe to enable one at a time. We only request the scopes shown on the Google consent screen.",
    steps: [
      "Go to Settings → Integrations to connect Gmail, Google Drive, or Google Calendar.",
      "Enable email intake to automatically turn job alerts and replies into pipeline items.",
      "Disconnect at any time — OAuth tokens are removed immediately when you do.",
    ],
  },
  {
    id: "pipeline",
    title: "Managing your pipeline",
    intro:
      "The board is your single source of truth. Every card carries the job, the contact, notes, and a full activity history.",
    steps: [
      "Add a job from the Jobs page or the Today quick-add.",
      "Attach contacts and schedule interviews so they surface in your daily view.",
      "Use bulk actions to move or archive multiple applications at once.",
    ],
  },
  {
    id: "documents",
    title: "Documents & AI",
    intro:
      "Draft documents that mirror the job description, then check how an ATS will read them before you apply.",
    steps: [
      "Upload or paste your base CV once, then create tailored variants per role.",
      "Generate a cover letter that matches the role and your writing style.",
      "Run the ATS score to catch formatting and keyword gaps.",
    ],
  },
  {
    id: "automations",
    title: "Automations",
    intro:
      "Automations remove the busywork. Each rule is transparent and can be paused from the Automation page.",
    steps: [
      "Create follow-up rules that fire a set number of days after applying.",
      "Add reminders for interviews, deadlines, and stale applications.",
      "Review the automation log to see exactly what ran and when.",
    ],
  },
  {
    id: "reports",
    title: "Reports & insights",
    intro:
      "See where applications stall and which sources convert, then export a report to share with a mentor or coach.",
    steps: [
      "Open Insights for funnel, source, and response-rate breakdowns.",
      "Filter reports by date range and pipeline stage.",
      "Export a PDF report from the Reports page.",
    ],
  },
];

export default function DocumentationPage() {
  return (
    <PublicPageShell
      eyebrow="Documentation"
      title="Documentation"
      subtitle="Everything you need to set up NewJob Guru, connect your tools, and put your job search on autopilot."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Documentation", href: "/docs" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-blue-400 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500 dark:hover:bg-white/10"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{category.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{category.blurb}</p>
            <span className="mt-3 inline-block text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
              Jump to section →
            </span>
          </a>
        ))}
      </div>

      <div className="mt-16 space-y-14">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">{section.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">{section.intro}</p>
            <ol className="mt-5 space-y-3">
              {section.steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Need more help?</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Browse the <Link href="/help" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Help Center</Link> for
          troubleshooting, or read the{" "}
          <Link href="/api-reference" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">API Reference</Link> to
          build on top of NewJob Guru.
        </p>
      </div>
    </PublicPageShell>
  );
}
