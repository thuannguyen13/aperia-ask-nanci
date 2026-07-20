"use client"

import { Download } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import { DASH_INSIGHTS } from "@/lib/ask-nanci/data/risk-dashboard"
import { DashChart } from "./charts"
import { useRiskNav } from "../RiskNavContext"

const FIRST = Object.keys(DASH_INSIGHTS)[0]

// The Dashboard insight panel — opened via the panel stack when a "take" is clicked.
// Layout mirrors the Figma Ask Nanci response (node 734:28462): Nanci's read, the
// numbered insight, an embedded titled card with the focus chart, then action chips.
export function DashboardInsightPanel() {
  const { closePanel } = useAskNanci()
  const nav = useRiskNav()
  const key = usePanelView("dashboard-insight", FIRST)
  const insight = DASH_INSIGHTS[key] ?? DASH_INSIGHTS[FIRST]
  const { lead, heading, body, focusChart } = insight.panel

  const onAction = (a: "detection-queue" | "critical" | "none") => {
    if (a === "detection-queue") nav.go("detection-queue")
    else if (a === "critical") nav.openBarometer("critical")
  }

  return (
    <PanelShell>
      <PanelHeader title="Ask Nanci" size="lg" onClose={() => closePanel("dashboard-insight")} />

      <div className="flex-1 space-y-4 overflow-auto px-4 py-4 text-sm">
        {/* Nanci's read + the numbered insight */}
        <p className="whitespace-pre-line text-foreground">{lead}</p>
        <div>
          <p className="font-semibold text-foreground">{heading}</p>
          <p className="mt-2 text-muted-foreground">{body}</p>
        </div>

        {/* Embedded titled card with the focus chart */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-2.5 px-4 py-3">
            <p className="flex-1 text-base font-semibold text-foreground">{key}</p>
            <Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>
          </div>
          <div className="px-4 pb-4">
            <DashChart id={focusChart} />
          </div>
        </div>

        {/* Action chips */}
        <div>
          <p className="mb-2 text-muted-foreground">Where do you want to start?</p>
          <div className="flex flex-wrap gap-2">
            {insight.chips.map((c) => (
              <button
                key={c.label}
                onClick={() => onAction(c.action)}
                className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span className="text-muted-foreground">↳</span> {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
