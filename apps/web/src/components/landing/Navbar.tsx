"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useLandingTheme } from "./LandingThemeContext";
import { LP } from "./landing-theme";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useLandingTheme();
  const pathname = usePathname();
  // On landing the anchors scroll in-page; on subpages they navigate home first.
  const anchor = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255, 255, 255, 0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          // Bottom hairline is always visible (also while the hero is on screen).
          boxShadow: "0 1px 0 rgba(15, 23, 42, 0.12)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[68px] sm:px-8">
          <BrandLogo priority />

          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={anchor(link.href)}
                className="text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
                style={{ color: LP.ink }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full opacity-80 transition-colors hover:opacity-100"
              style={{ color: LP.ink, background: scrolled ? "rgba(15, 23, 42, 0.05)" : "transparent" }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link href="/login" className="text-sm font-medium opacity-85 transition-opacity hover:opacity-100" style={{ color: LP.ink }}>
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ background: LP.green }}
            >
              Get started
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={toggle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full"
              style={{ color: LP.ink, background: "rgba(15, 23, 42, 0.06)" }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full"
              style={{ color: LP.ink, background: "rgba(15, 23, 42, 0.06)" }}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-0 top-16 z-40 border-b px-5 py-4 sm:top-[68px] md:hidden"
            style={{ background: LP.surface, borderColor: LP.line }}
          >
            <div className="flex flex-col gap-0.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={anchor(link.href)}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-[15px] font-medium"
                  style={{ color: LP.ink }}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t pt-3" style={{ borderColor: LP.line }}>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-semibold"
                  style={{ color: LP.ink, background: LP.panel }}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full px-4 py-2.5 text-center text-sm font-semibold text-white"
                  style={{ background: LP.green }}
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
