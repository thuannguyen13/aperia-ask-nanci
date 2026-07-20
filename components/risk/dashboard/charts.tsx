"use client"

import type { DashChartId } from "@/lib/ask-nanci/data/risk-dashboard"
import { ScatterQuadrant } from "./ScatterQuadrant"
import { AlertVolumeBars } from "./AlertVolumeBars"
import { HighRiskTable } from "./HighRiskTable"
import { ParamHeatChart } from "./ParamHeatChart"
import { RealertTable } from "./RealertTable"

export const CHART_TITLES: Record<DashChartId, string> = {
  scatter: "VW Risk Score vs. Mastercard Score — Live Alerted Portfolio",
  "alert-volume": "Alert Volume by Assignment",
  "high-risk": "High Risk Merchants",
  "param-heat": "Top 10 Parameters Heat",
  realert: "Re-alert Rate by Assignment",
}

// One place mapping a chart id to its component — used by the dashboard grid and
// the insight panel's embedded focus chart.
export function DashChart({ id }: { id: DashChartId }) {
  switch (id) {
    case "scatter": return <ScatterQuadrant />
    case "alert-volume": return <AlertVolumeBars />
    case "high-risk": return <HighRiskTable />
    case "param-heat": return <ParamHeatChart />
    case "realert": return <RealertTable />
  }
}
