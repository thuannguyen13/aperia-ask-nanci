"use client"

import { X } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"

const BATCH_TRANSACTIONS = [
  { id: "TXN-001", time: "8:14 AM", card: "Visa ••4821", amount: 124.50, status: "Approved", flagged: false },
  { id: "TXN-002", time: "8:31 AM", card: "MC ••7734",  amount:  89.00, status: "Approved", flagged: false },
  { id: "TXN-003", time: "9:02 AM", card: "Visa ••2291", amount: 312.75, status: "Approved", flagged: false },
  { id: "TXN-004", time: "9:18 AM", card: "Amex ••6614", amount: 2840.00, status: "Held",     flagged: true  },
  { id: "TXN-005", time: "9:44 AM", card: "Visa ••8812", amount:  55.20, status: "Approved", flagged: false },
  { id: "TXN-006", time: "10:03 AM", card: "MC ••3391",  amount: 198.40, status: "Approved", flagged: false },
  { id: "TXN-007", time: "10:22 AM", card: "Disc ••5518", amount:  74.90, status: "Approved", flagged: false },
  { id: "TXN-008", time: "11:05 AM", card: "Visa ••9923", amount: 441.00, status: "Approved", flagged: false },
]

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
}

export function BatchDetailPanel() {
  const { batchPanelOpen, setBatchPanelOpen } = useAskNanci()

  const total = BATCH_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div
      className={cn(
        "relative hidden h-full shrink-0 flex-col overflow-hidden rounded-[18px] border bg-background transition-[width,opacity] duration-200 ease-in-out md:flex",
        batchPanelOpen ? "w-[480px] opacity-100 mr-1" : "w-0 opacity-0 border-0 pointer-events-none",
      )}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-base font-semibold text-foreground">Batch #4471</h2>
          <p className="text-xs text-muted-foreground">May 20 · {BATCH_TRANSACTIONS.length} transactions · {fmt(total)}</p>
        </div>
        <button
          onClick={() => setBatchPanelOpen(false)}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mx-4 my-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300 shrink-0">
        1 transaction held for review — exceeds your single-ticket limit of $2,500.
      </div>

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
                  {fmt(txn.amount)}
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
    </div>
  )
}
