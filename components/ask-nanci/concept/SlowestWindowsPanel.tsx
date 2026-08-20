"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader, PanelExportButton, NanciInsight, formatWholeCurrency } from "@/components/ask-nanci/shared"
import { SLOWEST_WINDOWS, SLOWEST_WINDOWS_HIGH } from "@/lib/ask-nanci/data/panels/busiest-times"

export function SlowestWindowsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Slowest Windows"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("slowest-windows")}
      />

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        <NanciInsight>
          Tuesday and Wednesday afternoons are the safest to trim. Each two-hour window rings up under{" "}
          <span className="font-bold">{formatWholeCurrency(SLOWEST_WINDOWS_HIGH.sales)}</span> across roughly{" "}
          {SLOWEST_WINDOWS[0].orders} to {SLOWEST_WINDOWS_HIGH.orders} orders — a fraction of your lunch rush — so
          cutting a shift there costs you the least.
        </NanciInsight>

        <div>
          <p className="mb-3 text-base font-semibold text-foreground">Safest to trim · sales per 2-hour window</p>
          <div className="flex flex-col gap-3">
            {SLOWEST_WINDOWS.map((w) => (
              <div key={w.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.sub}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-sm font-semibold text-foreground tabular-nums">{formatWholeCurrency(w.sales)}</p>
                    <p className="text-xs text-muted-foreground">{w.orders} orders</p>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-slate-400 dark:bg-slate-500" style={{ width: `${w.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
