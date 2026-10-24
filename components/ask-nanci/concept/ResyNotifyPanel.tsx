"use client"

import { cn } from "aperia-ds5/utils"
import { Bell, Users } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { FRIDAY_AS_OF, FRIDAY_DATE, NOTIFY_GUESTS, NOTIFY_HISTOGRAM, NOTIFY_PARTIES, NOTIFY_SIZES, NOTIFY_TOP, PEAK_WINDOW, REBOOK, type NotifyRow, type NotifyStatus } from "@/lib/ask-nanci/data/panels/resy-friday"
import { PanelShell, PanelHeader, PanelBody, Callout, formatWholeCurrency } from "@/components/shared"

const STATUS: Record<NotifyStatus, { label: string; pill: string; row: string }> = {
  booked: { label: "Booked", pill: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300", row: "bg-green-50/60 dark:bg-green-950/10" },
  waiting: { label: "Waiting", pill: "bg-muted text-muted-foreground", row: "" },
}

// One shade per party size, light to dark as the party grows.
const SIZE_SHADE: Record<number, string> = { 2: "bg-primary/40", 3: "bg-primary/60", 4: "bg-primary/80", 6: "bg-primary" }

// The most parties any half hour holds sets the full bar width.
const MAX_PARTIES = Math.max(...NOTIFY_HISTOGRAM.map((h) => h.counts.reduce((t, c) => t + c, 0)))

const visitsLabel = (visits: number) => (visits === 0 ? "New guest" : `${visits} visit${visits === 1 ? "" : "s"}`)

function SizeLegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {NOTIFY_SIZES.map((size) => (
        <span key={size} className="flex items-center gap-1 text-xs text-muted-foreground"><span className={cn("size-2.5 rounded-sm", SIZE_SHADE[size])} />{size}s</span>
      ))}
    </div>
  )
}

function DemandBar({ time, counts }: { time: string; counts: number[] }) {
  const inWindow = PEAK_WINDOW.times.includes(time)
  const total = counts.reduce((t, c) => t + c, 0)
  return (
    <li className={cn("flex items-center gap-3 rounded-md px-2 py-1", inWindow && "bg-amber-50 dark:bg-amber-950/20")}>
      <span className="w-10 shrink-0 text-xs font-semibold tabular-nums text-foreground">{time}</span>
      <div className="flex h-3 min-w-0 flex-1 overflow-hidden rounded-sm">
        {counts.map((c, i) => <span key={NOTIFY_SIZES[i]} className={SIZE_SHADE[NOTIFY_SIZES[i]]} style={{ width: `${(c / MAX_PARTIES) * 100}%` }} />)}
      </div>
      <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{total}</span>
    </li>
  )
}

function DemandCard() {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base font-bold text-foreground">Demand by half hour</p>
        <SizeLegend />
      </div>
      <ul className="mt-3 space-y-1">
        {NOTIFY_HISTOGRAM.map((h) => <DemandBar key={h.time} time={h.time} counts={h.counts} />)}
      </ul>
      <p className="mt-3 text-sm text-foreground">
        <span className="font-semibold">{PEAK_WINDOW.label}:</span> {PEAK_WINDOW.twos} twos and {PEAK_WINDOW.fours} fours, {PEAK_WINDOW.parties} parties and {PEAK_WINDOW.guests} guests. Nothing is open there.
      </p>
    </div>
  )
}

function NotifyListRow({ row, rank }: { row: NotifyRow; rank: number }) {
  const status = STATUS[row.status]
  return (
    <li className={cn("flex items-center gap-3 px-4 py-3", status.row)}>
      <span className="w-4 shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">{rank}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{row.name}</p>
        <p className="truncate text-xs text-muted-foreground">{row.window} · {visitsLabel(row.visits)}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground"><Users className="size-3.5" />{row.party}</span>
      <div className="w-28 shrink-0 text-right">
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", status.pill)}>{status.label}</span>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{row.reason}</p>
      </div>
    </li>
  )
}

function NotifyList() {
  return (
    <div className="rounded-xl border">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Bell className="size-4 text-muted-foreground" />
        <p className="text-base font-bold text-foreground">Notify list</p>
        <p className="ml-auto text-xs text-muted-foreground">Ranked by fit, then visits</p>
      </div>
      <ul className="divide-y">
        {NOTIFY_TOP.map((row, i) => <NotifyListRow key={row.name} row={row} rank={i + 1} />)}
      </ul>
      <p className="border-t px-4 py-3 text-sm font-medium tabular-nums text-foreground">{NOTIFY_PARTIES} parties, {NOTIFY_GUESTS} guests on Notify</p>
    </div>
  )
}

export function ResyNotifyPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title={`Notify · ${FRIDAY_DATE}`} subtitle={`${NOTIFY_PARTIES} parties, ${NOTIFY_GUESTS} guests · ${FRIDAY_AS_OF}`} size="lg" onClose={() => closeDynamicPanel("resy-notify")} />
      <PanelBody className="space-y-4">
        <Callout variant="green">
          {REBOOK.time} six-top rebooked from Notify in {REBOOK.minutes} min. Party of {REBOOK.party} at {formatWholeCurrency(REBOOK.perCover)} a cover = {formatWholeCurrency(REBOOK.value)}.
        </Callout>
        <DemandCard />
        <NotifyList />
      </PanelBody>
    </PanelShell>
  )
}
