"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import type { PanelId } from "@/lib/ask-nanci/types"

function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1439px)")
    setIsSmall(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsSmall(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return isSmall
}
import { PANELS } from "./panel-registry"

type Slots = { A: PanelId | null; B: PanelId | null; C: PanelId | null; D: PanelId | null }

function mapPanelsToSlots(openPanels: string[]): Slots {
  const has = (p: string) => openPanels.includes(p)

  // Flow 7 — Case Management
  if (has("case") || has("transaction-receipt") || has("dispute-draft")) {
    return {
      A: has("case") ? "case" : null,
      B: has("transaction-receipt") ? "transaction-receipt" : null,
      C: has("dispute-draft") ? "dispute-draft" : null,
      D: null,
    }
  }

  // Flow 8 — Bulk Action
  if (has("decline-report") || has("email-draft")) {
    return {
      A: has("decline-report") ? "decline-report" : null,
      B: has("email-draft") ? "email-draft" : null,
      C: null,
      D: null,
    }
  }

  // Flow 10 — Risk Investigation
  if (has("risk-flags") || has("volume-settlement") || has("change-log")) {
    return {
      A: has("risk-flags") ? "risk-flags" : null,
      B: has("volume-settlement") ? "volume-settlement" : null,
      C: has("change-log") ? "change-log" : null,
      D: null,
    }
  }

  // Flow 12 — Detection Queue
  if (has("detection-queue") || has("barometer-report") || has("coastal-risk")) {
    return {
      A: has("barometer-report") ? "barometer-report" : "detection-queue",
      B: has("coastal-risk") ? "coastal-risk" : null,
      C: null,
      D: null,
    }
  }

  return { A: null, B: null, C: null, D: null }
}

// Slot geometry for the dynamic panel stack (new flows only). Position in the
// stack array is the only input: 1st panel gets a full-height column, a 2nd
// shares it 50/50, a 3rd stacks under the 2nd (55/45) — same nesting the
// legacy switch above already uses for its A/B/C/D slots.
function slotsFromDynamicPanels(stack: PanelId[]): Slots {
  const [first, second, third] = stack
  return { A: first ?? null, B: second ?? null, C: null, D: third ?? null }
}

function PanelContent({ id }: { id: PanelId }) {
  const Panel = PANELS[id].component
  return <Panel />
}

function SlotWrapper({ id, closing, children }: { id: PanelId | null | undefined; closing: string[]; children: ReactNode }) {
  const isClosing = !!id && closing.includes(id)
  return (
    <div
      key={id ?? undefined}
      className={cn(
        "h-full transition-opacity duration-500 ease-out",
        isClosing ? "opacity-0" : "animate-panel-in",
      )}
    >
      {children}
    </div>
  )
}

export function ConceptPanelArea({ fillWidth = false, visible = true }: { fillWidth?: boolean; visible?: boolean }) {
  const { openPanels, closingPanels, dynamicPanels } = useAskNanci()
  const isOpen = openPanels.length > 0 || dynamicPanels.length > 0
  const isClosing = closingPanels.length > 0
  const isSmall = useIsSmallScreen()

  // Legacy hardcoded flows take priority; the dynamic stack is only consulted
  // when no legacy flow has panels open.
  const resolveSlots = () =>
    openPanels.length > 0 ? mapPanelsToSlots(openPanels) : slotsFromDynamicPanels(dynamicPanels)

  // Freeze the slot layout during close animation — don't update while a staggered close is in progress
  const [renderContent, setRenderContent] = useState(isOpen)
  const [frozenSlots, setFrozenSlots] = useState(() => resolveSlots())
  const [frozenKey, setFrozenKey] = useState(() => [...openPanels, ...dynamicPanels].sort().join(","))
  useEffect(() => {
    if (isClosing) return  // freeze layout during staggered close
    if (isOpen) {
      setRenderContent(true)
      setFrozenSlots(resolveSlots())
      setFrozenKey([...openPanels, ...dynamicPanels].sort().join(","))
    } else {
      const t = setTimeout(() => setRenderContent(false), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen, isClosing, openPanels, dynamicPanels])

  const { A, B, C, D } = frozenSlots
  const layoutKey = frozenKey

  const hasLeft  = !!(A || C)
  const hasRight = !!(B || D)

  // Dynamic-stack panels (new flows) render as genuinely separate boxes —
  // own border/rounded corners, a real gap, no shared resize handle. Legacy
  // flows keep the existing resizable shared-divider layout untouched.
  const isDynamicLayout = openPanels.length === 0 && dynamicPanels.length > 0

  return (
    <div
      className={cn(
        "relative h-full shrink-0 flex-col overflow-hidden",
        "transition-[width,opacity,margin] duration-500 ease-out",
        !isDynamicLayout && "rounded-[18px] border bg-background",
        fillWidth
          ? cn("flex flex-1 min-w-0 transition-opacity duration-500 ease-out", visible ? "opacity-100" : "opacity-0")
          : cn(
              "hidden md:flex",
              isOpen
                ? "w-[58%] opacity-100 ml-2"
                : "w-0 opacity-0 border-0 pointer-events-none",
            ),
      )}
    >
      {renderContent && (
        isDynamicLayout ? (
          <div className="flex h-full flex-col gap-2">
            {[A, B, D].filter((id): id is PanelId => !!id).map((id) => (
              <div key={id} className="h-full min-w-0 flex-1 overflow-hidden rounded-[18px] border bg-background">
                <SlotWrapper id={id} closing={closingPanels}><PanelContent id={id} /></SlotWrapper>
              </div>
            ))}
          </div>
        ) : (
        <ResizablePanelGroup orientation={isSmall ? "vertical" : "horizontal"} className="h-full">

          {/* ── Left column (slots A + C) ── */}
          {hasLeft && (
            <ResizablePanel defaultSize={hasRight ? 50 : 100} minSize={20}>
              {A && C ? (
                <ResizablePanelGroup key={`${A}-${C}`} orientation="vertical" className="h-full">
                  <ResizablePanel defaultSize={55} minSize={15}>
                    <SlotWrapper id={A} closing={closingPanels}><PanelContent id={A!} /></SlotWrapper>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={45} minSize={15}>
                    <SlotWrapper id={C} closing={closingPanels}><PanelContent id={C!} /></SlotWrapper>
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <SlotWrapper id={A ?? C} closing={closingPanels}><PanelContent id={(A ?? C)!} /></SlotWrapper>
              )}
            </ResizablePanel>
          )}

          {/* ── Column divider ── */}
          {hasLeft && hasRight && <ResizableHandle withHandle />}

          {/* ── Right column (slots B + D) ── */}
          {hasRight && (
            <ResizablePanel defaultSize={hasLeft ? 50 : 100} minSize={20}>
              {B && D ? (
                <ResizablePanelGroup key={`${B}-${D}`} orientation="vertical" className="h-full">
                  <ResizablePanel defaultSize={55} minSize={15}>
                    <SlotWrapper id={B} closing={closingPanels}><PanelContent id={B!} /></SlotWrapper>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={45} minSize={15}>
                    <SlotWrapper id={D} closing={closingPanels}><PanelContent id={D!} /></SlotWrapper>
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <SlotWrapper id={B ?? D} closing={closingPanels}><PanelContent id={(B ?? D)!} /></SlotWrapper>
              )}
            </ResizablePanel>
          )}

        </ResizablePanelGroup>
        )
      )}
    </div>
  )
}
