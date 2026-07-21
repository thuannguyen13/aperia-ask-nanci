"use client"

import { useState } from "react"
import { RefreshCw, SlidersHorizontal, Download, Search, ChevronDown, AlertTriangle, ListChecks, Loader2, Check } from "lucide-react"
import { Button, Input } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import { QueueSummaryCard } from "./QueueSummaryCard"
import { useRiskNav } from "./RiskNavContext"
import { RISK_MERCHANTS, type RiskMerchant, type WorkStatus } from "@/lib/ask-nanci/data/risk-merchants"

const RISK_PILL: Record<RiskMerchant["risk"], string> = {
  High:   "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Low:    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
}

function TagBadges({ alert, list }: { alert: number; list: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center gap-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
        <AlertTriangle className="size-2.5" /> {alert}
      </span>
      <span className="flex items-center gap-1 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
        <ListChecks className="size-2.5" /> {list}
      </span>
    </div>
  )
}

function ActionButton({ status, onMarkWork }: { status: WorkStatus; onMarkWork: () => void }) {
  if (status === "worked")
    return <Button size="sm" className="w-32 justify-between bg-green-600 text-white hover:bg-green-600/90"><span className="flex items-center gap-1"><Check className="size-3.5" /> Worked</span><ChevronDown className="size-3.5" /></Button>
  if (status === "wip")
    return <Button size="sm" className="w-32 justify-between bg-amber-500 text-white hover:bg-amber-500/90"><span className="flex items-center gap-1"><Loader2 className="size-3.5" /> WIP</span><ChevronDown className="size-3.5" /></Button>
  return <Button size="sm" className="w-32 justify-between" onClick={onMarkWork}><span>Mark Work</span><ChevronDown className="size-3.5" /></Button>
}

export function BarometerReport() {
  const nav = useRiskNav()
  const filter = nav.barometerFilter
  // Local work-status so the demo's Mark Work is clickable (happy path).
  const [statuses, setStatuses] = useState<Record<string, WorkStatus>>(
    () => Object.fromEntries(RISK_MERCHANTS.map((m) => [m.id, m.status])),
  )
  const markWork = (id: string) => setStatuses((s) => ({ ...s, [id]: "worked" }))
  // "critical" chip → only the High-risk merchants (both models critical).
  const merchants = filter === "critical" ? RISK_MERCHANTS.filter((m) => m.risk === "High") : RISK_MERCHANTS

  return (
    <PanelShell className="min-w-0 flex-1">
      <PanelHeader
        title="Barometer Report"
        subtitle="04/23/2026"
        size="lg"
        actions={<Button variant="secondary" size="sm"><RefreshCw className="size-4" /> Refresh</Button>}
        onClose={() => nav.go("ask-nanci")}
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <button onClick={() => nav.go("detection-queue")} className="hover:text-foreground hover:underline">Detection Queue</button>
        <span>›</span>
        <span className="font-medium text-foreground">Barometer Report</span>
      </div>

      <QueueSummaryCard />

      {/* Merchant list */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Merchant List
            {filter === "critical" && <span className="ml-2 rounded bg-rose-100 px-1.5 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">VW + MC critical</span>}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm"><SlidersHorizontal className="size-4" /> Filter</Button>
            <Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search merchant id..." className="w-56 pl-8" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Merchant Name</th>
                <th className="px-4 py-2.5 font-medium">Tag</th>
                <th className="px-4 py-2.5 font-medium">VW Score</th>
                <th className="px-4 py-2.5 font-medium">MC Score</th>
                <th className="px-4 py-2.5 font-medium">Risk Level</th>
                <th className="px-4 py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-4 py-2.5">
                    <button onClick={() => nav.openMerchant(m.id)} className="max-w-[220px] truncate font-medium text-primary hover:underline">{m.name}</button>
                  </td>
                  <td className="px-4 py-2.5"><TagBadges alert={m.alertTag} list={m.listTag} /></td>
                  <td className="px-4 py-2.5 tabular-nums text-foreground">{m.vw}</td>
                  <td className="px-4 py-2.5 tabular-nums text-foreground">{m.mc}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn("rounded px-2 py-0.5 text-xs font-medium", RISK_PILL[m.risk])}>{m.risk}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end"><ActionButton status={statuses[m.id]} onMarkWork={() => markWork(m.id)} /></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </PanelShell>
  )
}
