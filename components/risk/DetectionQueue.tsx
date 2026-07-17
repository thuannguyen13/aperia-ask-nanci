"use client"

import { SlidersHorizontal, RefreshCw, ArrowRight } from "lucide-react"
import { Button } from "aperia-ds5"
import { QueueSummaryCard } from "./QueueSummaryCard"

export function DetectionQueue({ onBarometer }: { onBarometer: () => void }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Detection Queue</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm"><SlidersHorizontal className="size-4" /> Filter</Button>
          <Button variant="secondary" size="sm"><RefreshCw className="size-4" /> Refresh</Button>
        </div>
      </div>

      <QueueSummaryCard onBarometer={onBarometer} />

      <div className="mt-4 flex justify-end">
        <Button variant="secondary" size="sm" onClick={onBarometer}>Next Queue <ArrowRight className="size-4" /></Button>
      </div>
    </div>
  )
}
