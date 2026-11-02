import Link from "next/link";
import { PublicChrome } from "./PublicChrome";

export function PublicPageShell({
  title,
  subtitle,
  eyebrow,
  breadcrumb,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  breadcrumb?: { label: string; href: string }[];
  /** Kept for API compatibility with existing pages. */
  section?: "resources" | "company";
  children: React.ReactNode;
}) {
  return (
    <PublicChrome>
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
    </PublicChrome>
  );
}
