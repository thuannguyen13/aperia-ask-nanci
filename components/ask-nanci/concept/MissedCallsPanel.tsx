"use client"

import { useState } from "react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { HEATMAP_HOURS, HEATMAP_ROWS, HEATMAP_APPROX, HOURLY_SALES } from "@/lib/ask-nanci/data/panels/busiest-times"
import {
  MISSED_CALLS_TITLE, MISSED_CALLS_INSIGHT, MISSED_CALLS_TILES, MISSED_CALLS_NOTE, MISSED_BY_HOUR,
} from "@/lib/ask-nanci/data/panels/missed-calls"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, SectionHeader, formatWholeCurrency } from "@/components/shared"

const PANEL_ID = "missed-calls"

// Busiest Times levels in blue, as the Busiest Times heatmap draws them.
const LEVEL_CLS = [
  "bg-muted",
  "bg-blue-100 dark:bg-blue-950/40",
  "bg-blue-200 dark:bg-blue-900/50",
  "bg-blue-400 dark:bg-blue-700",
  "bg-blue-600 dark:bg-blue-500",
]

// The figure in each cell reads in white on the two darkest levels.
const FIGURE_CLS = ["text-muted-foreground", "text-foreground/70", "text-foreground/80", "text-white", "text-white"]

// A missed-call count sits on the corner of its Friday cell as a badge, so the calls read
// against the sales of the same hour without a second row.
const MISSED_BADGE = "inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 font-mono text-[10px] font-bold leading-none tabular-nums text-white shadow-sm ring-2 ring-background"

const GRID = "grid grid-cols-[32px_repeat(11,1fr)] gap-[5px]"

const DAY_NAMES: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" }
/** "12p" as "12 PM", "11a" as "11 AM". */
const spellHour = (hour: string) => `${hour.slice(0, -1)} ${hour.endsWith("a") ? "AM" : "PM"}`

// The hovered cell's details, as the design system's chart tooltip draws them: a light
// card over the cell, held inside the grid near either end.
function CellTip({ day, hourIndex, level, sales, missed }: { day: string; hourIndex: number; level: number; sales: number; missed: number }) {
  const last = HEATMAP_HOURS.length - 1
  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-full z-10 mb-1.5 grid min-w-40 gap-1.5 whitespace-nowrap rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl",
        hourIndex < 2 ? "left-0" : hourIndex > last - 2 ? "right-0" : "left-1/2 -translate-x-1/2",
      )}
    >
      <p className="font-medium text-foreground">{DAY_NAMES[day]}, {spellHour(HEATMAP_HOURS[hourIndex])}</p>
      <div className="flex items-center gap-2">
        <span className={cn("size-2.5 shrink-0 rounded-[2px]", LEVEL_CLS[level], level === 0 && "ring-1 ring-border")} />
        <span className="text-muted-foreground">Average sales, {HEATMAP_APPROX[level]}</span>
        <span className="ml-auto pl-6 font-medium tabular-nums text-foreground">{formatWholeCurrency(sales)}</span>
      </div>
      {missed > 0 && (
        <div className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full bg-orange-500" />
          <span className="text-muted-foreground">Missed calls, last Friday</span>
          <span className="ml-auto pl-6 font-medium tabular-nums text-foreground">{missed}</span>
        </div>
      )}
    </div>
  )
}

// Sales by day and hour, with last Friday's missed calls as badges on Friday's cells.
function Heatmap() {
  const [hover, setHover] = useState<{ day: string; hourIndex: number } | null>(null)
  return (
    <div>
      <SectionHeader title="Sales by Day and Hour" description="Average sales per hour over the last four weeks, with last Friday's missed calls." />
      <div className="flex flex-col gap-[5px]">
        <div className={GRID}>
          <span />
          {HEATMAP_HOURS.map((h) => (
            <span key={h} className="text-center text-[9px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>
        {HEATMAP_ROWS.map((row, r) => {
          const isFriday = row.day === "Fri"
          return (
            <div key={row.day} className={cn(GRID, "items-center")}>
              <span className={cn("text-[10px] font-semibold", isFriday ? "text-foreground" : "text-muted-foreground")}>{row.day}</span>
              {row.levels.map((lvl, i) => {
                const missed = isFriday ? MISSED_BY_HOUR[i] : 0
                const sales = HOURLY_SALES[r].sales[i]
                const hovered = hover?.day === row.day && hover.hourIndex === i
                return (
                  <span
                    key={i}
                    onMouseEnter={() => setHover({ day: row.day, hourIndex: i })}
                    className={cn("relative flex h-7 min-w-0 items-center justify-center rounded-[4px]", LEVEL_CLS[lvl], hovered && "ring-2 ring-foreground/40")}
                  >
                    {/* Eleven figures do not fit across a phone, so there the tooltip carries them. */}
                    <span className={cn("hidden text-[10px] font-medium tabular-nums sm:inline", FIGURE_CLS[lvl])}>{formatWholeCurrency(sales)}</span>
                    {missed > 0 && <span className={cn(MISSED_BADGE, "absolute -top-2 -right-1.5")}>{missed}</span>}
                    {hovered && <CellTip day={row.day} hourIndex={i} level={lvl} sales={sales} missed={missed} />}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span>Under $100</span>
          {LEVEL_CLS.map((cls, i) => <span key={i} className={cn("size-3 rounded-sm", cls)} />)}
          <span>$400 and over</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={MISSED_BADGE}>9</span>
          <span>Missed calls in that hour, last Friday</span>
        </span>
      </div>
    </div>
  )
}

function Findings() {
  return (
    <>
      <NanciInsight>{MISSED_CALLS_INSIGHT}</NanciInsight>
      {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
        {MISSED_CALLS_TILES.map((tile) => (
          <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} emphasis={tile.emphasis} />
        ))}
      </div>
      <Heatmap />
      <p className="text-xs leading-relaxed text-muted-foreground">{MISSED_CALLS_NOTE}</p>
    </>
  )
}

export function MissedCallsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title={MISSED_CALLS_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <Findings />
      </PanelBody>
    </PanelShell>
  )
}
