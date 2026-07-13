"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { WEEK_COMPARE, DAILY_SALES, WEEKDAY_AVG_TRANSACTIONS, SATURDAY_DRILLDOWN, SLOWEST_DAY } from "@/lib/ask-nanci/data/panels/sales-snapshot"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight, PanelTable, Th, Td, formatCurrency } from "@/components/ask-nanci/shared"

export function SalesSnapshotPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Weekly Sales Trend"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("sales-snapshot")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <NanciInsight>
              <span className="font-bold">+{WEEK_COMPARE.changePct}% vs last week</span> — you brought in {formatCurrency(WEEK_COMPARE.thisWeek)} against {formatCurrency(WEEK_COMPARE.lastWeek)}, driven almost entirely by Saturday. You ran {SATURDAY_DRILLDOWN.transactions} transactions that day versus a weekday average of {WEEKDAY_AVG_TRANSACTIONS}, while your average ticket held steady around $29–43. This was a busier week, not bigger baskets. {SLOWEST_DAY.day} was your softest day at {formatCurrency(SLOWEST_DAY.sales)}.
        </NanciInsight>

        <div>
          <p className="text-base font-bold text-foreground">This Week vs Last Week Sales</p>
          <p className="mb-2 text-sm text-muted-foreground">Week of May 11–17 vs. Week of May 4–10</p>
          <PanelTable className="table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="border-b bg-muted/40">
                <Th></Th>
                <Th align="right">Last Week</Th>
                <Th align="right">This Week</Th>
                <Th align="right">Change</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td></Td>
                <Td align="right" mono>{formatCurrency(WEEK_COMPARE.lastWeek)}</Td>
                <Td align="right" mono>{formatCurrency(WEEK_COMPARE.thisWeek)}</Td>
                <Td align="right" mono className="text-green-600 dark:text-green-400">+{WEEK_COMPARE.changePct}%</Td>
              </tr>
            </tbody>
          </PanelTable>
        </div>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Daily Sales</p>
          <PanelTable className="table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="border-b bg-muted/40">
                <Th>Day</Th>
                <Th align="right">Sales</Th>
                <Th align="right">Transactions</Th>
                <Th align="right">Avg Ticket</Th>
              </tr>
            </thead>
            <tbody>
              {DAILY_SALES.map((d) => (
                <tr key={d.day} className={d.isBest ? "bg-green-50 dark:bg-green-950/20" : ""}>
                  <Td>{d.date}</Td>
                  <Td align="right" mono className={d.isBest ? "font-semibold text-green-700 dark:text-green-400" : undefined}>
                    {formatCurrency(d.sales)}
                  </Td>
                  <Td align="right" mono>{d.transactions}</Td>
                  <Td align="right" mono>{formatCurrency(d.avgTicket)}</Td>
                </tr>
              ))}
            </tbody>
          </PanelTable>
        </div>
      </div>
    </PanelShell>
  )
}
