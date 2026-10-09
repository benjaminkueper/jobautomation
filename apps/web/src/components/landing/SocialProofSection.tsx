"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const COMPANY_LOGOS: { name: string; icon: React.ReactNode }[] = [
  {
    name: "Google",
    icon: (
      <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    icon: (
      <svg width="24" height="24" viewBox="0 0 23 23" fill="none">
        <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022"/>
        <rect x="12.5" y="0" width="10.5" height="10.5" fill="#7FBA00"/>
        <rect x="0" y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
      </svg>
    ),
  },
  {
    name: "amazon",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 14.5c4 3.4 12 3.4 16 0" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M18.2 12.6l2.6 1.9-2.5 2.1" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "airbnb",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C9.5 2 7.5 4.5 7.5 4.5S3 10 3 14c0 2.76 2.24 5 5 5 1.5 0 2.8-.66 3.7-1.7L12 18.5l.3.8C13.2 20.34 14.5 21 16 21c2.76 0 5-2.24 5-5 0-4-4.5-9.5-4.5-9.5S14.5 2 12 2zm0 3c1.1 0 2 1.5 2 1.5S17 11 17 14c0 1.66-1.34 3-3 3-.9 0-1.7-.4-2.24-1.03l-.76-1.14-.76 1.14C9.7 16.6 8.9 17 8 17c-1.66 0-3-1.34-3-3 0-3 3-7.5 3-7.5S10.9 5 12 5z" fill="#FF5A5F"/>
      </svg>
    ),
  },
  {
    name: "Spotify",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#1DB954"/>
        <path d="M7 15.5c2.5-1.5 5.5-1.8 8.5-.8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.5 12.5c3-1.8 6.5-2.1 10-.9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 9.5c3.5-2 7.5-2.4 11.5-1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Notion",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="2" width="18" height="20" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 7h10M7 11h7M7 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Slack",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 9a2 2 0 1 1 2-2v2H5zm0 1h4a2 2 0 0 1 0 4H5a2 2 0 0 1 0-4z" fill="#36C5F0"/>
        <path d="M15 5a2 2 0 1 1 2 2h-2V5zm-1 0v4a2 2 0 0 1-4 0V5a2 2 0 0 1 4 0z" fill="#2EB67D"/>
        <path d="M19 15a2 2 0 1 1-2 2v-2h2zm0-1h-4a2 2 0 0 1 0-4h4a2 2 0 0 1 0 4z" fill="#ECB22E"/>
        <path d="M9 19a2 2 0 1 1-2-2h2v2zm1 0v-4a2 2 0 0 1 4 0v4a2 2 0 0 1-4 0z" fill="#E01E5A"/>
      </svg>
    ),
  },
  {
    name: "Stripe",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#635BFF"/>
        <g transform="translate(3,0)">
          <path d="M9 8.5c0-.83.67-1.5 1.5-1.5.64 0 1.18.4 1.4.97l1.6-.66C13.1 6.23 11.9 5.5 10.5 5.5 8.57 5.5 7 7.07 7 9c0 3.31 4.5 2.77 4.5 4.5 0 .83-.67 1.5-1.5 1.5-.74 0-1.35-.5-1.47-1.2L7 14.48C7.26 16.04 8.73 17 10.5 17c1.93 0 3.5-1.57 3.5-3.5 0-3.31-4.5-2.77-4.5-4.5-.5 0 0 0 0 0v-.5z" fill="white"/>
        </g>
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    quote: "This completely replaced my spreadsheets. I used to track 40+ applications manually — now it's all automated. Got 3 interviews in my first week.",
    name: "Marcus Heidenreich",
    title: "Senior Frontend Engineer",
    location: "Berlin, Germany",
    avatar: "MH",
    avatarBg: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    stars: 5,
  },
  {
    quote: "Connecting Gmail pulled my job alerts straight into the pipeline. Apply Assistant on my phone made applying way faster — I save hours every week.",
    name: "Priya Nair",
    title: "Product Manager",
    location: "London, UK",
    avatar: "PN",
    avatarBg: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    stars: 5,
  },
  {
    quote: "Best job automation platform I've used. The AI cover letters actually sound like me — not generic. Landed my dream role at a Series B startup after 3 weeks.",
    name: "Jordan Williams",
    title: "Full Stack Developer",
    location: "Toronto, Canada",
    avatar: "JW",
    avatarBg: "linear-gradient(135deg,#22c55e,#10b981)",
    stars: 5,
  },
  {
    quote: "As an international job seeker, multi-language support was a game changer. I applied to roles in Germany, Netherlands, and Switzerland all from one place.",
    name: "Yuki Tanaka",
    title: "Data Scientist",
    location: "Amsterdam, Netherlands",
    avatar: "YT",
    avatarBg: "linear-gradient(135deg,#f97316,#ef4444)",
    stars: 5,
  },
  {
    quote: "The follow-up automation alone is worth it. I never have to remember to send a follow-up email — it happens automatically. My response rate went up 60%.",
    name: "Sofia Marchetti",
    title: "UX Designer",
    location: "Milan, Italy",
    avatar: "SM",
    avatarBg: "linear-gradient(135deg,#ec4899,#f43f5e)",
    stars: 5,
  },
  {
    quote: "I was applying to 15+ jobs per week. Without NewJob Guru I'd be drowning. The pipeline view shows exactly where each application is and what I need to do.",
    name: "David Osei",
    title: "Software Engineer",
    location: "Lagos, Nigeria",
    avatar: "DO",
    avatarBg: "linear-gradient(135deg,#6366f1,#3b82f6)",
    stars: 5,
  },
];

const STATS = [
  { target: 10000, suffix: "+", label: "Applications Tracked", prefix: "" },
  { target: 4.9, suffix: "/5", label: "Average Rating", prefix: "" },
  { target: 95, suffix: "%", label: "Automation Success", prefix: "" },
  { target: 40, suffix: "+", label: "Countries", prefix: "" },
];

function AnimatedCounter({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = isDecimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target);
      setCount(val);
      if (step >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target]);

  const display = target >= 1000
    ? (count >= 1000 ? `${Math.floor(count / 1000)}k` : count.toString())
    : count.toString();

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ quote, name, title, location, avatar, avatarBg, stars }: {
  quote: string; name: string; title: string; location: string;
  avatar: string; avatarBg: string; stars: number;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 cursor-default shrink-0 w-[320px] sm:w-[360px]"
      style={{ background: "var(--lp-card)", border: "1px solid var(--lp-bd)", boxShadow: "var(--lp-shadow-sm)" }}
    >
      <StarRating count={stars} />
      <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--lp-t2)" }}>&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid var(--lp-bd3)" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-lg" style={{ background: avatarBg }}>
          {avatar}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--lp-t1)" }}>{name}</div>
          <div className="text-[11px]" style={{ color: "var(--lp-t4)" }}>{title} · {location}</div>
        </div>
      </div>
    </div>
  );
}

export function SocialProofSection() {
  return (
    <section className="py-14 md:py-16 overflow-hidden" style={{ borderTop: "1px solid var(--lp-section-sep)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium uppercase tracking-widest mb-8" style={{ color: "var(--lp-t5)" }}>
            Trusted by job seekers worldwide
          </p>

          <div className="relative overflow-hidden">
            <div className="flex gap-10 items-center" style={{ animation: "scrollLogos 30s linear infinite" }}>
              {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map(({ name, icon }, i) => (
                <div
                  key={`${name}-${i}`}
                  className="flex items-center gap-2.5 shrink-0 opacity-50 hover:opacity-90 transition-opacity cursor-default"
                  style={{ color: "var(--lp-t2)" }}
                  title={name}
                >
                  <span className="flex items-center justify-center" style={{ width: 24, height: 24 }}>{icon}</span>
                  <span className="text-[15px] font-bold whitespace-nowrap">{name}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-24 pointer-events-none" style={{ background: "linear-gradient(90deg, var(--lp-bg), transparent)" }} />
            <div className="absolute inset-y-0 right-0 w-24 pointer-events-none" style={{ background: "linear-gradient(-90deg, var(--lp-bg), transparent)" }} />
          </div>
        </motion.div>

        {/* Animated stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden mb-16"
          style={{ background: "var(--lp-bd)", border: "1px solid var(--lp-bd)" }}
        >
          {STATS.map(({ target, suffix, label, prefix }) => (
            <div key={label} className="text-center py-7 px-4" style={{ background: "var(--lp-card2)" }}>
              <div
                className="text-3xl font-bold bg-clip-text text-transparent mb-1"
                style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}
              >
                <AnimatedCounter target={target} suffix={suffix} prefix={prefix} />
              </div>
              <div className="text-xs font-medium" style={{ color: "var(--lp-t5)" }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Section header */}
        <div id="testimonials" className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: "var(--lp-t1)" }}
          >
            Loved by Job Seekers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base"
            style={{ color: "var(--lp-t3)" }}
          >
            Join thousands who automated their job search and landed their dream role.
          </motion.p>
        </div>

      </div>

      {/* Testimonial marquee — full bleed, outside max-width container */}
      <div className="mt-4 space-y-4 overflow-hidden">
        {/* Row 1 — left to right scroll */}
        <div className="relative">
          <div className="flex gap-4" style={{ animation: "scrollTestimonials 40s linear infinite" }}>
            {[...TESTIMONIALS, ...TESTIMONIALS].map(({ quote, name, title, location, avatar, avatarBg, stars }, i) => (
              <TestimonialCard key={`r1-${i}`} quote={quote} name={name} title={title} location={location} avatar={avatar} avatarBg={avatarBg} stars={stars} />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, var(--lp-bg), transparent)" }} />
          <div className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10" style={{ background: "linear-gradient(-90deg, var(--lp-bg), transparent)" }} />
        </div>

        {/* Row 2 — right to left scroll (reverse), offset for masonry feel */}
        <div className="relative">
          <div className="flex gap-4" style={{ animation: "scrollTestimonialsReverse 50s linear infinite" }}>
            {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map(({ quote, name, title, location, avatar, avatarBg, stars }, i) => (
              <TestimonialCard key={`r2-${i}`} quote={quote} name={name} title={title} location={location} avatar={avatar} avatarBg={avatarBg} stars={stars} />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, var(--lp-bg), transparent)" }} />
          <div className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10" style={{ background: "linear-gradient(-90deg, var(--lp-bg), transparent)" }} />
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scrollLogos {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scrollTestimonials {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scrollTestimonialsReverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .testimonial-marquee-row:hover > div {
          animation-play-state: paused;
        }
      `,
        }}
      />
    </section>
  );
}
