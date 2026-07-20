"use client"

import { useEffect } from "react"
import { Download, Sparkles, MoreHorizontal, BarChartBig } from "lucide-react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import { useRiskNav } from "../RiskNavContext"
import { RISK_NANCI_TAKES } from "@/lib/ask-nanci/data/risk-landing"
import { DASH_KPIS, DASH_INSIGHTS, type DashChartId } from "@/lib/ask-nanci/data/risk-dashboard"
import { DashChart, CHART_TITLES } from "./charts"

const PANEL_ID = "dashboard-insight"

// A dashboard chart panel — title + AI/menu affordances + highlight ring when the
// active insight points at it.
function ChartPanel({ id, title, active, dim, children }: { id: DashChartId; title: string; active: boolean; dim: boolean; children: React.ReactNode }) {
  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 transition-all",
      active && "border-primary ring-1 ring-primary",
      dim && "opacity-50",
    )} data-chart={id}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          <MoreHorizontal className="size-4" />
        </div>
      </div>
      {children}
    </div>
  )
}

export function Dashboard() {
  const nav = useRiskNav()
  const { dynamicPanels, openDynamic, closeDynamicPanel, setPanelView } = useAskNanci()
  const panelOpen = dynamicPanels.includes(PANEL_ID)
  const activeKey = usePanelView(PANEL_ID, "")
  const active = panelOpen && activeKey ? activeKey : null
  const insight = active ? DASH_INSIGHTS[active] ?? null : null
  const isOn = (id: DashChartId) => insight?.highlight.includes(id) ?? false
  const anyActive = !!insight

  // Clicking a take opens/updates the registered insight panel (or closes it if
  // it's already showing that take).
  const toggleTake = (title: string) => {
    if (active === title) { closeDynamicPanel(PANEL_ID); return }
    setPanelView(PANEL_ID, title)
    openDynamic(PANEL_ID)
  }

  // Leaving the dashboard closes the insight panel so it doesn't bleed into other
  // destinations that share the same panel stack.
  useEffect(() => () => closeDynamicPanel(PANEL_ID), [closeDynamicPanel])

  return (
    <PanelShell className="min-w-0 flex-1">
      <PanelHeader
        title="Dashboard"
        size="lg"
        actions={<Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>}
        onClose={() => nav.go("ask-nanci")}
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Ask Nanci's take on today */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20">
          <div className="mb-3 flex items-center gap-2">
            <BarChartBig className="size-4 text-foreground" />
            <p className="text-sm font-semibold text-foreground">Ask Nanci&apos;s take on today</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {RISK_NANCI_TAKES.map((take) => (
              <button
                key={take.title}
                onClick={() => toggleTake(take.title)}
                className={cn(
                  "flex gap-2.5 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-muted",
                  active === take.title && "border-primary ring-1 ring-primary",
                )}
              >
                <span className={`mt-1 size-2 shrink-0 rounded-full ${take.dot}`} />
                <div>
                  <p className="text-xs font-semibold text-foreground">{take.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{take.body}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {DASH_KPIS.map((k) => (
            <div key={k.label} className="rounded-xl border bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <k.icon className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground">
                {k.delta && <span className={`font-medium ${k.deltaCls}`}>{k.delta} </span>}{k.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Chart grid — Figma layout */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(["high-risk", "scatter", "param-heat", "alert-volume"] as DashChartId[]).map((id) => (
            <ChartPanel key={id} id={id} title={CHART_TITLES[id]} active={isOn(id)} dim={anyActive && !isOn(id)}>
              <DashChart id={id} />
            </ChartPanel>
          ))}
          <div className="lg:col-span-2">
            <ChartPanel id="realert" title={CHART_TITLES.realert} active={isOn("realert")} dim={anyActive && !isOn("realert")}>
              <DashChart id="realert" />
            </ChartPanel>
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
