import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { PublicThemeScript } from "./PublicThemeScript";
import { PublicHeader, type PublicSection } from "./PublicHeader";

export function PublicPageShell({
  title,
  subtitle,
  eyebrow,
  breadcrumb,
  section = "resources",
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  breadcrumb?: { label: string; href: string }[];
  section?: PublicSection;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0b10] dark:text-white">
      <PublicThemeScript />
      <PublicHeader section={section} />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav className="mb-6 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {i > 0 ? <span className="text-slate-300 dark:text-slate-600">/</span> : null}
                <Link href={crumb.href} className="transition-colors hover:text-slate-700 dark:hover:text-slate-200">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">{subtitle}</p>
        ) : null}

        <div className="mt-10">{children}</div>
      </main>

      <footer className="border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Docs
            </Link>
            <Link href="/api-reference" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              API
            </Link>
            <Link href="/blog" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Blog
            </Link>
            <Link href="/help" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Help
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-slate-900 dark:hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}