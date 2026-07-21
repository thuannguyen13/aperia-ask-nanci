"use client"

import { ChevronsUpDown } from "lucide-react"
import { REALERT_ROWS } from "@/lib/ask-nanci/data/risk-dashboard"

// ponytail: display-only sort affordance — the Figma is static, no sorting yet.
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`px-3 py-2 font-medium ${right ? "text-right" : ""}`}>
      <span className="inline-flex items-center gap-1">{children}<ChevronsUpDown className="size-3 text-muted-foreground" /></span>
    </th>
  )
}

// Re-alert rate by assignment with an inline rate bar and Nanci's suggested action.
export function RealertTable() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-foreground">
            <Th>Assignment</Th>
            <Th>Worked</Th>
            <Th>Re-alerted</Th>
            <Th>Re-alert Rate</Th>
            <Th>Suggested Action</Th>
          </tr>
        </thead>
        <tbody>
          {REALERT_ROWS.map((r) => (
            <tr key={r.assignment} className="border-b last:border-0">
              <td className="px-3 py-2 font-medium text-primary">{r.assignment}</td>
              <td className="px-3 py-2 tabular-nums text-foreground">{r.worked.toLocaleString()}</td>
              <td className="px-3 py-2 tabular-nums text-foreground">{r.realerted.toLocaleString()}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full bg-orange-100 dark:bg-orange-950/40">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(r.rate * 2, 100)}%` }} />
                  </div>
                  <span className="tabular-nums text-foreground">{r.rate.toFixed(1)}%</span>
                </div>
              </td>
              <td className="px-3 py-2 text-foreground">{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
