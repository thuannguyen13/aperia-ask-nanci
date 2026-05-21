"use client"

import { X, ShieldCheck } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

const TXN_FIELDS = [
  ["Date",        "May 14, 2026 · 2:18pm"],
  ["Amount",      "$284.50"],
  ["Card",        "Visa ····4821"],
  ["Cardholder",  "J. Martinez"],
  ["Auth Code",   "881234"],
  ["Entry Mode",  "Chip & PIN"],
  ["Card Type",   "Card Present"],
  ["MID",         "4831••••7291"],
]

export function TransactionReceiptPanel() {
  const { closePanel } = useAskNanci()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="size-2 rounded-full bg-blue-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Transaction &amp; Receipt</span>
              <span className="rounded bg-blue-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">EVIDENCE</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Case #CS-8821 · May 14, 2026</p>
          </div>
        </div>
        <button onClick={() => closePanel("transaction-receipt")} className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Close">
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden divide-x">
        {/* Transaction detail */}
        <div className="flex-1 overflow-auto px-4 py-3">
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2.5">Transaction Detail</p>
          <div className="space-y-2.5">
            {TXN_FIELDS.map(([label, value]) => (
              <div key={label}>
                <p className="text-[9px] text-muted-foreground">{label}</p>
                <p className="font-mono text-xs font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt mock */}
        <div className="w-[170px] shrink-0 overflow-auto bg-neutral-50 dark:bg-neutral-900 p-3">
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2.5">Receipt</p>
          <div className="bg-white dark:bg-neutral-800 rounded border border-dashed border-neutral-300 dark:border-neutral-600 p-3 font-mono text-[9px] leading-[1.6] text-neutral-800 dark:text-neutral-200 shadow-sm">
            <p className="text-center text-[10px] font-bold tracking-wide">OAK STREET COFFEE</p>
            <p className="text-center text-neutral-500 text-[8px]">142 Oak St · Austin TX</p>
            <p className="text-center text-neutral-500 text-[8px]">(512) 334-7821</p>
            <div className="border-t border-dashed border-neutral-300 dark:border-neutral-600 my-2" />
            <p>05/14/26  14:18:42</p>
            <p>AUTH: <span className="font-bold">881234</span></p>
            <p>VISA ....4821</p>
            <div className="border-t border-dashed border-neutral-300 dark:border-neutral-600 my-2" />
            <div className="flex justify-between">
              <span>Custom Cake</span>
              <span>$284.50</span>
            </div>
            <div className="border-t border-dashed border-neutral-300 dark:border-neutral-600 my-1" />
            <div className="flex justify-between font-bold">
              <span>TOTAL</span>
              <span>$284.50</span>
            </div>
            <div className="border-t border-dashed border-neutral-300 dark:border-neutral-600 my-2" />
            <p className="text-[7.5px] leading-tight text-neutral-500">ALL SALES FINAL. NO REFUNDS OR EXCHANGES ON CUSTOM ORDERS.</p>
            <div className="mt-3 mb-1 border-b border-neutral-400" />
            <p className="text-[8px] text-neutral-500">Customer Signature</p>
            <p className="mt-1 font-bold italic text-xs text-neutral-800 dark:text-neutral-100" style={{ fontFamily: "cursive" }}>J. Martinez</p>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-2 py-1.5">
            <ShieldCheck className="size-3 text-green-600 dark:text-green-400 shrink-0" />
            <p className="text-[9px] text-green-700 dark:text-green-400 leading-tight">Signature consistent with 6 prior transactions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
