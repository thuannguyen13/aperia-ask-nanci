"use client"

import { PhoneMissed } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { HEATMAP_HOURS, HEATMAP_ROWS, HEATMAP_APPROX } from "@/lib/ask-nanci/data/panels/busiest-times"
import {
  MISSED_CALLS_TITLE, MISSED_CALLS_INSIGHT, MISSED_CALLS_TILES, MISSED_CALLS_NOTE, MISSED_BY_HOUR,
  CALLS_OPTIONS, CALLS_OPTIONS_HEADING,
} from "@/lib/ask-nanci/data/panels/missed-calls"
import { parseRequestView, requestView } from "@/lib/ask-nanci/data/panels/carrier-request"
import { isAwaitingCallsRequest } from "@/lib/ask-nanci/data/carrier-flows/calls"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard } from "@/components/shared"
import { RequestDraft, RequestOptions, RequestSent } from "./carrier-request"

const PANEL_ID = "missed-calls"

// Busiest Times levels in blue, which the AT&T theme turns into its cobalt scale.
const LEVEL_CLS = [
  "bg-muted",
  "bg-blue-100 dark:bg-blue-950/40",
  "bg-blue-200 dark:bg-blue-900/50",
  "bg-blue-400 dark:bg-blue-700",
  "bg-blue-600 dark:bg-blue-500",
]

// A missed-call count sits on its Friday cell as a badge, so the calls read against
// the sales of the same hour without a second row. The theme's accent colours it. The
// icon drops out below sm, where a cell is too narrow for both.
const MISSED_BADGE = "inline-flex h-4 min-w-4 items-center justify-center gap-0.5 rounded-full bg-[var(--brand-accent,var(--color-amber-500))] px-1.5 font-mono text-[10px] font-semibold leading-none tabular-nums text-neutral-950 shadow-sm"

function MissedBadge({ count, icon = "sm" }: { count: number; icon?: "sm" | "always" }) {
  return (
    <span className={MISSED_BADGE}>
      <PhoneMissed className={cn("size-2.5 shrink-0", icon === "sm" && "hidden sm:block")} strokeWidth={2.5} />
      {count}
    </span>
  )
}

const GRID = "grid grid-cols-[32px_repeat(11,1fr)] gap-[5px]"

// Sales by day and hour, with last Friday's missed calls as badges on Friday's cells.
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
            <div key={row.day} className={cn(GRID, "items-center")}>
              <span className={cn("text-[10px] font-semibold", isFriday ? "text-foreground" : "text-muted-foreground")}>{row.day}</span>
              {row.levels.map((lvl, i) => {
                const missed = isFriday ? MISSED_BY_HOUR[i] : 0
                return (
                  <span
                    key={i}
                    title={`${row.day} ${HEATMAP_HOURS[i]} · ${HEATMAP_APPROX[lvl]}${missed ? ` · ${missed} missed` : ""}`}
                    className={cn("flex h-6 items-center justify-center rounded-[4px]", LEVEL_CLS[lvl])}
                  >
                    {missed > 0 && <MissedBadge count={missed} />}
                  </span>
                )
              })}
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
          <MissedBadge count={9} icon="always" />
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
