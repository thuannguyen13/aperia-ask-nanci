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
    return () => { delete document.documentElement.dataset.theme }
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
    <div data-embed={embed} className="app-frame relative flex h-screen flex-col md:px-2 md:pb-2">
      {topBar}
      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden bg-sidebar shadow-sm md:rounded-2xl">
        {sidebar}
        {children}
      </div>
    </div>
  )
}
