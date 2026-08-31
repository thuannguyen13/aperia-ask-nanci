"use client"

import { ArrowUpRight } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW15_FOLLOWUP } from "@/lib/ask-nanci/data/flows.concept"
import { SATURDAY_DRILLDOWN, WEEKDAY_AVG_TRANSACTIONS, WEEKDAY_AVG_TICKET } from "@/lib/ask-nanci/data/panels/sales-snapshot"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, NanciInsight, StatCard, formatCurrency } from "@/components/shared"

export function SalesDrilldownPanel() {
  const { closeDynamicPanel, handlePrompt } = useAskNanci()

  // Signed, because ticket can land either side of the weekday average — the sublabels
  // used to hardcode a leading "+", which reads as "+-1%" the moment it goes negative.
  const signedPct = (value: number, baseline: number) => {
    const pct = Math.round(((value - baseline) / baseline) * 100)
    return `${pct >= 0 ? "+" : ""}${pct}%`
  }
  const txnChangePct = signedPct(SATURDAY_DRILLDOWN.transactions, WEEKDAY_AVG_TRANSACTIONS)
  const ticketChangePct = signedPct(SATURDAY_DRILLDOWN.avgTicket, WEEKDAY_AVG_TICKET)

  return (
    <PanelShell>
      <PanelHeader
        title={`${SATURDAY_DRILLDOWN.date} · Sales`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("sales-drilldown")}
      />

      <PanelBody className="space-y-4">
        <NanciInsight>
              Saturday was your best day at {formatCurrency(SATURDAY_DRILLDOWN.sales)}, and it was traffic — not ticket size. You ran {SATURDAY_DRILLDOWN.transactions} transactions versus a weekday average of {WEEKDAY_AVG_TRANSACTIONS}, while your average ticket held steady at {formatCurrency(SATURDAY_DRILLDOWN.avgTicket)} against a {formatCurrency(WEEKDAY_AVG_TICKET)} weekday average.
        </NanciInsight>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Vs Weekday Average</p>
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="Transactions"
              value={SATURDAY_DRILLDOWN.transactions}
              sublabel={`vs ${WEEKDAY_AVG_TRANSACTIONS} avg · ${txnChangePct}`}
            />
            <StatCard
              label="Avg. ticket"
              value={formatCurrency(SATURDAY_DRILLDOWN.avgTicket)}
              sublabel={`vs ${formatCurrency(WEEKDAY_AVG_TICKET)} avg · ${ticketChangePct}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border px-3 py-3">
          <div>
            <p className="text-foreground">Total Sales</p>
            <p className="text-xs text-muted-foreground">{SATURDAY_DRILLDOWN.date}</p>
          </div>
          <p className="text-xl font-bold text-foreground">{formatCurrency(SATURDAY_DRILLDOWN.sales)}</p>
        </div>

        <button
          onClick={() => handlePrompt(CONCEPT_FLOW15_FOLLOWUP)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
        >
          {CONCEPT_FLOW15_FOLLOWUP} <ArrowUpRight className="size-3.5" />
        </button>
      </PanelBody>
    </PanelShell>
  )
}
