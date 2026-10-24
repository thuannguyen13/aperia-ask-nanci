"use client"

import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { PACING_PER_15_MIN, PACING_PER_HALF_HOUR } from "@/lib/ask-nanci/data/panels/resy-group"
import { TONIGHT_DATE, BOOK_AS_OF, BOOK_SLOTS, BOOK_COVERS, BOOK_PEAK, BOOK_PARTIES, LARGE_PARTIES, TO_KNOW, UNCONFIRMED, UNCONFIRMED_COVERS } from "@/lib/ask-nanci/data/panels/resy-tonight"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, StatCard, Callout } from "@/components/shared"

// The bar heights put a slot that meets the pacing exactly on the dashed line.
const PACING_LINE_PCT = 85

const TO_KNOW_ITEMS = [
  { label: "VIPs", value: TO_KNOW.vips },
  { label: "Allergies", value: TO_KNOW.allergies },
  { label: "Birthdays", value: TO_KNOW.birthdays },
  { label: "Anniversaries", value: TO_KNOW.anniversaries },
  { label: "Repeat guests", value: TO_KNOW.repeatGuests },
]

function BookStats() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Covers" value={String(BOOK_COVERS)} sublabel="on the book" emphasis />
      <StatCard label="Parties" value={String(BOOK_PARTIES)} />
      <StatCard label="Large parties" value={String(LARGE_PARTIES.length)} />
    </div>
  )
}

function ArrivalBar({ covers, isPeak }: { covers: number; isPeak: boolean }) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-1">
      <span className={cn("text-[10px] font-semibold tabular-nums", isPeak ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground")}>{covers}</span>
      <div className={cn("w-full rounded-t-md", isPeak ? "bg-amber-500" : "bg-primary/70")} style={{ height: `${(covers / PACING_PER_HALF_HOUR) * PACING_LINE_PCT}%` }} />
    </div>
  )
}

function ArrivalChart() {
  return (
    <div>
      <p className="text-base font-bold text-foreground">Covers by arrival time</p>
      <p className="mb-3 text-sm text-muted-foreground">Dashed line is your pacing: {PACING_PER_HALF_HOUR} per half hour ({PACING_PER_15_MIN} per 15 min)</p>
      <div className="relative flex h-40 items-end gap-1.5 border-b">
        <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-muted-foreground/60" style={{ bottom: `${PACING_LINE_PCT}%` }} />
        {BOOK_SLOTS.map((s) => <ArrivalBar key={s.time} covers={s.covers} isPeak={s.time === BOOK_PEAK.time} />)}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {BOOK_SLOTS.map((s) => (
          <span key={s.time} className="flex-1 text-center text-[10px] text-muted-foreground tabular-nums">{s.time}</span>
        ))}
      </div>
    </div>
  )
}

function ToKnowStrip() {
  return (
    <div>
      <p className="mb-2 text-base font-bold text-foreground">To know</p>
      <div className="grid grid-cols-5 gap-2 rounded-xl border p-3">
        {TO_KNOW_ITEMS.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-lg font-bold tabular-nums text-foreground">{item.value}</p>
            <p className="text-[11px] text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResyShiftPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={`Tonight · ${TONIGHT_DATE}`}
        subtitle={`Resy book as of ${BOOK_AS_OF}`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("resy-shift")}
      />

      <PanelBody className="space-y-4">
        <BookStats />
        <ArrivalChart />
        <ToKnowStrip />
        <Callout variant="amber">
          <span className="font-semibold">{UNCONFIRMED.length} parties haven&apos;t confirmed.</span> {UNCONFIRMED_COVERS} covers.
        </Callout>
      </PanelBody>
    </PanelShell>
  )
}
