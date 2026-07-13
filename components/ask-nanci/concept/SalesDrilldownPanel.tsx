"use client"

import { ArrowUpRight } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW15_FOLLOWUP } from "@/lib/ask-nanci/concept-config"
import { SATURDAY_DRILLDOWN, WEEKDAY_AVG_TRANSACTIONS, WEEKDAY_AVG_TICKET } from "@/lib/ask-nanci/data/panels/sales-snapshot"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight, StatCard, formatCurrency } from "@/components/ask-nanci/shared"

export function SalesDrilldownPanel() {
  const { closeDynamicPanel, handlePrompt } = useAskNanci()

  const txnChangePct = Math.round(((SATURDAY_DRILLDOWN.transactions - WEEKDAY_AVG_TRANSACTIONS) / WEEKDAY_AVG_TRANSACTIONS) * 100)
  const ticketChangePct = Math.round(((SATURDAY_DRILLDOWN.avgTicket - WEEKDAY_AVG_TICKET) / WEEKDAY_AVG_TICKET) * 100)

  return (
    <PanelShell>
      <PanelHeader
        title={`${SATURDAY_DRILLDOWN.date} · Sales`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("sales-drilldown")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <NanciInsight>
              Saturday was your best day this week at {formatCurrency(SATURDAY_DRILLDOWN.sales)}. Both traffic and basket size were up — you ran {SATURDAY_DRILLDOWN.transactions} transactions versus a weekday average of {WEEKDAY_AVG_TRANSACTIONS}, and your average ticket rose to {formatCurrency(SATURDAY_DRILLDOWN.avgTicket)} versus a weekday average of {formatCurrency(WEEKDAY_AVG_TICKET)}.
        </NanciInsight>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Vs Weekday Average</p>
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              label="Transactions"
              value={SATURDAY_DRILLDOWN.transactions}
              sublabel={`vs ${WEEKDAY_AVG_TRANSACTIONS} avg · +${txnChangePct}%`}
            />
            <StatCard
              label="Avg. ticket"
              value={formatCurrency(SATURDAY_DRILLDOWN.avgTicket)}
              sublabel={`vs ${formatCurrency(WEEKDAY_AVG_TICKET)} avg · +${ticketChangePct}%`}
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
      </div>
    </PanelShell>
  )
}
