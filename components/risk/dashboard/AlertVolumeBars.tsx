"use client"

import { ALERT_VOLUME } from "@/lib/ask-nanci/data/risk-dashboard"

// Horizontal bar list (assignment → alert count). Top bar (highest) is emphasized.
// Plain flex bars — lighter than pulling Recharts in for a ranked list.
export function AlertVolumeBars() {
  const max = Math.max(...ALERT_VOLUME.map((a) => a.count))
  return (
    <div className="flex flex-col gap-2">
      {ALERT_VOLUME.map((a, i) => (
        <div key={a.name} className="flex items-center gap-3 text-xs">
          <span className="w-56 shrink-0 truncate text-right text-primary">{a.name}</span>
          <div className="flex flex-1 items-center gap-2">
            <div
              className={`h-4 rounded-sm ${i === 0 ? "bg-orange-500" : "bg-orange-300 dark:bg-orange-500/50"}`}
              style={{ width: `${Math.max((a.count / max) * 100, 2)}%` }}
            />
            <span className="tabular-nums text-muted-foreground">{a.count}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
