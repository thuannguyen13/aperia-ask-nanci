"use client"

import { CalendarDays, CheckCheck, Store, Trophy } from "lucide-react"
import { Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, type ChartConfig } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import {
  HISTORY_TITLE, HISTORY_INSIGHT, HISTORY_TILES, SALES_CHART, MONTHLY_SALES, HELD_TITLE, HELD_ITEMS, HISTORY_NOTE, EXPORT_NOTE,
} from "@/lib/ask-nanci/data/panels/year-history"
import {
  PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, SectionHeader, PanelItem, Callout,
  ResponsiveChart, ChartGrid, ChartTip, chartAxisProps,
} from "@/components/shared"

const PANEL_ID = "year-history"

const CHART_CONFIG = {
  thisYear: { label: "This year", color: "var(--chart-1)" },
  lastYear: { label: "Last year", color: "var(--muted-foreground)" },
} satisfies ChartConfig

const HELD_ICONS = { sales: CalendarDays, records: Trophy, benchmarks: Store }

// Monthly sales for both years in the design system's chart. Last year is the quiet
// reference line, this year the coloured one above it.
function SalesChart() {
  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader>
        <CardTitle>{SALES_CHART.title}</CardTitle>
        <CardDescription>{SALES_CHART.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveChart height={160} config={CHART_CONFIG} legend>
          {(narrow) => (
            <LineChart data={MONTHLY_SALES}>
              <ChartGrid />
              <XAxis dataKey="month" {...chartAxisProps(narrow)} />
              <YAxis width={44} domain={[40, 80]} {...chartAxisProps(narrow)} tickFormatter={(v: number) => `$${v}k`} />
              <ChartTip formatter={(value, name) => (
                <span className="flex w-full justify-between gap-6">
                  <span className="text-muted-foreground">{CHART_CONFIG[name as keyof typeof CHART_CONFIG].label}</span>
                  <span className="font-medium tabular-nums text-foreground">${value}k</span>
                </span>
              )} />
              <Line type="monotone" dataKey="lastYear" stroke="var(--color-lastYear)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="thisYear" stroke="var(--color-thisYear)" strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveChart>
      </CardContent>
    </Card>
  )
}

// Views: "summary", then "exported" once the owner downloads the history.
export function YearHistoryPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView(PANEL_ID, "summary")
  return (
    <PanelShell>
      <PanelHeader title={HISTORY_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>{HISTORY_INSIGHT}</NanciInsight>
        {view === "exported" && (
          <Callout variant="green" icon={CheckCheck} title={EXPORT_NOTE.title}>
            <p>{EXPORT_NOTE.body}</p>
          </Callout>
        )}
        {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          {HISTORY_TILES.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} />
          ))}
        </div>
        <SalesChart />
        <div>
          <SectionHeader title={HELD_TITLE} />
          <ul className="space-y-2">
            {HELD_ITEMS.map((item) => (
              <li key={item.id}>
                <PanelItem icon={HELD_ICONS[item.id as keyof typeof HELD_ICONS]} iconClassName="text-primary" className="items-start">
                  <div className="min-w-0 flex-1 space-y-0.5 text-sm">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-muted-foreground">{item.detail}</p>
                  </div>
                </PanelItem>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{HISTORY_NOTE}</p>
      </PanelBody>
    </PanelShell>
  )
}
