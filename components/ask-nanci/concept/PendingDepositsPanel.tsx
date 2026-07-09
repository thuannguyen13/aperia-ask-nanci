"use client"

import { X } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import {
  Button, Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { BATCHES } from "@/lib/ask-nanci/data/panels/pending-deposits"
import { PanelShell, StatCard, formatCurrency } from "@/components/ask-nanci/shared"

export function PendingDepositsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  const totalDeposit = BATCHES.reduce((sum, b) => sum + b.net, 0)
  const inTransitBatches = BATCHES.filter((b) => !b.isHeld)
  const onHoldBatches = BATCHES.filter((b) => b.isHeld)
  const inTransit = inTransitBatches.reduce((sum, b) => sum + b.net, 0)
  const onHold = onHoldBatches.reduce((sum, b) => sum + b.net, 0)

  return (
    <PanelShell className="overflow-y-auto p-0">
      <Card className="h-full gap-4 py-4">
        <CardHeader className="border-b">
          <CardTitle>Pending Deposits</CardTitle>
          <CardDescription>Account ending ••4432</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon" onClick={() => closeDynamicPanel("pending-deposits")} aria-label="Close">
              <X className="size-4" />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
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
                        <p className="font-mono text-[10px] text-muted-foreground">{b.batchId}</p>
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
        </CardContent>
      </Card>
    </PanelShell>
  )
}
