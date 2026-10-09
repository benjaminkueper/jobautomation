import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";
import { BLOG_POSTS } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and playbooks on running an efficient, high-quality job search — resumes, outreach, automation, and productivity.",
  alternates: { canonical: "https://www.newjob.guru/blog" },
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <PublicPageShell
      eyebrow="Blog"
      title="The NewJob Guru blog"
      subtitle="Practical playbooks for running a faster, higher-quality job search — no fluff, no spam tactics."
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }]}
    >
      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group block rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-transparent p-6 transition-colors hover:border-blue-400 sm:p-8 dark:border-white/10 dark:from-blue-500/10 dark:hover:border-blue-500"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">{featured.category}</span>
            <span>{featured.dateLabel}</span>
            <span>·</span>
            <span>{featured.readTime}</span>
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl dark:text-white">{featured.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">{featured.excerpt}</p>
          <span className="mt-5 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">Read article →</span>
        </Link>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-blue-400 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500 dark:hover:bg-white/10"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="rounded-full bg-slate-200 px-2.5 py-1 font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200">{post.category}</span>
              <span>{post.readTime}</span>
            </div>
            <h3 className="mt-4 text-base font-semibold leading-snug text-slate-900 dark:text-white">{post.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.excerpt}</p>
            <span className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
              Read article <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>
    </PublicPageShell>
  );
}
