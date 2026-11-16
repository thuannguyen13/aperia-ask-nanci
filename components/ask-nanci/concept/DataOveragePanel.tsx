"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  DATA_OVERAGE_TITLE, OVERAGE_INSIGHT, OVERAGE_TILES, USAGE_METER, DATA, PROJECTED_GB, OVERAGE_NOTE,
} from "@/lib/ask-nanci/data/panels/data-overage"
import { PanelShell, PanelHeader, PanelBody, NanciInsight, StatCard } from "@/components/shared"

const PANEL_ID = "data-overage"

// The cycle as one bar: what is used, what the pace adds by the end, and the included
// amount as a mark. The projected part past the mark is the overage.
function UsageMeter() {
  const scale = PROJECTED_GB
  const pct = (gb: number) => `${(gb / scale) * 100}%`
  return (
    <Card size="sm" className="shrink-0 shadow-xs">
      <CardHeader>
        <CardTitle>{USAGE_METER.title}</CardTitle>
        <CardDescription>{USAGE_METER.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative pt-5">
          <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground" style={{ left: pct(DATA.limitGb) }}>{USAGE_METER.limitLabel}</span>
          <div className="relative h-3 overflow-hidden rounded-full bg-muted">
            <div className="absolute inset-y-0 left-0 bg-[color-mix(in_oklab,var(--chart-1)_35%,transparent)]" style={{ width: "100%" }} />
            <div className="absolute inset-y-0 bg-amber-400/70" style={{ left: pct(DATA.limitGb), right: 0 }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--chart-1)]" style={{ width: pct(DATA.usedGb) }} />
          </div>
          <span className="absolute bottom-0 h-5 w-px -translate-x-1/2 translate-y-1 bg-foreground" style={{ left: pct(DATA.limitGb) }} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--chart-1)]" />{USAGE_METER.usedLabel}, {DATA.usedGb} GB</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[color-mix(in_oklab,var(--chart-1)_35%,transparent)]" />{USAGE_METER.projectedLabel}, {PROJECTED_GB} GB</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber-400/70" />Over the included amount</span>
        </div>
      </CardContent>
    </Card>
  )
}

// The findings only. A request the owner sends opens in its own panel underneath.
export function DataOveragePanel() {
  const { closeDynamicPanel } = useAskNanci()
  return (
    <PanelShell>
      <PanelHeader title={DATA_OVERAGE_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-4">
        <NanciInsight>{OVERAGE_INSIGHT}</NanciInsight>
        {/* Three across cuts the labels off on a phone, so the first two share a row there. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          {OVERAGE_TILES.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} tone={tile.tone} toneScope={tile.toneScope} />
          ))}
        </div>
        <UsageMeter />
        <p className="text-xs leading-relaxed text-muted-foreground">{OVERAGE_NOTE}</p>
      </PanelBody>
    </PanelShell>
  )
}
