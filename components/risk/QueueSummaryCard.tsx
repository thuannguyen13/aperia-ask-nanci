"use client"

import Image from "next/image"
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Settings } from "lucide-react"
import { Badge, Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { formatCurrency } from "@/components/ask-nanci/shared"
import { DETECTION_QUEUE, type QueueStatus, type DetectionQueueData } from "@/lib/ask-nanci/data/risk-detection-queue"

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

// Y ticks: 0 up to the largest count rounded to a nice number (357 → 360), 5 evenly.
function axisTicks(max: number) {
  const step = Math.ceil(max / 4 / 10) * 10 || 1
  return [0, 1, 2, 3, 4].map((i) => i * step)
}

// Bar chart: one bar per status, height = actual count, axis scaled from the data.
// Figma (410:27110) has no X labels — the status cells beside it name every bar —
// so it's gridlines + a left Y axis + four fully-rounded bars, nothing else.
function StatusChart({ statuses }: { statuses: QueueStatus[] }) {
  return (
    <ResponsiveContainer width="100%" height={152} className="min-w-0 flex-1 [&_*]:outline-none">
      {/* bottom/top margin keeps the 0 and top ticks from clipping against the card edge */}
      <BarChart data={statuses} margin={{ top: 10, right: 8, bottom: 10, left: -12 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" hide />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false} axisLine={false} width={44}
          ticks={axisTicks(Math.max(...statuses.map((s) => s.count)))}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)", radius: 8 }}
          contentStyle={{
            background: "var(--popover)", color: "var(--popover-foreground)",
            border: "1px solid var(--border)", borderRadius: 10, padding: "6px 10px",
            fontSize: 12, boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
          }}
          separator=""
          labelStyle={{ fontWeight: 500, marginBottom: 2 }}
          itemStyle={{ padding: 0 }}
          formatter={(value) => [`${Number(value).toLocaleString()} merchants`, ""]}
        />
        {/* minPointSize: a zero status still draws a thin colored line on the
            baseline, as in the Figma, instead of vanishing. */}
        <Bar dataKey="count" radius={8} maxBarSize={52} minPointSize={3}>
          {statuses.map((s) => <Cell key={s.key} fill={HEX[s.color]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function QueueSummaryCard({ queue = DETECTION_QUEUE, onBarometer }: { queue?: DetectionQueueData; onBarometer?: () => void }) {
  const q = queue
  const get = (key: QueueStatus["key"]) => q.statuses.find((s) => s.key === key)!
  const alerted = get("alerted")
  const worked = get("worked")
  const workedPct = q.workedOf ? (worked.count / q.workedOf) * 100 : 0

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-muted p-1">
      {/* Header — transparent on the gray card */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <p className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">{q.assignment}</p>
        {q.mastercard && <Image src="/iso/mastercard.svg" alt="Mastercard" width={28} height={20} className="h-5 w-auto shrink-0" />}
        <Badge variant="outline">{q.code}</Badge>
        {/* Only a queue with a drill-in handler is actionable. The others keep the
            same chrome but are inert — nothing behind them in the demo. */}
        <div className={cn("flex items-center gap-2", !onBarometer && "pointer-events-none")} aria-hidden={!onBarometer}>
          <Button variant="outline" size="sm" tabIndex={onBarometer ? undefined : -1}>Security Report</Button>
          <Button variant="default" size="sm" onClick={onBarometer} tabIndex={onBarometer ? undefined : -1}>Barometer Report</Button>
          <Button variant="outline" size="icon-sm" tabIndex={onBarometer ? undefined : -1}><Settings className="size-4" /></Button>
        </div>
      </div>

      {/* KPI row — transparent */}
      <div className="grid grid-cols-2 gap-4 px-3 py-1 sm:grid-cols-4">
        <Kpi label="Eligible Merchant Count" value={q.eligibleMerchants.toLocaleString()} sub="Merchants" />
        <Kpi label="Alerted" value={alerted.count.toLocaleString()} sub={formatCurrency(alerted.amount)} />
        <Kpi label="Re-queued" value={q.requeued.count.toLocaleString()} sub={formatCurrency(q.requeued.amount)} />
        <Kpi label="% Worked" value={`${workedPct.toFixed(2)}%`} sub={`${worked.count} of ${q.workedOf.toLocaleString()}`} />
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
