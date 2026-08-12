"use client"

import { Bell } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  TIGHTEST_ITEM, RUNS_OUT_FIRST, formatDaysOfCover,
} from "@/lib/ask-nanci/data/panels/inventory"
import {
  PanelShell, PanelHeader, PanelBody, PanelExportButton, NanciInsight,
} from "@/components/ask-nanci/shared"

const PANEL_ID = "runs-out-first"

// The single tightest item, pulled out of the Running Low list so the answer to "what
// goes first" is one row rather than a table to re-scan. Everything here derives from
// TIGHTEST_ITEM, so this panel and the list beside it cannot quote different numbers
// for the same item.
export function RunsOutFirstPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const item = TIGHTEST_ITEM

  return (
    <PanelShell>
      <PanelHeader
        title={RUNS_OUT_FIRST.title}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel(PANEL_ID)}
      />

      <PanelBody>
        <NanciInsight>
          {item.name} is on pace to run out{" "}
          <span className="font-bold">{RUNS_OUT_FIRST.runOutDay}</span>. It moves about{" "}
          {item.pace.replace("~", "")} and you have {item.onHand} on hand — roughly {formatDaysOfCover(item)} of cover.
        </NanciInsight>

        <p className="mb-3 mt-5 text-sm font-bold text-foreground">{RUNS_OUT_FIRST.detailLabel}</p>
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{item.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.onHand} on hand · {item.pace}</p>
          </div>
          <p className="shrink-0 font-mono text-sm font-bold text-amber-700 dark:text-amber-400">
            {formatDaysOfCover(item)}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t pt-3.5 text-sm">
          <span className="font-semibold text-foreground">{RUNS_OUT_FIRST.runOutLabel}</span>
          <span className="font-mono text-muted-foreground">{RUNS_OUT_FIRST.runOutDate}</span>
        </div>

        <div className="mt-3.5 flex items-center justify-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
          <Bell className="size-3.5 shrink-0" />
          {RUNS_OUT_FIRST.reminder}
        </div>
      </PanelBody>
    </PanelShell>
  )
}
