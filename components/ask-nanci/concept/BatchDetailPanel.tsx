"use client"

import { X } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { BATCH_TRANSACTIONS } from "@/lib/ask-nanci/data/panels/batch-detail"
import { PanelShell, Callout, PanelTable, Th, Td, formatCurrency } from "@/components/ask-nanci/shared"

export function BatchDetailPanel() {
  const { closeDynamicPanel } = useAskNanci()

  const total = BATCH_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0)

  return (
    <PanelShell>
      <div className="flex shrink-0 items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Batch #4471</h2>
          <p className="text-xs text-muted-foreground">May 20 · {BATCH_TRANSACTIONS.length} transactions · {formatCurrency(total)}</p>
        </div>
        <button
          onClick={() => closeDynamicPanel("batch-detail")}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <Callout variant="amber" className="mx-4 my-3 shrink-0">
        1 transaction held for review — exceeds your single-ticket limit of $2,500.
      </Callout>

      <div className="flex-1 overflow-auto px-4 pb-3">
        <PanelTable>
          <thead>
            <tr className="border-b bg-muted/40">
              <Th>Time</Th>
              <Th>Card</Th>
              <Th align="right">Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {BATCH_TRANSACTIONS.map((txn) => (
              <tr key={txn.id} className={txn.flagged ? "bg-amber-50 dark:bg-amber-950/20" : ""}>
                <Td mono className="text-muted-foreground">{txn.time}</Td>
                <Td>{txn.card}</Td>
                <Td align="right" mono className={cn("font-medium", txn.flagged ? "text-amber-700 dark:text-amber-400" : "text-foreground")}>
                  {formatCurrency(txn.amount)}
                </Td>
                <Td>
                  {txn.flagged ? (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Flagged
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">{txn.status}</span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </PanelTable>
      </div>
    </PanelShell>
  )
}
