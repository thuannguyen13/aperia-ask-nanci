"use client"

import { Settings } from "lucide-react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { formatCurrency } from "@/components/ask-nanci/shared"
import { DETECTION_QUEUE, type QueueStatus } from "@/lib/ask-nanci/data/risk-detection-queue"

// The assignment summary block (name + report switch + KPI row + chart + status grid),
// shared by the Detection Queue and Barometer Report destinations. Layout mirrors the
// Figma: a light-gray card holding the header + KPIs, with the chart + status grid in a
// white inner card.

const BAR: Record<QueueStatus["color"], string> = {
  orange:  "bg-orange-500",
  teal:    "bg-teal-600",
  amber:   "bg-amber-400",
  emerald: "bg-emerald-500",
}

const CHART_MAX = 12
const CHART_TICKS = [12, 9, 6, 3, 0]

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

// A status cell: slim colored left accent bar + label/count/amount. Cells sit flush in
// the white card, separated by thin dividers (no bordered boxes).
function StatusCell({ status, className }: { status: QueueStatus; className?: string }) {
  return (
    <div className={cn("flex items-stretch gap-2.5 px-4 py-3", className)}>
      <div className={cn("w-[3px] shrink-0 rounded-full", BAR[status.color])} />
      <div>
        <p className="text-xs text-muted-foreground">{status.label}</p>
        <p className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">{status.count.toLocaleString()}</p>
        <p className="text-xs tabular-nums text-muted-foreground">{formatCurrency(status.amount)}</p>
      </div>
    </div>
  )
}

function StatusChart({ statuses }: { statuses: QueueStatus[] }) {
  return (
    <div className="flex h-44 gap-2">
      <div className="flex flex-col justify-between py-1 text-[10px] tabular-nums text-muted-foreground">
        {CHART_TICKS.map((t) => <span key={t}>{t}</span>)}
      </div>
      <div className="relative flex flex-1 items-end gap-4 px-4 pb-px pt-1">
        {CHART_TICKS.map((t) => (
          <div key={t} className="pointer-events-none absolute inset-x-0 border-t border-border/50" style={{ bottom: `${(t / CHART_MAX) * 100}%` }} />
        ))}
        {statuses.map((s) => (
          <div
            key={s.key}
            title={`${s.label}: ${s.count.toLocaleString()}`}
            className={cn("relative z-10 w-16 rounded-t", BAR[s.color])}
            style={{ height: `${(s.bar / CHART_MAX) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function QueueSummaryCard({ activeReport = "none", onBarometer }: { activeReport?: "none" | "barometer"; onBarometer?: () => void }) {
  const q = DETECTION_QUEUE
  const get = (key: QueueStatus["key"]) => q.statuses.find((s) => s.key === key)!
  const alerted = get("alerted")
  const requeued = get("ready")
  const worked = get("worked")
  const workedPct = requeued.count ? (worked.count / requeued.count) * 100 : 0

  return (
    <div className="rounded-xl border bg-muted/40 p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">{q.assignment}</p>
        <span className="rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">{q.code}</span>
        <Button variant="secondary" size="sm">Security Report</Button>
        <Button variant={activeReport === "barometer" ? "default" : "secondary"} size="sm" onClick={onBarometer}>Barometer Report</Button>
        <Button variant="secondary" size="icon-sm" className="ml-1"><Settings className="size-4" /></Button>
      </div>

      {/* KPI row — directly on the gray card */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Eligible Merchant Count" value={q.eligibleMerchants.toLocaleString()} sub="Merchants" />
        <Kpi label="Alerted" value={alerted.count.toLocaleString()} sub={formatCurrency(alerted.amount)} />
        <Kpi label="Re-queued" value={requeued.count.toLocaleString()} sub={formatCurrency(requeued.amount)} />
        <Kpi label="% Worked" value={`${workedPct.toFixed(2)}%`} sub={`${worked.count} of ${requeued.count}`} />
      </div>

      {/* Chart + status grid — white inner card */}
      <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border bg-background p-4 lg:grid-cols-2">
        <StatusChart statuses={q.statuses} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 self-center">
          {q.statuses.map((s) => (
            <StatusCell key={s.key} status={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
