"use client"

import { cn } from "aperia-ds5/utils"
import { TriangleAlert } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { PACING_PER_15_MIN, PACING_PER_HALF_HOUR } from "@/lib/ask-nanci/data/panels/resy-group"
import { SHIFT_TITLE, BOOK_AS_OF, BOOK_SLOTS, BOOK_COVERS, BOOK_PEAK, BOOK_PARTIES, LARGE_PARTIES, TO_KNOW, UNCONFIRMED, UNCONFIRMED_COVERS, resyUpdatedAt } from "@/lib/ask-nanci/data/panels/resy-tonight"
import { PanelShell, PanelHeader, PanelBody, StatCard, Callout, SectionHeader } from "@/components/shared"

// The bar heights put a slot that meets the pacing exactly on the dotted line.
const PACING_LINE_PCT = 85

const TO_KNOW_ITEMS = [
  { label: "VIPs", value: TO_KNOW.vips },
  { label: "Allergies", value: TO_KNOW.allergies },
  { label: "Birthdays", value: TO_KNOW.birthdays },
  { label: "Anniversaries", value: TO_KNOW.anniversaries },
  { label: "Repeat Guests", value: TO_KNOW.repeatGuests },
]

function BookStats() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard size="lg" label="Covers" value={String(BOOK_COVERS)} sublabel="on the book" />
      <StatCard size="lg" label="Parties" value={String(BOOK_PARTIES)} />
      <StatCard size="lg" label="Large Parties" value={String(LARGE_PARTIES.length)} />
    </div>
  )
}

function ArrivalBar({ covers, isPeak }: { covers: number; isPeak: boolean }) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-1">
      <span className="text-[10px] tabular-nums text-muted-foreground">{covers}</span>
      <div className={cn("w-full rounded-md", isPeak ? "bg-amber-500" : "bg-primary")} style={{ height: `${(covers / PACING_PER_HALF_HOUR) * PACING_LINE_PCT}%` }} />
    </div>
  )
}

function ArrivalChart() {
  return (
    <div>
      <SectionHeader title="Covers by Arrival Time" description={`Dashed line is your pacing: ${PACING_PER_HALF_HOUR} per half hour (${PACING_PER_15_MIN} per 15 min)`} />
      <div className="rounded-xl border p-2.5 shadow-xs">
        <div className="relative flex h-40 items-end gap-1.5">
          <div className="pointer-events-none absolute inset-x-0 border-t border-dotted border-amber-500" style={{ bottom: `${PACING_LINE_PCT}%` }} />
          {BOOK_SLOTS.map((s) => <ArrivalBar key={s.time} covers={s.covers} isPeak={s.time === BOOK_PEAK.time} />)}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {BOOK_SLOTS.map((s) => (
            <span key={s.time} className="flex-1 text-center text-[10px] text-muted-foreground tabular-nums">{s.time}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToKnow() {
  return (
    <div>
      <SectionHeader title="To Know" />
      <div className="grid grid-cols-3 gap-3">
        {TO_KNOW_ITEMS.map((item) => <StatCard key={item.label} size="lg" label={item.label} value={String(item.value)} />)}
      </div>
    </div>
  )
}

export function ResyShiftPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={SHIFT_TITLE}
        subtitle={resyUpdatedAt(BOOK_AS_OF)}
        size="lg"
        onClose={() => closeDynamicPanel("resy-shift")}
      />

      <PanelBody className="space-y-4">
        <BookStats />
        <ArrivalChart />
        <ToKnow />
        <Callout variant="amber" icon={TriangleAlert} title={`${UNCONFIRMED.length} parties haven't confirmed.`}>
          {UNCONFIRMED_COVERS} covers.
        </Callout>
      </PanelBody>
    </PanelShell>
  )
}
