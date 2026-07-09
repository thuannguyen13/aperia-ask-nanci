"use client"

import { cn } from "aperia-ds5/utils"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { BATCHES } from "@/lib/ask-nanci/data/panels/pending-deposits"
import { PanelShell, PanelHeader, PanelExportButton, StatCard, formatCurrency } from "@/components/ask-nanci/shared"

export function PendingDepositsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  const totalDeposit = BATCHES.reduce((sum, b) => sum + b.net, 0)
  const inTransitBatches = BATCHES.filter((b) => !b.isHeld)
  const onHoldBatches = BATCHES.filter((b) => b.isHeld)
  const inTransit = inTransitBatches.reduce((sum, b) => sum + b.net, 0)
  const onHold = onHoldBatches.reduce((sum, b) => sum + b.net, 0)

  return (
    <PanelShell>
      <PanelHeader
        title="Pending Deposits"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("pending-deposits")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total Deposit" value={formatCurrency(totalDeposit)} sublabel={`${BATCHES.length} batches`} />
            <StatCard label="In Transit" value={formatCurrency(inTransit)} sublabel={`${inTransitBatches.length} batches`} />
            <StatCard
              label="On Hold"
              value={<span className="text-amber-600 dark:text-amber-400">{formatCurrency(onHold)}</span>}
              sublabel={`${onHoldBatches.length} batch${onHoldBatches.length === 1 ? "" : "es"}`}
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
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Fees</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BATCHES.map((b) => (
                    <TableRow key={b.day} className={cn(b.isHeld && "bg-amber-50 dark:bg-amber-950/20")}>
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
                      <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(b.gross)}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(b.fees)}</TableCell>
                      <TableCell className={cn("text-right font-mono font-medium", b.isHeld ? "text-amber-700 dark:text-amber-400" : "text-foreground")}>
                        {formatCurrency(b.net)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
      </div>
    </PanelShell>
  )
}
