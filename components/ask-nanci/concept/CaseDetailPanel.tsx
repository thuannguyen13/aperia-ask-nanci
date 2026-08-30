"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { TIMELINE } from "@/lib/ask-nanci/data/panels/case-detail"
import { PanelShell, PanelHeader } from "@/components/shared"

export function CaseDetailPanel() {
  const { closePanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="CS-8821"
        dot="bg-amber-400"
        badge={{ label: "IN REVIEW", className: "rounded bg-amber-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" }}
        subtitle="Oak Street Coffee · Chargeback"
        onClose={() => closePanel("case")}
      />

      <div className="flex-1 overflow-auto">
        {/* Summary grid */}
        <div className="border-b px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
          <p className="col-span-2 text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-0.5">Case Summary</p>
          {[
            ["Amount",   "$284.50"],
            ["Txn Date", "May 14, 2026"],
            ["Card",     "Visa ····4821"],
            ["Cardholder", "J. Martinez"],
            ["Reason",   "Item not received"],
            ["Deadline", "May 28, 2026"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[9px] text-muted-foreground">{label}</p>
              <p className="font-mono text-xs font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="px-4 py-3">
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Activity</p>
          <div className="relative pl-5">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
            <div className="space-y-4">
              {TIMELINE.map(({ icon: Icon, time, label, detail, color }, i) => (
                <div key={i} className="relative flex gap-3">
                  <div className="absolute -left-5 flex size-4 items-center justify-center rounded-full border bg-background">
                    <Icon className={`size-2.5 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold text-foreground">{label}</span>
                      <span className="font-mono text-[9px] text-muted-foreground">{time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call notes */}
        <div className="border-t mx-4 mb-4 pt-3">
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Call Notes</p>
          <blockquote className="border-l-2 border-blue-300 pl-3 text-[11px] text-muted-foreground leading-relaxed italic dark:border-blue-700">
            "Customer purchased a custom cake order. Deposit taken at time of order, balance at pickup. Customer collected and signed. No complaints at pickup. No-refund policy posted at register and printed on receipt."
          </blockquote>
        </div>
      </div>
    </PanelShell>
  )
}
