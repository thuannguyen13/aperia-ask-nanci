"use client"

import { X, Download } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ALL_MERCHANTS, FILTERED } from "@/lib/ask-nanci/data/panels/decline-report"
import { PanelShell } from "@/components/ask-nanci/shared"

function rateColor(r: number) {
  if (r >= 25) return "text-red-600 dark:text-red-400"
  if (r >= 20) return "text-orange-500 dark:text-orange-400"
  if (r >= 18) return "text-amber-600 dark:text-amber-400"
  return "text-foreground"
}

function rateBar(r: number) {
  const pct = Math.min(100, (r / 35) * 100)
  const color = r >= 25 ? "bg-red-400" : r >= 20 ? "bg-orange-400" : r >= 18 ? "bg-amber-400" : "bg-muted-foreground/40"
  return { pct, color }
}

export function DeclineReportPanel() {
  const { closePanel, declineReportFiltered } = useAskNanci()
  const rows = declineReportFiltered ? FILTERED : ALL_MERCHANTS

  return (
    <PanelShell>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-2 rounded-full bg-red-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">High-Decline Merchants</span>
              <span className="rounded bg-red-100 px-1.5 py-px font-mono text-[9px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400">{rows.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-muted-foreground">Last week · Above 15%</p>
              {declineReportFiltered && (
                <span className="rounded bg-amber-100 px-1.5 py-px text-[9px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Not contacted 30+ days</span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => closePanel("decline-report")} className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Close">
          <X className="size-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 bg-muted/60 backdrop-blur z-10">
            <tr>
              <th className="px-4 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Merchant</th>
              <th className="px-2 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">ISO</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Rate</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Contact</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const { pct, color } = rateBar(row.rate)
              return (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 group">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-[32px] h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-foreground truncate max-w-[110px]">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-muted-foreground">{row.iso}</td>
                  <td className={cn("px-3 py-2 text-right font-mono font-semibold", rateColor(row.rate))}>
                    {row.rate.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">{row.contact}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t px-4 py-2.5">
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="size-3.5" /> Export CSV
        </button>
      </div>
    </PanelShell>
  )
}
