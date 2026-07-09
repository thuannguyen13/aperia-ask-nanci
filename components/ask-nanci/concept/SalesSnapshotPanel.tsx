"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { WEEK_COMPARE, DAILY_SALES, WEEKDAY_AVG_TRANSACTIONS, SATURDAY_DRILLDOWN } from "@/lib/ask-nanci/data/panels/sales-snapshot"
import { PanelShell, PanelHeader, PanelExportButton, Callout, StatCard, formatCurrency } from "@/components/ask-nanci/shared"

export function SalesSnapshotPanel() {
  const { closeDynamicPanel, salesDrilldownOpen } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Weekly Sales Trend"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("sales-snapshot")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <Callout variant="blue">
          +{WEEK_COMPARE.changePct}% vs last week — you brought in {formatCurrency(WEEK_COMPARE.thisWeek)} against {formatCurrency(WEEK_COMPARE.lastWeek)}, driven almost entirely by Saturday. You ran {SATURDAY_DRILLDOWN.transactions} transactions that day versus a weekday average of {WEEKDAY_AVG_TRANSACTIONS}, while your average ticket held steady.
        </Callout>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">This Week vs Last Week</p>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr className="border-b bg-muted/40">
                  <th></th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">Last Week</th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">This Week</th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td className="px-3 py-2 text-right text-foreground">{formatCurrency(WEEK_COMPARE.lastWeek)}</td>
                  <td className="px-3 py-2 text-right text-foreground">{formatCurrency(WEEK_COMPARE.thisWeek)}</td>
                  <td className="px-3 py-2 text-right text-green-600 dark:text-green-400">+{WEEK_COMPARE.changePct}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="mb-2 text-base font-bold text-foreground">Daily Sales</p>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-3 py-2 text-left font-medium text-foreground">Day</th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">Sales</th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">Transactions</th>
                  <th className="px-3 py-2 text-right font-medium text-foreground">Avg Ticket</th>
                </tr>
              </thead>
              <tbody>
                {DAILY_SALES.map((d) => (
                  <tr key={d.day} className={cn("border-b last:border-0", d.isBest ? "bg-green-50 dark:bg-green-950/20" : "")}>
                    <td className="px-3 py-2">
                      <p className="text-foreground">{d.day}</p>
                      <p className="text-xs text-muted-foreground">{d.date}</p>
                    </td>
                    <td className={cn("px-3 py-2 text-right", d.isBest ? "font-semibold text-green-700 dark:text-green-400" : "text-foreground")}>
                      {formatCurrency(d.sales)}
                    </td>
                    <td className="px-3 py-2 text-right text-foreground">{d.transactions}</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(d.avgTicket)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {salesDrilldownOpen && (
            <div className="mt-3">
              <p className="mb-2 text-base font-bold text-foreground">{SATURDAY_DRILLDOWN.date} — Sales</p>
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  label="Vs Weekday Average"
                  value={`${SATURDAY_DRILLDOWN.transactions} txns`}
                  sublabel={`Weekday avg: ${WEEKDAY_AVG_TRANSACTIONS}`}
                  emphasis
                />
                <StatCard
                  label="Total Sales"
                  value={formatCurrency(SATURDAY_DRILLDOWN.sales)}
                  sublabel={`Avg ticket ${formatCurrency(SATURDAY_DRILLDOWN.avgTicket)}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </PanelShell>
  )
}
