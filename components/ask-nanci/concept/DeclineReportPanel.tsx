"use client"

import { Download } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ALL_MERCHANTS, FILTERED } from "@/lib/ask-nanci/data/panels/decline-report"
import { PanelShell, PanelHeader, PanelTable, Th, Td, formatPercent } from "@/components/ask-nanci/shared"

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
      <PanelHeader
        title="High-Decline Merchants"
        dot="bg-red-400"
        badge={{ label: rows.length, className: "rounded bg-red-100 px-1.5 py-px font-mono text-[9px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400" }}
        subtitle={
          <span className="flex items-center gap-1.5">
            Last week · Above 15%
            {declineReportFiltered && (
              <span className="rounded bg-amber-100 px-1.5 py-px text-[9px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Not contacted 30+ days</span>
            )}
          </span>
        }
        onClose={() => closePanel("decline-report")}
      />

      {/* Table */}
      <div className="flex-1 overflow-auto px-4 py-3">
        <PanelTable>
          <thead>
            <tr className="border-b bg-muted/40">
              <Th>Merchant</Th>
              <Th>ISO</Th>
              <Th align="right">Rate</Th>
              <Th align="right">Contact</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const { pct, color } = rateBar(row.rate)
              return (
                <tr key={i} className="hover:bg-muted/30 group">
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-[32px] h-1.5 rounded-full bg-muted overflow-hidden shrink-0">
                        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-foreground truncate max-w-[110px]">{row.name}</span>
                    </div>
                  </Td>
                  <Td className="text-muted-foreground">{row.iso}</Td>
                  <Td align="right" mono className={cn("font-semibold", rateColor(row.rate))}>
                    {formatPercent(row.rate)}
                  </Td>
                  <Td align="right" mono className="text-muted-foreground">{row.contact}</Td>
                </tr>
              )
            })}
          </tbody>
        </PanelTable>
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
