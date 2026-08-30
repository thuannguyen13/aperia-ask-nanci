"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { FLAGS, flagCount, criticalCount, mediumCount, FLAG_SEVERITY_CLS } from "@/lib/ask-nanci/data/panels/risk-flags"
import { PanelShell, PanelHeader } from "@/components/shared"

export function RiskFlagsPanel() {
  const { closePanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Bayside Imports"
        dot="bg-red-500 ring-2 ring-red-200 dark:ring-red-800"
        badge={{ label: "HIGH RISK", className: "rounded bg-red-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-red-700 dark:bg-red-900/40 dark:text-red-400" }}
        subtitle="Investigation · 90-day window"
        onClose={() => closePanel("risk-flags")}
      />

      {/* Score strip */}
      <div className="flex shrink-0 items-center gap-4 border-b bg-red-50/50 dark:bg-red-950/10 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-lg font-bold text-red-600 dark:text-red-400">{flagCount}</span>
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
        {FLAGS.map(({ icon: Icon, label, detail, severity }, i) => {
          const cls = FLAG_SEVERITY_CLS[severity]
          return (
            <div key={i} className={cn("flex items-start gap-2.5 rounded-lg border px-3 py-2.5", cls.row)}>
              <div className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded", cls.iconBg)}>
                <Icon className={cn("size-3", cls.iconText)} />
              </div>
              <div className="min-w-0">
                <p className={cn("text-xs font-semibold", cls.label)}>{label}</p>
                <p className={cn("text-[10px] mt-0.5", cls.detail)}>{detail}</p>
              </div>
              <div className={cn("mt-1.5 size-1.5 rounded-full shrink-0", cls.dot)} />
            </div>
          )
        })}
      </div>
    </PanelShell>
  )
}
