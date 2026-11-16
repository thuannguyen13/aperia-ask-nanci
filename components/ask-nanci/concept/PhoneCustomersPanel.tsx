"use client"

import { CheckCheck, Download, UserRound } from "lucide-react"
import { Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, type ChartConfig } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import {
  PHONE_CUSTOMERS_TITLE, PHONE_INSIGHT, PHONE_TILES, PHONE_CHART, MONTHLY_PHONE_ORDERS, TOP_REGULARS_TITLE, TOP_REGULARS,
  HELD_TITLE, HELD_BODY, PHONE_NOTE, EXPORT_NOTE,
} from "@/lib/ask-nanci/data/panels/phone-customers"
import {
  PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, SectionHeader, PanelItem, Callout,
  ResponsiveChart, ChartGrid, ChartTip, chartAxisProps, formatWholeCurrency,
} from "@/components/shared"

const PANEL_ID = "phone-customers"

const CHART_CONFIG = {
  thisYear: { label: "This year", color: "var(--chart-1)" },
  lastYear: { label: "Last year", color: "var(--muted-foreground)" },
} satisfies ChartConfig

// Phone orders by month for both years in the design system's chart. Last year is the
// quiet reference line, this year the coloured one above it.
function PhoneOrdersChart() {
  return (
    <Card size="sm" className="shrink-0 shadow-xs">
      <CardHeader>
        <CardTitle>{PHONE_CHART.title}</CardTitle>
        <CardDescription>{PHONE_CHART.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveChart height={160} config={CHART_CONFIG} legend>
          {(narrow) => (
            <LineChart data={MONTHLY_PHONE_ORDERS}>
              <ChartGrid />
              <XAxis dataKey="month" {...chartAxisProps(narrow)} />
              <YAxis width={36} domain={[120, 240]} {...chartAxisProps(narrow)} />
              <ChartTip formatter={(value, name) => (
                <span className="flex w-full justify-between gap-6">
                  <span className="text-muted-foreground">{CHART_CONFIG[name as keyof typeof CHART_CONFIG].label}</span>
                  <span className="font-medium tabular-nums text-foreground">{value} orders</span>
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
export function PhoneCustomersPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView(PANEL_ID, "summary")
  return (
    <PanelShell>
      <PanelHeader title={PHONE_CUSTOMERS_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>{PHONE_INSIGHT}</NanciInsight>
        {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          {PHONE_TILES.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} tone={tile.tone} toneScope={tile.toneScope} />
          ))}
        </div>
        <PhoneOrdersChart />
        <div>
          <SectionHeader title={TOP_REGULARS_TITLE} />
          <ul className="space-y-2">
            {TOP_REGULARS.map((r) => (
              <li key={r.name}>
                <PanelItem icon={UserRound} iconClassName="text-primary" className="items-start">
                  <div className="min-w-0 flex-1 space-y-0.5 text-sm">
                    <p className="font-medium text-foreground">{r.name}</p>
                    <p className="text-muted-foreground">{r.habit}, {r.orders} orders</p>
                  </div>
                  <span className="shrink-0 self-center text-sm font-medium tabular-nums text-foreground">{formatWholeCurrency(r.spend)}</span>
                </PanelItem>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeader title={HELD_TITLE} />
          <PanelItem icon={Download} variant="muted" iconClassName="text-primary">
            <p className="text-sm text-muted-foreground">{HELD_BODY}</p>
          </PanelItem>
        </div>
        {view === "exported" && (
          <Callout variant="green" icon={CheckCheck} title={EXPORT_NOTE.title}>
            <p>{EXPORT_NOTE.body}</p>
          </Callout>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">{PHONE_NOTE}</p>
      </PanelBody>
    </PanelShell>
  )
}
