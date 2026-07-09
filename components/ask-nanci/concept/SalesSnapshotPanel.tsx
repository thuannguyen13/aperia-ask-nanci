"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { WEEK_COMPARE, DAILY_SALES, WEEKDAY_AVG_TRANSACTIONS, SATURDAY_DRILLDOWN } from "@/lib/ask-nanci/data/panels/sales-snapshot"
import { PanelShell, PanelHeader, PanelExportButton, Callout, StatCard, formatCurrency } from "@/components/ask-nanci/shared"

export function SalesSnapshotPanel() {
  const { closePanel, salesDrilldownOpen } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Weekly Sales Trend"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closePanel("sales-snapshot")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <Callout variant="blue">
          +{WEEK_COMPARE.changePct}% vs last week — you brought in {formatCurrency(WEEK_COMPARE.thisWeek)} against {formatCurrency(WEEK_COMPARE.lastWeek)}, driven almost entirely by Saturday. You ran {SATURDAY_DRILLDOWN.transactions} transactions that day versus a weekday average of {WEEKDAY_AVG_TRANSACTIONS}, while your average ticket held steady.
        </Callout>

        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">This Week vs Last Week</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Last Week</th>
                <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">This Week</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 font-mono text-muted-foreground">{formatCurrency(WEEK_COMPARE.lastWeek)}</td>
                <td className="px-3 py-2 font-mono font-medium text-foreground">{formatCurrency(WEEK_COMPARE.thisWeek)}</td>
                <td className="px-3 py-2 text-right font-mono font-medium text-green-600 dark:text-green-400">+{WEEK_COMPARE.changePct}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Daily Sales</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-3 py-2 text-left text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Day</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Sales</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Transactions</th>
                <th className="px-3 py-2 text-right text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Avg Ticket</th>
              </tr>
            </thead>
            <tbody>
              {DAILY_SALES.map((d) => (
                <tr key={d.day} className={cn("border-b last:border-0", d.isBest ? "bg-green-50 dark:bg-green-950/20" : "")}>
                  <td className="px-3 py-2">
                    <p className="font-medium text-foreground">{d.day}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{d.date}</p>
                  </td>
                  <td className={cn("px-3 py-2 text-right font-mono", d.isBest ? "font-semibold text-green-700 dark:text-green-400" : "text-foreground")}>
                    {formatCurrency(d.sales)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">{d.transactions}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">{formatCurrency(d.avgTicket)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {salesDrilldownOpen && (
            <div className="mt-3">
              <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">{SATURDAY_DRILLDOWN.date} — Sales</p>
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
