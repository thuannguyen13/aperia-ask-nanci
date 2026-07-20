"use client"

import { Download } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader, NanciInsight } from "@/components/ask-nanci/shared"
import { DASH_INSIGHTS } from "@/lib/ask-nanci/data/risk-dashboard"
import { DashChart } from "./charts"
import { useRiskNav } from "../RiskNavContext"

const FIRST = Object.keys(DASH_INSIGHTS)[0]

// The Dashboard insight panel — a real registered panel (opened via the panel
// stack), built from the shared PanelShell / PanelHeader / NanciInsight primitives,
// same as the Merchant Money flow panels. Reads which insight to show from its view.
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

      <div className="flex-1 space-y-4 overflow-auto px-4 py-3">
        <NanciInsight>{lead}</NanciInsight>

        <div>
          <p className="text-sm font-semibold text-foreground">{heading}</p>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>

        {/* Embedded focus chart */}
        <div className="rounded-xl border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">{key}</span>
            <Button variant="secondary" size="xs"><Download className="size-3" /> Export</Button>
          </div>
          <DashChart id={focusChart} />
        </div>

        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Where do you want to start?</p>
          <div className="flex flex-col items-start gap-2">
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
