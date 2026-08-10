"use client"

import { LayoutGrid } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

// The right-hand counterpart to MobileSidebarToggle: same size and treatment on the
// brand bar, opening the panel switcher instead of the sidebar. It only appears once
// something is open, so the bar stays clean until there is a panel to go back to.
export function MobilePanelToggle() {
  const { dynamicPanels, setPanelSwitcherOpen } = useAskNanci()

  if (dynamicPanels.length === 0) return null

  return (
    <button
      onClick={() => setPanelSwitcherOpen(true)}
      className="relative flex size-10 items-center justify-center text-white"
      aria-label={dynamicPanels.length > 1 ? `Show ${dynamicPanels.length} panels` : "Show panel"}
    >
      <LayoutGrid className="size-5" />
      {dynamicPanels.length > 1 && (
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
          {dynamicPanels.length}
        </span>
      )}
    </button>
  )
}
