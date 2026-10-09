import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";

export const metadata: Metadata = {
  title: "API Reference",
  description:
    "NewJob Guru REST API reference — authentication, resources, and example requests for jobs, applications, documents, and automations.",
  alternates: { canonical: "https://www.newjob.guru/api-reference" },
};

const ENDPOINT_GROUPS: { resource: string; description: string; endpoints: { method: string; path: string; note: string }[] }[] = [
  {
    resource: "Authentication",
    description: "Create sessions and manage access tokens for a workspace.",
    endpoints: [
      { method: "POST", path: "/auth/register", note: "Create a new account and workspace." },
      { method: "POST", path: "/auth/login", note: "Exchange credentials for an access token." },
      { method: "POST", path: "/auth/refresh", note: "Refresh an expiring access token." },
      { method: "GET", path: "/auth/me", note: "Return the current user and workspace." },
    ],
  },
  {
    resource: "Jobs",
    description: "The roles you are tracking and their sources.",
    endpoints: [
      { method: "GET", path: "/jobs", note: "List jobs with filtering and pagination." },
      { method: "POST", path: "/jobs", note: "Create a job." },
      { method: "GET", path: "/jobs/:id", note: "Retrieve a single job." },
      { method: "PATCH", path: "/jobs/:id", note: "Update a job." },
      { method: "DELETE", path: "/jobs/:id", note: "Archive a job." },
    ],
  },
  {
    resource: "Applications",
    description: "Move applications through your pipeline stages.",
    endpoints: [
      { method: "GET", path: "/applications", note: "List applications in the workspace." },
      { method: "POST", path: "/applications", note: "Create an application for a job." },
      { method: "PATCH", path: "/applications/:id", note: "Update stage, notes, or metadata." },
    ],
  },
  {
    resource: "Documents",
    description: "CVs, cover letters, and ATS scoring.",
    endpoints: [
      { method: "GET", path: "/documents", note: "List documents." },
      { method: "POST", path: "/documents", note: "Upload or create a document." },
      { method: "POST", path: "/documents/ats-score", note: "Score a document against a job description." },
    ],
  },
  {
    resource: "Interviews & contacts",
    description: "People and scheduled conversations.",
    endpoints: [
      { method: "GET", path: "/contacts", note: "List contacts." },
      { method: "POST", path: "/contacts", note: "Create a contact." },
      { method: "GET", path: "/interviews", note: "List scheduled interviews." },
      { method: "POST", path: "/interviews", note: "Schedule an interview." },
    ],
  },
  {
    resource: "Automations",
    description: "Rules that run follow-ups, reminders, and intake.",
    endpoints: [
      { method: "GET", path: "/automations", note: "List automation rules." },
      { method: "POST", path: "/automations", note: "Create a rule." },
      { method: "PATCH", path: "/automations/:id", note: "Enable, disable, or edit a rule." },
    ],
  },
  {
    resource: "System",
    description: "Health and platform metadata.",
    endpoints: [{ method: "GET", path: "/system/status", note: "Return platform service status." }],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  POST: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  PATCH: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const REQUEST_EXAMPLE = `curl https://api.newjob.guru/jobs \\
  -H "Authorization: Bearer $NEWJOB_TOKEN" \\
  -H "Content-Type: application/json"`;

const RESPONSE_EXAMPLE = `{
  "data": [
    {
      "id": "6ac4d2e05ba40c10cec43e1b",
      "title": "Senior Frontend Engineer",
      "company": "Acme GmbH",
      "stage": "applied",
      "createdAt": "2026-06-01T09:24:00.000Z"
    }
  ],
  "meta": { "page": 1, "pageSize": 20, "total": 1 }
}`;

const CODE_SHELL = "overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-[#0d0f1d]";

const CODE_CHIP = "rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-800 dark:bg-white/10 dark:text-slate-200";

const CARD = "rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5";

export default function ApiReferencePage() {
  return (
    <PublicPageShell
      eyebrow="API Reference"
      title="API Reference"
      subtitle="Build on the NewJob Guru REST API. Everything the web app does — jobs, applications, documents, and automations — is available over HTTP."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "API Reference", href: "/api-reference" }]}
    >
      <div className="space-y-4">
        <section className={CARD}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Base URL</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">All endpoints are served over HTTPS from a single host.</p>
          <pre className={`mt-4 ${CODE_SHELL}`}>
            <code className="text-blue-700 dark:text-blue-300">https://api.newjob.guru</code>
          </pre>
        </section>

        <section className={CARD}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Authentication</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Obtain an access token from <code className={CODE_CHIP}>POST /auth/login</code> and send it with every request
            in the <code className={CODE_CHIP}>Authorization</code> header as a Bearer token.
          </p>
          <pre className={`mt-4 ${CODE_SHELL}`}>
            <code className="text-slate-800 dark:text-slate-200">{"Authorization: Bearer <access_token>"}</code>
          </pre>
        </section>

        <section className={CARD}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Example request</h2>
          <pre className={`mt-4 ${CODE_SHELL}`}>
            <code className="text-slate-800 dark:text-slate-200">{REQUEST_EXAMPLE}</code>
          </pre>
          <h3 className="mt-6 text-sm font-semibold text-slate-700 dark:text-slate-200">Example response</h3>
          <pre className={`mt-3 ${CODE_SHELL}`}>
            <code className="text-slate-800 dark:text-slate-200">{RESPONSE_EXAMPLE}</code>
          </pre>
        </section>
      </div>

      <div className="mt-14 space-y-10">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">Endpoints</h2>
        {ENDPOINT_GROUPS.map((group) => (
          <section key={group.resource}>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{group.resource}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{group.description}</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  {group.endpoints.map((endpoint, i) => (
                    <tr key={endpoint.path + endpoint.method} className={i % 2 ? "bg-slate-50 dark:bg-white/[0.03]" : "bg-white dark:bg-transparent"}>
                      <td className="w-24 px-4 py-3 align-top">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide ${
                            METHOD_COLORS[endpoint.method] ?? "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <code className="text-[13px] text-slate-800 dark:text-slate-200">{endpoint.path}</code>
                      </td>
                      <td className="px-4 py-3 align-top text-slate-500 dark:text-slate-400">{endpoint.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Looking for setup instructions instead? Start with the{" "}
          <Link href="/docs" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Documentation</Link>{" "}
          or visit the{" "}
          <Link href="/help" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Help Center</Link>.
        </p>
      </div>
    </PublicPageShell>
  );
}