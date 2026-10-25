"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { LOCATIONS_WINDOW, LOCATION_ROWS, VENUES } from "@/lib/ask-nanci/data/panels/resy-reports"
import { PanelShell, PanelHeader, PanelBody, PanelFigureTable, Td } from "@/components/shared"

const HEADERS = ["", ...VENUES.map((v) => v.name), "Group"]

export function ResyLocationsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title="No-shows by location" subtitle={LOCATIONS_WINDOW} size="lg" onClose={() => closeDynamicPanel("resy-locations")} />
      <PanelBody className="space-y-3">
        <PanelFigureTable headers={HEADERS}>
          {LOCATION_ROWS.map((r) => (
            <tr key={r.label}>
              <Td>{r.label}</Td>
              {r.values.map((value, i) => <Td key={HEADERS[i + 1]} align="right" className="tabular-nums">{value}</Td>)}
            </tr>
          ))}
        </PanelFigureTable>
        <p className="text-xs text-muted-foreground">Booked covers and no-shows from Resy. Card sales per cover and Amex share from each venue&apos;s card processing.</p>
      </PanelBody>
    </PanelShell>
  )
}
