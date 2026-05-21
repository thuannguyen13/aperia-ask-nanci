"use client"

import { X, Clock, Layers, Zap, BarChart3, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"

const TRIAGE_GROUPS = [
  { label: "Time-critical",   count: 4,  note: "SLA breach within 2 hours",                    color: "red",   icon: Clock   },
  { label: "Grouped issue",   count: 8,  note: "All Processor X settlement delays",             color: "amber", icon: Layers  },
  { label: "Quick wins",      count: 12, note: "Document approvals, docs already submitted",    color: "green", icon: Zap     },
  { label: "Normal priority", count: 23, note: "Standard service requests",                     color: "slate", icon: BarChart3 },
]

const QUICK_WINS = [
  { id: "SR-4401", merchant: "Blue Oak Brewing",    doc: "Void Check",       valid: true  },
  { id: "SR-4402", merchant: "Harbor View Hotel",    doc: "Business License", valid: true  },
  { id: "SR-4403", merchant: "Summit Auto Group",    doc: "Bank Statement",   valid: false },
  { id: "SR-4404", merchant: "Coastal Fresh Market", doc: "Void Check",       valid: true  },
  { id: "SR-4405", merchant: "Riviera Day Spa",      doc: "Tax ID Letter",    valid: true  },
  { id: "SR-4406", merchant: "Greenfield Hardware",  doc: "Void Check",       valid: true  },
  { id: "SR-4407", merchant: "Westside CrossFit",    doc: "Business License", valid: true  },
  { id: "SR-4408", merchant: "Canyon Road Bakery",   doc: "Bank Statement",   valid: true  },
  { id: "SR-4409", merchant: "Pacific Rim Rest.",    doc: "Void Check",       valid: true  },
  { id: "SR-4410", merchant: "Pinnacle Dental",      doc: "Insurance Form",   valid: true  },
  { id: "SR-4411", merchant: "Blue Oak Brewing 2",   doc: "Void Check",       valid: true  },
  { id: "SR-4412", merchant: "Valley Trade Corp",    doc: "Bank Statement",   valid: false },
]

const OUTAGE_MERCHANTS = [
  "Harbor View Hotel", "Summit Auto Group", "Coastal Fresh Market",
  "Pinnacle Dental", "Pacific Rim Restaurant", "Riviera Day Spa",
  "Blue Oak Brewing", "Greenfield Hardware",
]

export function WorkQueuePanel() {
  const { closePanel, closeAllNewPanels, workQueuePhase } = useAskNanci()

  const totalCount = workQueuePhase === "triage" ? 47 : workQueuePhase === "quick-wins" ? 12 : 8
  const phaseLabel = workQueuePhase === "triage" ? "AI TRIAGE" : workQueuePhase === "quick-wins" ? "QUICK WINS" : "OUTAGE"
  const phaseDotColor = workQueuePhase === "triage" ? "bg-blue-400" : workQueuePhase === "quick-wins" ? "bg-green-400" : "bg-amber-400"
  const badgeCls = workQueuePhase === "triage"
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
    : workQueuePhase === "quick-wins"
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className={cn("size-2 rounded-full shrink-0", phaseDotColor)} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Work Queue</span>
              <span className={cn("rounded px-1.5 py-px text-[9px] font-bold tracking-wide", badgeCls)}>{phaseLabel}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">{totalCount}</span>
              {workQueuePhase === "triage" && " open cases · AI-sorted"}
              {workQueuePhase === "quick-wins" && " document approvals"}
              {workQueuePhase === "outage" && " merchants affected"}
            </p>
          </div>
        </div>
        <button
          onClick={() => { closePanel("work-queue"); closeAllNewPanels() }}
          className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Triage phase */}
      {workQueuePhase === "triage" && (
        <div className="flex-1 overflow-auto px-4 py-3">
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">AI Triage Summary</p>
          <div className="space-y-2">
            {TRIAGE_GROUPS.map(({ label, count, note, color, icon: Icon }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                  color === "red"   ? "border-red-200 bg-red-50 dark:border-red-800/60 dark:bg-red-950/20"
                  : color === "amber" ? "border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/20"
                  : color === "green" ? "border-green-200 bg-green-50 dark:border-green-800/60 dark:bg-green-950/20"
                  : "border-border bg-muted/20",
                )}
              >
                <div className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded",
                  color === "red"   ? "bg-red-100 dark:bg-red-900/40"
                  : color === "amber" ? "bg-amber-100 dark:bg-amber-900/40"
                  : color === "green" ? "bg-green-100 dark:bg-green-900/40"
                  : "bg-muted",
                )}>
                  <Icon className={cn(
                    "size-3.5",
                    color === "red"   ? "text-red-600 dark:text-red-400"
                    : color === "amber" ? "text-amber-600 dark:text-amber-400"
                    : color === "green" ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground",
                  )} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn(
                    "text-xs font-semibold",
                    color === "red"   ? "text-red-800 dark:text-red-300"
                    : color === "amber" ? "text-amber-800 dark:text-amber-300"
                    : color === "green" ? "text-green-800 dark:text-green-300"
                    : "text-foreground",
                  )}>{label}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{note}</p>
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
        </div>
      )}

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
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/20 px-3 py-2.5">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Processor X Outage</p>
            <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-0.5">
              <span className="font-mono">Posted 06:14</span> · ETA: noon · <span className="font-mono font-semibold">8</span> merchants affected
            </p>
          </div>

          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Affected Merchants</p>
          <div className="space-y-1">
            {OUTAGE_MERCHANTS.map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-3 py-2">
                <span className="text-xs text-foreground">{name}</span>
                <span className="rounded-full bg-amber-100 px-2 py-px text-[9px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800/60 dark:bg-blue-950/20 px-3 py-2.5">
            <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">Suggested action ready</p>
            <p className="text-[9px] text-blue-600 dark:text-blue-400 mt-0.5">Notify all 8 · Mark Waiting on Vendor · Auto-close on resolution</p>
          </div>
        </div>
      )}
    </div>
  )
}
