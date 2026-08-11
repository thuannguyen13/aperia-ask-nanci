"use client"

import { REALERT_ROWS } from "@/lib/ask-nanci/data/risk-dashboard"
import { findAssignment } from "@/lib/ask-nanci/data/risk-assignments"
import { TableBody, TableRow } from "aperia-ds5"
import { PanelTable, Thead, Th, Td, formatPercent } from "@/components/ask-nanci/shared"
import { useRiskNav } from "../RiskNavContext"

// Re-alert rate by assignment with an inline rate bar and Nanci's suggested action.
// The assignment name drills into Assignment Management, same as the alert-volume bars.
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
                onClick={() => nav.openAssignment(r.assignmentId)}
                title={findAssignment(r.assignmentId)?.name}
                className="font-medium text-primary hover:underline"
              >
                {findAssignment(r.assignmentId)?.short ?? r.assignmentId}
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
