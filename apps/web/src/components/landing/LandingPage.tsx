"use client";

import { useEffect } from "react";
import { LandingThemeProvider, useLandingTheme } from "./LandingThemeContext";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { ComparisonSection } from "./ComparisonSection";
import { FeatureShowcaseSection } from "./FeatureShowcaseSection";
import { ToolsBentoSection } from "./ToolsBentoSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { IntegrationsSection } from "./IntegrationsSection";
import { MobileSection } from "./MobileSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";
import { LandingFooter } from "./LandingFooter";
import { LP, LP_DARK_VARS, LP_LIGHT_VARS } from "./landing-theme";

function LandingInner() {
  const { isDark } = useLandingTheme();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

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
        <main>
          <HeroSection />
          <ComparisonSection />
          <FeatureShowcaseSection />
          <ToolsBentoSection />
          <HowItWorksSection />
          <IntegrationsSection />
          <MobileSection />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
          <CTASection />
        </main>
        <LandingFooter />
      </div>
    </>
  );
}

export function LandingPage() {
  return (
    <LandingThemeProvider>
      <LandingInner />
    </LandingThemeProvider>
  );
}
