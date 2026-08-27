"use client"

import { LayoutGrid } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

// The right-hand counterpart to MobileSidebarToggle: same size and treatment on the
// brand bar, bringing back a dismissed panel sheet instead of opening the sidebar.
// Rendered only where a sheet exists at all (the concept layouts, see AppShell): a
// control with nothing behind it is worse than an absent one. Constant within those,
// though, because a control that comes and goes is one the user has to re-find.
export function MobilePanelToggle() {
  const { dynamicPanels, reopenPanelSheet } = useAskNanci()

  return (
    <button
      onClick={reopenPanelSheet}
      className="relative flex size-10 items-center justify-center text-white"
      aria-label={
        dynamicPanels.length === 0
          ? "Show panels"
          : dynamicPanels.length > 1
          ? `Show ${dynamicPanels.length} panels`
          : "Show panel"
      }
    >
      <LayoutGrid className="size-5" />
      {/* The count shows from the first panel: with one open the badge is what says
          so, and only an empty stack has nothing to report. */}
      {dynamicPanels.length > 0 && (
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
          {dynamicPanels.length}
        </span>
      )}
    </button>
  )
}
