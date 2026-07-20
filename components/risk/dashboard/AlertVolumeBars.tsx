"use client"

import { cn } from "aperia-ds5/utils"
import { ALERT_VOLUME } from "@/lib/ask-nanci/data/risk-dashboard"

// Horizontal bar list (assignment → alert count), per the Figma card (734:28526):
// the top row is emphasized; the rest sit at 40% opacity. Bars are orange #ea580c,
// length proportional to count, with the value at the end.
export function AlertVolumeBars() {
  const max = Math.max(...ALERT_VOLUME.map((a) => a.count))
  return (
    <div className="flex flex-col gap-2">
      {ALERT_VOLUME.map((a, i) => (
        <div key={a.name} className={cn("flex items-center gap-2 text-xs", i > 0 && "opacity-40")}>
          <span className="w-52 shrink-0 truncate text-right font-medium text-primary">{a.name}</span>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="h-4 rounded-[2px] bg-[#ea580c]" style={{ width: `${Math.max((a.count / max) * 100, 2)}%` }} />
            <span className="shrink-0 text-sm tabular-nums text-foreground">{a.count}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
