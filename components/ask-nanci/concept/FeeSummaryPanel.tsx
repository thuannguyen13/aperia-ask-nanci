"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { DRIVER_SUMMARY, EFFECTIVE_RATE, VOLUME, FEES, FEES_TOTAL } from "@/lib/ask-nanci/data/panels/fee-summary"
import { PanelShell, PanelHeader, PanelExportButton, Callout, formatCurrency } from "@/components/ask-nanci/shared"

export function FeeSummaryPanel() {
  const { closeDynamicPanel, feeVolumeRowHighlighted } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Fee Summary"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("fee-summary")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <Callout variant="blue">
          Fees rose {formatCurrency(DRIVER_SUMMARY.deltaAmount)} vs. April — almost all of it from volume being up {DRIVER_SUMMARY.volumeChangePct}%. Your rate did not change.
        </Callout>

        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Effective Rate</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground"></th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">April</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">May</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 font-medium text-foreground">Effective Rate</td>
                <td className="px-3 py-2 text-right font-mono text-muted-foreground">{EFFECTIVE_RATE.april}</td>
                <td className="px-3 py-2 text-right font-mono text-foreground">{EFFECTIVE_RATE.may}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Volume Processed</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground"></th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">April</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">May</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className={cn(feeVolumeRowHighlighted ? "bg-blue-50 dark:bg-blue-950/20" : "")}>
                <td className="px-3 py-2 font-medium text-foreground">Volume</td>
                <td className="px-3 py-2 text-right font-mono text-muted-foreground">{formatCurrency(VOLUME.april)}</td>
                <td className="px-3 py-2 text-right font-mono text-foreground">{formatCurrency(VOLUME.may)}</td>
                <td className="px-3 py-2 text-right font-mono font-medium text-blue-600 dark:text-blue-400">+{VOLUME.changePct}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Fees</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Fee Type</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">April</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">May</th>
              </tr>
            </thead>
            <tbody>
              {FEES.map((fee) => (
                <tr key={fee.type} className={cn("border-b last:border-0", fee.highlighted ? "bg-amber-50 dark:bg-amber-950/20" : "")}>
                  <td className="px-3 py-2 text-foreground">{fee.type}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">{formatCurrency(fee.april)}</td>
                  <td className={cn("px-3 py-2 text-right font-mono", fee.highlighted ? "font-semibold text-amber-700 dark:text-amber-400" : "text-foreground")}>
                    {formatCurrency(fee.may)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2">
                <td className="px-3 py-2 font-semibold text-foreground">Total</td>
                <td className="px-3 py-2 text-right font-mono font-semibold text-muted-foreground">{formatCurrency(FEES_TOTAL.april)}</td>
                <td className="px-3 py-2 text-right font-mono font-semibold text-foreground">{formatCurrency(FEES_TOTAL.may)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PanelShell>
  )
}
