"use client"

import { LayoutGrid } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

// The right-hand counterpart to MobileSidebarToggle: same size and treatment on the
// brand bar, opening the panel switcher instead of the sidebar. Always present, like
// the sidebar toggle — a control that comes and goes is one the user has to re-find,
// and with nothing open the switcher explains where panels come from.
export function MobilePanelToggle() {
  const { dynamicPanels, setPanelSwitcherOpen } = useAskNanci()

  return (
    <button
      onClick={() => setPanelSwitcherOpen(true)}
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
      {dynamicPanels.length > 1 && (
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
          {dynamicPanels.length}
        </span>
      )}
    </button>
  )
}
