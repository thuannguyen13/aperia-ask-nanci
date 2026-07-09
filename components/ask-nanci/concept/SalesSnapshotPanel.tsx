"use client"

import Image from "next/image"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { WEEK_COMPARE, DAILY_SALES, WEEKDAY_AVG_TRANSACTIONS, SATURDAY_DRILLDOWN, SLOWEST_DAY } from "@/lib/ask-nanci/data/panels/sales-snapshot"
import { PanelShell, PanelHeader, PanelExportButton, Callout, formatCurrency } from "@/components/ask-nanci/shared"

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
        <Callout variant="blue">
          <div className="flex items-start gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p>
              <span className="font-bold">+{WEEK_COMPARE.changePct}% vs last week</span> — you brought in {formatCurrency(WEEK_COMPARE.thisWeek)} against {formatCurrency(WEEK_COMPARE.lastWeek)}, driven almost entirely by Saturday. You ran {SATURDAY_DRILLDOWN.transactions} transactions that day versus a weekday average of {WEEKDAY_AVG_TRANSACTIONS}, while your average ticket held steady around $29–43. This was a busier week, not bigger baskets. {SLOWEST_DAY.day} was your softest day at {formatCurrency(SLOWEST_DAY.sales)}.
            </p>
          </div>
        </Callout>

        <div>
          <p className="text-base font-bold text-foreground">This Week vs Last Week Sales</p>
          <p className="mb-2 text-sm text-muted-foreground">Week of May 11–17 vs. Week of May 4–10</p>
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
                    <td className="px-3 py-2 text-foreground">{d.date}</td>
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
        </div>
      </div>
    </PanelShell>
  )
}
