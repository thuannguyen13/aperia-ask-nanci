"use client"

import Image from "next/image"
import { Bell, Check } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { HELD_TXN } from "@/lib/ask-nanci/data/panels/pending-deposits"
import { PanelShell, PanelHeader, Callout, formatCurrency } from "@/components/ask-nanci/shared"

export function FlaggedTransactionPanel() {
  const { closeDynamicPanel, depositNotifyRequested, requestDepositNotify } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Flagged Transaction"
        subtitle="Pending Deposits · Sunday's batch"
        onClose={() => closeDynamicPanel("flagged-transaction")}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <Callout variant="blue">
          <div className="flex items-start gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p>
              A {formatCurrency(HELD_TXN.amount)} transaction in this batch exceeded your typical ticket size, triggering a routine review. No action needed on your end.
            </p>
          </div>
        </Callout>

        <div>
          <p className="mb-2 text-base font-semibold text-foreground">Flagged transaction (1)</p>
          <div className="rounded-lg border px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-base font-semibold text-foreground">{HELD_TXN.counterparty}</p>
              <p className="text-base font-semibold text-foreground">{formatCurrency(HELD_TXN.amount)}</p>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{HELD_TXN.date} · {HELD_TXN.paymentType}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">Expected to clear</p>
          <p className="text-sm text-muted-foreground">{HELD_TXN.expectedClear}</p>
        </div>

        <Button
          variant="secondary"
          disabled={depositNotifyRequested}
          onClick={requestDepositNotify}
          className="w-full gap-1.5"
        >
          {depositNotifyRequested ? <Check className="size-4" /> : <Bell className="size-4" />}
          {depositNotifyRequested ? "You'll be notified when it funds" : "Notify me when it funds"}
        </Button>
      </div>
    </PanelShell>
  )
}
