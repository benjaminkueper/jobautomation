"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BRAND } from "@/lib/brand";

const NAV_SECTIONS = {
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api-reference" },
    { label: "Blog", href: "/blog" },
    { label: "Status Page", href: "/status" },
    { label: "Help Center", href: "/help" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
} as const;

export type PublicSection = keyof typeof NAV_SECTIONS;

export function PublicHeader({ section = "resources" }: { section?: PublicSection }) {
  const pathname = usePathname();
  const nav = NAV_SECTIONS[section];

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("theme");
      document.documentElement.classList.toggle("dark", stored === "dark");
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0b10]/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <img src={BRAND.iconPath} alt={BRAND.name} className="h-8 w-8 rounded-lg object-cover" />
          <span className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">{BRAND.name}</span>
        </Link>

        <nav className="order-last flex w-full flex-wrap items-center gap-x-5 gap-y-2 md:order-none md:w-auto">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  active
                    ? "font-semibold text-blue-600 dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500 sm:inline-block dark:bg-blue-500"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}