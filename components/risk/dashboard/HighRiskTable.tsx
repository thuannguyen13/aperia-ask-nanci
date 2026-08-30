"use client"

import { HIGH_RISK_MERCHANTS } from "@/lib/ask-nanci/data/risk-dashboard"
import { formatMcScore } from "@/lib/ask-nanci/data/risk-merchants"
import { TableBody, TableRow } from "aperia-ds5"
import { PanelTable, Thead, Th, Td } from "@/components/shared"
import { useRiskNav } from "../RiskNavContext"

// Merchants whose MC score jumped most — the drivers behind today's risk. Each name
// drills into that merchant's Risk Report, the same destination the Barometer list
// opens, so the dashboard is a way into the portfolio rather than a readout of it.
export function HighRiskTable() {
  const nav = useRiskNav()
  return (
    <PanelTable density="comfortable">
      <Thead>
        <Th sortable>Merchant</Th>
        <Th sortable>MC score change</Th>
        <Th sortable align="right">Delta</Th>
      </Thead>
      <TableBody>
        {HIGH_RISK_MERCHANTS.map((m) => (
          <TableRow key={m.id}>
            <Td>
              <button onClick={() => nav.openMerchant(m.id)} className="font-medium text-primary hover:underline">{m.name}</button>
            </Td>
            <Td mono>{formatMcScore(m.from)} → {formatMcScore(m.to)}</Td>
            <Td mono align="right">+{m.delta}</Td>
          </TableRow>
        ))}
      </TableBody>
    </PanelTable>
  )
}
