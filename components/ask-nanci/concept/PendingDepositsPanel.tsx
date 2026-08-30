"use client"

import { useEffect, useState } from "react"
import { Bell, Check } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from "aperia-ds5"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { BATCHES, CASH_DEPOSITS, DEPOSIT_ACCOUNT_LAST4, HELD_TXN } from "@/lib/ask-nanci/data/panels/pending-deposits"
import { PanelShell, PanelHeader, PanelExportButton, StatCard, NanciInsight, formatCurrency } from "@/components/shared"

// How long the held row pulses brighter when its detail appears, before it settles
// back to its resting "on hold" tint.
const HIGHLIGHT_MS = 2600

export function PendingDepositsPanel() {
  const { closeDynamicPanel, requestDepositNotify } = useAskNanci()
  const view = usePanelView("pending-deposits", "default")
  const showFlagged = view === "flagged" || view === "notified"
  const notified = view === "notified"

  const inTransitBatches = BATCHES.filter((b) => !b.isHeld)
  const onHoldBatches = BATCHES.filter((b) => b.isHeld)
  const inTransit = inTransitBatches.reduce((sum, b) => sum + b.net, 0)
  const onHold = onHoldBatches.reduce((sum, b) => sum + b.net, 0)
  const cashDeposited = CASH_DEPOSITS.reduce((sum, d) => sum + d.amount, 0)
  // Headline = what actually hits the account: card (in transit + held) plus cash.
  const totalExpected = inTransit + onHold + cashDeposited

  // Pulse the held row brighter when its detail appears, then let it settle.
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (view !== "flagged") { setPulse(false); return }
    setPulse(true)
    const t = setTimeout(() => setPulse(false), HIGHLIGHT_MS)
    return () => clearTimeout(t)
  }, [view])

  return (
    <PanelShell>
      <PanelHeader
        title="Pending Deposits"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("pending-deposits")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Expected" value={formatCurrency(totalExpected)} sublabel="card + cash" />
          <StatCard label="In Transit" value={formatCurrency(inTransit)} sublabel={`${inTransitBatches.length} batches`} />
          <StatCard
            label="On Hold"
            value={<span className="text-amber-600 dark:text-amber-400">{formatCurrency(onHold)}</span>}
            sublabel={`${onHoldBatches.length} batch${onHoldBatches.length === 1 ? "" : "es"}`}
          />
          <StatCard
            label="Cash Deposited"
            value={<span className="text-green-600 dark:text-green-400">{formatCurrency(cashDeposited)}</span>}
            sublabel={`${CASH_DEPOSITS.length} deposits, landed`}
          />
        </div>

        <div>
          <p className="mb-2 text-base font-semibold text-foreground">Batches</p>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Txns</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Fees</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead className="text-right">Expected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BATCHES.map((b) => (
                  <TableRow
                    key={b.day}
                    className={cn(
                      "transition-colors duration-500",
                      b.isHeld && (pulse ? "bg-amber-100 dark:bg-amber-900/30" : "bg-amber-50 dark:bg-amber-950/20"),
                    )}
                  >
                    <TableCell>
                      <p className="font-medium text-foreground">{b.date}</p>
                      <p className="font-mono text-sm text-muted-foreground">{b.batchId}</p>
                    </TableCell>
                    <TableCell>
                      {b.isHeld ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          On Hold
                        </span>
                      ) : (
                        <span className="text-muted-foreground">In Transit</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{b.txns}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(b.gross)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(b.fees)}</TableCell>
                    <TableCell className={cn("text-right font-mono font-medium", b.isHeld ? "text-amber-700 dark:text-amber-400" : "text-foreground")}>
                      {formatCurrency(b.net)}
                    </TableCell>
                    <TableCell className={cn("text-right font-mono", b.isHeld ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>
                      {b.expected}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <p className="mb-2 text-base font-semibold text-foreground">
            Cash deposits <span className="font-normal text-muted-foreground">(from your connected bank)</span>
          </p>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CASH_DEPOSITS.map((d) => (
                  <TableRow key={`${d.date}-${d.amount}`}>
                    <TableCell className="font-mono text-muted-foreground">{d.date}</TableCell>
                    <TableCell className="text-foreground">{d.source}</TableCell>
                    <TableCell className="text-right font-mono font-medium text-foreground">{formatCurrency(d.amount)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {d.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Pulled from your account ending ••{DEPOSIT_ACCOUNT_LAST4}. Cash is already in your account, card batches are still settling.
          </p>
        </div>

        {/* Held-batch detail — appears inline once the flow drills into the held Sunday batch. */}
        {showFlagged && (
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold text-foreground">Held batch — flagged transaction</p>
            <NanciInsight>
              A {formatCurrency(HELD_TXN.amount)} transaction in this batch exceeded your typical ticket size, triggering a routine review. No action needed on your end.
            </NanciInsight>

            <div className="rounded-lg border px-3 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-base font-semibold text-foreground">{HELD_TXN.counterparty}</p>
                <p className="text-base font-semibold text-foreground">{formatCurrency(HELD_TXN.amount)}</p>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{HELD_TXN.date} · {HELD_TXN.paymentType}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-foreground">Expected to clear</p>
              <p className="text-sm text-muted-foreground">{HELD_TXN.expectedClear}</p>
            </div>

            <Button
              variant="secondary"
              disabled={notified}
              onClick={requestDepositNotify}
              className="w-full gap-1.5"
            >
              {notified ? <Check className="size-4" /> : <Bell className="size-4" />}
              {notified ? "You'll be notified when it funds" : "Notify me when it funds"}
            </Button>
          </div>
        )}
      </div>
    </PanelShell>
  )
}
