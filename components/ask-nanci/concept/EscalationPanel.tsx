"use client"

import { Phone, Ticket, CheckCircle2 } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { PAYOUT_DISCREPANCY, ESCALATION_PATHS, ESCALATION_BOOKING } from "@/lib/ask-nanci/data/panels/escalation"
import { PanelShell, PanelHeader, PanelExportButton, PanelTable, Th, Callout, formatCurrency } from "@/components/ask-nanci/shared"

const PATH_ICONS = { call: Phone, ticket: Ticket } as const

const DETAIL_ROWS: [string, string][] = [
  ["Batch Date", PAYOUT_DISCREPANCY.batchDate],
  ["Transactions", String(PAYOUT_DISCREPANCY.transactions)],
  ["Gross Sales", formatCurrency(PAYOUT_DISCREPANCY.grossSales)],
  ["Fees", formatCurrency(PAYOUT_DISCREPANCY.fees)],
  ["Destination", `**** ${PAYOUT_DISCREPANCY.destinationLast4}`],
  ["Net Amount (Expected)", formatCurrency(PAYOUT_DISCREPANCY.netExpected)],
  ["Received", formatCurrency(PAYOUT_DISCREPANCY.received)],
]

export function EscalationPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("escalation", "detail")

  return (
    <PanelShell>
      <PanelHeader
        title="Payout Discrepancy"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("escalation")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <p className="text-sm font-semibold text-foreground">Batch {PAYOUT_DISCREPANCY.batchId}</p>

        <PanelTable>
          <thead>
            <tr className="border-b bg-muted/40">
              <Th>Fee Type</Th>
              <Th>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {DETAIL_ROWS.map(([label, value]) => (
              <tr key={label} className="border-b last:border-0">
                <td className="px-3 py-2 text-foreground">{label}</td>
                <td className="px-3 py-2 font-mono text-foreground">{value}</td>
              </tr>
            ))}
            <tr className="bg-red-50 dark:bg-red-950/20">
              <td className="px-3 py-2 font-medium text-foreground">Short</td>
              <td className="px-3 py-2 font-mono font-semibold text-red-600 dark:text-red-400">{formatCurrency(PAYOUT_DISCREPANCY.short)}</td>
            </tr>
          </tbody>
        </PanelTable>

        {(view === "paths" || view === "booked") && (
          <div>
            <p className="mb-2 text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Escalate to Settlement Team</p>
            <div className="space-y-2">
              {ESCALATION_PATHS.map((path) => {
                const Icon = PATH_ICONS[path.id]
                const chosen = view === "booked" && path.id === "call"
                return (
                  <div
                    key={path.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                      chosen ? "border-primary bg-primary/5" : "border-border",
                    )}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">{path.label}</p>
                      <p className="text-[10px] text-muted-foreground">{path.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view === "booked" && (
          <Callout variant="green" className="flex flex-col items-center gap-2 px-4 py-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
              <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-semibold text-foreground">Booked for {ESCALATION_BOOKING.bookedFor}</p>
            <p className="text-[10px] text-muted-foreground">Reference {ESCALATION_BOOKING.reference} · Batch details carried over</p>
          </Callout>
        )}
      </div>
    </PanelShell>
  )
}
