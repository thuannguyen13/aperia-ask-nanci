"use client"

import { SlidersHorizontal, RefreshCw } from "lucide-react"
import { Button } from "aperia-ds5"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import { QueueSummaryCard } from "./QueueSummaryCard"
import { DETECTION_QUEUES } from "@/lib/ask-nanci/data/risk-detection-queue"
import { useRiskNav } from "./RiskNavContext"

export function DetectionQueue() {
  const nav = useRiskNav()
  const openBarometer = () => nav.openBarometer()

  return (
    <PanelShell className="min-w-0 flex-1">
      <PanelHeader
        title="Detection Queue"
        size="lg"
        actions={
          <>
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
