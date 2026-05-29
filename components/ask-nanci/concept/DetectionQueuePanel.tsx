"use client"

import { X, ArrowRight, FileBarChart2, ShieldCheck } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

const STATUS_ROWS = [
  { label: "Alerted",          count: 14, amount: "$380,000.00" },
  { label: "Ready to Work",    count: 11, amount: "$290,000.00" },
  { label: "Work In Progress", count: 3,  amount: "$90,000.00"  },
  { label: "Worked",           count: 0,  amount: "$0.00"       },
  { label: "Requeue",          count: 2,  amount: "$52,000.00"  },
]

export function DetectionQueuePanel() {
  const { closePanel, closeAllNewPanels } = useAskNanci()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Detection Queue</p>
        <button
          onClick={() => { closePanel("detection-queue"); closeAllNewPanels() }}
          className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Assignment header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-base font-semibold text-foreground">High Velocity Watch</p>
            <p className="text-xs text-muted-foreground mt-0.5">05/24/2026</p>
          </div>
          <button className="shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
            Assignment Details
          </button>
        </div>

        {/* General Information */}
        <div className="rounded-lg border px-3 py-2.5 space-y-2">
          <p className="text-xs font-semibold text-foreground">General Information</p>
          {[
            { label: "Assignment Name",      value: "High Velocity Watch" },
            { label: "Assignment Type",      value: "DQ" },
            { label: "Eligible Merchant Count", value: "14" },
            { label: "Percent Worked",       value: "0%" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* Status table */}
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/60">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground">Distinct Merchants — Current Status</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-muted-foreground">Count</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {STATUS_ROWS.map(({ label, count, amount }) => (
                <tr key={label} className="border-t border-border/50">
                  <td className="px-3 py-3 text-foreground">{label}</td>
                  <td className="px-3 py-3 text-right text-foreground font-mono">{count}</td>
                  <td className="px-3 py-3 text-right text-foreground font-mono">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              <FileBarChart2 className="size-3.5" />
              Barometer Report
            </button>
            <button className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
              <ShieldCheck className="size-3.5" />
              Security Report
            </button>
          </div>
          <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            Next Queue
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
