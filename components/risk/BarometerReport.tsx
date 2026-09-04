"use client"

import { useState } from "react"
import { RefreshCw, SlidersHorizontal, Download, Search, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, ListChecks } from "lucide-react"
import {
  Badge, Button, Input,
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
  TableBody, TableRow,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { PanelShell, PanelHeader, PanelBody, PanelTable, Thead, Th, Td } from "@/components/shared"
import { MarkWorkPopover } from "./MarkWorkPopover"
import { QueueSummaryCard, QueueTitle } from "./QueueSummaryCard"
import { DETECTION_QUEUE } from "@/lib/ask-nanci/data/risk-detection-queue"
import { useRiskNav } from "./RiskNavContext"
import { RISK_TODAY, RISK_MERCHANTS, RISK_MERCHANTS_TOTAL, getRiskLevel, formatMcScore, formatMerchantName, statusForDisposition } from "@/lib/ask-nanci/data/risk-merchants"
import { RISK_PILL } from "./risk-level"

function TagBadges({ alert, list }: { alert: number; list: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center gap-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
        <AlertTriangle className="size-2.5" /> {alert}
      </span>
      <span className="flex items-center gap-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
        <ListChecks className="size-2.5" /> {list}
      </span>
    </div>
  )
}

export function BarometerReport() {
  const nav = useRiskNav()
  const filter = nav.barometerFilter
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()

  // "critical" chip → the High-risk merchants. That is "critical on either model",
  // not both: 8 of the 13 fire on one model only, and dropping them would hide the
  // exact cases the two-score view exists to surface.
  // The search box narrows whatever that left, matching name or MID — the field says
  // "merchant id" but an analyst reading the list has the name in front of them.
  const merchants = RISK_MERCHANTS
    .filter((m) => filter !== "critical" || getRiskLevel(m) === "High")
    .filter((m) => !q || m.name.toLowerCase().includes(q) || m.mid.includes(q))

  // The 357 total belongs to the unfiltered assignment. Once anything narrows the
  // list, the count on screen is the whole result, so quoting 357 beside it would
  // claim there are pages of matches that do not exist.
  const narrowed = filter === "critical" || !!q

  return (
    <PanelShell className="min-w-0 flex-1">
      {/* The assignment names the page; "Barometer Report" is already the last
          breadcrumb. Same shape the Risk Report uses, where the merchant is the
          title and its tags sit beside it. */}
      <PanelHeader
        title={<QueueTitle queue={DETECTION_QUEUE} />}
        subtitle={RISK_TODAY}
        size="page"
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><button onClick={() => nav.go("detection-queue")}>Detection Queue</button></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Barometer Report</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        actions={<Button variant="outline"><RefreshCw className="size-4" /> Refresh</Button>}
      />

      <PanelBody>
      {/* live: this list's Mark Work buttons feed the card directly above them. */}
      <QueueSummaryCard live header={false} />

      {/* Merchant list */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Merchant List
            {filter === "critical" && <span className="ml-2 rounded bg-rose-100 px-1.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">VW + MC critical</span>}
          </h2>
          {/* The 224px search box plus both buttons is wider than a phone, so the
              row wraps and the box takes the full width it lands on. */}
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <Button variant="secondary"><SlidersHorizontal className="size-4" /> Filter</Button>
            <Button variant="secondary"><Download className="size-4" /> Export</Button>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                // "Filter", not "Search": the console's own search jumps to a
                // merchant, this narrows the 357 rows in place. Two boxes on one
                // screen only read as one job if they are named differently.
                placeholder="Filter this list..."
                className="w-full pl-8 sm:w-56"
              />
            </div>
          </div>
        </div>

        <PanelTable density="comfortable">
          <Thead>
            <Th sortable>Merchant name</Th>
            <Th sortable>MCC</Th>
            <Th>Tag</Th>
            <Th sortable>VW score</Th>
            <Th sortable>MC score</Th>
            <Th sortable>Risk level</Th>
            <Th align="right">Action</Th>
          </Thead>
          <TableBody>
            {merchants.length === 0 && (
              <TableRow>
                <Td colSpan={7} className="py-10 text-center text-muted-foreground">
                  No merchant matches <span className="font-medium text-foreground">{query}</span> in this assignment.
                </Td>
              </TableRow>
            )}
            {merchants.map((m) => (
              <TableRow key={m.id}>
                <Td>
                  <button onClick={() => nav.openMerchant(m.id)} className="block max-w-[220px] truncate text-left font-medium text-primary hover:underline">{formatMerchantName(m.name)}</button>
                  <span className="font-mono text-xs text-muted-foreground">{m.mid}</span>
                </Td>
                <Td>
                  <span className="block font-mono">{m.mcc}</span>
                  <span className="block max-w-[160px] truncate text-xs text-muted-foreground">{m.mccDesc}</span>
                </Td>
                <Td><TagBadges alert={m.alertTag} list={m.listTag} /></Td>
                <Td mono>{m.vw}</Td>
                <Td mono>{formatMcScore(m.mc)}</Td>
                <Td>
                  <Badge className={RISK_PILL[getRiskLevel(m)]}>{getRiskLevel(m)}</Badge>
                </Td>
                <Td align="right">
                  {/* Same control as the merchant detail: disposition first, then
                      the mark — a row is never closed out without a reason. */}
                  <div className="flex justify-end">
                    <MarkWorkPopover
                      status={nav.workStatuses[m.id]}
                      onSubmit={(choice) => nav.markWork(m.id, statusForDisposition(choice))}
                    />
                  </div>
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </PanelTable>

        {/* Pagination — same shape as Assignment Management. Display-only, like the
            sort affordances: the list is page one of the assignment's alerted
            merchants, and the count is what stops 30 rows reading as the whole queue. */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>Showing {merchants.length} of {narrowed ? merchants.length : RISK_MERCHANTS_TOTAL}</span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 hover:text-foreground"><ChevronLeft className="size-4" /> Previous</button>
            {[1, 2, 3].map((p) => (
              <button key={p} className={cn("size-7 rounded", p === 1 ? "border bg-background text-foreground" : "hover:bg-muted")}>{p}</button>
            ))}
            <button className="flex items-center gap-1 hover:text-foreground">Next <ChevronRight className="size-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            Rows per page
            <span className="flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-foreground">30 <ChevronDown className="size-3.5" /></span>
          </div>
        </div>
      </div>
      </PanelBody>
    </PanelShell>
  )
}
