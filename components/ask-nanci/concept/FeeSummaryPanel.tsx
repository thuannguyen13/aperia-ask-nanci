"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, X } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { DRIVER_SUMMARY, EFFECTIVE_RATE, VOLUME, FEES, FEES_TOTAL } from "@/lib/ask-nanci/data/panels/fee-summary"
import { CHARGEBACK } from "@/lib/ask-nanci/data/panels/chargeback-status"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight, Callout, PanelTable, Th, Td, formatCurrency } from "@/components/ask-nanci/shared"

// How long the volume row stays tinted before it fades on its own — the flow
// reads it aloud, then it clears so the panel returns to a neutral state.
const HIGHLIGHT_MS = 2600

export function FeeSummaryPanel() {
  const { closeDynamicPanel, clearPanelView } = useAskNanci()
  const view = usePanelView("fee-summary", "default")

  // Show the highlight briefly when the flow sets it, then drop it on a timer.
  const [highlighted, setHighlighted] = useState(false)
  useEffect(() => {
    if (view !== "highlighted") { setHighlighted(false); return }
    setHighlighted(true)
    const t = setTimeout(() => setHighlighted(false), HIGHLIGHT_MS)
    return () => clearTimeout(t)
  }, [view])

  // vaul renders the drawer into this element (callback ref → re-render once set);
  // the translateZ containing block keeps its fixed overlay + content inside the panel.
  const [drawerHost, setDrawerHost] = useState<HTMLDivElement | null>(null)

  return (
    <PanelShell>
      <PanelHeader
        title="Fee Summary"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("fee-summary")}
      />

      <div ref={setDrawerHost} className="relative flex-1 overflow-hidden [transform:translateZ(0)] [&_[data-slot=drawer-overlay]]:!bg-black/40">
        <div className="h-full overflow-auto px-4 py-3 space-y-5">
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
                <tr className={cn("transition-colors duration-500", highlighted ? "bg-blue-50 dark:bg-blue-950/20" : "")}>
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

        {/* Chargeback detail — too small for its own panel, so it slides in as a
            right drawer contained within this panel (dim overlay via modal). */}
        <Drawer
          direction="right"
          open={view === "chargeback"}
          onOpenChange={(open) => { if (!open) clearPanelView("fee-summary") }}
          container={drawerHost}
        >
          <DrawerContent className="absolute data-[vaul-drawer-direction=right]:inset-y-2 data-[vaul-drawer-direction=right]:right-2 data-[vaul-drawer-direction=right]:w-[320px] data-[vaul-drawer-direction=right]:max-w-[85%] data-[vaul-drawer-direction=right]:rounded-xl data-[vaul-drawer-direction=right]:border">
            <DrawerHeader className="flex-row items-center justify-between gap-2 border-b py-3">
              <DrawerTitle className="text-sm">{formatCurrency(CHARGEBACK.amount)} Chargeback Fee</DrawerTitle>
              <DrawerClose className="text-muted-foreground hover:text-foreground" aria-label="Close">
                <X className="size-4" />
              </DrawerClose>
            </DrawerHeader>

            <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
              <Callout variant="green">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 shrink-0" />
                  {CHARGEBACK.resolution} — {CHARGEBACK.creditNote}
                </div>
              </Callout>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {[
                  ["Case", CHARGEBACK.caseId],
                  ["Amount", formatCurrency(CHARGEBACK.amount)],
                  ["Dispute Date", CHARGEBACK.disputeDate],
                  ["Status", "Closed — merchant favor"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[9px] text-muted-foreground">{label}</p>
                    <p className="font-mono text-xs font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </PanelShell>
  )
}
