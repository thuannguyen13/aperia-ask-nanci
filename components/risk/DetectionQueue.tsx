"use client"

import { SlidersHorizontal, RefreshCw } from "lucide-react"
import { Button } from "aperia-ds5"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import { QueueSummaryCard } from "./QueueSummaryCard"
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
        onClose={() => nav.go("ask-nanci")}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <QueueSummaryCard onBarometer={openBarometer} />
      </div>
    </PanelShell>
  )
}
