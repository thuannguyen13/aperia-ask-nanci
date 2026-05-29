"use client"

import { X, TrendingUp } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"

const RISK_INFO = [
  { label: "Watch",               value: "No" },
  { label: "Status",              value: "Alerted",    badge: true },
  { label: "Profile",             value: "No-Profile" },
  { label: "Multi-Watch",         value: "ISO" },
  { label: "# Worked",            value: "0" },
  { label: "# Parameter Worked",  value: "0" },
  { label: "Worked in 30 Days",   value: "—" },
  { label: "Classification",      value: "—" },
  { label: "Multiplier",          value: "—" },
  { label: "Risk Level",          value: "High",       highlight: "red" },
  { label: "Risk Score",          value: "89",         highlight: "red", large: true },
]

const ACCOUNT_INFO = [
  { label: "First Batch Amount",  value: "—" },
  { label: "First Batch Date",    value: "—" },
  { label: "Last Batch",          value: "05/12/2026" },
  { label: "Last Statement",      value: "05/12/2026" },
  { label: "SIC/MCC",             value: "5099" },
  { label: "Owner",               value: "—" },
  { label: "Phone",               value: "(972) 392-2882" },
  { label: "Address",             value: "PAPILLION, FL 010853016" },
  { label: "URL",                 value: "—" },
  { label: "Reserve Indicator",   value: "—" },
  { label: "Reserve Target",      value: "—" },
]

const ACTIVITY_TABS = ["Volume", "Chargebacks", "Batches", "Statements", "Profile"]

const VOLUME_ROWS = [
  { date: "05/12/2026", count: 24, amount: "$8,400.00",  avg: "$350.00" },
  { date: "05/11/2026", count: 31, amount: "$12,400.00", avg: "$400.00" },
  { date: "05/10/2026", count: 28, amount: "$9,800.00",  avg: "$350.00" },
  { date: "05/09/2026", count: 19, amount: "$6,650.00",  avg: "$350.00" },
  { date: "05/08/2026", count: 22, amount: "$7,700.00",  avg: "$350.00" },
  { date: "04/15/2026", count: 8,  amount: "$2,000.00",  avg: "$250.00" },
  { date: "04/14/2026", count: 7,  amount: "$1,750.00",  avg: "$250.00" },
]

function InfoRow({ label, value, badge, highlight, large }: { label: string; value: string; badge?: boolean; highlight?: string; large?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground shrink-0">{label}</span>
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
          "font-medium",
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
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">Risk Report</p>
          <p className="text-[10px] text-muted-foreground truncate">Coastal Merchant Solutions</p>
        </div>
        <button
          onClick={() => { closePanel("coastal-risk"); closeAllNewPanels() }}
          className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
        {/* Risk score callout */}
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-800/60 dark:bg-red-950/20">
          <div className="flex size-8 shrink-0 items-center justify-center rounded bg-red-100 dark:bg-red-900/40">
            <TrendingUp className="size-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-red-800 dark:text-red-300">Score climbed 44 → 89 in 52 days</p>
            <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">Settlement account + address changed in last 10 days</p>
          </div>
          <span className="font-mono text-2xl font-bold text-red-600 dark:text-red-400 shrink-0">89</span>
        </div>

        {/* Merchant Identity */}
        <div className="rounded-lg border px-3 py-2.5 space-y-2">
          <p className="text-xs font-semibold text-foreground">Merchant Identity</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Merchant Name</span>
            <span className="text-foreground font-medium">Coastal Merchant Solutions</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Merchant ID</span>
            <span className="font-mono text-foreground">00000000078166655</span>
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
          <div className="flex gap-1 border-b">
            {ACTIVITY_TABS.map((tab, i) => (
              <button
                key={tab}
                className={cn(
                  "px-2.5 py-1.5 text-[10px] font-medium border-b-2 -mb-px transition-colors",
                  i === 0
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <table className="w-full text-xs border-collapse rounded-md border overflow-hidden">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground">Date</th>
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted-foreground">Txns</th>
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted-foreground">Amount</th>
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted-foreground">Avg</th>
              </tr>
            </thead>
            <tbody>
              {VOLUME_ROWS.map((row) => (
                <tr key={row.date} className="border-t border-border/40">
                  <td className="px-3 py-2 font-mono text-[10px] text-foreground">{row.date}</td>
                  <td className="px-2 py-2 text-right font-mono text-foreground">{row.count}</td>
                  <td className="px-2 py-2 text-right font-mono text-foreground">{row.amount}</td>
                  <td className="px-2 py-2 text-right font-mono text-muted-foreground">{row.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
