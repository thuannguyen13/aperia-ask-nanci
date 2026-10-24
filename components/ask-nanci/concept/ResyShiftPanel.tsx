"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { SHIFT_DATE, SHIFT_SLOTS, SHIFT_COVERS, SHIFT_PEAK, SHIFT_PARTIES, SHIFT_WAITLIST, KITCHEN_PACE } from "@/lib/ask-nanci/data/panels/resy-service-day"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, StatCard, Callout } from "@/components/shared"

export function ResyShiftPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={`Tonight · ${SHIFT_DATE}`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("resy-shift")}
      />

      <PanelBody className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Covers" value={String(SHIFT_COVERS)} sublabel="booked on Resy" emphasis />
          <StatCard label="Parties" value={String(SHIFT_PARTIES)} />
          <StatCard label="Waitlist" value={String(SHIFT_WAITLIST)} sublabel="parties" />
        </div>

        <div>
          <p className="text-base font-bold text-foreground">Covers by arrival time</p>
          <p className="mb-3 text-sm text-muted-foreground">Dashed line is the {KITCHEN_PACE} covers per slot your kitchen paces to</p>
          <div className="relative flex h-40 items-end gap-1.5 border-b">
            <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-muted-foreground/60" style={{ bottom: "85%" }} />
            {SHIFT_SLOTS.map((s) => {
              const isPeak = s.time === SHIFT_PEAK.time
              return (
                <div key={s.time} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span className={cn("text-[10px] font-semibold tabular-nums", isPeak ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>{s.covers}</span>
                  <div
                    className={cn("w-full rounded-t-md", isPeak ? "bg-amber-500" : "bg-primary/70")}
                    style={{ height: `${(s.covers / KITCHEN_PACE) * 85}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {SHIFT_SLOTS.map((s) => (
              <span key={s.time} className="flex-1 text-center text-[10px] text-muted-foreground tabular-nums">{s.time}</span>
            ))}
          </div>
        </div>

        <Callout variant="amber">
          <span className="font-semibold">{SHIFT_PEAK.time} is tight.</span> {SHIFT_PEAK.covers} covers against a pace of {KITCHEN_PACE}. Hold walk-ins for that slot and seat the waitlist from 8:00.
        </Callout>
      </PanelBody>
    </PanelShell>
  )
}
