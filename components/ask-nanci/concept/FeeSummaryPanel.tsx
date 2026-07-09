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

      <div className="flex-1 overflow-auto px-4 py-3 space-y-5">
        <Callout variant="blue">
          <span className="font-bold">+{formatCurrency(DRIVER_SUMMARY.deltaAmount)} vs April</span> — almost all of it is volume. You processed {DRIVER_SUMMARY.volumeChangePct}% more transactions this month. Your effective rate held roughly steady at {EFFECTIVE_RATE.april}–{EFFECTIVE_RATE.may}; the small uptick is entirely the one-time {formatCurrency(DRIVER_SUMMARY.chargebackFee)} chargeback fee from a dispute on May 3, not a pricing change.
        </Callout>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Effective Rate</p>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-3 py-2 text-center font-medium text-foreground">April</th>
                  <th className="px-3 py-2 text-center font-medium text-foreground">May</th>
                  <th className="px-3 py-2 text-center font-medium text-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2 text-center text-foreground">{EFFECTIVE_RATE.april}</td>
                  <td className="px-3 py-2 text-center text-foreground">{EFFECTIVE_RATE.may}</td>
                  <td className="px-3 py-2 text-center text-amber-600 dark:text-amber-400">{EFFECTIVE_RATE.change}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Volume Processed</p>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-3 py-2 text-center font-medium text-foreground">April</th>
                  <th className="px-3 py-2 text-center font-medium text-foreground">May</th>
                  <th className="px-3 py-2 text-center font-medium text-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className={cn(feeVolumeRowHighlighted ? "bg-blue-50 dark:bg-blue-950/20" : "")}>
                  <td className="px-3 py-2 text-center text-foreground">{formatCurrency(VOLUME.april)}</td>
                  <td className="px-3 py-2 text-center text-foreground">{formatCurrency(VOLUME.may)}</td>
                  <td className="px-3 py-2 text-center text-amber-600 dark:text-amber-400">+{formatCurrency(VOLUME.changeAmount)} (+{VOLUME.changePct}%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Fees</p>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-3 py-2 text-left font-medium text-foreground">Fee Type</th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">April</th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">May</th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                {FEES.map((fee) => (
                  <tr key={fee.type} className="border-b last:border-0">
                    <td className="px-3 py-2">
                      <p className="text-foreground">{fee.type}</p>
                      <p className="text-xs text-muted-foreground">{fee.sublabel}</p>
                    </td>
                    <td className="px-3 py-2 text-right align-top text-foreground">{formatCurrency(fee.april)}</td>
                    <td className="px-3 py-2 text-right align-top text-foreground">{formatCurrency(fee.may)}</td>
                    <td className="px-3 py-2 text-right align-top text-amber-600 dark:text-amber-400">
                      {fee.change == null ? "—" : `+${formatCurrency(fee.change)}`}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/40">
                  <td className="px-3 py-2 font-semibold text-foreground">Total</td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground">{formatCurrency(FEES_TOTAL.april)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-foreground">{formatCurrency(FEES_TOTAL.may)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-amber-600 dark:text-amber-400">+{formatCurrency(FEES_TOTAL.change)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
