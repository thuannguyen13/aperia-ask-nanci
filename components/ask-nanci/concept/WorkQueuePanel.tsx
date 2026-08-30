"use client"

import { CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { QUICK_WINS, OUTAGE_MERCHANTS } from "@/lib/ask-nanci/data/panels/work-queue"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight, PanelTable, Th } from "@/components/shared"

const reviewCount = QUICK_WINS.filter((r) => !r.valid).length
const cleanCount = QUICK_WINS.length - reviewCount

export function WorkQueuePanel() {
  const { closeDynamicPanel } = useAskNanci()
  const isOutage = usePanelView("work-queue", "quick-wins") === "outage"

  return (
    <PanelShell>
      <PanelHeader
        title="Work Queue"
        subtitle={isOutage ? "Processor X outage · 8 merchants" : `${QUICK_WINS.length} document approvals`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("work-queue")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <NanciInsight>
              {isOutage
                ? <><span className="font-bold">Processor X posted an outage at 06:14</span> (ETA noon) — 8 merchants are waiting on settlement. I can notify all 8, mark them Waiting on Vendor, and auto-close when the processor confirms.</>
                : <><span className="font-bold">{QUICK_WINS.length} approvals ready.</span> I&apos;ve pre-checked each — {cleanCount} look clean, {reviewCount} flagged something worth your eyes before you batch-approve.</>}
        </NanciInsight>

        {/* Quick-wins phase */}
        {!isOutage && (
          <PanelTable>
            <thead>
              <tr className="border-b bg-muted/40">
                <Th>Merchant</Th>
                <Th>Doc</Th>
                <Th align="right">AI Read</Th>
              </tr>
            </thead>
            <tbody>
              {QUICK_WINS.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b last:border-0",
                    !row.valid && "bg-amber-50 dark:bg-amber-950/20",
                  )}
                >
                  <td className="px-3 py-2">
                    <p className="text-foreground">{row.merchant}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{row.id}</p>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-muted-foreground">{row.doc}</td>
                  <td className="px-3 py-2 text-right">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold",
                      row.valid
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    )}>
                      {row.valid ? <CheckCircle2 className="size-2.5" /> : <AlertCircle className="size-2.5" />}
                      {row.valid ? "Valid" : "Review"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </PanelTable>
        )}

        {/* Outage phase */}
        {isOutage && (
          <div className="space-y-2">
            <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Affected Merchants</p>
            {OUTAGE_MERCHANTS.map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2">
                <span className="text-xs text-foreground">{name}</span>
                <span className="rounded bg-amber-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Pending</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PanelShell>
  )
}
