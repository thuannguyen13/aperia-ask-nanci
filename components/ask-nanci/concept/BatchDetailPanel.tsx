"use client"

import { X } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { BATCH_TRANSACTIONS } from "@/lib/ask-nanci/data/panels/batch-detail"
import { SidebarPanelShell, Callout, formatCurrency } from "@/components/ask-nanci/shared"

export function BatchDetailPanel() {
  const { batchPanelOpen, setBatchPanelOpen } = useAskNanci()

  const total = BATCH_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0)

  return (
    <SidebarPanelShell isOpen={batchPanelOpen} width="480px" side="right">
      <div className="flex shrink-0 items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Batch #4471</h2>
          <p className="text-xs text-muted-foreground">May 20 · {BATCH_TRANSACTIONS.length} transactions · {formatCurrency(total)}</p>
        </div>
        <button
          onClick={() => setBatchPanelOpen(false)}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <Callout variant="amber" className="mx-4 my-3 shrink-0">
        1 transaction held for review — exceeds your single-ticket limit of $2,500.
      </Callout>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/60 backdrop-blur">
            <tr>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Time</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Card</th>
              <th className="px-3 py-2.5 text-right text-xs font-medium text-muted-foreground">Amount</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {BATCH_TRANSACTIONS.map((txn) => (
              <tr
                key={txn.id}
                className={cn(
                  "border-b last:border-0",
                  txn.flagged ? "bg-amber-50 dark:bg-amber-950/20" : "",
                )}
              >
                <td className="px-3 py-2.5 text-muted-foreground">{txn.time}</td>
                <td className="px-3 py-2.5 text-foreground">{txn.card}</td>
                <td className={cn(
                  "px-3 py-2.5 text-right font-medium",
                  txn.flagged ? "text-amber-700 dark:text-amber-400" : "text-foreground",
                )}>
                  {formatCurrency(txn.amount)}
                </td>
                <td className="px-3 py-2.5">
                  {txn.flagged ? (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Flagged
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 text-xs">{txn.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarPanelShell>
  )
}
