"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  STOCK_ITEMS, STOCK_SUMMARY, STOCK_TABLE_LABEL, STOCK_SOURCE_NOTE,
  formatDaysOfCover, isCritical,
} from "@/lib/ask-nanci/data/panels/inventory"
import {
  PanelShell, PanelHeader, PanelBody, PanelExportButton, StatCard,
  PanelTable, Thead, Th, Td,
} from "@/components/shared"

const PANEL_ID = "running-low"

// Ranked Report shape: what the kitchen is about to run out of, sorted by days of
// cover rather than by how much is left. The tinted rows are the two items inside the
// critical threshold — the reason the panel opened, so they carry a background rather
// than only a border.
export function RunningLowPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Running Low"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel(PANEL_ID)}
      />

      <PanelBody>
        <div className="grid grid-cols-3 gap-3">
          {STOCK_SUMMARY.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.count} sublabel={s.sub} tone={s.warn ? "amber" : undefined} />
          ))}
        </div>

        <p className="mb-2 mt-5 text-sm font-bold text-foreground">{STOCK_TABLE_LABEL}</p>
        <PanelTable>
          <Thead>
            <Th>Item</Th>
            <Th align="right">On hand</Th>
            <Th align="right">Selling</Th>
            <Th align="right">Days left</Th>
            <Th align="right">Runs out</Th>
          </Thead>
          <tbody>
            {STOCK_ITEMS.map((item) => {
              const critical = isCritical(item)
              return (
                <tr key={item.name} className={cn(critical && "bg-amber-50 dark:bg-amber-950/20")}>
                  <Td className="font-medium">{item.name}</Td>
                  <Td mono align="right">{item.onHand}</Td>
                  <Td mono align="right">{item.pace}</Td>
                  <Td mono align="right" className={cn("font-semibold", critical && "text-amber-700 dark:text-amber-400")}>
                    {formatDaysOfCover(item)}
                  </Td>
                  <Td align="right" className={cn(critical ? "font-medium text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>
                    {item.runsOut}
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </PanelTable>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {STOCK_SOURCE_NOTE.lead}
          <span className="font-semibold text-foreground">{STOCK_SOURCE_NOTE.boldA}</span>
          {STOCK_SOURCE_NOTE.mid}
          <span className="font-semibold text-foreground">{STOCK_SOURCE_NOTE.boldB}</span>
          {STOCK_SOURCE_NOTE.tail}
        </p>
      </PanelBody>
    </PanelShell>
  )
}
