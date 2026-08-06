// Per-theme logo assets — the branding CSS can't express. Everything else about a
// theme (colors, gradient, any token or rule it wants to override) lives in
// globals.css under `[data-theme="<id>"]`. Keys here must match those selectors.
//
// Three logo slots, each tagged with a `data-logo` attribute at the usage site so
// CSS can restyle one slot for one theme (e.g. dark-mode filters — see globals.css):
//   frame            → app frame top bar        [data-logo="frame"]
//   sidebar          → sidebar rail, expanded   [data-logo="sidebar"]
//   sidebarCollapsed → sidebar rail, collapsed  [data-logo="sidebar-collapsed"]
//
// Omit `sidebar` / `sidebarCollapsed` to fall back to the Ask Nanci wordmark + logomark.
// width/height are the asset's intrinsic size (a next/image ratio hint) — rendered
// size is controlled by CSS at the usage site.
type LogoAsset = { src: string; alt: string; width: number; height: number }

export type ThemeLogos = {
  frame: LogoAsset
  sidebar?: LogoAsset
  sidebarCollapsed?: LogoAsset
}

const THEME_LOGOS = {
  clover: {
    frame: { src: "/logos/clover.svg", alt: "Clover", width: 80, height: 24 },
  },
  aperia: {
    frame: { src: "/logos/titan.svg", alt: "Titan", width: 120, height: 24 },
  },
  "aperia-risk": {
    frame: { src: "/logos/titan.svg", alt: "Titan", width: 120, height: 24 },
    sidebar: { src: "/logos/logo-aperia-risk.svg", alt: "Aperia Risk", width: 146, height: 33 },
    sidebarCollapsed: { src: "/logos/logo-aperia-risk-logomark.svg", alt: "Aperia Risk", width: 29, height: 32 },
  },
  "access-one": {
    frame: { src: "/logos/access-one-logo.svg", alt: "AccessOne", width: 80, height: 24 },
  },
  "vision-web": {
    frame: { src: "/logos/vision-web-logo.svg", alt: "VisionWeb", width: 80, height: 24 },
  },
  // White wordmark, so it only works on the dark frame bar. No sidebar slots: those
  // fall back to the Ask Nanci lockup, which the light sidebar can actually show.
  tib: {
    frame: { src: "/logos/tib.png", alt: "TIB", width: 134, height: 48 },
  },
  woodforest: {
    frame: { src: "/logos/logo-woodforest.png", alt: "Woodforest National Bank", width: 278, height: 48 },
  },
} satisfies Record<string, ThemeLogos>

export type ThemeId = keyof typeof THEME_LOGOS

/** Widen to `ThemeLogos` so optional slots (sidebar, sidebarCollapsed) are visible on every entry. */
export const getThemeLogos = (id: ThemeId): ThemeLogos => THEME_LOGOS[id]
