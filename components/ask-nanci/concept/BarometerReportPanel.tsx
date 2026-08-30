"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ASSIGNMENT, STATUS_ROWS, MERCHANT_ROWS, eligibleMerchantCount } from "@/lib/ask-nanci/data/panels/barometer"
import { PanelShell, PanelHeader, ScoreBadge, PanelTable, Th, Td } from "@/components/shared"

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
              <p className="text-sm font-semibold text-foreground">{ASSIGNMENT.name}</p>
              <p className="text-xs text-muted-foreground">{ASSIGNMENT.date}</p>
            </div>
            <button className="shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
              Assignment Details
            </button>
          </div>

          {/* General info */}
          <div className="rounded-lg border px-3 py-2 space-y-1.5">
            <p className="text-xs font-semibold text-foreground">General Information</p>
            {ASSIGNMENT.generalInfo.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">{value}</span>
              </div>
            ))}
          </div>

          {/* Status table */}
          <PanelTable>
            <thead>
              <tr className="border-b bg-muted/40">
                <Th>Status</Th>
                <Th align="right">Count</Th>
                <Th align="right">Amount</Th>
              </tr>
            </thead>
            <tbody>
              {STATUS_ROWS.map(({ label, count, amount }) => (
                <tr key={label}>
                  <Td>{label}</Td>
                  <Td align="right" mono>{count}</Td>
                  <Td align="right" mono>{amount}</Td>
                </tr>
              ))}
            </tbody>
          </PanelTable>
        </div>

        {/* Merchant Activity */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Merchant Activity</p>
            <span className="text-[10px] text-muted-foreground">Top {MERCHANT_ROWS.length} of {eligibleMerchantCount} by risk score</span>
          </div>

          <PanelTable>
            <thead>
              <tr className="border-b bg-muted/40">
                <Th>Merchant</Th>
                <Th align="right">Score</Th>
                <Th>Status</Th>
                <Th align="right">Amount</Th>
              </tr>
            </thead>
            <tbody>
              {MERCHANT_ROWS.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    row.score >= 80 ? "bg-red-50/40 dark:bg-red-950/10" : "",
                    i === 0 ? "font-medium" : "",
                  )}
                >
                  <Td>
                    <p className="text-foreground truncate max-w-[140px]">{row.name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{row.id}</p>
                  </Td>
                  <Td align="right"><ScoreBadge score={row.score} /></Td>
                  <Td className="text-muted-foreground whitespace-nowrap">{row.status}</Td>
                  <Td align="right" mono>{row.amount}</Td>
                </tr>
              ))}
            </tbody>
          </PanelTable>
        </div>
      </div>
    </PanelShell>
  )
}
