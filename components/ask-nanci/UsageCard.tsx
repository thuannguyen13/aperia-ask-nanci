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

export function UsageCard() {
  const { usage } = useAskNanci()
  const tokenPct = Math.round((usage.tokens.used / usage.tokens.limit) * 100)

  return (
    <div className="rounded-[10px] bg-card border p-3 shadow-sm flex flex-col gap-2">
      <div>
        <p className="text-sm font-semibold text-foreground">Your Usage</p>
        <p className="text-[11px] text-muted-foreground">Resets in {getTimeUntilMidnight()}</p>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Tokens Used</span>
          <span className="text-[11px] font-medium text-foreground">{tokenPct}% Used</span>
        </div>
        <Progress value={tokenPct} className="h-1" />
      </div>
    </div>
  )
}
