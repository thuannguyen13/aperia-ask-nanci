"use client"

import { Badge } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { Bell, CheckCheck, Users } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { FRIDAY_AS_OF, FRIDAY_DATE, NOTIFY_GUESTS, NOTIFY_HISTOGRAM, NOTIFY_PARTIES, NOTIFY_SIZES, NOTIFY_TITLE, NOTIFY_TOP, PEAK_WINDOW, REBOOK, type NotifyRow, type NotifyStatus } from "@/lib/ask-nanci/data/panels/resy-friday"
import { PanelShell, PanelHeader, PanelBody, PanelItem, Callout, SectionHeader, formatWholeCurrency } from "@/components/shared"

const STATUS: Record<NotifyStatus, { label: string; className: string }> = {
  booked: { label: "Booked", className: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
  waiting: { label: "Waiting", className: "bg-muted text-foreground" },
}

// One colour per party size, as the design keys them: the sizes are categories, not a scale.
const SIZE_COLOR: Record<number, string> = { 2: "bg-primary", 3: "bg-amber-500", 4: "bg-red-400", 6: "bg-purple-500" }

// The most parties any half hour holds sets the full bar width.
const MAX_PARTIES = Math.max(...NOTIFY_HISTOGRAM.map((h) => h.counts.reduce((t, c) => t + c, 0)))

const visitsLabel = (visits: number) => (visits === 0 ? "New guest" : `${visits} visit${visits === 1 ? "" : "s"}`)

function SizeLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {NOTIFY_SIZES.map((size) => (
        <span key={size} className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className={cn("size-2 rounded-sm", SIZE_COLOR[size])} />{size}s</span>
      ))}
    </div>
  )
}

function DemandBar({ time, counts }: { time: string; counts: number[] }) {
  const total = counts.reduce((t, c) => t + c, 0)
  return (
    <li className="flex items-center gap-2">
      <div className="relative flex h-5 min-w-0 flex-[0_0_auto] overflow-hidden rounded-sm" style={{ width: `calc((100% - 2rem) * ${total / MAX_PARTIES})` }}>
        {counts.map((c, i) => <span key={NOTIFY_SIZES[i]} className={SIZE_COLOR[NOTIFY_SIZES[i]]} style={{ width: `${(c / total) * 100}%` }} />)}
        <span className="absolute inset-y-0 left-1.5 flex items-center text-xs text-primary-foreground tabular-nums">{time}</span>
      </div>
      <span className="text-xs tabular-nums text-foreground">{total}</span>
    </li>
  )
}

function DemandCard() {
  return (
    <div className="space-y-4 rounded-xl border px-6 py-4 shadow-xs">
      <p className="text-base font-semibold text-foreground">Demand by Half Hour</p>
      <ul className="space-y-2.5">
        {NOTIFY_HISTOGRAM.map((h) => <DemandBar key={h.time} time={h.time} counts={h.counts} />)}
      </ul>
      <SizeLegend />
      <p className="text-sm text-foreground">
        {PEAK_WINDOW.label}: {PEAK_WINDOW.twos} twos and {PEAK_WINDOW.fours} fours, {PEAK_WINDOW.parties} parties and {PEAK_WINDOW.guests} guests. Nothing is open there.
      </p>
    </div>
  )
}

function NotifyListRow({ row }: { row: NotifyRow }) {
  const status = STATUS[row.status]
  return (
    <li>
      <PanelItem icon={Bell}>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-sm leading-4 font-medium text-foreground">{row.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.window} · {visitsLabel(row.visits)}</p>
        </div>
        <span className="flex min-w-0 flex-1 items-center gap-1 self-center text-xs tabular-nums text-foreground"><Users className="size-4 text-muted-foreground" />{row.party}</span>
        <div className="flex min-w-0 flex-1 flex-col items-end gap-1 text-right">
          <Badge className={status.className}>{status.label}</Badge>
          <p className="text-xs text-muted-foreground">{row.reason}</p>
        </div>
      </PanelItem>
    </li>
  )
}

function NotifyList() {
  return (
    <div>
      <SectionHeader title="Notify List" description="Ranked by fit, then visits" />
      <ul className="space-y-2">
        {NOTIFY_TOP.map((row) => <NotifyListRow key={row.name} row={row} />)}
      </ul>
      <p className="mt-4 text-sm tabular-nums text-foreground">{NOTIFY_PARTIES} parties, {NOTIFY_GUESTS} guests still waiting on Notify.</p>
    </div>
  )
}

export function ResyNotifyPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title={NOTIFY_TITLE} subtitle={`${FRIDAY_DATE} · ${FRIDAY_AS_OF}`} size="lg" onClose={() => closeDynamicPanel("resy-notify")} />
      <PanelBody className="space-y-4">
        <Callout variant="green" icon={CheckCheck} title={`${REBOOK.time} six-top rebooked from Notify in ${REBOOK.minutes} min.`}>
          Party of {REBOOK.party} at {formatWholeCurrency(REBOOK.perCover)} a cover = {formatWholeCurrency(REBOOK.value)}.
        </Callout>
        <DemandCard />
        <NotifyList />
      </PanelBody>
    </PanelShell>
  )
}
