"use client"

import { cn } from "aperia-ds5/utils"

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span className={cn(
      "inline-block rounded-full px-2 py-0.5 text-[10px] font-bold font-mono",
      score >= 80
        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        : score >= 60
          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          : "bg-muted text-muted-foreground",
    )}>
      {score}
    </span>
  )
}
