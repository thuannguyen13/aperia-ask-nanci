"use client"

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, type ChartConfig } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  SEASONAL_CLOSURE_TITLE, CLOSURE_INSIGHT, CLOSURE_TILES, CALLS_CHART, WEEKLY_CALLS, CLOSURE_NOTE,
} from "@/lib/ask-nanci/data/panels/seasonal-closure"
import {
  PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, ResponsiveChart, ChartGrid, ChartTip, chartAxisProps,
} from "@/components/shared"

const PANEL_ID = "seasonal-closure"

const CHART_CONFIG = {
  open: { label: "Open", color: "var(--chart-1)" },
  closed: { label: "Closed", color: "var(--color-amber-500)" },
} satisfies ChartConfig

// Weekly calls last winter in the design system's chart, with the closed weeks in amber:
// the calls that kept coming while the register took nothing.
function CallsChart() {
  return (
    <Card size="sm" className="shrink-0 shadow-xs">
      <CardHeader>
        <CardTitle>{CALLS_CHART.title}</CardTitle>
        <CardDescription>{CALLS_CHART.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveChart height={160} config={CHART_CONFIG} legend>
          {(narrow) => (
            <BarChart data={WEEKLY_CALLS}>
              <ChartGrid />
              <XAxis dataKey="week" {...chartAxisProps(narrow)} />
              <YAxis width={36} {...chartAxisProps(narrow)} />
              <ChartTip
                labelFormatter={(label) => `Week of ${label}`}
                formatter={(value, _name, item) => (
                  <span className="flex w-full justify-between gap-6">
                    <span className="text-muted-foreground">{item.payload.closed ? CHART_CONFIG.closed.label : CHART_CONFIG.open.label}</span>
                    <span className="font-medium tabular-nums text-foreground">{value} calls</span>
                  </span>
                )}
              />
              <Bar dataKey="calls" radius={[3, 3, 0, 0]}>
                {WEEKLY_CALLS.map((w) => (
                  <Cell key={w.week} fill={w.closed ? "var(--color-closed)" : "var(--color-open)"} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveChart>
      </CardContent>
    </Card>
  )
}

export function SeasonalClosurePanel() {
  const { closeDynamicPanel } = useAskNanci()
  return (
    <PanelShell>
      <PanelHeader title={SEASONAL_CLOSURE_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>{CLOSURE_INSIGHT}</NanciInsight>
        {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          {CLOSURE_TILES.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} tone={tile.tone} toneScope={tile.toneScope} />
          ))}
        </div>
        <CallsChart />
        <p className="text-xs leading-relaxed text-muted-foreground">{CLOSURE_NOTE}</p>
      </PanelBody>
    </PanelShell>
  )
}
