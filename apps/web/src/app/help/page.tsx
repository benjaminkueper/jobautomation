import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Answers to common questions about NewJob Guru — accounts, integrations, billing, and troubleshooting.",
  alternates: { canonical: "https://www.newjob.guru/help" },
};

const TOPICS = [
  {
    title: "Getting started",
    blurb: "Set up your workspace and import your first roles.",
    href: "/docs#getting-started",
  },
  {
    title: "Integrations",
    blurb: "Connect Gmail, Google Drive, and Calendar.",
    href: "/docs#integrations",
  },
  {
    title: "Account & login",
    blurb: "Passwords, sessions, and workspace access.",
    href: "#account-login",
  },
  {
    title: "Billing & plans",
    blurb: "Subscriptions, invoices, and plan changes.",
    href: "#billing",
  },
];

const FAQ: { question: string; answer: React.ReactNode }[] = [
  {
    question: "How do I reset my password?",
    answer: (
      <>
        Go to the{" "}
        <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          forgot-password page
        </Link>{" "}
        and enter your email. We’ll send a secure link to set a new password. If you signed up with Google, use the
        Google sign-in button instead.
      </>
    ),
  },
  {
    question: "Is my Gmail and Google Drive data safe?",
    answer: (
      <>
        Yes. We request only the scopes shown on the Google consent screen, store OAuth tokens encrypted per workspace,
        and never sell your data. You can revoke access any time from Settings → Integrations or from your Google account.
        See the <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</Link> for
        details.
      </>
    ),
  },
  {
    question: "Can I export my data?",
    answer: (
      <>
        Yes. Reports can be exported to PDF from the Reports page, and you can request a full export of your workspace
        data by contacting support.
      </>
    ),
  },
  {
    question: "Why did an automation not run?",
    answer: (
      <>
        Check the Automation page for the rule’s status and its recent log. Rules can be paused automatically if a
        connected integration is disconnected — reconnect it and the rule resumes.
      </>
    ),
  },
  {
    question: "How do I change or cancel my plan?",
    answer: (
      <>
        Open Billing from your workspace settings to switch plans or cancel. Changes take effect at the end of the current
        billing period.
      </>
    ),
  },
  {
    question: "How do I delete my account?",
    answer: (
      <>
        Contact{" "}
        <a href="mailto:info@benjaminkueper.com" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          info@benjaminkueper.com
        </a>{" "}
        from your registered email. We’ll remove your account and associated workspace data.
      </>
    ),
  },
];

export default function HelpCenterPage() {
  return (
    <PublicPageShell
      eyebrow="Help Center"
      title="Help Center"
      subtitle="Quick answers and step-by-step guides. If you can’t find what you need, our team is one message away."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Help Center", href: "/help" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <a
            key={topic.title}
            href={topic.href}
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-blue-400 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500 dark:hover:bg-white/10"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{topic.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{topic.blurb}</p>
          </a>
        ))}
      </div>

      <section id="account-login" className="mt-16 scroll-mt-24">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-slate-200 bg-slate-50 p-5 open:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:open:bg-white/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 marker:hidden dark:text-white">
                {item.question}
                <span className="text-slate-400 transition-transform group-open:rotate-45 dark:text-slate-500">+</span>
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</div>
            </details>
          ))}
        </div>
      </section>

      <section id="billing" className="mt-14 scroll-mt-24 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Still need help?</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Email us at{" "}
          <a href="mailto:info@benjaminkueper.com" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            info@benjaminkueper.com
          </a>{" "}
          and we’ll get back to you. For developer topics, see the{" "}
          <Link href="/api-reference" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">API Reference</Link>.
        </p>
      </section>
    </PublicPageShell>
  );
}
