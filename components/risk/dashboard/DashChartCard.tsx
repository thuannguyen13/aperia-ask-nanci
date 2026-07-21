"use client"

import { Download } from "lucide-react"
import { Button } from "aperia-ds5"
import type { DashChartId } from "@/lib/ask-nanci/data/risk-dashboard"
import { DashChart, CHART_TITLES } from "./charts"

// A dashboard chart embedded inside a Nanci answer (Figma node 734:28462): the
// same chart the Dashboard renders, in a titled card with an Export affordance.
export function DashChartCard({ id }: { id: DashChartId }) {
  return (
    <div className="mt-3 rounded-lg border bg-card">
      <div className="flex items-center gap-2.5 px-4 py-3">
        <p className="flex-1 text-sm font-semibold text-foreground">{CHART_TITLES[id]}</p>
        <Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>
      </div>
      <div className="px-4 pb-4">
        <DashChart id={id} />
      </div>
    </div>
  )
}
