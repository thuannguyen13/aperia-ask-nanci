"use client"

import { Clock, Layers, Zap, BarChart3, ShieldAlert } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW12_CONTINUE_KEY } from "@/lib/ask-nanci/concept-config"

const TRIAGE_GROUPS = [
  { label: "Time-critical",   count: 4,  note: "SLA breach within 2 hours",           color: "red",   icon: Clock     },
  { label: "Grouped issue",   count: 8,  note: "Processor X settlement delays",        color: "amber", icon: Layers    },
  { label: "Quick wins",      count: 12, note: "Document approvals already submitted", color: "green", icon: Zap       },
  { label: "Normal priority", count: 23, note: "Standard service requests",            color: "slate", icon: BarChart3 },
]

export function AiTriageSummaryWidget() {
  const { handlePrompt } = useAskNanci()

  return (
    <div className="mt-3 space-y-2">
      {/* 2×2 triage grid */}
      <div className="grid grid-cols-2 gap-2">
        {TRIAGE_GROUPS.map(({ label, count, note, color, icon: Icon }) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3 py-2.5",
              color === "red"   ? "border-red-200 bg-red-50 dark:border-red-800/60 dark:bg-red-950/20"
              : color === "amber" ? "border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/20"
              : color === "green" ? "border-green-200 bg-green-50 dark:border-green-800/60 dark:bg-green-950/20"
              : "border-border bg-muted/30",
            )}
          >
            <div className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-lg",
              color === "red"   ? "bg-red-100 dark:bg-red-900/40"
              : color === "amber" ? "bg-amber-100 dark:bg-amber-900/40"
              : color === "green" ? "bg-green-100 dark:bg-green-900/40"
              : "bg-muted",
            )}>
              <Icon className={cn(
                "size-3",
                color === "red"   ? "text-red-600 dark:text-red-400"
                : color === "amber" ? "text-amber-600 dark:text-amber-400"
                : color === "green" ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground",
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={cn(
                "text-[11px] font-semibold leading-tight",
                color === "red"   ? "text-red-800 dark:text-red-300"
                : color === "amber" ? "text-amber-800 dark:text-amber-300"
                : color === "green" ? "text-green-800 dark:text-green-300"
                : "text-foreground",
              )}>{label}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{note}</p>
            </div>
            <span className={cn(
              "font-mono text-xl font-bold shrink-0",
              color === "red"   ? "text-red-600 dark:text-red-400"
              : color === "amber" ? "text-amber-600 dark:text-amber-400"
              : color === "green" ? "text-green-600 dark:text-green-400"
              : "text-foreground",
            )}>{count}</span>
          </div>
        ))}
      </div>

      {/* Detection Queue card */}
      <button
        onClick={() => handlePrompt(CONCEPT_FLOW12_CONTINUE_KEY)}
        className="w-full rounded-xl border border-violet-200 bg-violet-50 dark:border-violet-800/50 dark:bg-violet-950/20 px-3 py-2.5 text-left transition-colors hover:bg-violet-100 dark:hover:bg-violet-900/30 group"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
            <ShieldAlert className="size-3 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-semibold text-violet-800 dark:text-violet-300">Detection Queue</p>
              <span className="rounded-full bg-violet-200 dark:bg-violet-800/60 px-1.5 py-px text-[9px] font-bold tracking-wide text-violet-700 dark:text-violet-300">ACTIVE</span>
            </div>
            <p className="text-[9px] text-violet-700 dark:text-violet-400 mt-0.5 leading-tight">
              High Velocity Watch · <span className="font-semibold text-red-600 dark:text-red-400">3 high-risk</span> · 0 worked
            </p>
          </div>
          <span className="font-mono text-xl font-bold shrink-0 text-violet-600 dark:text-violet-400">14</span>
        </div>
      </button>
    </div>
  )
}
