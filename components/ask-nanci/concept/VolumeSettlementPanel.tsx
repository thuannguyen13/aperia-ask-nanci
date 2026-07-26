"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { FLAT_BARS, MAX } from "@/lib/ask-nanci/data/panels/volume-settlement"
import { PanelShell, PanelHeader, Callout } from "@/components/ask-nanci/shared"

export function VolumeSettlementPanel() {
  const { closePanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Volume & Settlement"
        dot="bg-orange-400"
        badge={{ label: "90 DAYS", className: "rounded bg-orange-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" }}
        subtitle="Bayside Imports"
        onClose={() => closePanel("volume-settlement")}
      />

      <div className="flex flex-1 overflow-hidden divide-x">
        {/* Volume chart */}
        <div className="flex-1 overflow-auto px-4 py-3">
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Transaction Volume Index</p>
          <div className="flex items-end gap-[3px] h-[120px]">
            {FLAT_BARS.map((bar, i) => {
              const isSpike = bar.val >= 24
              const h = Math.round((bar.val / MAX) * 112)
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={cn("w-full rounded-t-sm", isSpike ? "bg-red-400 dark:bg-red-500" : "bg-muted-foreground/25")}
                    style={{ height: `${h}px` }}
                  />
                  {bar.label ? (
                    <span className="text-[8px] text-muted-foreground">{bar.label}</span>
                  ) : (
                    <span className="text-[8px] text-transparent">·</span>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[9px]">
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-muted-foreground/25 inline-block" />Normal</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-red-400 inline-block" />Spike (Apr)</span>
          </div>
          <Callout variant="red" className="mt-3 rounded-md px-3 py-2">
            <p className="text-[10px] font-semibold text-red-800 dark:text-red-300">+340% volume increase</p>
            <p className="text-[9px] text-red-600 dark:text-red-400">Apr W1–W4 vs Feb average</p>
          </Callout>
        </div>

        {/* Settlement change */}
        <div className="w-[175px] shrink-0 overflow-auto px-3 py-3">
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3">Settlement Change</p>
          <div className="space-y-3 text-[10px]">
            <div>
              <p className="text-[9px] text-muted-foreground mb-1.5">Previous account</p>
              <div className="rounded-md border bg-muted/20 px-2.5 py-2 space-y-1 font-mono">
                <p className="text-foreground">Routing ••••4892</p>
                <p className="text-foreground">Account ••••7823</p>
                <p className="text-muted-foreground">Checking · 2+ yrs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[9px] text-muted-foreground">changed</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground mb-1.5">Current · <span className="text-red-600 dark:text-red-400 font-semibold">Apr 27</span></p>
              <Callout variant="red" className="rounded-md px-2.5 py-2 space-y-1 font-mono">
                <p className="text-foreground">Routing ••••3341</p>
                <p className="text-foreground">Account ••••9104</p>
                <p className="text-red-600 dark:text-red-400">Checking · 18 days ago</p>
              </Callout>
            </div>
            <div className="border-t pt-2.5 space-y-1">
              <p className="text-[9px] text-muted-foreground">Changed by</p>
              <p className="font-semibold text-foreground">M. Torres</p>
              <p className="text-muted-foreground">Pacific ISO</p>
            </div>
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
