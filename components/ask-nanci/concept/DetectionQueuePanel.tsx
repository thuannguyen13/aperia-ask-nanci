"use client"

import { ArrowRight, FileBarChart2, ShieldCheck } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ASSIGNMENT, STATUS_ROWS } from "@/lib/ask-nanci/data/panels/barometer"
import { PanelShell, PanelHeader, PanelBody, PanelTable, Thead, Th, Td } from "@/components/shared"

export function DetectionQueuePanel() {
  const { closePanel, closeAllNewPanels } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Detection Queue"
        onClose={() => { closePanel("detection-queue"); closeAllNewPanels() }}
      />

      <PanelBody className="py-4 space-y-4">
        {/* Assignment header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground truncate">{ASSIGNMENT.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{ASSIGNMENT.date}</p>
          </div>
          <button className="shrink-0 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
            Assignment Details
          </button>
        </div>

        {/* General Information */}
        <div className="rounded-lg border px-3 py-2.5 space-y-2">
          <p className="text-xs font-semibold text-foreground">General Information</p>
          {ASSIGNMENT.generalInfo.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-2 text-xs">
              <span className="min-w-0 truncate text-muted-foreground">{label}</span>
              <span className="shrink-0 text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* Status table */}
        <PanelTable>
          <Thead>
            <Th>Distinct Merchants — Current Status</Th>
            <Th align="right">Count</Th>
            <Th align="right">Amount</Th>
          </Thead>
          <tbody>
            {STATUS_ROWS.map(({ label, count, amount }) => (
              <tr key={label}>
                <Td className="whitespace-nowrap">{label}</Td>
                <Td align="right" mono>{count}</Td>
                <Td align="right" mono className="whitespace-nowrap">{amount}</Td>
              </tr>
            ))}
          </tbody>
        </PanelTable>

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
      </PanelBody>
    </PanelShell>
  )
}
