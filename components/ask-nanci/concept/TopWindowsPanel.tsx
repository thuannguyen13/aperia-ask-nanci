"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight } from "@/components/ask-nanci/shared"
import { TOP_WINDOWS, TOP_WINDOWS_CALLOUT } from "@/lib/ask-nanci/data/panels/busiest-times"

export function TopWindowsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Top Windows"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("top-windows")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        <NanciInsight>{TOP_WINDOWS_CALLOUT}</NanciInsight>

        <div>
          <p className="mb-3 text-base font-semibold text-foreground">Highest-volume windows</p>
          <div className="flex flex-col gap-3">
            {TOP_WINDOWS.map((w) => (
              <div key={w.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.sub}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-medium text-foreground tabular-nums">{w.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-teal-500 dark:bg-teal-600" style={{ width: `${w.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
