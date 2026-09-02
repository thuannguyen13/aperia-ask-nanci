"use client"

import { REALERT_ROWS } from "@/lib/ask-nanci/data/risk-dashboard"
import { findAssignment } from "@/lib/ask-nanci/data/risk-assignments"
import { TableBody, TableRow } from "aperia-ds5"
import { PanelTable, Thead, Th, Td, formatPercent } from "@/components/shared"
import { useRiskNav } from "../RiskNavContext"
import { useDashboardScope } from "./DashboardScope"

// Re-alert rate by assignment with an inline rate bar and Nanci's suggested action.
// Every row is a detection queue, so the name opens that queue's Barometer Report —
// the ranked merchant list behind the rate — rather than the assignment's settings.
// The alert-volume bars still go to Assignment Management.
export function RealertTable() {
  const nav = useRiskNav()
  // Re-alert rate is a period metric of its own (see REALERT_ROWS), so the row's
  // period does not reach it — only the assignment narrowing does.
  const { assignmentIds } = useDashboardScope()
  const rows = REALERT_ROWS.filter((r) => !assignmentIds || assignmentIds.includes(r.assignmentId))
  return (
    <PanelTable density="comfortable">
      <Thead>
        <Th sortable>Assignment</Th>
        {/* Scoped on purpose: the queue cards report today (0 worked), these are
            the reporting window the rate is measured over. Unlabelled, the two
            read as the same quantity with two values. */}
        <Th sortable>Worked (30d)</Th>
        <Th sortable>Re-alerted (30d)</Th>
        <Th sortable>Re-alert rate</Th>
        <Th sortable>Suggested action</Th>
      </Thead>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <Td colSpan={5} className="py-8 text-center text-muted-foreground">
              No assignment in scope has a re-alert rate.
            </Td>
          </TableRow>
        )}
        {rows.map((r) => (
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
