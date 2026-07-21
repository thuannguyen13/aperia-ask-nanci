"use client"

import { useEffect } from "react"
import type { SkinId } from "@/lib/ask-nanci/data/skins"

// The active skin is announced by `data-theme` on <html>, never on the frame div:
// Radix portals mount on <body>, so a theme scoped to the frame leaves dialogs and
// popovers on the :root palette. The tokens themselves are plain CSS rules in
// globals.css — deliberately not inline styles, which no stylesheet could override.
export function useAppTheme(skin: SkinId) {
  useEffect(() => {
    document.documentElement.dataset.theme = skin
    return () => { delete document.documentElement.dataset.theme }
  }, [skin])
}

// The app theme chrome: the page-gradient frame (`.app-frame`) plus the bg-sidebar
// rounded card that holds the sidebar + content. The top bar and sidebar are slots
// so each skin (concept app, Aperia Risk) supplies its own.
export function AppFrame({
  skin,
  embed = "concept",
  topBar,
  sidebar,
  children,
}: {
  skin: SkinId
  embed?: string
  topBar: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  useAppTheme(skin)
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
