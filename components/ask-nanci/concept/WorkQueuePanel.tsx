"use client"

import Image from "next/image"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { QUICK_WINS, OUTAGE_MERCHANTS } from "@/lib/ask-nanci/data/panels/work-queue"
import { PanelShell, PanelHeader, PanelExportButton, Callout } from "@/components/ask-nanci/shared"

const reviewCount = QUICK_WINS.filter((r) => !r.valid).length
const cleanCount = QUICK_WINS.length - reviewCount

const TH = "px-3 py-2 text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground"

export function WorkQueuePanel() {
  const { closeDynamicPanel, workQueuePhase } = useAskNanci()
  const isOutage = workQueuePhase === "outage"

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
        <Callout variant="blue">
          <div className="flex items-start gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p>
              {isOutage
                ? <><span className="font-bold">Processor X posted an outage at 06:14</span> (ETA noon) — 8 merchants are waiting on settlement. I can notify all 8, mark them Waiting on Vendor, and auto-close when the processor confirms.</>
                : <><span className="font-bold">{QUICK_WINS.length} approvals ready.</span> I&apos;ve pre-checked each — {cleanCount} look clean, {reviewCount} flagged something worth your eyes before you batch-approve.</>}
            </p>
          </div>
        </Callout>

        {/* Quick-wins phase */}
        {!isOutage && (
          <table className="w-full text-xs border-separate border-spacing-0 overflow-hidden rounded-lg border [&_th]:border-b [&_tr:not(:last-child)_td]:border-b">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className={cn(TH, "text-left")}>Merchant</th>
                <th className={cn(TH, "text-left")}>Doc</th>
                <th className={cn(TH, "text-right")}>AI Read</th>
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
                    <p className="text-foreground truncate max-w-[140px]">{row.merchant}</p>
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
          </table>
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
