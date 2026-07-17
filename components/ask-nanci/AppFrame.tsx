"use client"

// The app theme chrome: the DS-themed page wrapper (`data-theme` drives the token
// set) plus the bg-sidebar rounded card that holds the sidebar + content. The top
// bar and sidebar are slots so each skin (concept app, Aperia Risk) supplies its own.
export function AppFrame({
  theme,
  embed = "concept",
  topBar,
  sidebar,
  children,
}: {
  theme: string
  embed?: string
  topBar: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div data-embed={embed} data-theme={theme} className="relative flex h-screen flex-col md:px-2 md:pb-2">
      {topBar}
      <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden bg-sidebar shadow-sm md:rounded-2xl">
        {sidebar}
        {children}
      </div>
    </div>
  )
}
