"use client"

import { HIGH_RISK_MERCHANTS } from "@/lib/ask-nanci/data/risk-dashboard"

// Merchants whose MC score jumped most — the drivers behind today's risk.
export function HighRiskTable() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-muted-foreground">
            <th className="px-3 py-2 font-medium">Merchant</th>
            <th className="px-3 py-2 font-medium">MC Score Change</th>
            <th className="px-3 py-2 text-right font-medium">Delta</th>
          </tr>
        </thead>
        <tbody>
          {HIGH_RISK_MERCHANTS.map((m) => (
            <tr key={m.name} className="border-b last:border-0">
              <td className="px-3 py-2 font-medium text-primary">{m.name}</td>
              <td className="px-3 py-2 tabular-nums text-foreground">{m.from} → {m.to}</td>
              <td className="px-3 py-2 text-right font-medium tabular-nums text-rose-600 dark:text-rose-400">+{m.delta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
