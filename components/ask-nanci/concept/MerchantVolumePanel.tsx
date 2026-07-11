"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { MERCHANT_VOLUME_DATA } from "@/lib/ask-nanci/concept-config"
import { PanelShell, PanelHeader, PanelExportButton, Callout, formatCurrency } from "@/components/ask-nanci/shared"

type SortKey = "volume" | "txnCount" | "avgTicket"

const SORT_LABELS: Record<SortKey, string> = {
  volume: "Volume",
  txnCount: "Txn Count",
  avgTicket: "Avg Ticket",
}

// The volume leader is the answer to "merchant volume this week" — stable
// regardless of which column the user sorts by, so it anchors the insight line.
const leader = [...MERCHANT_VOLUME_DATA].sort((a, b) => b.volume - a.volume)[0]

const TH = "px-3 py-2 text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground"
const TD = "px-3 py-2 font-mono text-foreground"

export function MerchantVolumePanel() {
  const { closeDynamicPanel, merchantVolumePhase } = useAskNanci()
  const [sortKey, setSortKey] = useState<SortKey>("volume")

  const topN = merchantVolumePhase === "top5" ? 5 : 10
  const rows = [...MERCHANT_VOLUME_DATA].sort((a, b) => b[sortKey] - a[sortKey]).slice(0, topN)

  return (
    <PanelShell>
      <PanelHeader
        title="Volume by Merchant"
        subtitle={`Top ${topN} of ${MERCHANT_VOLUME_DATA.length} merchants · week of May 15–21`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("merchant-volume")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <Callout variant="blue">
          <div className="flex items-start gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p>
              {merchantVolumePhase === "top5"
                ? <>Your top 5 by volume. <span className="font-bold">{leader.merchant}</span> still leads at ${leader.volume.toLocaleString()} across {leader.txnCount.toLocaleString()} transactions. Sort by any column to reorder.</>
                : <><span className="font-bold">{leader.merchant}</span> leads the week at ${leader.volume.toLocaleString()} across {leader.txnCount.toLocaleString()} transactions — the highest average ticket earners rank lower on count. Sort by any column to reorder.</>}
            </p>
          </div>
        </Callout>

        {/* Sort chips — the one Ranked-Report affordance; named dimensions, not raw arrows */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground">Sort</span>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <Badge
              key={key}
              variant={sortKey === key ? "default" : "secondary"}
              className="cursor-pointer select-none"
              onClick={() => setSortKey(key)}
            >
              {SORT_LABELS[key]}
            </Badge>
          ))}
        </div>

        <table className="w-full text-xs border-separate border-spacing-0 overflow-hidden rounded-lg border [&_th]:border-b [&_tr:not(:last-child)_td]:border-b">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className={cn(TH, "text-left w-8")}>#</th>
              <th className={cn(TH, "text-left")}>Merchant</th>
              <th className={cn(TH, "text-right")}>Volume</th>
              <th className={cn(TH, "text-right")}>Txns</th>
              <th className={cn(TH, "text-right")}>Avg Ticket</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.merchant}
                className={cn(
                  "border-b last:border-0",
                  row.rank === 1 && "bg-amber-50 dark:bg-amber-950/20",
                )}
              >
                <td className={cn(TD, "text-muted-foreground")}>{i + 1}</td>
                <td className="px-3 py-2 text-foreground">{row.merchant}</td>
                <td className={cn(TD, "text-right")}>${row.volume.toLocaleString()}</td>
                <td className={cn(TD, "text-right")}>{row.txnCount.toLocaleString()}</td>
                <td className={cn(TD, "text-right")}>{formatCurrency(row.avgTicket)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  )
}
