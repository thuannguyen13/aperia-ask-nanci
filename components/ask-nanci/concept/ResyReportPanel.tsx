"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { spellCount } from "@/lib/ask-nanci/data/flows.concept"
import { WEEK_REPORT, WEEK_ROWS, WEEK_TITLE } from "@/lib/ask-nanci/data/panels/resy-reports"
import { PanelShell, PanelHeader, PanelBody, StatCard, PanelFigureTable, Td, formatWholeCurrency } from "@/components/shared"

const { covers, turn, cardSales, amexShare } = WEEK_REPORT

const STATS = [
  { label: "Covers", value: covers.latest.toLocaleString("en-US"), sublabel: covers.delta },
  { label: "Average Turn", value: turn.latest, sublabel: turn.delta },
  { label: "Card Sales", value: formatWholeCurrency(cardSales.latest), sublabel: cardSales.delta },
  { label: "Amex Share of Card Sales", value: `${amexShare.latest}%`, sublabel: amexShare.delta },
]

export function ResyReportPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title={WEEK_TITLE} subtitle="Card sales from your processing" size="lg" onClose={() => closeDynamicPanel("resy-report")} />
      <PanelBody className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s) => <StatCard key={s.label} size="lg" label={s.label} value={s.value} sublabel={s.sublabel} />)}
        </div>
        <div>
          <p className="mb-3 text-base text-muted-foreground">{WEEK_REPORT.latest} against {WEEK_REPORT.prior}, {spellCount(WEEK_REPORT.nights)} service nights each</p>
          <PanelFigureTable headers={["", WEEK_REPORT.latest, WEEK_REPORT.prior]}>
            {WEEK_ROWS.map((r) => (
              <tr key={r.label}>
                <Td>{r.label}</Td>
                <Td align="right" className="tabular-nums">{r.latest}</Td>
                <Td align="right" className="tabular-nums">{r.prior}</Td>
              </tr>
            ))}
          </PanelFigureTable>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
