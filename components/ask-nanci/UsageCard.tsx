"use client"

import { Progress } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"

function getTimeUntilMidnight(): string {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const diffMs = midnight.getTime() - now.getTime()
  const hrs = Math.floor(diffMs / (1000 * 60 * 60))
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  if (hrs > 0) return `${hrs} hr ${mins} min`
  return `${mins} min`
}

/**
 * @expected-unused awaiting redesign
 *
 * Unmounted, not dead. Pulled out of the sidebar footer on 2026-08-06; usage is
 * being redesigned and will get its own place to view. Kept so that work starts
 * from the existing card instead of a blank file.
 */
export function UsageCard() {
  const { usage } = useAskNanci()
  const tokenPct = Math.round((usage.tokens.used / usage.tokens.limit) * 100)

  return (
    <div className="rounded-[10px] bg-card border p-3 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col items-start gap-1">
        <p className="text-sm font-semibold text-foreground">Your Usage</p>
        {/* ponytail: the countdown is read at render, so server and client land a
            minute apart and hydration complains. It never ticks anyway, so keep the
            server's value rather than adding mount state for a number that goes stale
            regardless. Swap to a mount effect + interval if it ever needs to count down. */}
        <p className="text-sm text-muted-foreground" suppressHydrationWarning>Resets in {getTimeUntilMidnight()}</p>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs leading-none text-muted-foreground">Tokens Used</span>
          <span className="text-xs leading-none text-foreground">{tokenPct}% Used</span>
        </div>
        <Progress value={tokenPct} className="h-1" />
      </div>
    </div>
  )
}
