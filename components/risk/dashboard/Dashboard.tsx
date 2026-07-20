"use client"

import { useState } from "react"
import { Download, Sparkles, MoreHorizontal, BarChartBig } from "lucide-react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { RISK_NANCI_TAKES } from "@/lib/ask-nanci/data/risk-landing"
import { DASH_KPIS, DASH_INSIGHTS, type DashChartId, type DashInsight } from "@/lib/ask-nanci/data/risk-dashboard"
import { DashChart, CHART_TITLES } from "./charts"
import { DashboardInsightPanel } from "./DashboardInsightPanel"

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

export function Dashboard({ onOpenDetectionQueue, onOpenCritical }: { onOpenDetectionQueue: () => void; onOpenCritical: () => void }) {
  const [active, setActive] = useState<string | null>(null)
  const insight: DashInsight | null = active ? DASH_INSIGHTS[active] ?? null : null
  const isOn = (id: DashChartId) => insight?.highlight.includes(id) ?? false
  const anyActive = !!insight

  const onAction = (action: "detection-queue" | "critical" | "none") => {
    if (action === "detection-queue") onOpenDetectionQueue()
    else if (action === "critical") onOpenCritical()
  }

  return (
    <div className="flex min-w-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>
        </div>

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
                onClick={() => setActive((a) => (a === take.title ? null : take.title))}
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

      {/* Docked insight panel */}
      {insight && active && (
        <DashboardInsightPanel title={active} insight={insight} onClose={() => setActive(null)} onAction={onAction} />
      )}
    </div>
  )
}
