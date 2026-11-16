"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  MONTH_VALUE_TITLE, MONTH_INSIGHT, MONTH_TILES, MONTH_CATCHES_TITLE, MONTH_CATCHES, MONTH_NOTE,
} from "@/lib/ask-nanci/data/panels/plan-value"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, SectionHeader, PanelItem } from "@/components/shared"

const PANEL_ID = "month-value"

// The monthly receipt: what Ask Nanci caught on the account this month, in date order,
// with a figure beside the catches that have one.
export function MonthValuePanel() {
  const { closeDynamicPanel } = useAskNanci()
  return (
    <PanelShell>
      <PanelHeader title={MONTH_VALUE_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>{MONTH_INSIGHT}</NanciInsight>
        {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          {MONTH_TILES.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} />
          ))}
        </div>
        <div>
          <SectionHeader title={MONTH_CATCHES_TITLE} />
          <ul className="space-y-2">
            {MONTH_CATCHES.map((item) => (
              <li key={item.id}>
                <PanelItem icon={item.icon} iconClassName="text-primary" className="items-start">
                  <div className="min-w-0 flex-1 space-y-0.5 text-sm">
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-muted-foreground">{item.detail}</p>
                  </div>
                  {item.savingLabel && (
                    <span className="shrink-0 self-center text-sm font-medium tabular-nums text-green-700 dark:text-green-400">{item.savingLabel}</span>
                  )}
                </PanelItem>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{MONTH_NOTE}</p>
      </PanelBody>
    </PanelShell>
  )
}
