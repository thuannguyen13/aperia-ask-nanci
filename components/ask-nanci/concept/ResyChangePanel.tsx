"use client"

import { ArrowRight, Users } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW29_MOVE, isAwaitingFlow29Move } from "@/lib/ask-nanci/data/flows.concept"
import { FRIDAY_AS_OF, FRIDAY_DATE, MOVE, MOVE_TABLE, PACING_CHECK } from "@/lib/ask-nanci/data/panels/resy-friday"
import { PanelShell, PanelHeader, PanelBody, Callout } from "@/components/shared"
import { ResyConfirmCard } from "./ResyConfirmCard"

const PROPOSAL = `Move the ${MOVE.guest} party, ${FRIDAY_DATE.replace(",", "")}, from ${MOVE.from.time} to ${MOVE.to.time} on Table ${MOVE.to.table}. Resy will send them the updated booking.`
const WHAT_CHANGES = `What changes in Resy: the booking moves to ${MOVE.to.time} PM on T${MOVE.to.table}, and the ${MOVE.from.time} six-top on T${MOVE.from.table} goes online. Nothing changes in Resy until you confirm.`

function BookingRow({ label, time, table }: { label: string; time: string; table: number }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border bg-background p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-bold tabular-nums text-foreground">{time} PM</p>
      <p className="text-sm text-muted-foreground">Table {table}</p>
    </div>
  )
}

function BeforeAfter() {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <p className="text-base font-bold text-foreground">{MOVE.guest}</p>
        <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="size-3.5" />Party of {MOVE.party}</span>
        <span className="ml-auto text-sm text-muted-foreground">{FRIDAY_DATE}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <BookingRow label="Before" time={MOVE.from.time} table={MOVE.from.table} />
        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        <BookingRow label="After" time={MOVE.to.time} table={MOVE.to.table} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Table {MOVE.to.table} frees at {MOVE_TABLE.frees}, when its {MOVE_TABLE.earlier} party turns.</p>
      <p className="mt-1 text-sm font-medium tabular-nums text-foreground">Pacing check · {PACING_CHECK.time}: {PACING_CHECK.before} → {PACING_CHECK.after} of {PACING_CHECK.cap}</p>
    </div>
  )
}

function MoveConfirm() {
  return <ResyConfirmCard title={PROPOSAL} detail={WHAT_CHANGES} buttonLabel={CONCEPT_FLOW29_MOVE.replace(/\.$/, "")} awaiting={isAwaitingFlow29Move} onConfirmTurn={CONCEPT_FLOW29_MOVE} />
}

function MoveDone() {
  return (
    <Callout variant="green">
      <p className="font-semibold">Moved in Resy: {MOVE.to.time} PM on T{MOVE.to.table}.</p>
      <p className="mt-1">The {MOVE.from.time} six-top on T{MOVE.from.table} is open online.</p>
    </Callout>
  )
}

const VIEW_BODY: Record<string, () => React.ReactElement> = { proposed: MoveConfirm, done: MoveDone }

export function ResyChangePanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("resy-change", "proposed")
  const Body = VIEW_BODY[view] ?? MoveConfirm

  return (
    <PanelShell>
      <PanelHeader title="Move a booking" subtitle={`${FRIDAY_DATE} · ${FRIDAY_AS_OF}`} size="lg" onClose={() => closeDynamicPanel("resy-change")} />
      <PanelBody className="space-y-4">
        <BeforeAfter />
        <Body />
      </PanelBody>
    </PanelShell>
  )
}
