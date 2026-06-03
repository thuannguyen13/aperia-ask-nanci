"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { STATUS_ROWS, MERCHANT_ROWS } from "@/lib/ask-nanci/data/panels/barometer"
import { PanelShell, PanelHeader, ScoreBadge } from "@/components/ask-nanci/shared"

export function BarometerReportPanel() {
  const { closePanel, closeAllNewPanels } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Barometer Report"
        actions={
          <button className="rounded-md border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
            Filter
          </button>
        }
        onClose={() => { closePanel("barometer-report"); closeAllNewPanels() }}
      />

      <div className="flex-1 overflow-auto">
        {/* Assignment header */}
        <div className="border-b px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">High Velocity Watch</p>
              <p className="text-xs text-muted-foreground">05/24/2026</p>
            </div>
            <button className="shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
              Assignment Details
            </button>
          </div>

          {/* General info */}
          <div className="rounded-lg border px-3 py-2 space-y-1.5">
            <p className="text-xs font-semibold text-foreground">General Information</p>
            {[
              { label: "Assignment Name",         value: "High Velocity Watch" },
              { label: "Assignment Type",         value: "DQ" },
              { label: "Eligible Merchant Count", value: "14" },
              { label: "Percent Worked",          value: "0%" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">{value}</span>
              </div>
            ))}
          </div>

          {/* Status table */}
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground">Status</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-muted-foreground">Count</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {STATUS_ROWS.map(({ label, count, amount }) => (
                  <tr key={label} className="border-t border-border/50">
                    <td className="px-3 py-2 text-foreground">{label}</td>
                    <td className="px-3 py-2 text-right font-mono text-foreground">{count}</td>
                    <td className="px-3 py-2 text-right font-mono text-foreground">{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Merchant Activity */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Merchant Activity</p>
            <span className="text-[10px] text-muted-foreground">Sorted by risk score</span>
          </div>

          <div className="rounded-md border overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground border-r border-border">Merchant</th>
                <th className="px-2 py-2 text-center text-[10px] font-semibold text-muted-foreground border-r border-border">Score</th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted-foreground border-r border-border">Status</th>
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {MERCHANT_ROWS.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t border-border/40",
                    row.score >= 80 ? "bg-red-50/40 dark:bg-red-950/10" : "",
                    i === 0 ? "font-medium" : "",
                  )}
                >
                  <td className="px-3 py-2 border-r border-border/40">
                    <p className="text-foreground truncate max-w-[140px]">{row.name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{row.id}</p>
                  </td>
                  <td className="px-2 py-2 text-center border-r border-border/40">
                    <ScoreBadge score={row.score} />
                  </td>
                  <td className="px-2 py-2 text-muted-foreground text-[10px] whitespace-nowrap border-r border-border/40">{row.status}</td>
                  <td className="px-2 py-2 text-right font-mono text-foreground">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
