"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Linkedin, Mail, Twitter } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useLandingTheme } from "./LandingThemeContext";
import { LP } from "./landing-theme";

const COLUMNS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "mailto:hello@newjob.guru" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "Status", href: "/status" },
  ],
};

/**
 * Footer — light palette per the shared brand colors:
 * Tint #E0EAFF background, Text #0F172A, Primary #2563EB, Muted #475569.
 * Product · Company · Legal sit side by side in one row from md up.
 */
export function LandingFooter() {
  const { isDark } = useLandingTheme();
  const ghostRef = useRef<HTMLDivElement>(null);

  // The ghost's sweep is a pure CSS animation. In environments where the
  // browser's animation timeline is frozen (battery savers, embedded views),
  // drive the same sweep manually so the shine still moves.
  useEffect(() => {
    const el = ghostRef.current;
    if (!el) return;
    let raf = 0;
    const DURATION = 7000;
    const start = Date.now();
    let t0: number | null = null;
    try {
      const anims = el.getAnimations ? el.getAnimations() : [];
      t0 = anims.length ? (anims[0].currentTime as number) : null;
    } catch { /* old engines */ }
    const decide = window.setTimeout(() => {
      let frozen = true;
      try {
        const anims = el.getAnimations ? el.getAnimations() : [];
        if (anims.length && anims[0].currentTime !== (t0 as number)) frozen = false;
        if (!anims.length && t0 === null) frozen = true;
      } catch { frozen = true; }
      if (!frozen) return;
      el.style.animation = "none";
      // setInterval + Date.now: the most universally advancing clock pair.
      const iv = window.setInterval(() => {
        const t = ((Date.now() - start) % DURATION) / DURATION;
        el.style.backgroundPosition = `${200 - 400 * t}% 50%`;
      }, 32);
      raf = iv as unknown as number;
    }, 700);
    return () => {
      window.clearTimeout(decide);
      if (raf) window.clearInterval(raf);
    };
  }, []);

  return (
    <footer className="relative overflow-hidden" style={{ background: LP.mint }}>
      {/* Ghost watermark: black-toned with a looping sheen sweep */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes lpGhostShine {
              0% { background-position: 200% 50%; }
              100% { background-position: -200% 50%; }
            }
            .lp-ghost-mark {
              background-image: linear-gradient(90deg,
                rgba(15, 23, 42, 0.16) 0%,
                rgba(15, 23, 42, 0.16) 40%,
                rgba(255, 255, 255, 0.95) 50%,
                rgba(15, 23, 42, 0.16) 60%,
                rgba(15, 23, 42, 0.16) 100%);
              background-size: 200% 100%;
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              -webkit-text-fill-color: transparent;
              animation: lpGhostShine 7s linear infinite;
            }
            .dark .lp-ghost-mark {
              background-image: linear-gradient(90deg,
                rgba(226, 232, 240, 0.14) 0%,
                rgba(226, 232, 240, 0.14) 40%,
                rgba(147, 197, 253, 0.6) 50%,
                rgba(226, 232, 240, 0.14) 60%,
                rgba(226, 232, 240, 0.14) 100%);
            }
            @media (prefers-reduced-motion: reduce) {
              .lp-ghost-mark { animation: none; }
            }
          `,
        }}
      />
      <div
        aria-hidden
        ref={ghostRef}
        className="lp-ghost-mark pointer-events-none absolute inset-x-0 bottom-0 select-none text-center text-[12vw] font-extrabold leading-none tracking-tighter"
      >
        NewJob Guru
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-10 pb-12 sm:px-8 sm:pt-12">
        {/* Below md everything is center-aligned for a clean mobile footer;
            from md up the grid returns to left-aligned. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-center min-[540px]:grid-cols-3 md:grid-cols-[1.25fr_1fr_1fr_1fr] md:gap-x-8 md:text-left lg:gap-x-10">
          <div className="col-span-2 min-[540px]:col-span-3 md:col-span-1">
            <BrandLogo onDark={isDark} className="mb-3" />
            <p className="mx-auto max-w-xs text-sm leading-relaxed md:mx-0" style={{ color: LP.muted }}>
              AI-powered job search automation. Collect alerts, apply smarter, and track every opportunity in one place.
            </p>
            <div className="mt-4 flex justify-center gap-2.5 md:justify-start">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "mailto:hello@newjob.guru", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-all hover:-translate-y-0.5 hover:opacity-90"
                  style={{ background: LP.surface, color: LP.green, boxShadow: LP.shadow }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(COLUMNS).map(([title, links]) => {
            const isLegal = title === "Legal";
            return (
              <div key={title} className={isLegal ? "col-span-2 min-[540px]:col-span-1 md:col-span-1" : undefined}>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: LP.muted, opacity: 0.7 }}>
                {title}
              </h4>
              {/* Legal: horizontal full-width row on phones; joins the 3-col
                  row from 540px up, and the 4-col grid from md up. */}
              <ul
                className={
                  isLegal
                    ? "flex flex-wrap items-center justify-center gap-x-6 gap-y-2 min-[540px]:flex-col min-[540px]:justify-start min-[540px]:gap-y-2 md:items-start"
                    : "space-y-2"
                }
              >
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors hover:text-[color:var(--lp-brand)]"
                        style={{ color: LP.muted }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm transition-colors hover:text-[color:var(--lp-brand)]"
                        style={{ color: LP.muted }}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-8 border-t pt-5 text-center text-xs" style={{ borderColor: LP.line, color: LP.muted }}>
          © {new Date().getFullYear()} NewJob Guru. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
