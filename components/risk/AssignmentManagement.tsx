"use client"

import { useState } from "react"
import { RefreshCw, SlidersHorizontal, Plus, ChevronDown, SlidersVertical, Pencil, Copy, Trash2, Download, CircleCheck } from "lucide-react"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { AM_INTEGRATION, AM_SUMMARY, ASSIGNMENTS, AM_TOTAL, type AssignmentStatus } from "@/lib/ask-nanci/data/risk-assignments"

const TABS: ("All" | AssignmentStatus)[] = ["All", "Active", "Expired"]

const STATUS_PILL: Record<AssignmentStatus, string> = {
  Active:  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Expired: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}

export function AssignmentManagement() {
  const [tab, setTab] = useState<"All" | AssignmentStatus>("All")
  const rows = tab === "All" ? ASSIGNMENTS : ASSIGNMENTS.filter((a) => a.status === tab)

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-foreground">Assignment Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm"><RefreshCw className="size-4" /> Refresh</Button>
          <Button variant="secondary" size="sm"><SlidersHorizontal className="size-4" /> Advanced Filter</Button>
          <Button size="sm" className="gap-1"><Plus className="size-4" /> Create Assignment <ChevronDown className="size-3.5" /></Button>
        </div>
      </div>

      {/* Integration card */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-400 text-[10px] font-bold text-white">MC</div>
        <span className="text-sm font-semibold text-foreground">{AM_INTEGRATION.name}</span>
        <span className="flex items-center gap-1 rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
          <CircleCheck className="size-3" /> {AM_INTEGRATION.status}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Last score sync: <span className="font-medium text-foreground">{AM_INTEGRATION.lastSync}</span></span>
          <span>{AM_INTEGRATION.scored}</span>
          <Button variant="secondary" size="sm"><SlidersVertical className="size-4" /> Configure Risk Score Band</Button>
        </div>
      </div>

      {/* Distinct Merchant Summary */}
      <h2 className="mb-2 mt-6 text-base font-semibold text-foreground">Distinct Merchant Summary</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {AM_SUMMARY.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4">
            <p className="text-sm font-semibold text-foreground">{s.label}</p>
            <div className="mt-3 flex items-end gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Count</p>
                <p className="text-lg font-semibold tabular-nums text-foreground">{s.count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-lg font-semibold tabular-nums text-foreground">{s.amount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Summary tabs */}
      <h2 className="mb-2 mt-6 text-base font-semibold text-foreground">Assignment Summary</h2>
      <div className="inline-flex w-fit gap-1 rounded-lg bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("rounded-md px-3 py-1 text-sm font-medium transition-colors", tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Assignment List</h3>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm"><SlidersHorizontal className="size-4" /> Filter</Button>
            <Button variant="secondary" size="sm"><Download className="size-4" /> Export</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Assignment Name</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Alerted Merchant Count</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Last Processed Date</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.name} className="border-b last:border-0">
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-primary">{a.name}</span>
                    {a.system && <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">System</span>}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{a.type}</td>
                  <td className="px-4 py-2.5 tabular-nums text-foreground">{a.alerted}</td>
                  <td className="px-4 py-2.5"><span className={cn("rounded px-2 py-0.5 text-xs font-medium", STATUS_PILL[a.status])}>{a.status}</span></td>
                  <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{a.lastProcessed}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                      <button className="rounded border p-1.5 hover:bg-muted"><Pencil className="size-3.5" /></button>
                      <button className="rounded border p-1.5 hover:bg-muted"><Copy className="size-3.5" /></button>
                      <button className="rounded border border-rose-200 bg-rose-50 p-1.5 text-rose-500 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30"><Trash2 className="size-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>Showing {rows.length} of {AM_TOTAL}</span>
          <div className="flex items-center gap-2">
            <button className="hover:text-foreground">‹ Previous</button>
            {[1, 2, 3].map((p) => (
              <button key={p} className={cn("size-7 rounded", p === 1 ? "bg-primary text-white" : "hover:bg-muted")}>{p}</button>
            ))}
            <button className="hover:text-foreground">Next ›</button>
          </div>
        </div>
      </div>
    </div>
  )
}
