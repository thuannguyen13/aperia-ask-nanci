// Per-skin logo assets. Colors are NOT here — they live in globals.css under
// `[data-theme="<id>"]`, so a brand can override any token (or add its own rules)
// without touching TypeScript. This file holds only what CSS can't express: which
// image file goes in which slot.
//
// Three logo slots, each tagged with a `data-logo` attribute at the usage site so
// CSS can restyle one slot for one brand (e.g. dark-mode filters — see globals.css):
//   frame            → app frame top bar        [data-logo="frame"]
//   sidebar          → sidebar rail, expanded   [data-logo="sidebar"]
//   sidebarCollapsed → sidebar rail, collapsed  [data-logo="sidebar-collapsed"]
//
// Omit `sidebar` / `sidebarCollapsed` to fall back to the Ask Nanci wordmark + logomark.
// width/height are the asset's intrinsic size (a next/image ratio hint) — rendered
// size is controlled by CSS at the usage site.
export type LogoAsset = { src: string; alt: string; width: number; height: number }

export type Skin = {
  logos: {
    frame: LogoAsset
    sidebar?: LogoAsset
    sidebarCollapsed?: LogoAsset
  }
}

export const SKINS = {
  clover: {
    logos: { frame: { src: "/logos/clover.svg", alt: "Clover", width: 80, height: 24 } },
  },
  aperia: {
    logos: { frame: { src: "/logos/titan.svg", alt: "Titan", width: 120, height: 24 } },
  },
  "aperia-risk": {
    logos: {
      frame: { src: "/logos/titan.svg", alt: "Titan", width: 120, height: 24 },
      sidebar: { src: "/logos/logo-aperia-risk.svg", alt: "Aperia Risk", width: 146, height: 33 },
      sidebarCollapsed: { src: "/logos/logo-aperia-risk-logomark.svg", alt: "Aperia Risk", width: 29, height: 32 },
    },
  },
  "access-one": {
    logos: { frame: { src: "/logos/access-one-logo.svg", alt: "AccessOne", width: 80, height: 24 } },
  },
  "vision-web": {
    logos: { frame: { src: "/logos/vision-web-logo.svg", alt: "VisionWeb", width: 80, height: 24 } },
  },
} satisfies Record<string, Skin>

export type SkinId = keyof typeof SKINS

/** Widen to `Skin` so optional slots (sidebar, sidebarCollapsed) are visible on every entry. */
export const skin = (id: SkinId): Skin => SKINS[id]
