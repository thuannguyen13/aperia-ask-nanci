"use client"

import { REALERT_ROWS } from "@/lib/ask-nanci/data/risk-dashboard"
import { findAssignment } from "@/lib/ask-nanci/data/risk-assignments"
import { TableBody, TableRow } from "aperia-ds5"
import { PanelTable, Thead, Th, Td, formatPercent } from "@/components/shared"
import { useRiskNav } from "../RiskNavContext"

// Re-alert rate by assignment with an inline rate bar and Nanci's suggested action.
// Every row is a detection queue, so the name opens that queue's Barometer Report —
// the ranked merchant list behind the rate — rather than the assignment's settings.
// The alert-volume bars still go to Assignment Management.
export function RealertTable() {
  const nav = useRiskNav()
  return (
    <PanelTable density="comfortable">
      <Thead>
        <Th sortable>Assignment</Th>
        <Th sortable>Worked</Th>
        <Th sortable>Re-alerted</Th>
        <Th sortable>Re-alert rate</Th>
        <Th sortable>Suggested action</Th>
      </Thead>
      <TableBody>
        {REALERT_ROWS.map((r) => (
          <TableRow key={r.assignmentId}>
            <Td>
              <button
                onClick={() => nav.openBarometer()}
                className="text-left font-medium text-primary hover:underline"
              >
                {/* The full name, the same string the Detection Queue card and the
                    Barometer Report title show. The chart-width `short` label read
                    as a different assignment from the page it opens. */}
                {findAssignment(r.assignmentId)?.name ?? r.assignmentId}
              </button>
            </Td>
            <Td mono>{r.worked.toLocaleString()}</Td>
            <Td mono>{r.realerted.toLocaleString()}</Td>
            <Td>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-orange-100 dark:bg-orange-950/40">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(r.rate * 2, 100)}%` }} />
                </div>
                <span className="font-mono">{formatPercent(r.rate)}</span>
              </div>
            </Td>
            <Td>{r.action}</Td>
          </TableRow>
        ))}
      </TableBody>
    </PanelTable>
  )
}
