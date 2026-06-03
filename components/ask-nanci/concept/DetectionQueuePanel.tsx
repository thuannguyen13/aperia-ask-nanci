"use client"

import { ArrowRight, FileBarChart2, ShieldCheck } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { STATUS_ROWS } from "@/lib/ask-nanci/data/panels/barometer"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"

export function DetectionQueuePanel() {
  const { closePanel, closeAllNewPanels } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Detection Queue"
        onClose={() => { closePanel("detection-queue"); closeAllNewPanels() }}
      />

      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        {/* Assignment header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground truncate">High Velocity Watch</p>
            <p className="text-xs text-muted-foreground mt-0.5">05/24/2026</p>
          </div>
          <button className="shrink-0 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
            Assignment Details
          </button>
        </div>

        {/* General Information */}
        <div className="rounded-lg border px-3 py-2.5 space-y-2">
          <p className="text-xs font-semibold text-foreground">General Information</p>
          {[
            { label: "Assignment Name",         value: "High Velocity Watch" },
            { label: "Assignment Type",         value: "DQ" },
            { label: "Eligible Merchant Count", value: "14" },
            { label: "Percent Worked",          value: "0%" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-2 text-xs">
              <span className="min-w-0 truncate text-muted-foreground">{label}</span>
              <span className="shrink-0 text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* Status table */}
        <div className="rounded-md border overflow-hidden">
          <table className="w-full table-fixed text-xs border-collapse">
            <thead>
              <tr className="bg-muted/60">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground">
                  <span className="block truncate">Distinct Merchants — Current Status</span>
                </th>
                <th className="w-12 px-3 py-2.5 text-right text-[10px] font-semibold text-muted-foreground">Count</th>
                <th className="w-20 px-3 py-2.5 text-right text-[10px] font-semibold text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {STATUS_ROWS.map(({ label, count, amount }) => (
                <tr key={label} className="border-t border-border/50">
                  <td className="px-3 py-3 text-foreground">
                    <span className="block truncate">{label}</span>
                  </td>
                  <td className="px-3 py-3 text-right text-foreground font-mono">{count}</td>
                  <td className="px-3 py-3 text-right text-foreground font-mono">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            <FileBarChart2 className="size-3.5" />
            Barometer Report
          </button>
          <button className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            <ShieldCheck className="size-3.5" />
            Security Report
          </button>
          <button className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            Next Queue
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </PanelShell>
  )
}
