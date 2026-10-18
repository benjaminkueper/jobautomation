"use client";

import Link from "next/link";
import { Linkedin, Mail, Twitter } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
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

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden" style={{ background: LP.greenDeep }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none text-center text-[12vw] font-extrabold leading-none tracking-tighter text-white/[0.035]"
      >
        NewJob Guru
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo onDark className="mb-3" />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              AI-powered job search automation. Collect alerts, apply smarter, and track every opportunity in one place.
            </p>
            <div className="mt-4 flex gap-2.5">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "mailto:hello@newjob.guru", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(COLUMNS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-white/45">
          © {new Date().getFullYear()} NewJob Guru. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
