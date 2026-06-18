"use client"

import { AlertTriangle } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CHANGES, CHANGE_SEVERITY_CLS } from "@/lib/ask-nanci/data/panels/change-log"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"

export function ChangeLogPanel() {
  const { closePanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Account Change Log"
        dot="bg-violet-400"
        badge={{ label: "90 DAYS", className: "rounded bg-violet-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-violet-700 dark:bg-violet-900/40 dark:text-violet-400" }}
        subtitle="Bayside Imports"
        onClose={() => closePanel("change-log")}
      />

      {/* Alert strip */}
      <div className="flex shrink-0 items-center gap-2 border-b bg-amber-50/60 dark:bg-amber-950/10 px-4 py-2">
        <AlertTriangle className="size-3 shrink-0 text-amber-500" />
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          3 changes in 90 days — <span className="font-semibold">1 from internal team</span>
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto px-4 py-3">
        <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Change Timeline</p>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" />

          <div className="space-y-0">
            {CHANGES.map(({ date, code, action, user, role, highlight, icon: Icon, severity }, i) => (
              <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                {/* Icon dot */}
                <div className={cn(
                  "relative z-10 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2",
                  CHANGE_SEVERITY_CLS[severity].dotContainer,
                )}>
                  <Icon className={cn("size-2.5", CHANGE_SEVERITY_CLS[severity].dotIcon)} />
                </div>

                {/* Content */}
                <div className={cn(
                  "flex-1 rounded-lg border px-3 py-2",
                  highlight
                    ? "border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/20"
                    : severity === "high"
                      ? "border-red-200 bg-red-50/50 dark:border-red-800/40 dark:bg-red-950/10"
                      : "border-border/60 bg-muted/20",
                )}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={cn(
                        "text-xs font-semibold",
                        highlight ? "text-amber-800 dark:text-amber-300" : severity === "high" ? "text-red-700 dark:text-red-300" : "text-foreground",
                      )}>{action}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[9px] text-muted-foreground">{code}</span>
                        <span className="text-[9px] text-muted-foreground">·</span>
                        <span className="font-mono text-[9px] text-muted-foreground">{date}</span>
                      </div>
                    </div>
                    {severity === "high" && (
                      <span className="shrink-0 rounded bg-red-100 px-1.5 py-px text-[8px] font-bold tracking-wide text-red-700 dark:bg-red-900/40 dark:text-red-400">FLAGGED</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 border-t border-border/40 pt-1.5">
                    <span className="text-[10px] font-semibold text-foreground">{user}</span>
                    <span className="text-[9px] text-muted-foreground">·</span>
                    <span className={cn(
                      "text-[9px]",
                      highlight ? "font-semibold text-amber-600 dark:text-amber-400" : "text-muted-foreground",
                    )}>{role}</span>
                    {highlight && (
                      <span className="ml-auto rounded bg-amber-100 px-1.5 py-px text-[8px] font-bold tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">INTERNAL</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
