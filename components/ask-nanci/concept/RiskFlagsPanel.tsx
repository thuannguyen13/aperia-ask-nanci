"use client"

import { X } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { FLAGS, criticalCount, mediumCount } from "@/lib/ask-nanci/data/panels/risk-flags"
import { PanelShell } from "@/components/ask-nanci/shared"

export function RiskFlagsPanel() {
  const { closePanel } = useAskNanci()

  return (
    <PanelShell>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-2 rounded-full bg-red-500 shrink-0 ring-2 ring-red-200 dark:ring-red-800" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground truncate">Bayside Imports</span>
              <span className="rounded bg-red-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-red-700 dark:bg-red-900/40 dark:text-red-400">HIGH RISK</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Investigation · 90-day window</p>
          </div>
        </div>
        <button onClick={() => closePanel("risk-flags")} className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Close">
          <X className="size-3.5" />
        </button>
      </div>

      {/* Score strip */}
      <div className="flex shrink-0 items-center gap-4 border-b bg-red-50/50 dark:bg-red-950/10 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-lg font-bold text-red-600 dark:text-red-400">6</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wide">flags</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px]">
            <span className="size-1.5 rounded-full bg-red-500 inline-block" />
            <span className="text-muted-foreground">{criticalCount} critical</span>
          </span>
          <span className="flex items-center gap-1 text-[10px]">
            <span className="size-1.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-muted-foreground">{mediumCount} medium</span>
          </span>
        </div>
      </div>

      {/* Flags */}
      <div className="flex-1 overflow-auto px-3 py-2.5 space-y-1.5">
        {FLAGS.map(({ icon: Icon, label, detail, severity }, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
              severity === "critical"
                ? "border-red-200 bg-red-50 dark:border-red-800/60 dark:bg-red-950/20"
                : "border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/20",
            )}
          >
            <div className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded",
              severity === "critical" ? "bg-red-100 dark:bg-red-900/40" : "bg-amber-100 dark:bg-amber-900/40",
            )}>
              <Icon className={cn("size-3", severity === "critical" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")} />
            </div>
            <div className="min-w-0">
              <p className={cn("text-xs font-semibold", severity === "critical" ? "text-red-800 dark:text-red-300" : "text-amber-800 dark:text-amber-300")}>
                {label}
              </p>
              <p className={cn("text-[10px] mt-0.5", severity === "critical" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")}>
                {detail}
              </p>
            </div>
            <div className={cn("mt-1.5 size-1.5 rounded-full shrink-0", severity === "critical" ? "bg-red-500" : "bg-amber-500")} />
          </div>
        ))}
      </div>
    </PanelShell>
  )
}
