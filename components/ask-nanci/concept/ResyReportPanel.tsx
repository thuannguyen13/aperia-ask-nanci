"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { SHIFT_DATE, REPORT_SOURCES, REPORT_COVERS, REPORT_SALES, REPORT_PER_COVER, REPORT_NO_SHOWS, RESY_PER_COVER, RESY_LIFT_PER_COVER } from "@/lib/ask-nanci/data/panels/resy-service-day"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, NanciInsight, StatCard, PanelFigureTable, Td, formatCurrency, formatWholeCurrency } from "@/components/shared"

export function ResyReportPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={`Last Night · ${SHIFT_DATE}`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("resy-report")}
      />

      <PanelBody className="space-y-4">
        <NanciInsight>
          <span className="font-bold">Resy guests spent {formatCurrency(RESY_PER_COVER)} a cover</span>, {formatWholeCurrency(RESY_LIFT_PER_COVER)} more than walk-ins. Booked tables are your best tables, so the waitlist fill and the late-running text both protected the night's biggest checks.
        </NanciInsight>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          <StatCard label="Covers" value={String(REPORT_COVERS)} sublabel={`${REPORT_NO_SHOWS.parties} no-shows, ${REPORT_NO_SHOWS.seats} seats`} />
          <StatCard label="Card sales" value={formatWholeCurrency(REPORT_SALES)} emphasis />
          <StatCard label="Per cover" value={formatCurrency(REPORT_PER_COVER)} />
        </div>

        <div>
          <p className="text-base font-bold text-foreground">By booking source</p>
          <p className="mb-2 text-sm text-muted-foreground">Card sales matched to tables from Resy</p>
          <PanelFigureTable headers={["Source", "Covers", "Sales", "Per cover"]}>
            {REPORT_SOURCES.map((s, i) => (
              <tr key={s.source} className={i === 0 ? "bg-green-50 dark:bg-green-950/20" : ""}>
                <Td><span className="font-medium text-foreground">{s.source}</span></Td>
                <Td align="right" mono>{s.covers}</Td>
                <Td align="right" mono>{formatWholeCurrency(s.sales)}</Td>
                <Td align="right" mono className={i === 0 ? "font-semibold text-green-700 dark:text-green-400" : undefined}>{formatCurrency(s.perCover)}</Td>
              </tr>
            ))}
          </PanelFigureTable>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
