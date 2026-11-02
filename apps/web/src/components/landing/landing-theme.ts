/** NewJob Guru landing tokens — CSS vars swap for light/dark. */
/** Palette: Background #FFFFFF · Text #0F172A · Primary #2563EB · Tint #E0EAFF · Muted #475569 */

export const LP_LIGHT_VARS = `
  --lp-bg: #ffffff;
  --lp-surface: #ffffff;
  --lp-panel: #f1f5f9;
  --lp-panel-soft: #f8fafc;
  --lp-cream: #f8fafc;
  --lp-cream-soft: #f1f5f9;
  --lp-cream-warm: #e0eaff;
  --lp-ink: #0f172a;
  --lp-muted: #475569;
  --lp-heading: #0f172a;
  --lp-body: #475569;
  --lp-line: rgba(15, 23, 42, 0.10);
  --lp-brand: #2563eb;
  --lp-brand-deep: #0f172a;
  --lp-brand-mid: #1d4ed8;
  --lp-brand-soft: #3b82f6;
  --lp-yellow: #e0eaff;
  --lp-yellow-hover: #2563eb;
  --lp-yellow-soft: #e0eaff;
  --lp-on-yellow: #2563eb;
  --lp-chip: #e2e8f0;
  --lp-mint: #e0eaff;
  --lp-mint-text: #2563eb;
  --lp-progress: #e2e8f0;
  --lp-tag: #e0eaff;
  --lp-tag-text: #2563eb;
  --lp-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  --lp-shadow-lg: 0 18px 40px rgba(15, 23, 42, 0.16);
`;

export const LP_DARK_VARS = `
  --lp-bg: #0f172a;
  --lp-surface: #1e293b;
  --lp-panel: #243350;
  --lp-panel-soft: #19233a;
  --lp-cream: #19233a;
  --lp-cream-soft: #16202f;
  --lp-cream-warm: #1e3a5f;
  --lp-ink: #e2e8f0;
  --lp-muted: #94a3b8;
  --lp-heading: #f8fafc;
  --lp-body: #cbd5e1;
  --lp-line: rgba(255, 255, 255, 0.10);
  --lp-brand: #3b82f6;
  --lp-brand-deep: #0b1120;
  --lp-brand-mid: #1d4ed8;
  --lp-brand-soft: #60a5fa;
  --lp-yellow: #bfdbfe;
  --lp-yellow-hover: #93c5fd;
  --lp-yellow-soft: #bfdbfe;
  --lp-on-yellow: #0f172a;
  --lp-chip: #263551;
  --lp-mint: #1e3a5f;
  --lp-mint-text: #bfdbfe;
  --lp-progress: #334155;
  --lp-tag: #263551;
  --lp-tag-text: #cbd5e1;
  --lp-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  --lp-shadow-lg: 0 18px 40px rgba(0, 0, 0, 0.5);
`;

/** Theme-aware landing palette (reads CSS vars from .lp-root). */
export const LP = {
  bg: "var(--lp-bg)",
  surface: "var(--lp-surface)",
  panel: "var(--lp-panel)",
  panelSoft: "var(--lp-panel-soft)",
  cream: "var(--lp-cream)",
  creamSoft: "var(--lp-cream-soft)",
  creamWarm: "var(--lp-cream-warm)",
  ink: "var(--lp-ink)",
  muted: "var(--lp-muted)",
  heading: "var(--lp-heading)",
  body: "var(--lp-body)",
  line: "var(--lp-line)",
  /** Primary brand fill (#2563EB) — same in both themes. */
  green: "var(--lp-brand)",
  greenDeep: "var(--lp-brand-deep)",
  greenMid: "var(--lp-brand-mid)",
  greenSoft: "var(--lp-brand-soft)",
  /** Accent chip color (tint #E0EAFF in light) + readable text paired with it. */
  yellow: "var(--lp-yellow)",
  yellowHover: "var(--lp-yellow-hover)",
  yellowSoft: "var(--lp-yellow-soft)",
  onYellow: "var(--lp-on-yellow)",
  /** Card / elevated surface */
  white: "var(--lp-surface)",
  chip: "var(--lp-chip)",
  mint: "var(--lp-mint)",
  mintText: "var(--lp-mint-text)",
  progress: "var(--lp-progress)",
  tag: "var(--lp-tag)",
  tagText: "var(--lp-tag-text)",
  shadow: "var(--lp-shadow)",
  shadowLg: "var(--lp-shadow-lg)",
  sectionY: "py-10 md:py-14",
  sectionYTight: "py-8 md:py-12",
} as const;
