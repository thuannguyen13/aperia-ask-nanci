"use client"

import { ChevronsUpDown } from "lucide-react"
import { HIGH_RISK_MERCHANTS } from "@/lib/ask-nanci/data/risk-dashboard"
import { formatMcScore } from "@/lib/ask-nanci/data/risk-merchants"

// ponytail: display-only sort affordance — the Figma is static, no sorting yet.
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`px-3 py-2 font-medium ${right ? "text-right" : ""}`}>
      <span className="inline-flex items-center gap-1">{children}<ChevronsUpDown className="size-3 text-muted-foreground" /></span>
    </th>
  )
}

// Merchants whose MC score jumped most — the drivers behind today's risk.
export function HighRiskTable() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-foreground">
            <Th>Merchant</Th>
            <Th>MC Score Change</Th>
            <Th right>Delta</Th>
          </tr>
        </thead>
        <tbody>
          {HIGH_RISK_MERCHANTS.map((m) => (
            <tr key={m.name} className="border-b last:border-0">
              <td className="px-3 py-2 font-medium text-primary">{m.name}</td>
              <td className="px-3 py-2 tabular-nums text-foreground">{formatMcScore(m.from)} → {formatMcScore(m.to)}</td>
              <td className="px-3 py-2 text-right tabular-nums text-foreground">+{m.delta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
