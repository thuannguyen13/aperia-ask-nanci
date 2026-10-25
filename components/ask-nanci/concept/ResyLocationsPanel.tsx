"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { LOCATIONS_WINDOW, LOCATION_ROWS, VENUES } from "@/lib/ask-nanci/data/panels/resy-reports"
import { PanelShell, PanelHeader, PanelBody, PanelTable, Thead, Th, Td } from "@/components/shared"

const COLUMNS = [...VENUES.map((v) => v.name), "Group"]

// PanelTable rather than PanelFigureTable: five columns squeezed into fixed equal widths
// overlap on a phone, so this table sizes to its figures and scrolls under the pinned labels.
export function ResyLocationsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title="No-shows by location" subtitle={LOCATIONS_WINDOW} size="lg" onClose={() => closeDynamicPanel("resy-locations")} />
      <PanelBody className="space-y-3">
        <PanelTable pinFirst>
          <Thead>
            <Th />
            {COLUMNS.map((c) => <Th key={c} align="right">{c}</Th>)}
          </Thead>
          <tbody>
            {LOCATION_ROWS.map((r) => (
              <tr key={r.label}>
                <Td className="min-w-32">{r.label}</Td>
                {r.values.map((value, i) => <Td key={COLUMNS[i]} align="right" className="whitespace-nowrap tabular-nums">{value}</Td>)}
              </tr>
            ))}
          </tbody>
        </PanelTable>
        <p className="text-xs text-muted-foreground">Booked covers and no-shows from Resy. Card sales per cover and Amex share from each venue&apos;s card processing.</p>
      </PanelBody>
    </PanelShell>
  )
}
