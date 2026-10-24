"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { TONIGHT_DATE, BOOK_SLOTS, BOOK_COVERS, BOOK_PEAK, BOOK_PARTIES, LARGE_PARTIES, PACING_PER_HALF_HOUR } from "@/lib/ask-nanci/data/panels/resy-tonight"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, StatCard, Callout } from "@/components/shared"

export function ResyShiftPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={`Tonight · ${TONIGHT_DATE}`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("resy-shift")}
      />

      <PanelBody className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Covers" value={String(BOOK_COVERS)} sublabel="on the book" emphasis />
          <StatCard label="Parties" value={String(BOOK_PARTIES)} />
          <StatCard label="Large parties" value={String(LARGE_PARTIES.length)} />
        </div>

        <div>
          <p className="text-base font-bold text-foreground">Covers by arrival time</p>
          <p className="mb-3 text-sm text-muted-foreground">Dashed line is the {PACING_PER_HALF_HOUR} covers per slot your kitchen paces to</p>
          <div className="relative flex h-40 items-end gap-1.5 border-b">
            <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-muted-foreground/60" style={{ bottom: "85%" }} />
            {BOOK_SLOTS.map((s) => {
              const isPeak = s.time === BOOK_PEAK.time
              return (
                <div key={s.time} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span className={cn("text-[10px] font-semibold tabular-nums", isPeak ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>{s.covers}</span>
                  <div
                    className={cn("w-full rounded-t-md", isPeak ? "bg-amber-500" : "bg-primary/70")}
                    style={{ height: `${(s.covers / PACING_PER_HALF_HOUR) * 85}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {BOOK_SLOTS.map((s) => (
              <span key={s.time} className="flex-1 text-center text-[10px] text-muted-foreground tabular-nums">{s.time}</span>
            ))}
          </div>
        </div>

        <Callout variant="amber">
          <span className="font-semibold">{BOOK_PEAK.time} is tight.</span> {BOOK_PEAK.covers} covers against a pace of {PACING_PER_HALF_HOUR}. Hold walk-ins for that slot and seat the waitlist from 8:00.
        </Callout>
      </PanelBody>
    </PanelShell>
  )
}
