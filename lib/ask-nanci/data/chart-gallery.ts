// Data for the /charts gallery: the reference page that shows every chart form the
// stack can render and every knob that themes it.
//
// Datasets that already exist elsewhere are imported, not re-authored: the gallery is
// a reference, so it should show the same figures the real panels show. Only the shapes
// no panel currently renders (radar, funnel, radial, sparkline) are authored here.
import { MERCHANT_VOLUME_DATA } from "./merchants";
import { SCATTER_POINTS } from "./risk-dashboard";

// ── Palettes ───────────────────────────────────────────────────────────────────
// A swatch is either one color for both schemes, or a light/dark pair. The pair form
// is what shadcn's ChartConfig calls `theme`. ChartStyle emits it as
// `--color-<key>` under `[data-chart=id]` and `.dark [data-chart=id]`.
export type ChartSwatch = string | { light: string; dark: string };

export interface GalleryPalette {
  label: string;
  /** One line on what this ramp is and when it is the right choice. */
  note: string;
  swatches: ChartSwatch[];
}

export const PALETTES = {
  shadcn: {
    label: "Shadcn",
    note: "The stock shadcn chart ramp, shipped by aperia-ds5 in styles/base.css. It has separate :root and .dark values, so it is the only one of the three that was built to re-tune for dark mode.",
    swatches: [
      { light: "oklch(0.646 0.222 41.116)", dark: "oklch(0.488 0.243 264.376)" },
      { light: "oklch(0.600 0.118 184.704)", dark: "oklch(0.696 0.170 162.480)" },
      { light: "oklch(0.398 0.070 227.392)", dark: "oklch(0.769 0.188 70.080)" },
      { light: "oklch(0.828 0.189 84.429)", dark: "oklch(0.627 0.265 303.900)" },
      { light: "oklch(0.769 0.188 70.080)", dark: "oklch(0.645 0.246 16.439)" },
    ],
  },
  ds5: {
    label: "DS5 Colors",
    note: "The --chart-1..6 hexes in app/globals.css. What the app renders today. One ramp for both schemes, fixed regardless of brand theme.",
    swatches: ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"],
  },
  primary: {
    label: "Primary Ramp",
    note: "Mixed from the active brand's --primary toward --background, so it follows the theme picker and re-tunes for dark mode on its own. Sequential: correct for one ordered measure, wrong for unrelated categories.",
    swatches: [
      "var(--primary)",
      "color-mix(in oklab, var(--primary) 82%, var(--background))",
      "color-mix(in oklab, var(--primary) 64%, var(--background))",
      "color-mix(in oklab, var(--primary) 46%, var(--background))",
      "color-mix(in oklab, var(--primary) 30%, var(--background))",
      "color-mix(in oklab, var(--primary) 17%, var(--background))",
    ],
  },
} satisfies Record<string, GalleryPalette>;

export type PaletteId = keyof typeof PALETTES;

// ── Datasets ───────────────────────────────────────────────────────────────────

/** Twelve months of portfolio figures, for the trend, area, combo and brush specimens. */
export const GALLERY_MONTHLY = [
  { month: "Jan", volume: 4.12, declines: 6.8, chargebacks: 0.41 },
  { month: "Feb", volume: 3.94, declines: 7.1, chargebacks: 0.46 },
  { month: "Mar", volume: 4.68, declines: 6.4, chargebacks: 0.38 },
  { month: "Apr", volume: 4.91, declines: 6.9, chargebacks: 0.44 },
  { month: "May", volume: 5.24, declines: 7.6, chargebacks: 0.52 },
  { month: "Jun", volume: 5.08, declines: 8.2, chargebacks: 0.61 },
  { month: "Jul", volume: 5.63, declines: 7.9, chargebacks: 0.57 },
  { month: "Aug", volume: 5.81, declines: 7.4, chargebacks: 0.49 },
  { month: "Sep", volume: 5.42, declines: 8.7, chargebacks: 0.66 },
  { month: "Oct", volume: 5.97, declines: 9.1, chargebacks: 0.72 },
  { month: "Nov", volume: 6.44, declines: 8.4, chargebacks: 0.63 },
  { month: "Dec", volume: 7.12, declines: 7.8, chargebacks: 0.55 },
];

/**
 * Channel split, for the grouped and stacked specimens: a full year across five
 * channels, so multi-series charts exercise five ramp colors, not three.
 */
export const GALLERY_CHANNEL_MIX = [
  { month: "Jan", cardPresent: 2.31, ecom: 0.86, keyed: 0.48, wallet: 0.29, ach: 0.18 },
  { month: "Feb", cardPresent: 2.18, ecom: 0.91, keyed: 0.45, wallet: 0.24, ach: 0.16 },
  { month: "Mar", cardPresent: 2.6, ecom: 1.06, keyed: 0.52, wallet: 0.29, ach: 0.21 },
  { month: "Apr", cardPresent: 2.71, ecom: 1.12, keyed: 0.54, wallet: 0.32, ach: 0.22 },
  { month: "May", cardPresent: 2.86, ecom: 1.24, keyed: 0.57, wallet: 0.34, ach: 0.23 },
  { month: "Jun", cardPresent: 2.74, ecom: 1.23, keyed: 0.55, wallet: 0.33, ach: 0.23 },
  { month: "Jul", cardPresent: 3.02, ecom: 1.35, keyed: 0.6, wallet: 0.41, ach: 0.25 },
  { month: "Aug", cardPresent: 3.09, ecom: 1.43, keyed: 0.61, wallet: 0.42, ach: 0.26 },
  { month: "Sep", cardPresent: 2.84, ecom: 1.38, keyed: 0.58, wallet: 0.38, ach: 0.24 },
  { month: "Oct", cardPresent: 3.11, ecom: 1.54, keyed: 0.63, wallet: 0.43, ach: 0.26 },
  { month: "Nov", cardPresent: 3.34, ecom: 1.69, keyed: 0.67, wallet: 0.46, ach: 0.28 },
  { month: "Dec", cardPresent: 3.71, ecom: 1.91, keyed: 0.73, wallet: 0.48, ach: 0.29 },
];

/** Top merchants by volume, in millions, for the bar and horizontal-bar specimens. */
export const GALLERY_TOP_MERCHANTS = MERCHANT_VOLUME_DATA.slice(0, 6).map((m) => ({
  merchant: m.merchant.replace(/ (Group|Chain|Co\.)$/, ""),
  volume: Number((m.volume / 1_000_000).toFixed(2)),
}));

/** Decline reasons, for the pie and donut specimens. Part-to-whole, sums to 100. */
export const GALLERY_DECLINE_REASONS = [
  { key: "funds", reason: "Insufficient funds", share: 34 },
  { key: "donotHonor", reason: "Do not honor", share: 27 },
  { key: "expired", reason: "Expired card", share: 16 },
  { key: "cvv", reason: "Invalid CVV", share: 13 },
  { key: "fraud", reason: "Suspected fraud", share: 10 },
];

/** VW vs Mastercard scores, for the scatter and bubble specimens. Real client proportions. */
export const GALLERY_SCATTER = SCATTER_POINTS;

/** Merchant health profile across six axes, for the radar specimen. Three overlays. */
export const GALLERY_HEALTH_PROFILE = [
  { axis: "Approval", portfolio: 92, merchant: 78, topQuartile: 96 },
  { axis: "Retention", portfolio: 74, merchant: 81, topQuartile: 90 },
  { axis: "Ticket size", portfolio: 61, merchant: 88, topQuartile: 79 },
  { axis: "Dispute rate", portfolio: 83, merchant: 52, topQuartile: 94 },
  { axis: "Settlement", portfolio: 88, merchant: 90, topQuartile: 97 },
  { axis: "Growth", portfolio: 69, merchant: 84, topQuartile: 88 },
];

/** Authorization drop-off, for the funnel specimen. Each stage is a subset of the one above. */
export const GALLERY_AUTH_FUNNEL = [
  { stage: "Attempted", count: 128_400 },
  { stage: "Authorized", count: 117_900 },
  { stage: "Captured", count: 114_200 },
  { stage: "Settled", count: 112_800 },
  { stage: "Net of refunds", count: 108_100 },
];

/** SLA attainment, for the radial specimen. Three gauges on one 0 to 100 scale. */
export const GALLERY_SLA = [
  { key: "tier1", team: "Tier 1", attainment: 94 },
  { key: "tier2", team: "Tier 2", attainment: 81 },
  { key: "escalations", team: "Escalations", attainment: 67 },
  { key: "chargebacks", team: "Chargebacks", attainment: 58 },
  { key: "onboarding", team: "Onboarding", attainment: 88 },
];

/** Twenty-four intraday points, for the sparkline specimen. No axes, no labels. */
export const GALLERY_INTRADAY = [18, 16, 14, 11, 9, 8, 12, 21, 34, 47, 58, 71, 84, 79, 66, 61, 68, 77, 88, 82, 64, 47, 33, 24].map((v, i) => ({ hour: i, txns: v }));

/** Assignment alert counts, for the CSS-bar specimen, matching AlertVolumeBars. */
export const GALLERY_ALERT_VOLUME = [
  { name: "Excessive Chargebacks", count: 118 },
  { name: "Velocity, Same Card", count: 86 },
  { name: "MCC Mismatch", count: 64 },
  { name: "Offshore IP", count: 41 },
  { name: "Dormant Reactivation", count: 22 },
];
