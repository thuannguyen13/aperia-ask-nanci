"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { DRIVER_SUMMARY, EFFECTIVE_RATE, VOLUME, FEES, FEES_TOTAL } from "@/lib/ask-nanci/data/panels/fee-summary"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight, PanelTable, Th, Td, formatCurrency } from "@/components/ask-nanci/shared"

export function FeeSummaryPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const highlighted = usePanelView("fee-summary", "default") === "highlighted"

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
          <PanelTable className="table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="border-b bg-muted/40">
                <Th></Th>
                <Th align="right">April</Th>
                <Th align="right">May</Th>
                <Th align="right">Change</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td></Td>
                <Td align="right" mono>{EFFECTIVE_RATE.april}</Td>
                <Td align="right" mono>{EFFECTIVE_RATE.may}</Td>
                <Td align="right" mono className="text-amber-600 dark:text-amber-400">{EFFECTIVE_RATE.change}</Td>
              </tr>
            </tbody>
          </PanelTable>
        </div>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Volume Processed</p>
          <PanelTable className="table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="border-b bg-muted/40">
                <Th></Th>
                <Th align="right">April</Th>
                <Th align="right">May</Th>
                <Th align="right">Change</Th>
              </tr>
            </thead>
            <tbody>
              <tr className={cn(highlighted ? "bg-blue-50 dark:bg-blue-950/20" : "")}>
                <Td></Td>
                <Td align="right" mono>{formatCurrency(VOLUME.april)}</Td>
                <Td align="right" mono>{formatCurrency(VOLUME.may)}</Td>
                <Td align="right" mono className="text-amber-600 dark:text-amber-400">+{formatCurrency(VOLUME.changeAmount)} (+{VOLUME.changePct}%)</Td>
              </tr>
            </tbody>
          </PanelTable>
        </div>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Fees</p>
          <PanelTable className="table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="border-b bg-muted/40">
                <Th>Fee Type</Th>
                <Th align="right">April</Th>
                <Th align="right">May</Th>
                <Th align="right">Change</Th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </PanelTable>
        </div>
      </div>
    </PanelShell>
  )
}
