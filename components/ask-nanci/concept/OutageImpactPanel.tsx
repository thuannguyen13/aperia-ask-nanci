"use client"

import { CircleAlert, Wifi, WifiOff } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { HEATMAP_HOURS, HEATMAP_APPROX } from "@/lib/ask-nanci/data/panels/busiest-times"
import {
  OUTAGE_IMPACT_TITLE, OUTAGE_INSIGHT, OUTAGE_TILES, OUTAGE_WHY, OUTAGE_EVENTS, OUTAGE_ESTIMATE_NOTE,
  OUTAGE, OUTAGE_WINDOW, EVENING, EVENING_HOURS, THURSDAY_ROW, OUTAGE_OPTIONS, OUTAGE_OPTIONS_HEADING, formatClock,
} from "@/lib/ask-nanci/data/panels/outage-impact"
import { parseRequestView, requestView } from "@/lib/ask-nanci/data/panels/carrier-request"
import { isAwaitingOutageRequest } from "@/lib/ask-nanci/data/carrier-flows/outage"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, Callout } from "@/components/shared"
import { ExampleFiguresNote, RequestDraft, RequestOptions, RequestSent } from "./carrier-request"

const PANEL_ID = "outage-impact"

// The Busiest Times scale, so a busy hour here reads as busy there.
const LEVEL_CLS = [
  "bg-muted",
  "bg-teal-100 dark:bg-teal-950/40",
  "bg-teal-200 dark:bg-teal-900/50",
  "bg-teal-400 dark:bg-teal-700",
  "bg-teal-500 dark:bg-teal-600",
]

const SPAN = EVENING.end - EVENING.start
const pct = (minutes: number) => `${((minutes - EVENING.start) / SPAN) * 100}%`

// The evening as one track: each hour shaded by how busy a usual Thursday is, with the
// outage laid over it.
function EveningTrack() {
  return (
    <div>
      <p className="mb-2 text-base font-semibold text-foreground">Thursday evening</p>
      <div className="relative pt-6">
        <div
          className="absolute top-0 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap text-[10px] font-semibold text-red-700 dark:text-red-400"
          style={{ left: pct((OUTAGE.start + OUTAGE.end) / 2) }}
        >
          <WifiOff className="size-3" />Down {OUTAGE_WINDOW}
        </div>
        <div className="relative flex h-8 overflow-hidden rounded-md">
          {EVENING_HOURS.map((hour) => {
            const lvl = THURSDAY_ROW.levels[HEATMAP_HOURS.indexOf(hour)]
            return <span key={hour} title={`Thu ${hour} · ${HEATMAP_APPROX[lvl]}`} className={cn("flex-1 border-r border-background last:border-r-0", LEVEL_CLS[lvl])} />
          })}
          <span
            className="absolute inset-y-0 bg-red-500/80 dark:bg-red-600/80"
            style={{ left: pct(OUTAGE.start), width: `${((OUTAGE.end - OUTAGE.start) / SPAN) * 100}%` }}
          />
        </div>
        <div className="relative mt-1 h-4 text-[10px] text-muted-foreground">
          {[...EVENING_HOURS.map((_, i) => EVENING.start + i * 60), EVENING.end].map((m, i, all) => (
            <span
              key={m}
              className={cn("absolute whitespace-nowrap tabular-nums",i === 0 ? "" : i === all.length - 1 ? "-translate-x-full" : "-translate-x-1/2")}
              style={{ left: pct(m) }}
            >
              {formatClock(m, i === 0 || i === all.length - 1).replace(":00", "")}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span>Usual Thursday: quiet</span>
          {LEVEL_CLS.map((cls, i) => <span key={i} className={cn("size-3 rounded-sm", cls)} />)}
          <span>busy</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-red-500/80 dark:bg-red-600/80" />
          <span>Internet down</span>
        </span>
      </div>
    </div>
  )
}

// What happened, in order, from the service record and the register.
function Events() {
  return (
    <div className="relative pl-5">
      <div className="absolute bottom-1 left-[7px] top-1 w-px bg-border" />
      <ol className="space-y-3">
        {OUTAGE_EVENTS.map((e) => {
          const Icon = e.down ? WifiOff : Wifi
          return (
            <li key={e.label} className="relative">
              <span className="absolute -left-5 flex size-4 items-center justify-center rounded-full border bg-background">
                <Icon className={cn("size-2.5", e.down ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")} />
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium text-foreground">{e.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{formatClock(e.at, true)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{e.detail}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Findings() {
  return (
    <>
      <NanciInsight>{OUTAGE_INSIGHT}</NanciInsight>
      {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
        {OUTAGE_TILES.map((tile) => (
          <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} tone={tile.tone} />
        ))}
      </div>
      <EveningTrack />
      <Callout variant="amber" icon={CircleAlert} title={OUTAGE_WHY.title}>
        <p>{OUTAGE_WHY.body}</p>
      </Callout>
      <Events />
      <p className="text-xs leading-relaxed text-muted-foreground">{OUTAGE_ESTIMATE_NOTE}</p>
    </>
  )
}

export function OutageImpactPanel() {
  const { closeDynamicPanel, setPanelView, messages, chatState } = useAskNanci()
  const view = usePanelView(PANEL_ID, "findings")
  const { step, id } = parseRequestView(view)
  const option = OUTAGE_OPTIONS.find((o) => o.id === id)

  return (
    <PanelShell>
      <PanelHeader title={OUTAGE_IMPACT_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        {step === "options" && (
          <RequestOptions heading={OUTAGE_OPTIONS_HEADING} options={OUTAGE_OPTIONS} ranked onChoose={(o) => setPanelView(PANEL_ID, requestView(o.id))} />
        )}
        {step === "request" && option && (
          <RequestDraft option={option} onBack={() => setPanelView(PANEL_ID, "options")} canSend={isAwaitingOutageRequest(messages, chatState)} />
        )}
        {step === "sent" && option && <RequestSent option={option} />}
        {step === "findings" && <Findings />}
        <ExampleFiguresNote />
      </PanelBody>
    </PanelShell>
  )
}
