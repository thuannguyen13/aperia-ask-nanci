"use client"

import { ALERT_VOLUME, alertsForRange } from "@/lib/ask-nanci/data/risk-dashboard"
import { findAssignment } from "@/lib/ask-nanci/data/risk-assignments"
import { useDashboardScope } from "./DashboardScope"

// Horizontal bar list (assignment → alert count), per the Figma card (734:28526):
// the top row is emphasized; the rest sit at 40% opacity. Bars are orange #ea580c,
// length proportional to count, with the value at the end.
//
// The label text is the registry's `short` name rather than a string stored on the
// chart row, so the bar and the queue card can no longer disagree about what an
// assignment is called.
export function AlertVolumeBars() {
  const { range, assignmentIds } = useDashboardScope()
  // Sorted after filtering, so the longest bar is the longest bar in what is shown
  // rather than a leftover from the unfiltered order.
  const rows = ALERT_VOLUME
    .filter((a) => !assignmentIds || assignmentIds.includes(a.assignmentId))
    .map((a) => ({ ...a, value: alertsForRange(a, range) }))
    .sort((x, y) => y.value - x.value)
  const max = Math.max(...rows.map((r) => r.value), 1)

  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No assignment in scope raised an alert in this period.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map((a) => {
        const assignment = findAssignment(a.assignmentId)
        return (
          <div key={a.assignmentId} className="flex items-center gap-2 text-xs">
            {/* A label, not a link: the bar answers "which queue is loudest today",
                and sending that click to the assignment's settings answers a
                different question. The re-alert table is where a name drills in. */}
            <span
              title={assignment?.name}
              className="w-52 shrink-0 truncate text-right font-medium text-foreground"
            >
              {assignment?.short ?? a.assignmentId}
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="h-4 rounded-[2px] bg-[#ea580c]" style={{ width: `${Math.max((a.value / max) * 100, 2)}%` }} />
              <span className="shrink-0 text-sm tabular-nums text-foreground">{a.value.toLocaleString()}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
