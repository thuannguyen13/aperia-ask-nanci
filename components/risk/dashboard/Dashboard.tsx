"use client"

import { useEffect } from "react"
import { Download, Sparkles, MoreHorizontal, BarChartBig } from "lucide-react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import { useRiskNav } from "../RiskNavContext"
import { RISK_NANCI_TAKES } from "@/lib/ask-nanci/data/risk-landing"
import { DASH_KPIS, DASH_HIGHLIGHTS, CHART_TAKE, type DashChartId } from "@/lib/ask-nanci/data/risk-dashboard"
import { DashChart, CHART_TITLES } from "./charts"
import { NanciTakeCard } from "../NanciTakeCard"

const PANEL_ID = "dashboard-insight"

// A dashboard chart panel — title + AI/menu affordances + highlight ring when the
// active insight points at it.
function ChartPanel({ id, title, active, dim, onAsk, children }: { id: DashChartId; title: string; active: boolean; dim: boolean; onAsk: () => void; children: React.ReactNode }) {
  return (
    <div className={cn(
      "flex h-full flex-col rounded-xl border bg-card p-4 transition-all",
      active && "border-primary ring-1 ring-primary",
      dim && "opacity-50",
    )} data-chart={id}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="truncate text-base font-semibold text-foreground">{title}</h3>
        <div className="flex shrink-0 items-center gap-0.5">
          {/* Second entry point to the same insight panel the takes above open. */}
          <Button variant="ghost" size="icon-sm" aria-label={`Ask Nanci about ${title}`} onClick={onAsk}>
            <Sparkles className="size-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={`More options for ${title}`}>
            <MoreHorizontal className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      {/* min-h-0 so a chart child can shrink to the card instead of forcing it taller.
          recharts puts tabindex on its wrapper/surface — kill the focus ring it shows on click. */}
      <div className="min-h-0 flex-1 [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none">{children}</div>
    </div>
  )
}

export function Dashboard() {
  const nav = useRiskNav()
  const { dynamicPanels, openDynamic, closeDynamicPanel, setPanelView } = useAskNanci()
  const panelOpen = dynamicPanels.includes(PANEL_ID)
  const activeKey = usePanelView(PANEL_ID, "")
  const active = panelOpen && activeKey ? activeKey : null
  const highlight = active ? DASH_HIGHLIGHTS[active] ?? null : null
  const isOn = (id: DashChartId) => highlight?.includes(id) ?? false
  const anyActive = !!highlight

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
            <p className="text-base font-semibold text-foreground">Ask Nanci&apos;s take on today</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {RISK_NANCI_TAKES.map((take) => (
              // Same card as the landing — but here the answer lands in a sibling
              // chat panel and the related charts light up behind it.
              <NanciTakeCard key={take.title} take={take} active={active === take.title} onClick={() => toggleTake(take.title)} />
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {DASH_KPIS.map((k) => (
            <div key={k.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">{k.label}</p>
                <k.icon className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-1 text-[28px] font-bold leading-tight tabular-nums text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground">
                {k.delta && <span className={`font-medium ${k.deltaCls}`}>{k.delta} </span>}{k.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Chart grid — Figma layout */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(["high-risk", "scatter", "param-heat", "alert-volume"] as DashChartId[]).map((id) => (
            <ChartPanel key={id} id={id} title={CHART_TITLES[id]} active={isOn(id)} dim={anyActive && !isOn(id)} onAsk={() => toggleTake(CHART_TAKE[id])}>
              <DashChart id={id} />
            </ChartPanel>
          ))}
          <div className="lg:col-span-2">
            <ChartPanel id="realert" title={CHART_TITLES.realert} active={isOn("realert")} dim={anyActive && !isOn("realert")} onAsk={() => toggleTake(CHART_TAKE.realert)}>
              <DashChart id="realert" />
            </ChartPanel>
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
