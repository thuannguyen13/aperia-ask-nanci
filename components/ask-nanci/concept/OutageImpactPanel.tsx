"use client"

import { CheckCheck, Wifi, WifiOff } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "aperia-ds5"
import { HEATMAP_HOURS, HEATMAP_APPROX } from "@/lib/ask-nanci/data/panels/busiest-times"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  OUTAGE_IMPACT_TITLE, OUTAGE_INSIGHT, OUTAGE_TILES, OUTAGE_EVENTS, OUTAGE_ESTIMATE_NOTE,
  OUTAGE, OUTAGE_WINDOW, EVENING, EVENING_HOURS, EVENING_CHART, THURSDAY_ROW, INCIDENT_TITLE, INCIDENT_WHEN, formatClock,
  OUTAGE_CREDIT_NOTE,
} from "@/lib/ask-nanci/data/panels/outage-impact"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, Callout, SectionHeader } from "@/components/shared"

const PANEL_ID = "outage-impact"

// A custom graph in the design system's chart frame: its Card, its axis type (12px muted
// labels, no axis line), its series colour (--chart-1 for the usual evening, deepening
// with how busy the hour is), its tooltip and its legend. Recharts has no shape for a
// timeline band, so the graph itself is drawn here.
const LEVEL_FILL = [
  "var(--muted)",
  "color-mix(in oklab, var(--chart-1) 22%, transparent)",
  "color-mix(in oklab, var(--chart-1) 42%, transparent)",
  "color-mix(in oklab, var(--chart-1) 68%, transparent)",
  "var(--chart-1)",
]
const DOWN_FILL = "var(--color-red-500)"

const SPAN = EVENING.end - EVENING.start
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const pct = (minutes: number) => `${((minutes - EVENING.start) / SPAN) * 100}%`

interface Tip { at: number; title: string; swatch: string; label: string; value: string }

// The tooltip, as the design system's chart tooltip draws it: a light card over the
// plot, centred on what the pointer is over, with no pointer of its own.
function ChartTipCard({ tip }: { tip: Tip }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-full z-10 mb-2 grid min-w-44 gap-1.5 whitespace-nowrap rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl",
        // Kept inside the card: centred on the hover, held to the edge near either end.
        tip.at - EVENING.start < SPAN / 4 ? "" : EVENING.end - tip.at < SPAN / 4 ? "-translate-x-full" : "-translate-x-1/2",
      )}
      style={{ left: pct(tip.at) }}
    >
      <p className="font-medium text-foreground">{tip.title}</p>
      <div className="flex items-center gap-2">
        <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: tip.swatch }} />
        <span className="text-muted-foreground">{tip.label}</span>
        <span className="ml-auto pl-6 font-medium tabular-nums text-foreground">{tip.value}</span>
      </div>
    </div>
  )
}

function EveningChart() {
  const ticks = [...EVENING_HOURS.map((_, i) => EVENING.start + i * 60), EVENING.end]
  const [tip, setTip] = useState<Tip | null>(null)
  const outageTip: Tip = { at: (OUTAGE.start + OUTAGE.end) / 2, title: OUTAGE_WINDOW, swatch: DOWN_FILL, label: "Internet down", value: `${OUTAGE.end - OUTAGE.start} min` }
  return (
    <Card size="sm" className="shrink-0 shadow-xs">
      <CardHeader>
        <CardTitle>{EVENING_CHART.title}</CardTitle>
        <CardDescription>{EVENING_CHART.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pt-6" onMouseLeave={() => setTip(null)}>
            <div
              className="absolute top-0 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap text-xs font-medium text-red-600 tabular-nums dark:text-red-400"
              style={{ left: pct((OUTAGE.start + OUTAGE.end) / 2) }}
            >
              <WifiOff className="size-3.5" />Down {OUTAGE_WINDOW}
            </div>
            <div className="relative flex h-10 gap-px overflow-hidden rounded-md">
              {EVENING_HOURS.map((hour, i) => {
                const lvl = THURSDAY_ROW.levels[HEATMAP_HOURS.indexOf(hour)]
                const at = EVENING.start + i * 60 + 30
                return (
                  <span
                    key={hour}
                    className="flex-1"
                    style={{ background: LEVEL_FILL[lvl] }}
                    onMouseEnter={() => setTip({ at, title: `Thursday, ${hour.replace("p", " PM")}`, swatch: LEVEL_FILL[lvl], label: "Usual Thursday", value: capitalize(HEATMAP_APPROX[lvl]) })}
                  />
                )
              })}
              <span
                className="absolute inset-y-0"
                style={{ left: pct(OUTAGE.start), width: `${((OUTAGE.end - OUTAGE.start) / SPAN) * 100}%`, background: DOWN_FILL }}
                onMouseEnter={() => setTip(outageTip)}
              />
            </div>
            {tip && <ChartTipCard tip={tip} />}
            {/* The axis: labels 8px under the plot, no axis line or tick marks. */}
            <div className="relative mt-2 h-4 text-xs text-muted-foreground tabular-nums">
              {ticks.map((m, i) => (
                <span
                  key={m}
                  className={cn("absolute whitespace-nowrap", i === 0 ? "" : i === ticks.length - 1 ? "-translate-x-full" : "-translate-x-1/2")}
                  style={{ left: pct(m) }}
                >
                  {formatClock(m, true).replace(":00", "")}
                </span>
              ))}
            </div>
        </div>
        {/* The legend, as the design system's chart legend draws it. */}
        <ul className="flex list-none flex-wrap justify-center gap-x-4 gap-y-2 pt-4 text-xs text-foreground">
          <li className="flex items-center gap-1.5">
            <span>Quiet</span>
            {LEVEL_FILL.map((fill, i) => <span key={i} aria-hidden className="size-2 shrink-0 rounded-[2px]" style={{ background: fill }} />)}
            <span>Busy</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 shrink-0 rounded-[2px]" style={{ background: DOWN_FILL }} />
            Internet down
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

// What happened, in order: the time on the left, then the event. The rail joins each
// event to the next, so the last one has none.
function Events() {
  return (
    <ol>
      {OUTAGE_EVENTS.map((e, i) => {
        const Icon = e.down ? WifiOff : Wifi
        const last = i === OUTAGE_EVENTS.length - 1
        return (
          <li key={e.label} className="flex gap-3">
            <span className="w-14 shrink-0 text-xs leading-6 tabular-nums text-muted-foreground">{formatClock(e.at, true)}</span>
            <div className="flex flex-col items-center">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border bg-background">
                <Icon className={cn("size-3.5", e.down ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")} />
              </span>
              {!last && <span className="my-1 w-px flex-1 bg-border" />}
            </div>
            <div className={cn("min-w-0", !last && "pb-4")}>
              <p className="text-sm font-medium leading-6 text-foreground">{e.label}</p>
              <p className="text-xs text-muted-foreground">{e.detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Findings() {
  return (
    <>
      <NanciInsight>{OUTAGE_INSIGHT}</NanciInsight>
      {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
        {OUTAGE_TILES.map((tile) => (
          <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} tone={tile.tone} toneScope={tile.toneScope} />
        ))}
      </div>
      <div>
        <SectionHeader title={INCIDENT_TITLE} description={INCIDENT_WHEN} />
        <div className="flex flex-col gap-5">
          <EveningChart />
          <Events />
        </div>
      </div>
      <Callout variant="green" icon={CheckCheck} title={OUTAGE_CREDIT_NOTE.title}>
        <p>{OUTAGE_CREDIT_NOTE.body}</p>
      </Callout>
      <p className="text-xs leading-relaxed text-muted-foreground">{OUTAGE_ESTIMATE_NOTE}</p>
    </>
  )
}

export function OutageImpactPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title={OUTAGE_IMPACT_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <Findings />
      </PanelBody>
    </PanelShell>
  )
}
