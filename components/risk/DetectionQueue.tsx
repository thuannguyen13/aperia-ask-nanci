"use client"

import { useEffect } from "react"
import { SlidersHorizontal, RefreshCw } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader, PanelBody } from "@/components/ask-nanci/shared"
import { AskNanciButton } from "./AskNanciButton"
import { QueueSummaryCard } from "./QueueSummaryCard"
import { DETECTION_QUEUES } from "@/lib/ask-nanci/data/risk-detection-queue"
import { useRiskNav } from "./RiskNavContext"

const INSIGHT_PANEL = "detection-queue-insight"

export function DetectionQueue() {
  const nav = useRiskNav()
  const { dynamicPanels, openDynamic, closeDynamicPanel } = useAskNanci()
  const openBarometer = () => nav.openBarometer()

  // Summon, per the panel model: the button opens Ask Nanci beside the queue and
  // never touches it, and summoning again is how the user puts it away.
  const panelOpen = dynamicPanels.includes(INSIGHT_PANEL)
  const toggleNanci = () => (panelOpen ? closeDynamicPanel(INSIGHT_PANEL) : openDynamic(INSIGHT_PANEL))

  // Leaving the queue closes the panel so it doesn't bleed into other
  // destinations that share the same panel stack.
  useEffect(() => () => closeDynamicPanel(INSIGHT_PANEL), [closeDynamicPanel])

  return (
    <PanelShell className="min-w-0 flex-1">
      <PanelHeader
        title="Detection Queue"
        size="page"
        actions={
          <>
            {/* The queue is the one destination with no other way in to Nanci —
                its nav item is a different destination and its cards drill down. */}
            {nav.assistant && <AskNanciButton onClick={toggleNanci} pressed={panelOpen} />}
            <Button variant="outline"><SlidersHorizontal className="size-4" /> Filter</Button>
            <Button variant="outline"><RefreshCw className="size-4" /> Refresh</Button>
          </>
        }
      />

      <PanelBody className="flex flex-col gap-4">
        {DETECTION_QUEUES.map((q, i) => (
          // Only the first (Mastercard) queue drills into the Barometer Report —
          // the second card's actions are inert.
          <QueueSummaryCard key={q.assignmentId} queue={q} onBarometer={i === 0 ? openBarometer : undefined} live={i === 0} />
        ))}
      </PanelBody>
    </PanelShell>
  )
}
