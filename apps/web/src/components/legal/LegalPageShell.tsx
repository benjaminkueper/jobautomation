import { PublicHeader } from "@/components/marketing/PublicHeader";
import { PublicThemeScript } from "@/components/marketing/PublicThemeScript";

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0b10] dark:text-white">
      <PublicThemeScript />
      <PublicHeader section="company" />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Last updated: {lastUpdated}</p>
        <article className="mt-8 max-w-none [&_h2]:mt-9 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h3]:mt-6 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:dark:text-slate-200 [&_p]:mt-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-slate-700 [&_p]:dark:text-slate-300 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-slate-700 [&_li]:dark:text-slate-300 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_strong]:dark:text-white [&_em]:italic [&_a]:font-medium [&_a]:text-blue-600 [&_a]:hover:text-blue-500 [&_a]:dark:text-blue-400 [&_a]:dark:hover:text-blue-300 [&_br]:leading-relaxed [&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-800 [&_blockquote]:dark:text-slate-100">
          {children}
        </article>
        <footer className="mt-12 border-t border-slate-200 pt-8 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          <p>
            Questions? Contact{" "}
            <a href="mailto:info@benjaminkueper.com" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              info@benjaminkueper.com
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}