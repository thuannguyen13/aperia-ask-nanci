"use client"

import { CheckCheck, PhoneMissed, TriangleAlert } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import {
  BRIEFING_TITLE, BRIEFING_INSIGHT, BRIEFING_TILES, TOP_ITEMS_TITLE, TOP_ITEMS, WORTH_A_LOOK_TITLE, WORTH_A_LOOK, BRIEFING_NOTE, SHARED_NOTE,
  LINE_TITLE, LINE_ROWS, REGULARS_LOOK,
} from "@/lib/ask-nanci/data/panels/daily-briefing"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard, SectionHeader, Callout } from "@/components/shared"

const PANEL_ID = "daily-briefing"

// Views: "briefing" until the owner shares it, then "shared". The chat turn sets the view.
export function DailyBriefingPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView(PANEL_ID, "briefing")
  return (
    <PanelShell>
      <PanelHeader title={BRIEFING_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>{BRIEFING_INSIGHT}</NanciInsight>
        {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          {BRIEFING_TILES.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} tone={tile.tone} toneScope={tile.toneScope} />
          ))}
        </div>
        {/* What only the carrier sees: yesterday on the business line. */}
        <div>
          <SectionHeader title={LINE_TITLE} />
          <dl className="rounded-xl border px-4 py-1">
            {LINE_ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-0">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-medium tabular-nums text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <SectionHeader title={TOP_ITEMS_TITLE} />
          <ol className="rounded-xl border px-4 py-1">
            {TOP_ITEMS.map((item, i) => (
              <li key={item.name} className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-0">
                <span className="text-foreground"><span className="mr-2 tabular-nums text-muted-foreground">{i + 1}</span>{item.name}</span>
                <span className="font-medium tabular-nums text-foreground">{item.sold} sold</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <SectionHeader title={WORTH_A_LOOK_TITLE} />
          <div className="flex flex-col gap-2">
            <Callout variant="amber" icon={PhoneMissed} title={REGULARS_LOOK.title}>
              <p>{REGULARS_LOOK.body}</p>
            </Callout>
            <Callout variant="amber" icon={TriangleAlert} title={WORTH_A_LOOK.title}>
              <p>{WORTH_A_LOOK.body}</p>
            </Callout>
          </div>
        </div>
        {view === "shared" && (
          <Callout variant="green" icon={CheckCheck} title={SHARED_NOTE.title}>
            <p>{SHARED_NOTE.body}</p>
          </Callout>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">{BRIEFING_NOTE}</p>
      </PanelBody>
    </PanelShell>
  )
}
