"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"

interface StatCardProps {
  label: string
  value: React.ReactNode
  sublabel?: React.ReactNode
  emphasis?: boolean
  /**
   * Severity tint, for a stat that is itself the warning — the Critical count on the
   * Running Low panel, where an amber tile is the point rather than decoration.
   * `emphasis` stays the neutral "this one matters" highlight; per the colour rule,
   * amber means held/review/attention and is never used just to stand out.
   */
  tone?: "amber"
  /**
   * "lg" is the design system's small Card: the label and sublabel head the card and a
   * larger value sits at its foot, level with its neighbours' in a grid row.
   */
  size?: "default" | "lg"
}

export function StatCard({ label, value, sublabel, emphasis, tone, size = "default" }: StatCardProps) {
  const amber = tone === "amber"
  if (size === "lg") {
    return (
      <Card size="sm" className={cn(
        "justify-between shadow-xs",
        amber ? "bg-amber-50 ring-amber-200 dark:bg-amber-950/20 dark:ring-amber-900" : emphasis && "bg-primary/5 ring-primary/30",
      )}>
        <CardHeader>
          <CardTitle>{label}</CardTitle>
          {sublabel && <CardDescription>{sublabel}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className={cn("text-2xl font-bold tabular-nums", amber ? "text-amber-900 dark:text-amber-300" : "text-foreground")}>{value}</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <div className={cn(
      "rounded-lg border px-3 py-3",
      amber
        ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20"
        : emphasis ? "border-primary/30 bg-primary/5" : "bg-background",
    )}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn(
        "mt-1 text-xl font-bold tabular-nums",
        amber ? "text-amber-700 dark:text-amber-400" : "text-foreground",
      )}>{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  )
}
