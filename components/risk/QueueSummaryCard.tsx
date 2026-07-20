"use client"

import { Settings } from "lucide-react"
import { Button } from "aperia-ds5"
import { formatCurrency } from "@/components/ask-nanci/shared"
import { DETECTION_QUEUE, type QueueStatus } from "@/lib/ask-nanci/data/risk-detection-queue"

// The assignment summary block (name + report switch + KPI row + chart + status grid),
// shared by the Detection Queue and Barometer Report destinations. Built to the Figma
// design context (node 410:27095): gray card, transparent header + KPI rows, and the
// chart + status grid in a white shadowed card. Exact bar/accent hexes from the design.

const HEX: Record<QueueStatus["color"], string> = {
  orange:  "#ea580c", // Alerted
  teal:    "#164e63", // Ready to work
  amber:   "#fbbf24", // Work in progress
  emerald: "#0d9488", // Worked
}

const CHART_MAX = 12
const CHART_TICKS = [12, 9, 6, 3, 0]

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{sub}</p>
    </div>
  )
}

// Status cell: 4px colored accent bar + label / count / amount. No dividers.
function StatusCell({ status }: { status: QueueStatus }) {
  return (
    <div className="flex items-stretch gap-3">
      <div className="w-1 shrink-0 rounded-[2px]" style={{ backgroundColor: HEX[status.color] }} />
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground">{status.label}</p>
        <p className="mt-2 text-xl font-semibold tabular-nums text-foreground">{status.count.toLocaleString()}</p>
        <p className="text-sm tabular-nums text-muted-foreground">{formatCurrency(status.amount)}</p>
      </div>
    </div>
  )
}

// Bar chart: horizontal gridlines only (no Y-axis line), tick labels at left.
function StatusChart({ statuses }: { statuses: QueueStatus[] }) {
  return (
    <div className="flex flex-1 gap-2 py-4 pl-1">
      <div className="flex flex-col justify-between py-1 text-xs tabular-nums text-muted-foreground">
        {CHART_TICKS.map((t) => <span key={t}>{t}</span>)}
      </div>
      <div className="relative flex flex-1 items-end gap-7 px-2">
        {CHART_TICKS.map((t) => (
          <div key={t} className="pointer-events-none absolute inset-x-0 border-t border-border/60" style={{ bottom: `${(t / CHART_MAX) * 100}%` }} />
        ))}
        {statuses.map((s) => (
          <div
            key={s.key}
            title={`${s.label}: ${s.count.toLocaleString()}`}
            className="relative z-10 min-w-0 flex-1 rounded-lg"
            style={{ height: `${(s.bar / CHART_MAX) * 100}%`, backgroundColor: HEX[s.color] }}
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
    <div className="flex flex-col gap-1 rounded-xl bg-muted p-1">
      {/* Header — transparent on the gray card */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <p className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">{q.assignment}</p>
        <span className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium text-foreground">{q.code}</span>
        <Button variant="secondary" size="sm">Security Report</Button>
        <Button variant={activeReport === "barometer" ? "default" : "secondary"} size="sm" onClick={onBarometer}>Barometer Report</Button>
        <Button variant="secondary" size="icon-sm"><Settings className="size-4" /></Button>
      </div>

      {/* KPI row — transparent */}
      <div className="grid grid-cols-2 gap-4 px-3 py-1 sm:grid-cols-4">
        <Kpi label="Eligible Merchant Count" value={q.eligibleMerchants.toLocaleString()} sub="Merchants" />
        <Kpi label="Alerted" value={alerted.count.toLocaleString()} sub={formatCurrency(alerted.amount)} />
        <Kpi label="Re-queued" value={requeued.count.toLocaleString()} sub={formatCurrency(requeued.amount)} />
        <Kpi label="% Worked" value={`${workedPct.toFixed(2)}%`} sub={`${worked.count} of ${requeued.count}`} />
      </div>

      {/* Chart + status grid — white shadowed card */}
      <div className="flex gap-4 rounded-lg bg-card p-3 shadow-sm">
        <StatusChart statuses={q.statuses} />
        <div className="grid flex-1 grid-cols-2 gap-4 self-center">
          {q.statuses.map((s) => <StatusCell key={s.key} status={s} />)}
        </div>
      </div>
    </div>
  )
}
