"use client"

import { TrendingUp } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { RISK_INFO, ACCOUNT_INFO, ACTIVITY_TABS, VOLUME_ROWS } from "@/lib/ask-nanci/data/panels/coastal-risk"
import { PanelShell, PanelHeader, PanelTable, Th, Td, Callout } from "@/components/ask-nanci/shared"

function InfoRow({ label, value, badge, highlight, large }: { label: string; value: string; badge?: boolean; highlight?: string; large?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      {badge ? (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          {value}
        </span>
      ) : large ? (
        <span className={cn("font-mono text-base font-bold", highlight === "red" ? "text-red-600 dark:text-red-400" : "text-foreground")}>
          {value}
        </span>
      ) : (
        <span className={cn(
          "min-w-0 truncate text-right font-medium",
          highlight === "red" ? "text-red-600 dark:text-red-400" : "text-foreground",
        )}>
          {value}
        </span>
      )}
    </div>
  )
}

export function CoastalRiskPanel() {
  const { closePanel, closeAllNewPanels } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Risk Report"
        subtitle="Coastal Merchant Solutions"
        onClose={() => { closePanel("coastal-risk"); closeAllNewPanels() }}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
        {/* Risk score callout */}
        <Callout variant="red" className="flex flex-col gap-2 rounded-lg px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-red-100 dark:bg-red-900/40">
              <TrendingUp className="size-3.5 text-red-600 dark:text-red-400" />
            </div>
            <span className="font-mono text-2xl font-bold text-red-600 dark:text-red-400">89</span>
            <span className="text-xs font-semibold text-red-800 dark:text-red-300">Risk Score</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-800 dark:text-red-300">Score climbed 44 → 89 in 52 days</p>
            <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">Settlement account + address changed in last 10 days</p>
          </div>
        </Callout>

        {/* Merchant Identity */}
        <div className="rounded-lg border px-3 py-2.5 space-y-2">
          <p className="text-xs font-semibold text-foreground">Merchant Identity</p>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="shrink-0 text-muted-foreground">Merchant Name</span>
            <span className="min-w-0 truncate text-right font-medium text-foreground">Coastal Merchant Solutions</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="shrink-0 text-muted-foreground">Merchant ID</span>
            <span className="min-w-0 truncate text-right font-mono text-foreground">00000000078166655</span>
          </div>
        </div>

        {/* Risk Profile Summary */}
        <div className="rounded-lg border px-3 py-2.5 space-y-2">
          <p className="text-xs font-semibold text-foreground">Risk Profile Summary</p>
          {RISK_INFO.map((row) => (
            <InfoRow key={row.label} {...row} />
          ))}
        </div>

        {/* Merchant Account Details */}
        <div className="rounded-lg border px-3 py-2.5 space-y-2">
          <p className="text-xs font-semibold text-foreground">Merchant Account Details</p>
          {ACCOUNT_INFO.map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-2 text-xs">
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="text-foreground text-right">{value}</span>
            </div>
          ))}
        </div>

        {/* Merchant Activity */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Transaction Volume Analysis</p>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b scrollbar-none">
            {ACTIVITY_TABS.map((tab, i) => (
              <button
                key={tab}
                className={cn(
                  "shrink-0 whitespace-nowrap px-2.5 py-1.5 text-[10px] font-medium border-b-2 -mb-px transition-colors",
                  i === 0
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <PanelTable className="min-w-[280px]">
              <thead>
                <tr className="border-b bg-muted/40">
                  <Th className="whitespace-nowrap">Date</Th>
                  <Th align="right" className="whitespace-nowrap">Txns</Th>
                  <Th align="right" className="whitespace-nowrap">Amount</Th>
                  <Th align="right" className="whitespace-nowrap">Avg</Th>
                </tr>
              </thead>
              <tbody>
                {VOLUME_ROWS.map((row) => (
                  <tr key={row.date}>
                    <Td mono className="whitespace-nowrap">{row.date}</Td>
                    <Td align="right" mono className="whitespace-nowrap">{row.count}</Td>
                    <Td align="right" mono className="whitespace-nowrap">{row.amount}</Td>
                    <Td align="right" mono className="text-muted-foreground whitespace-nowrap">{row.avg}</Td>
                  </tr>
                ))}
              </tbody>
            </PanelTable>
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
