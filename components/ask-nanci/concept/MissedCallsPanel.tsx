"use client"

import { PhoneMissed } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { HEATMAP_HOURS, HEATMAP_ROWS, HEATMAP_APPROX } from "@/lib/ask-nanci/data/panels/busiest-times"
import {
  MISSED_CALLS_TITLE, MISSED_CALLS_INSIGHT, MISSED_CALLS_TILES, MISSED_CALLS_NOTE, MISSED_BY_HOUR, MISSED_WINDOW,
  CALLS_OPTIONS, CALLS_OPTIONS_HEADING,
} from "@/lib/ask-nanci/data/panels/missed-calls"
import { parseRequestView, requestView } from "@/lib/ask-nanci/data/panels/carrier-request"
import { isAwaitingCallsRequest } from "@/lib/ask-nanci/data/carrier-flows/calls"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard } from "@/components/shared"
import { RequestDraft, RequestOptions, RequestSent } from "./carrier-request"

const PANEL_ID = "missed-calls"

// The Busiest Times scale, so the two heatmaps read the same.
const LEVEL_CLS = [
  "bg-muted",
  "bg-teal-100 dark:bg-teal-950/40",
  "bg-teal-200 dark:bg-teal-900/50",
  "bg-teal-400 dark:bg-teal-700",
  "bg-teal-500 dark:bg-teal-600",
]

// Missed calls are the attention layer, so amber, darker with more calls.
const missedCls = (n: number) =>
  n === 0 ? "bg-muted/40 text-transparent"
    : n < 3 ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
      : n < 7 ? "bg-amber-300 text-amber-950 dark:bg-amber-700 dark:text-amber-50"
        : "bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50"

const GRID = "grid grid-cols-[32px_repeat(11,1fr)] gap-[5px]"
const inWindow = (hour: string) => MISSED_WINDOW.hours.includes(hour)

// Sales by day and hour, with last Friday's missed calls as a paired row under Friday.
function Heatmap() {
  return (
    <div>
      <p className="mb-2 text-base font-semibold text-foreground">Sales by day and hour, with last Friday's missed calls</p>
      <div className="flex flex-col gap-[5px]">
        <div className={GRID}>
          <span />
          {HEATMAP_HOURS.map((h) => (
            <span key={h} className="text-center text-[9px] font-semibold text-muted-foreground">{h}</span>
          ))}
        </div>
        {HEATMAP_ROWS.map((row) => {
          const isFriday = row.day === "Fri"
          return (
            <div key={row.day} className={cn("flex flex-col gap-[5px]", isFriday && "rounded-md bg-amber-50/60 py-1 dark:bg-amber-950/10")}>
              <div className={cn(GRID, "items-center")}>
                <span className={cn("text-[10px] font-semibold", isFriday ? "text-foreground" : "text-muted-foreground")}>{row.day}</span>
                {row.levels.map((lvl, i) => (
                  <span
                    key={i}
                    title={`${row.day} ${HEATMAP_HOURS[i]} · ${HEATMAP_APPROX[lvl]}`}
                    className={cn(
                      "aspect-square min-h-[18px] rounded-[4px]",
                      LEVEL_CLS[lvl],
                      isFriday && inWindow(HEATMAP_HOURS[i]) && "ring-2 ring-amber-500 ring-offset-1 ring-offset-background",
                    )}
                  />
                ))}
              </div>
              {isFriday && (
                <div className={cn(GRID, "items-center")}>
                  <span className="flex justify-center" title="Missed calls, last Friday">
                    <PhoneMissed className="size-3 text-amber-700 dark:text-amber-400" />
                  </span>
                  {MISSED_BY_HOUR.map((n, i) => (
                    <span
                      key={i}
                      title={`Fri ${HEATMAP_HOURS[i]} · ${n} missed`}
                      className={cn("flex min-h-[18px] items-center justify-center rounded-[4px] font-mono text-[10px] font-semibold tabular-nums", missedCls(n))}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span>Quiet</span>
          {LEVEL_CLS.map((cls, i) => <span key={i} className={cn("size-3 rounded-sm", cls)} />)}
          <span>Busy</span>
        </span>
        <span className="flex items-center gap-1.5">
          <PhoneMissed className="size-3 text-amber-700 dark:text-amber-400" />
          <span>Missed calls per hour</span>
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
  const { closeDynamicPanel, setPanelView, messages, chatState } = useAskNanci()
  const view = usePanelView(PANEL_ID, "findings")
  const { step, id } = parseRequestView(view)
  const option = CALLS_OPTIONS.find((o) => o.id === id)

  return (
    <PanelShell>
      <PanelHeader title={MISSED_CALLS_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        {step === "options" && (
          <RequestOptions heading={CALLS_OPTIONS_HEADING} options={CALLS_OPTIONS} onChoose={(o) => setPanelView(PANEL_ID, requestView(o.id))} />
        )}
        {step === "request" && option && (
          <RequestDraft option={option} onBack={() => setPanelView(PANEL_ID, "options")} canSend={isAwaitingCallsRequest(messages, chatState)} />
        )}
        {step === "sent" && option && <RequestSent option={option} />}
        {step === "findings" && <Findings />}
      </PanelBody>
    </PanelShell>
  )
}
