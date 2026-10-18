"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

function MobileStickyBar() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.4, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{
        background: "rgba(1, 59, 42, 0.96)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(16px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <Link
          href="/register"
          className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold"
          style={{ background: LP.yellow, color: LP.onYellow }}
        >
          Get started
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/login"
          className="rounded-full px-5 py-3.5 text-sm font-semibold text-white"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          Log in
        </Link>
      </div>
    </motion.div>
  );
}

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
        className={`lp-root min-h-screen overflow-x-hidden font-sans antialiased selection:bg-[#FDA201]/35 selection:text-[#013B2A] ${isDark ? "dark" : ""}`}
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
        <div className="h-20 md:hidden" />
        <LandingFooter />
        <MobileStickyBar />
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
