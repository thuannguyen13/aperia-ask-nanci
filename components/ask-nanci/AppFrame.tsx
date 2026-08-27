"use client"

import { useEffect } from "react"
import type { ThemeId } from "@/lib/ask-nanci/data/theme-logos"

// The active theme is announced by `data-theme` on <html>, never on the frame div:
// Radix portals mount on <body>, so a theme scoped to the frame leaves dialogs and
// popovers on the :root palette. The tokens themselves are plain CSS rules in
// globals.css — deliberately not inline styles, which no stylesheet could override.
export function useAppTheme(theme: ThemeId) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme

    // iOS Safari tints its toolbars from <meta name="theme-color">, and with no tag
    // it samples the page background — white — so the browser chrome reads as a
    // broken band above the brand bar. Take the colour from the gradient stop the
    // frame actually paints (same shape every block in globals.css uses) so the two
    // can never drift; --primary covers a theme that ships no gradient.
    const cs = getComputedStyle(document.documentElement)
    const start = cs.getPropertyValue("--app-gradient").match(/linear-gradient\(180deg,\s*(.+?)\s+0%/)
    const tint = (start?.[1] ?? cs.getPropertyValue("--primary")).trim()

    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const owned = !meta
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "theme-color"
      document.head.appendChild(meta)
    }
    const previous = meta.content
    if (tint) meta.content = tint

    return () => {
      delete document.documentElement.dataset.theme
      if (owned) meta.remove()
      else meta.content = previous
    }
  }, [theme])
}

// The app theme chrome: the page-gradient frame (`.app-frame`) plus the bg-sidebar
// rounded card that holds the sidebar + content. The top bar and sidebar are slots
// so each theme (concept app, Aperia Risk) supplies its own.
export function AppFrame({
  theme,
  embed = "concept",
  topBar,
  sidebar,
  children,
}: {
  theme: ThemeId
  embed?: string
  topBar: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  useAppTheme(theme)
  return (
    <div data-embed={embed} className="app-frame relative flex h-[100dvh] flex-col px-1 pb-1 md:px-2 md:pb-2">
      {topBar}
      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden rounded-xl bg-sidebar shadow-sm md:rounded-2xl">
        {sidebar}
        {children}
      </div>
    </div>
  )
}
