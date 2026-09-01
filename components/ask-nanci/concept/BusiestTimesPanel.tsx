"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  HEATMAP_HOURS, HEATMAP_ROWS, HEATMAP_APPROX, BUSIEST_TIMES_TILES,
} from "@/lib/ask-nanci/data/panels/busiest-times"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, StatCard } from "@/components/shared"

const LEVEL_CLS = [
  "bg-muted",
  "bg-teal-100 dark:bg-teal-950/40",
  "bg-teal-200 dark:bg-teal-900/50",
  "bg-teal-400 dark:bg-teal-700",
  "bg-teal-500 dark:bg-teal-600",
]

export function BusiestTimesPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Busiest Times"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("busiest-times")}
      />

      <PanelBody className="flex flex-col gap-4">
        {/* Three across at 390px gives each card ~78px of content, which cuts "Saturday"
            off. On a phone the first two share a row and the third takes the width, so
            no card is narrower than half the panel. The last-child variant does it
            without threading an index through the map. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>:last-child]:col-span-2 sm:[&>:last-child]:col-span-1">
          {BUSIEST_TIMES_TILES.map((tile) => (
            <StatCard key={tile.label} label={tile.label} value={tile.value} sublabel={tile.sublabel} emphasis={tile.emphasis} />
          ))}
        </div>

        <div>
          <p className="mb-2 text-base font-semibold text-foreground">Sales by day and hour · last 4 weeks</p>
          <div className="flex flex-col gap-[5px]">
            <div className="grid grid-cols-[32px_repeat(11,1fr)] gap-[5px]">
              <span />
              {HEATMAP_HOURS.map((h) => (
                <span key={h} className="text-center text-[9px] font-semibold text-muted-foreground">{h}</span>
              ))}
            </div>
            {HEATMAP_ROWS.map((row) => (
              <div key={row.day} className="grid grid-cols-[32px_repeat(11,1fr)] items-center gap-[5px]">
                <span className="text-[10px] font-semibold text-muted-foreground">{row.day}</span>
                {row.levels.map((lvl, i) => (
                  <span
                    key={i}
                    title={`${row.day} ${HEATMAP_HOURS[i]} · ${HEATMAP_APPROX[lvl]}`}
                    className={cn("aspect-square min-h-[18px] rounded-[4px]", LEVEL_CLS[lvl])}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>Quiet</span>
            {LEVEL_CLS.map((cls, i) => (
              <span key={i} className={cn("size-3 rounded-sm", cls)} />
            ))}
            <span>Busy</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Averaged from your <span className="font-medium text-foreground">sales</span> over the last four weeks.
          Darker cells are higher sales for that hour. Schedule staff and prep around the peaks — and trim the pale afternoons.
        </p>
      </PanelBody>
    </PanelShell>
  )
}
