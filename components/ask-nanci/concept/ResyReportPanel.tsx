"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { spellCount } from "@/lib/ask-nanci/data/flows.concept"
import { WEEK_REPORT, WEEK_ROWS } from "@/lib/ask-nanci/data/panels/resy-reports"
import { PanelShell, PanelHeader, PanelBody, StatCard, PanelFigureTable, Td, formatWholeCurrency } from "@/components/shared"

const { covers, turn, cardSales, amexShare } = WEEK_REPORT

const STATS = [
  { label: "Covers", value: covers.latest.toLocaleString("en-US"), sublabel: covers.delta },
  { label: "Avg turn", value: turn.latest, sublabel: turn.delta },
  { label: "Card sales", value: formatWholeCurrency(cardSales.latest), sublabel: cardSales.delta },
  { label: "Amex share of card sales", value: `${amexShare.latest}%`, sublabel: amexShare.delta },
]

export function ResyReportPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title="Week against week" subtitle="Resy reports · card sales from your processing" size="lg" onClose={() => closeDynamicPanel("resy-report")} />
      <PanelBody className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s) => <StatCard key={s.label} label={s.label} value={s.value} sublabel={s.sublabel} />)}
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">{WEEK_REPORT.latest} against {WEEK_REPORT.prior}, {spellCount(WEEK_REPORT.nights)} service nights each</p>
          <PanelFigureTable headers={["", WEEK_REPORT.latest, WEEK_REPORT.prior]}>
            {WEEK_ROWS.map((r) => (
              <tr key={r.label}>
                <Td>{r.label}</Td>
                <Td align="right" className="tabular-nums font-semibold">{r.latest}</Td>
                <Td align="right" className="tabular-nums">{r.prior}</Td>
              </tr>
            ))}
          </PanelFigureTable>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
