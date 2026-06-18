"use client"

import { CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { QUICK_WINS, OUTAGE_MERCHANTS } from "@/lib/ask-nanci/data/panels/work-queue"
import { PanelShell, PanelHeader, Callout } from "@/components/ask-nanci/shared"

const PHASE_CLS = {
  "quick-wins": { dot: "bg-green-400", badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400", label: "QUICK WINS", count: 12, subtitle: " document approvals" },
  outage:       { dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", label: "OUTAGE",      count: 8,  subtitle: " merchants affected"  },
} as const

export function WorkQueuePanel() {
  const { closePanel, closeAllNewPanels, workQueuePhase } = useAskNanci()
  const phase = PHASE_CLS[workQueuePhase as keyof typeof PHASE_CLS] ?? PHASE_CLS["outage"]

  return (
    <PanelShell>
      <PanelHeader
        title="Work Queue"
        dot={phase.dot}
        badge={{ label: phase.label, className: cn("rounded px-1.5 py-px text-[9px] font-bold tracking-wide", phase.badge) }}
        subtitle={<><span className="font-mono font-semibold text-foreground">{phase.count}</span>{phase.subtitle}</>}
        onClose={() => { closePanel("work-queue"); closeAllNewPanels() }}
      />

      {/* Quick-wins phase */}
      {workQueuePhase === "quick-wins" && (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-muted/60 backdrop-blur z-10">
              <tr>
                <th className="px-4 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Merchant</th>
                <th className="px-2 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Doc</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">AI Read</th>
              </tr>
            </thead>
            <tbody>
              {QUICK_WINS.map((row) => (
                <tr key={row.id} className={cn(
                  "border-b border-border/50 hover:bg-muted/30",
                  !row.valid ? "bg-amber-50/60 dark:bg-amber-950/10" : "",
                )}>
                  <td className="px-4 py-2">
                    <p className="text-foreground font-medium truncate max-w-[120px]">{row.merchant}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{row.id}</p>
                  </td>
                  <td className="px-2 py-2 text-muted-foreground text-[10px]">{row.doc}</td>
                  <td className="px-3 py-2 text-right">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold",
                      row.valid
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    )}>
                      {row.valid
                        ? <CheckCircle2 className="size-2.5" />
                        : <AlertCircle className="size-2.5" />}
                      {row.valid ? "Valid" : "Review"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Outage phase */}
      {workQueuePhase === "outage" && (
        <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
          <Callout variant="amber" className="rounded-lg px-3 py-2.5 text-xs">
            <p className="font-semibold">Processor X Outage</p>
            <p className="text-[9px] mt-0.5">
              <span className="font-mono">Posted 06:14</span> · ETA: noon · <span className="font-mono font-semibold">8</span> merchants affected
            </p>
          </Callout>

          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Affected Merchants</p>
          <div className="space-y-1">
            {OUTAGE_MERCHANTS.map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-3 py-2">
                <span className="text-xs text-foreground">{name}</span>
                <span className="rounded-full bg-amber-100 px-2 py-px text-[9px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>
              </div>
            ))}
          </div>

          <Callout variant="blue" className="rounded-lg px-3 py-2.5 text-[10px]">
            <p className="font-semibold">Suggested action ready</p>
            <p className="text-[9px] mt-0.5">Notify all 8 · Mark Waiting on Vendor · Auto-close on resolution</p>
          </Callout>
        </div>
      )}
    </PanelShell>
  )
}
