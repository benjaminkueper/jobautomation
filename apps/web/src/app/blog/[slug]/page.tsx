import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";
import { BLOG_POSTS, getPost } from "@/content/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://www.newjob.guru/blog/${post.slug}` },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <PublicPageShell
      eyebrow={post.category}
      title={post.title}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: post.category, href: "/blog" },
      ]}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
        <span>{post.dateLabel}</span>
        <span>·</span>
        <span>{post.readTime}</span>
      </div>

      <article className="mt-8 max-w-3xl [&_h2]:mt-9 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_p]:mt-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-slate-700 [&_li]:dark:text-slate-300 [&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:text-[15px] [&_blockquote]:italic [&_blockquote]:text-slate-800 [&_blockquote]:dark:text-slate-100 [&_code]:rounded [&_code]:bg-slate-200 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:text-blue-700 [&_code]:dark:bg-white/10 [&_code]:dark:text-blue-300 [&_a]:text-blue-600 [&_a]:dark:text-blue-400">
        {post.body}
      </article>

      <div className="mt-14 flex items-center justify-between border-t border-slate-200 pt-8 dark:border-white/10">
        <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          ← All articles
        </Link>
        <Link href="/register" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Start automating →
        </Link>
      </div>

      {others.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Keep reading</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-blue-400 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500 dark:hover:bg-white/10"
              >
                <span className="text-xs text-slate-400 dark:text-slate-500">{other.readTime}</span>
                <h3 className="mt-2 text-base font-semibold leading-snug text-slate-900 dark:text-white">{other.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{other.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </PublicPageShell>
  );
}
