"use client"

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CaseDetailPanel } from "./CaseDetailPanel"
import { TransactionReceiptPanel } from "./TransactionReceiptPanel"
import { DisputeDraftPanel } from "./DisputeDraftPanel"
import { DeclineReportPanel } from "./DeclineReportPanel"
import { EmailDraftPanel } from "./EmailDraftPanel"
import { RiskFlagsPanel } from "./RiskFlagsPanel"
import { VolumeSettlementPanel } from "./VolumeSettlementPanel"
import { ChangeLogPanel } from "./ChangeLogPanel"
import { WorkQueuePanel } from "./WorkQueuePanel"
import { DetectionQueuePanel } from "./DetectionQueuePanel"
import { BarometerReportPanel } from "./BarometerReportPanel"
import { CoastalRiskPanel } from "./CoastalRiskPanel"

type PanelId =
  | "case" | "transaction-receipt" | "dispute-draft"
  | "decline-report" | "email-draft"
  | "risk-flags" | "volume-settlement" | "change-log"
  | "work-queue"
  | "detection-queue" | "barometer-report" | "coastal-risk"

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

  // Flow 11 — Work Queue
  if (has("work-queue")) {
    return { A: "work-queue", B: null, C: null, D: null }
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

function PanelContent({ id }: { id: PanelId }) {
  switch (id) {
    case "case":                return <CaseDetailPanel />
    case "transaction-receipt": return <TransactionReceiptPanel />
    case "dispute-draft":       return <DisputeDraftPanel />
    case "decline-report":      return <DeclineReportPanel />
    case "email-draft":         return <EmailDraftPanel />
    case "risk-flags":          return <RiskFlagsPanel />
    case "volume-settlement":   return <VolumeSettlementPanel />
    case "change-log":          return <ChangeLogPanel />
    case "work-queue":          return <WorkQueuePanel />
    case "detection-queue":     return <DetectionQueuePanel />
    case "barometer-report":    return <BarometerReportPanel />
    case "coastal-risk":        return <CoastalRiskPanel />
  }
}

export function ConceptPanelArea({ fillWidth = false, visible = true }: { fillWidth?: boolean; visible?: boolean }) {
  const { openPanels } = useAskNanci()
  const isOpen = openPanels.length > 0

  const layoutKey = [...openPanels].sort().join(",")
  const { A, B, C, D } = mapPanelsToSlots(openPanels)

  const hasLeft  = !!(A || C)
  const hasRight = !!(B || D)

  return (
    <div
      className={cn(
        "relative hidden h-full shrink-0 flex-col overflow-hidden rounded-[18px] border bg-background",
        "transition-[width,opacity,margin] duration-300 ease-out md:flex",
        fillWidth
          ? `flex-1 min-w-0 transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"}`
          : isOpen
            ? "w-[58%] opacity-100 ml-1"
            : "w-0 opacity-0 border-transparent pointer-events-none",
      )}
    >
      {isOpen && (
        <ResizablePanelGroup key={layoutKey} orientation="horizontal" className="h-full">

          {/* ── Left column (slots A + C) ── */}
          {hasLeft && (
            <ResizablePanel defaultSize={hasRight ? 50 : 100} minSize={20}>
              {A && C ? (
                <ResizablePanelGroup orientation="vertical" className="h-full">
                  <ResizablePanel defaultSize={55} minSize={15}>
                    <PanelContent id={A} />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={45} minSize={15}>
                    <PanelContent id={C} />
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <PanelContent id={(A ?? C)!} />
              )}
            </ResizablePanel>
          )}

          {/* ── Column divider ── */}
          {hasLeft && hasRight && <ResizableHandle withHandle />}

          {/* ── Right column (slots B + D) ── */}
          {hasRight && (
            <ResizablePanel defaultSize={hasLeft ? 50 : 100} minSize={20}>
              {B && D ? (
                <ResizablePanelGroup orientation="vertical" className="h-full">
                  <ResizablePanel defaultSize={55} minSize={15}>
                    <PanelContent id={B} />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={45} minSize={15}>
                    <PanelContent id={D} />
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <PanelContent id={(B ?? D)!} />
              )}
            </ResizablePanel>
          )}

        </ResizablePanelGroup>
      )}
    </div>
  )
}
