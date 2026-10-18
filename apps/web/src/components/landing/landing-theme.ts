/** NewJob Guru landing tokens — CSS vars swap for light/dark. */

export const LP_LIGHT_VARS = `
  --lp-bg: #ffffff;
  --lp-surface: #ffffff;
  --lp-panel: #f3f1ec;
  --lp-panel-soft: #f7f8f7;
  --lp-cream: #f3eee6;
  --lp-cream-soft: #f7f4ee;
  --lp-cream-warm: #fff7e8;
  --lp-ink: #0b1f18;
  --lp-muted: #5c6b64;
  --lp-heading: #013b2a;
  --lp-body: #0a5a42;
  --lp-line: rgba(1, 59, 42, 0.12);
  --lp-brand: #013b2a;
  --lp-brand-deep: #01281d;
  --lp-brand-mid: #024f38;
  --lp-brand-soft: #0a5a42;
  --lp-yellow: #fda201;
  --lp-yellow-hover: #e89200;
  --lp-yellow-soft: #ffe7b0;
  --lp-on-yellow: #013b2a;
  --lp-chip: #eef0ee;
  --lp-mint: #e7f6ec;
  --lp-mint-text: #013b2a;
  --lp-progress: #e4e0d8;
  --lp-tag: #e8eef2;
  --lp-tag-text: #3a4a5a;
  --lp-shadow: 0 8px 24px rgba(1, 59, 42, 0.08);
  --lp-shadow-lg: 0 18px 40px rgba(1, 40, 29, 0.22);
`;

export const LP_DARK_VARS = `
  --lp-bg: #0b1410;
  --lp-surface: #15241c;
  --lp-panel: #1a2c22;
  --lp-panel-soft: #122019;
  --lp-cream: #1a2820;
  --lp-cream-soft: #16241c;
  --lp-cream-warm: #243528;
  --lp-ink: #e8f0eb;
  --lp-muted: #8fa399;
  --lp-heading: #f3f7f4;
  --lp-body: #a8c5b5;
  --lp-line: rgba(255, 255, 255, 0.12);
  --lp-brand: #013b2a;
  --lp-brand-deep: #071510;
  --lp-brand-mid: #0e3d2c;
  --lp-brand-soft: #0a5a42;
  --lp-yellow: #fda201;
  --lp-yellow-hover: #e89200;
  --lp-yellow-soft: #4a3a14;
  --lp-on-yellow: #013b2a;
  --lp-chip: #243830;
  --lp-mint: #1a3328;
  --lp-mint-text: #b7e4c7;
  --lp-progress: #2a3a32;
  --lp-tag: #243830;
  --lp-tag-text: #c5d4cc;
  --lp-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  --lp-shadow-lg: 0 18px 40px rgba(0, 0, 0, 0.45);
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
  /** Brand fill green — stays deep green in both themes */
  green: "var(--lp-brand)",
  greenDeep: "var(--lp-brand-deep)",
  greenMid: "var(--lp-brand-mid)",
  greenSoft: "var(--lp-brand-soft)",
  yellow: "var(--lp-yellow)",
  yellowHover: "var(--lp-yellow-hover)",
  yellowSoft: "var(--lp-yellow-soft)",
  onYellow: "var(--lp-on-yellow)",
  /** Card / elevated surface (was white) */
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
