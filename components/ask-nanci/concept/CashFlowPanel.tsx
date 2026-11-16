"use client"

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, type ChartConfig } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  CASH_FLOW_TITLE, CASH_FLOW_INSIGHT, CASH_FLOW_TILES, DEPOSITS_CHART, WEEKLY_DEPOSITS,
  FRIDAY_TITLE, FRIDAY_ROWS, FRIDAY_RESULT, CASH_FLOW_NOTE,
} from "@/lib/ask-nanci/data/panels/cash-flow"
import {
  PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, SectionHeader,
  ResponsiveChart, ChartGrid, ChartTip, chartAxisProps, formatWholeCurrency,
} from "@/components/shared"

const PANEL_ID = "cash-flow"

const CHART_CONFIG = {
  earlier: { label: "Earlier weeks", color: "var(--chart-1)" },
  thisMonth: { label: "This month", color: "var(--color-amber-500)" },
} satisfies ChartConfig

// Weekly deposits in the design system's chart, with this month's weeks in amber: the
// drop the panel is about.
function DepositsChart() {
  return (
    <Card size="sm" className="shrink-0 shadow-xs">
      <CardHeader>
        <CardTitle>{DEPOSITS_CHART.title}</CardTitle>
        <CardDescription>{DEPOSITS_CHART.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveChart height={160} config={CHART_CONFIG} legend>
          {(narrow) => (
            <BarChart data={WEEKLY_DEPOSITS}>
              <ChartGrid />
              <XAxis dataKey="week" {...chartAxisProps(narrow)} />
              <YAxis width={52} {...chartAxisProps(narrow)} tickFormatter={(v: number) => formatWholeCurrency(v)} />
              <ChartTip
                labelFormatter={(label) => `Week of ${label}`}
                formatter={(value, _name, item) => (
                  <span className="flex w-full justify-between gap-6">
                    <span className="text-muted-foreground">{item.payload.thisMonth ? CHART_CONFIG.thisMonth.label : CHART_CONFIG.earlier.label}</span>
                    <span className="font-medium tabular-nums text-foreground">{formatWholeCurrency(Number(value))}</span>
                  </span>
                )}
              />
              <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                {WEEKLY_DEPOSITS.map((w) => (
                  <Cell key={w.week} fill={w.thisMonth ? "var(--color-thisMonth)" : "var(--color-earlier)"} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveChart>
      </CardContent>
    </Card>
  )
}

// Friday's cash as a short sum: what is there, what comes in, what goes out, and the gap.
function FridaySum() {
  return (
    <div>
      <SectionHeader title={FRIDAY_TITLE} />
      <dl className="rounded-xl border px-4 py-1">
        {FRIDAY_ROWS.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 border-b py-2 text-sm">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium tabular-nums text-foreground">{row.value}</dd>
          </div>
        ))}
        <div className="flex items-start justify-between gap-4 py-2 text-sm">
          <dt className="font-semibold text-foreground">{FRIDAY_RESULT.label}</dt>
          <dd className="font-semibold tabular-nums text-amber-700 dark:text-amber-400">{FRIDAY_RESULT.value}</dd>
        </div>
      </dl>
    </div>
  )
}

export function CashFlowPanel() {
  const { closeDynamicPanel } = useAskNanci()
  return (
    <PanelShell>
      <PanelHeader title={CASH_FLOW_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>{CASH_FLOW_INSIGHT}</NanciInsight>
        {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          {CASH_FLOW_TILES.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} tone={tile.tone} toneScope={tile.toneScope} />
          ))}
        </div>
        <DepositsChart />
        <FridaySum />
        <p className="text-xs leading-relaxed text-muted-foreground">{CASH_FLOW_NOTE}</p>
      </PanelBody>
    </PanelShell>
  )
}
