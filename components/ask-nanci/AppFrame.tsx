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

    // Safari tints its toolbars from <meta name="theme-color">. The root layout renders
    // the tag with the default theme so the first paint already carries it (iOS reads
    // it then and not later); this re-tints it for the theme the mode actually picked.
    // Take the colour from the gradient stop the frame actually paints (same shape
    // every block in globals.css uses) so the two can never drift; --primary covers a
    // theme that ships no gradient.
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

    // Safari's other source for the tint, and on a phone the only one: iOS Safari
    // paints the status bar area with the document background colour, which WebKit
    // computes as the body's background over the root's. The design system paints the
    // body opaque white, so the root alone changes nothing; both have to carry the
    // tint. The frame covers the whole viewport, so nothing on the page changes; only
    // what Safari samples does.
    const root = document.documentElement.style
    const body = document.body.style
    const previousRootBackground = root.backgroundColor
    const previousBodyBackground = body.backgroundColor
    if (tint) {
      root.backgroundColor = tint
      body.backgroundColor = tint
    }

    return () => {
      delete document.documentElement.dataset.theme
      root.backgroundColor = previousRootBackground
      body.backgroundColor = previousBodyBackground
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
  // The frame owns the app's outer edge, so the safe-area insets belong here and nowhere
  // else — everything below it is already inside this padding. Each side adds its inset to
  // the gap the design already had, rather than replacing it, so nothing moves on hardware
  // that reports no inset (every desktop, and any phone whose browser chrome already
  // clears the notch).
  return (
    <div
      data-embed={embed}
      className="app-frame relative flex h-[100dvh] flex-col
        pl-[calc(var(--spacing)+var(--spacing-safe-l))]
        pr-[calc(var(--spacing)+var(--spacing-safe-r))]
        pb-[calc(var(--spacing)+var(--spacing-safe-b))]
        md:pl-[calc(var(--spacing)*2+var(--spacing-safe-l))]
        md:pr-[calc(var(--spacing)*2+var(--spacing-safe-r))]
        md:pb-[calc(var(--spacing)*2+var(--spacing-safe-b))]"
    >
      {topBar}
      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden rounded-xl bg-sidebar shadow-sm md:rounded-2xl">
        {sidebar}
        {children}
      </div>
    </div>
  )
}
