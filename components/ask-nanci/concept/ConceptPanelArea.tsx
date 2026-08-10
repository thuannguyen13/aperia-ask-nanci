"use client"

import { memo, useEffect, useState } from "react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import type { PanelId } from "@/lib/ask-nanci/types"
import { PANELS } from "./panel-registry"

// Every concept panel renders here as its own separate box, stacked vertically
// with a gap — one layout for all flows. Order is the open order of the stack.
const PanelBox = memo(function PanelBox({ id, closing }: { id: PanelId; closing: string[] }) {
  const Panel = PANELS[id].component
  const isClosing = closing.includes(id)
  return (
    <div className="h-full min-w-0 flex-1 overflow-hidden rounded-[18px] border bg-background">
      <div className={cn("h-full transition-opacity duration-500 ease-out", isClosing ? "opacity-0" : "animate-panel-in")}>
        <Panel />
      </div>
    </div>
  )
})

export function ConceptPanelArea({ fillWidth = false, visible = true }: { fillWidth?: boolean; visible?: boolean }) {
  const { closingPanels, dynamicPanels } = useAskNanci()
  const isOpen = dynamicPanels.length > 0
  const isClosing = closingPanels.length > 0

  // Freeze the rendered list during the staggered close so panels animate out
  // instead of vanishing instantly.
  const [renderContent, setRenderContent] = useState(isOpen)
  const [frozen, setFrozen] = useState<PanelId[]>(() => [...dynamicPanels])
  useEffect(() => {
    if (isClosing) return
    if (isOpen) {
      setRenderContent(true)
      setFrozen([...dynamicPanels])
    } else {
      const t = setTimeout(() => setRenderContent(false), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen, isClosing, dynamicPanels])

  return (
    <div
      className={cn(
        "relative h-full shrink-0 flex-col overflow-hidden",
        "transition-[width,opacity,margin] duration-500 ease-out",
        fillWidth
          ? cn(
              // Below md there is no room beside the chat — MobilePanelSwitcher shows
              // these panels instead.
              "hidden md:flex flex-1 min-w-0 transition-opacity duration-500 ease-out",
              visible ? "opacity-100" : "opacity-0",
            )
          : cn(
              "hidden md:flex",
              isOpen ? "w-[50%] opacity-100 ml-2" : "w-0 opacity-0 border-0 pointer-events-none",
            ),
      )}
    >
      {renderContent && (
        <div className="flex h-full flex-col gap-2">
          {frozen.map((id) => (
            <PanelBox key={id} id={id} closing={closingPanels} />
          ))}
        </div>
      )}
    </div>
  )
}
