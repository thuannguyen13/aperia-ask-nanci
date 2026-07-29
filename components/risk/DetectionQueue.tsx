"use client"

import { useEffect } from "react"
import Image from "next/image"
import { SlidersHorizontal, RefreshCw } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
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
        size="lg"
        actions={
          <>
            {/* The queue is the one destination with no other way in to Nanci —
                its nav item is a different destination and its cards drill down. */}
            {nav.assistant && (
              <Button variant="secondary" size="sm" onClick={toggleNanci} aria-pressed={panelOpen}>
                <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={16} height={16} className="size-4" />
                Ask Nanci
              </Button>
            )}
            <Button variant="secondary" size="sm"><SlidersHorizontal className="size-4" /> Filter</Button>
            <Button variant="secondary" size="sm"><RefreshCw className="size-4" /> Refresh</Button>
          </>
        }
        onClose={() => nav.go(nav.home)}
      />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
        {DETECTION_QUEUES.map((q, i) => (
          // Only the first (Mastercard) queue drills into the Barometer Report —
          // the second card's actions are inert.
          <QueueSummaryCard key={q.assignment} queue={q} onBarometer={i === 0 ? openBarometer : undefined} />
        ))}
      </div>
    </PanelShell>
  )
}
