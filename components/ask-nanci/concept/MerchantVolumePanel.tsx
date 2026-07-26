"use client"

import { useState } from "react"
import { Badge } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { MERCHANT_VOLUME_DATA } from "@/lib/ask-nanci/data/merchants"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight, PanelTable, Th, Td, formatCurrency, formatWholeCurrency } from "@/components/ask-nanci/shared"

type SortKey = "volume" | "txnCount" | "avgTicket"

const SORT_LABELS: Record<SortKey, string> = {
  volume: "Volume",
  txnCount: "Txn Count",
  avgTicket: "Avg Ticket",
}

// The volume leader is the answer to "merchant volume this week" — stable
// regardless of which column the user sorts by, so it anchors the insight line.
const leader = [...MERCHANT_VOLUME_DATA].sort((a, b) => b.volume - a.volume)[0]

export function MerchantVolumePanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("merchant-volume", "full")
  const [sortKey, setSortKey] = useState<SortKey>("volume")

  const topN = view === "top5" ? 5 : 10
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
        <NanciInsight>
              {view === "top5"
                ? <>Your top 5 by volume. <span className="font-bold">{leader.merchant}</span> still leads at {formatWholeCurrency(leader.volume)} across {leader.txnCount.toLocaleString()} transactions. Sort by any column to reorder.</>
                : <><span className="font-bold">{leader.merchant}</span> leads the week at {formatWholeCurrency(leader.volume)} across {leader.txnCount.toLocaleString()} transactions — the highest average ticket earners rank lower on count. Sort by any column to reorder.</>}
        </NanciInsight>

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

        <PanelTable>
          <thead>
            <tr className="border-b bg-muted/40">
              <Th className="w-8">#</Th>
              <Th>Merchant</Th>
              <Th align="right">Volume</Th>
              <Th align="right">Txns</Th>
              <Th align="right">Avg Ticket</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.merchant}
                className={cn(
                  "border-b last:border-0",
                  // Tint the merchant the insight line names, by identity — not by
                  // `rank`, which only means "volume rank" by convention and detaches
                  // from the copy the moment the data is re-ordered or swapped for an API.
                  row.merchant === leader.merchant && "bg-amber-50 dark:bg-amber-950/20",
                )}
              >
                <Td mono className="text-muted-foreground">{i + 1}</Td>
                <Td>{row.merchant}</Td>
                <Td align="right" mono>{formatWholeCurrency(row.volume)}</Td>
                <Td align="right" mono>{row.txnCount.toLocaleString()}</Td>
                <Td align="right" mono>{formatCurrency(row.avgTicket)}</Td>
              </tr>
            ))}
          </tbody>
        </PanelTable>
      </div>
    </PanelShell>
  )
}
