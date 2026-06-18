"use client"

import { useState } from "react"
import { X, Download, ArrowUpDown } from "lucide-react"
import {
  Button, Badge, ScrollArea,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { MERCHANT_VOLUME_DATA } from "@/lib/ask-nanci/concept-config"
import { SidebarPanelShell } from "@/components/ask-nanci/shared"

type SortKey = "volume" | "txnCount" | "avgTicket"

const SORT_LABELS: Record<SortKey, string> = {
  volume: "Volume",
  txnCount: "Txn Count",
  avgTicket: "Avg Ticket",
}

export function MerchantVolumePanel() {
  const { reportPanelOpen, setReportPanelOpen, reportTopN } = useAskNanci()
  const [sortKey, setSortKey] = useState<SortKey>("volume")

  const rows = [...MERCHANT_VOLUME_DATA]
    .sort((a, b) => b[sortKey] - a[sortKey])
    .slice(0, reportTopN)

  return (
    <SidebarPanelShell isOpen={reportPanelOpen} width="55%" side="left">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">Q1 2026 — Volume by Merchant</p>
          <p className="text-xs text-muted-foreground">Showing top {reportTopN} of 47 merchants</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" size="sm" disabled className="gap-1.5">
            <Download className="size-3.5" /> Export
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setReportPanelOpen(false)}>
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Sort chips */}
      <div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
        <span className="text-xs text-muted-foreground">Sort:</span>
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

      {/* Table */}
      <ScrollArea className="flex-1">
        <Table className="border-collapse [&_th]:border [&_td]:border [&_th]:border-border [&_td]:border-border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead className="text-right">
                <button className="flex items-center gap-1 ml-auto" onClick={() => setSortKey("volume")}>
                  Volume <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button className="flex items-center gap-1 ml-auto" onClick={() => setSortKey("txnCount")}>
                  Txns <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button className="flex items-center gap-1 ml-auto" onClick={() => setSortKey("avgTicket")}>
                  Avg Ticket <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={row.merchant}>
                <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">{row.merchant}</TableCell>
                <TableCell className="text-right">${row.volume.toLocaleString()}</TableCell>
                <TableCell className="text-right">{row.txnCount.toLocaleString()}</TableCell>
                <TableCell className="text-right">${row.avgTicket.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </SidebarPanelShell>
  )
}
