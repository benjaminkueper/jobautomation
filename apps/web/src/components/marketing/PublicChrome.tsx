"use client";

import type { ReactNode } from "react";
import { LandingThemeProvider, useLandingTheme } from "@/components/landing/LandingThemeContext";
import { Navbar } from "@/components/landing/Navbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LP, LP_DARK_VARS, LP_LIGHT_VARS } from "@/components/landing/landing-theme";

function Chrome({ children }: { children: ReactNode }) {
  const { isDark } = useLandingTheme();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .lp-root { ${isDark ? LP_DARK_VARS : LP_LIGHT_VARS} }
            .lp-root, .lp-root * {
              transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
            }
            .lp-root a, .lp-root button { transition: all 0.2s ease; }
          `,
        }}
      />
      <div
        className={`lp-root min-h-screen overflow-x-hidden font-sans antialiased selection:bg-[#2563EB]/25 selection:text-[#0F172A] ${isDark ? "dark" : ""}`}
        style={{
          background: LP.bg,
          color: LP.ink,
          fontFamily: "var(--font-ui), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <Navbar />
        {/* Clear the fixed navbar */}
        <div className="pt-16 sm:pt-[68px]">{children}</div>
        <LandingFooter />
      </div>
    </>
  );
}

/**
 * Landing-identical chrome (updated navbar + footer + palette) for public
 * content pages such as /about, /careers, /privacy, /terms, /cookies, /status.
 */
export function PublicChrome({ children }: { children: ReactNode }) {
  return (
    <LandingThemeProvider>
      <Chrome>{children}</Chrome>
    </LandingThemeProvider>
  );
}
