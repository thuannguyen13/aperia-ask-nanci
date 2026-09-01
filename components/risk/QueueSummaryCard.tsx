"use client"

import Image from "next/image"
import { Settings } from "lucide-react"
import { Badge, Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { formatCurrency, formatPercent } from "@/components/shared"
import { applyWorkMarks, DETECTION_QUEUE, type QueueStatus, type DetectionQueueData } from "@/lib/ask-nanci/data/risk-detection-queue"
import { findAssignment } from "@/lib/ask-nanci/data/risk-assignments"
import { useRiskNav } from "./RiskNavContext"

// The assignment summary block (name + report switch + KPI row + progress trail),
// shared by the Detection Queue and Barometer Report destinations. Built to the Figma
// design context (node 1171:34879): gray card, transparent header + KPI rows, and the
// trail + legend in a white shadowed card. Chart hexes are the design's own tokens.

const HEX: Record<QueueStatus["color"], string> = {
  orange: "#ea580c", // chart-1 — Ready to Work
  amber:  "#fbbf24", // chart-4 — In Progress
  // green-600, the Worked split button in BarometerReport/RiskReport, not the
  // design's chart-2 teal: one merchant marked Worked should tint the trail the
  // same color as the button that marked it.
  green:  "#16a34a",
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

// Legend entry: 8px swatch + count + label, the count carrying the weight.
function LegendItem({ status }: { status: QueueStatus }) {
  return (
    <span className="flex items-center gap-1 whitespace-nowrap text-sm">
      <span className="size-2 shrink-0 rounded-xs" style={{ backgroundColor: HEX[status.color] }} />
      <span className="font-semibold tabular-nums text-foreground">{status.count.toLocaleString()}</span>
      <span className="text-muted-foreground">{status.label}</span>
    </span>
  )
}

const Dot = () => <span className="text-sm text-muted-foreground" aria-hidden>·</span>

// Trail: one 24px bar showing how the alerted volume is split across the work
// states. Widths come from the counts, so a state holding nothing occupies nothing —
// the Figma draws equal thirds, which would read as "a third worked" against a
// queue where nothing has been. Zero states stay in the legend, not the bar.
function StatusTrail({ alerted, statuses }: { alerted: QueueStatus; statuses: QueueStatus[] }) {
  const segments = statuses.filter((s) => s.key !== "alerted" && s.count > 0)
  const total = segments.reduce((sum, s) => sum + s.count, 0) || 1

  return (
    <div className="flex h-6 w-full overflow-hidden rounded-[4px]" role="img"
      aria-label={segments.map((s) => `${s.count.toLocaleString()} ${s.label}`).join(", ") || alerted.label}>
      {segments.map((s) => (
        // min-w-px: a state with a rounding-width share still shows as a hairline
        // rather than vanishing, as the design's own segments do.
        <div key={s.key} className="h-full min-w-px" style={{ width: `${(s.count / total) * 100}%`, backgroundColor: HEX[s.color] }} />
      ))}
    </div>
  )
}

/**
 * The assignment's name and its tags. Exported because the Barometer Report shows
 * this cluster as its page title instead of inside the card — same markup either
 * way, so the two can never drift.
 */
export function QueueTitle({ queue }: { queue: DetectionQueueData }) {
  return (
    <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      {findAssignment(queue.assignmentId)?.name ?? queue.assignmentId}
      {/* Same outline badge as the code pill — the network mark is a tag too.
          Both take an explicit background: the outline variant is transparent,
          which would let the gray card show through a tag meant to read white. */}
      {queue.mastercard && (
        <Badge variant="outline" className="shrink-0 bg-background">
          <Image src="/iso/mastercard.svg" alt="Mastercard" width={16} height={16} />
        </Badge>
      )}
      <Badge variant="outline" className="shrink-0 bg-background">{queue.code}</Badge>
    </span>
  )
}

export function QueueSummaryCard({ queue = DETECTION_QUEUE, onBarometer, live = false, header = true }:
  // `header` drops the name-and-switch row entirely. The Detection Queue keeps it
  // on every card, inert ones included, because that row of queues has to read the
  // same; the Barometer Report shows the name as its page title instead, and has no
  // use for a button to the page you are already on.
  { queue?: DetectionQueueData; onBarometer?: () => void; live?: boolean; header?: boolean }) {
  // `live` belongs to the Mastercard queue alone — it is the one with a merchant
  // list behind it, so it is the only one a Mark Work click can move.
  const marks = Object.values(useRiskNav().workStatuses)
  const q = live
    ? applyWorkMarks(queue, {
        wip: marks.filter((s) => s === "wip").length,
        worked: marks.filter((s) => s === "worked").length,
      })
    : queue
  const get = (key: QueueStatus["key"]) => q.statuses.find((s) => s.key === key)!
  const alerted = get("alerted")
  const worked = get("worked")
  const workedPct = q.workedOf ? (worked.count / q.workedOf) * 100 : 0

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-muted p-1">
      {/* Header — transparent on the gray card */}
      {header && (
        <div className="flex flex-wrap items-center gap-4 px-3 py-2">
          {/* Tags belong to the title, so they travel with it rather than drifting
              over to the buttons: the name takes the slack, the tags never do. */}
          <span className="min-w-0 flex-1 text-base font-semibold text-foreground">
            <QueueTitle queue={q} />
          </span>
          {/* Only a queue with a drill-in handler is actionable. The others keep the
              same chrome but are inert — nothing behind them in the demo. */}
          <div className={cn("flex items-center gap-2", !onBarometer && "pointer-events-none")} aria-hidden={!onBarometer}>
            <Button variant="outline" size="sm" tabIndex={onBarometer ? undefined : -1}>Security Report</Button>
            <Button variant="default" size="sm" onClick={onBarometer} tabIndex={onBarometer ? undefined : -1}>Barometer Report</Button>
            <Button variant="outline" size="icon-sm" tabIndex={onBarometer ? undefined : -1}><Settings className="size-4" /></Button>
          </div>
        </div>
      )}

      {/* KPI row — transparent */}
      <div className="grid grid-cols-2 gap-4 px-3 py-1 sm:grid-cols-4">
        <Kpi label="Eligible Count" value={q.eligibleMerchants.toLocaleString()} sub="Merchants" />
        <Kpi label="Alerted" value={alerted.count.toLocaleString()} sub={formatCurrency(alerted.amount)} />
        <Kpi label="Re-queued" value={q.requeued.count.toLocaleString()} sub={formatCurrency(q.requeued.amount)} />
        <Kpi label="% Worked" value={formatPercent(workedPct, 2)} sub={`${worked.count} of ${q.workedOf.toLocaleString()}`} />
      </div>

      {/* Trail + legend — white shadowed card. min-h rather than the design's fixed
          80px so a narrow screen can wrap the legend instead of clipping it. */}
      <div className="flex min-h-20 flex-col justify-center gap-3 rounded-lg bg-card p-3 shadow-xs">
        <StatusTrail alerted={alerted} statuses={q.statuses} />
        {/* Ready to Work and the money it carries lead; the two states holding
            nothing sit opposite, where a zero reads as evidence, not as filler. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <LegendItem status={get("ready")} />
            <Dot />
            <span className="flex items-center gap-1 whitespace-nowrap text-sm">
              <span className="font-semibold tabular-nums text-foreground">{formatCurrency(alerted.amount)}</span>
              <span className="text-muted-foreground">At Risk</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <LegendItem status={get("wip")} />
            <Dot />
            <LegendItem status={worked} />
          </div>
        </div>
      </div>
    </div>
  )
}
