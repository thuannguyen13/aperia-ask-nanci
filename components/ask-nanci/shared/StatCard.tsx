"use client"

import { cn } from "aperia-ds5/utils"

interface StatCardProps {
  label: string
  value: React.ReactNode
  sublabel?: React.ReactNode
  emphasis?: boolean
}

export function StatCard({ label, value, sublabel, emphasis }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-lg border px-3 py-3",
      emphasis ? "border-primary/30 bg-primary/5" : "bg-background",
    )}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  )
}
