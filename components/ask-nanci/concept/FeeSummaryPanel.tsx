"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { DRIVER_SUMMARY, EFFECTIVE_RATE, VOLUME, FEES, FEES_TOTAL } from "@/lib/ask-nanci/data/panels/fee-summary"
import { CHARGEBACK } from "@/lib/ask-nanci/data/panels/chargeback-status"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight, Callout, PanelFigureTable, Td, formatCurrency } from "@/components/shared"

// How long the volume row stays tinted before it fades on its own — the flow
// reads it aloud, then it clears so the panel returns to a neutral state.
const HIGHLIGHT_MS = 2600

export function FeeSummaryPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("fee-summary", "default")

  // Show the highlight briefly when the flow sets it, then drop it on a timer.
  const [highlighted, setHighlighted] = useState(false)
  useEffect(() => {
    if (view !== "highlighted") { setHighlighted(false); return }
    setHighlighted(true)
    const t = setTimeout(() => setHighlighted(false), HIGHLIGHT_MS)
    return () => clearTimeout(t)
  }, [view])

  return (
    <PanelShell>
      <PanelHeader
        title="Fee Summary"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("fee-summary")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-5">
          <NanciInsight>
                <span className="font-bold">+{formatCurrency(DRIVER_SUMMARY.deltaAmount)} vs April</span> — almost all of it is volume. You processed {DRIVER_SUMMARY.volumeChangePct}% more transactions this month. Your effective rate held roughly steady at {EFFECTIVE_RATE.april}–{EFFECTIVE_RATE.may}; the small uptick is entirely the one-time {formatCurrency(DRIVER_SUMMARY.chargebackFee)} chargeback fee from a dispute on May 3, not a pricing change.
          </NanciInsight>

          <div>
            <p className="mb-2 text-base font-bold text-foreground">Effective Rate</p>
            <PanelFigureTable headers={["", "April", "May", "Change"]}>
              <tr>
                <Td></Td>
                <Td align="right" mono>{EFFECTIVE_RATE.april}</Td>
                <Td align="right" mono>{EFFECTIVE_RATE.may}</Td>
                <Td align="right" mono className="text-amber-600 dark:text-amber-400">{EFFECTIVE_RATE.change}</Td>
              </tr>
            </PanelFigureTable>
          </div>

          <div>
            <p className="mb-2 text-base font-bold text-foreground">Volume Processed</p>
            <PanelFigureTable headers={["", "April", "May", "Change"]}>
              <tr className={cn("transition-colors duration-500", highlighted ? "bg-blue-50 dark:bg-blue-950/20" : "")}>
                <Td></Td>
                <Td align="right" mono>{formatCurrency(VOLUME.april)}</Td>
                <Td align="right" mono>{formatCurrency(VOLUME.may)}</Td>
                <Td align="right" mono className="text-amber-600 dark:text-amber-400">+{formatCurrency(VOLUME.changeAmount)} (+{VOLUME.changePct}%)</Td>
              </tr>
            </PanelFigureTable>
          </div>

          <div>
            <p className="mb-2 text-base font-bold text-foreground">Fees</p>
            <PanelFigureTable headers={["Fee Type", "April", "May", "Change"]}>
                {FEES.map((fee) => (
                  <tr key={fee.type}>
                    <Td>
                      <p className="text-foreground">{fee.type}</p>
                      <p className="text-xs text-muted-foreground">{fee.sublabel}</p>
                    </Td>
                    <Td align="right" mono className="align-top">{formatCurrency(fee.april)}</Td>
                    <Td align="right" mono className="align-top">{formatCurrency(fee.may)}</Td>
                    <Td align="right" mono className="align-top text-amber-600 dark:text-amber-400">
                      {fee.change == null ? "—" : `+${formatCurrency(fee.change)}`}
                    </Td>
                  </tr>
                ))}
                <tr className="bg-muted/40">
                  <Td className="font-semibold">Total</Td>
                  <Td align="right" mono className="font-semibold">{formatCurrency(FEES_TOTAL.april)}</Td>
                  <Td align="right" mono className="font-semibold">{formatCurrency(FEES_TOTAL.may)}</Td>
                  <Td align="right" mono className="font-semibold text-amber-600 dark:text-amber-400">+{formatCurrency(FEES_TOTAL.change)}</Td>
                </tr>
            </PanelFigureTable>
          </div>
        {/* Chargeback detail — the answer to "show me that chargeback"; renders inline
            as the reason this view opened (green-tinted = resolved in the merchant's favor). */}
        {view === "chargeback" && (
          <div className="flex flex-col gap-3">
            <p className="text-base font-bold text-foreground">{formatCurrency(CHARGEBACK.amount)} chargeback fee · {CHARGEBACK.disputeDate}</p>
            <Callout variant="green">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 shrink-0" />
                {CHARGEBACK.resolution} — {CHARGEBACK.creditNote}
              </div>
            </Callout>
            <div className="rounded-xl border bg-background p-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  ["Case", CHARGEBACK.caseId],
                  ["Amount", formatCurrency(CHARGEBACK.amount)],
                  ["Dispute Date", CHARGEBACK.disputeDate],
                  ["Status", "Closed — merchant favor"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-mono text-xs font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PanelShell>
  )
}
