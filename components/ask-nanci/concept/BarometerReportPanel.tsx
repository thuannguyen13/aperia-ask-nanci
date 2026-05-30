"use client"

import { X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"

const STATUS_ROWS = [
  { label: "Alerted",          count: 14, amount: "$380,000.00" },
  { label: "Ready to Work",    count: 11, amount: "$290,000.00" },
  { label: "Work In Progress", count: 3,  amount: "$90,000.00"  },
  { label: "Worked",           count: 0,  amount: "$0.00"       },
  { label: "Requeue",          count: 2,  amount: "$52,000.00"  },
]

const MERCHANT_ROWS = [
  { id: "00078166655", name: "Coastal Merchant Solutions", score: 89, status: "Alerted",          amount: "$42,000.00",  delta: "+45" },
  { id: "00041293847", name: "Pacific Trade Group",        score: 83, status: "Ready to Work",    amount: "$28,500.00",  delta: "+18" },
  { id: "00065432198", name: "Harbor Bay Distributors",    score: 81, status: "Ready to Work",    amount: "$19,200.00",  delta: "+12" },
  { id: "00029384756", name: "Summit Retail Partners",     score: 74, status: "Ready to Work",    amount: "$33,800.00",  delta: "+8"  },
  { id: "00093847561", name: "Westbrook Commerce LLC",     score: 71, status: "Work In Progress",  amount: "$21,600.00",  delta: "+5"  },
  { id: "00047382910", name: "Blue Water Imports",         score: 68, status: "Alerted",          amount: "$15,400.00",  delta: "+22" },
  { id: "00018273645", name: "Inland Valley Merchants",    score: 65, status: "Ready to Work",    amount: "$11,700.00",  delta: "+3"  },
  { id: "00056473829", name: "Cascade Trading Co.",        score: 62, status: "Work In Progress",  amount: "$8,900.00",   delta: "+9"  },
  { id: "00072938471", name: "Sunrise Enterprise Group",   score: 58, status: "Alerted",          amount: "$27,300.00",  delta: "+31" },
  { id: "00034829173", name: "Ridgeline Merchant Services",score: 55, status: "Ready to Work",    amount: "$9,100.00",   delta: "+7"  },
]

function ScoreBadge({ score }: { score: number }) {
  const high = score >= 80
  const med  = score >= 60
  return (
    <span className={cn(
      "inline-block rounded-full px-2 py-0.5 text-[10px] font-bold font-mono",
      high ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
           : med ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                 : "bg-muted text-muted-foreground",
    )}>
      {score}
    </span>
  )
}

export function BarometerReportPanel() {
  const { closePanel, closeAllNewPanels } = useAskNanci()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Barometer Report</p>
        <div className="flex items-center gap-2">
          <button className="rounded-md border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
            Filter
          </button>
          <button
            onClick={() => { closePanel("barometer-report"); closeAllNewPanels() }}
            className="ml-1 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Assignment header */}
        <div className="border-b px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">High Velocity Watch</p>
              <p className="text-xs text-muted-foreground">05/24/2026</p>
            </div>
            <button className="shrink-0 rounded-md border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
              Assignment Details
            </button>
          </div>

          {/* General info */}
          <div className="rounded-lg border px-3 py-2 space-y-1.5">
            <p className="text-xs font-semibold text-foreground">General Information</p>
            {[
              { label: "Assignment Name",         value: "High Velocity Watch" },
              { label: "Assignment Type",         value: "DQ" },
              { label: "Eligible Merchant Count", value: "14" },
              { label: "Percent Worked",          value: "0%" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">{value}</span>
              </div>
            ))}
          </div>

          {/* Status table */}
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground">Status</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-muted-foreground">Count</th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {STATUS_ROWS.map(({ label, count, amount }) => (
                  <tr key={label} className="border-t border-border/50">
                    <td className="px-3 py-2 text-foreground">{label}</td>
                    <td className="px-3 py-2 text-right font-mono text-foreground">{count}</td>
                    <td className="px-3 py-2 text-right font-mono text-foreground">{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Merchant Activity */}
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Merchant Activity</p>
            <span className="text-[10px] text-muted-foreground">Sorted by risk score</span>
          </div>

          <div className="rounded-md border overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground border-r border-border">Merchant</th>
                <th className="px-2 py-2 text-center text-[10px] font-semibold text-muted-foreground border-r border-border">Score</th>
                <th className="px-2 py-2 text-left text-[10px] font-semibold text-muted-foreground border-r border-border">Status</th>
                <th className="px-2 py-2 text-right text-[10px] font-semibold text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {MERCHANT_ROWS.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t border-border/40",
                    row.score >= 80 ? "bg-red-50/40 dark:bg-red-950/10" : "",
                    i === 0 ? "font-medium" : "",
                  )}
                >
                  <td className="px-3 py-2 border-r border-border/40">
                    <p className="text-foreground truncate max-w-[140px]">{row.name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{row.id}</p>
                  </td>
                  <td className="px-2 py-2 text-center border-r border-border/40">
                    <ScoreBadge score={row.score} />
                  </td>
                  <td className="px-2 py-2 text-muted-foreground text-[10px] whitespace-nowrap border-r border-border/40">{row.status}</td>
                  <td className="px-2 py-2 text-right font-mono text-foreground">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}
