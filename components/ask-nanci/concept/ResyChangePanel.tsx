"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "aperia-ds5"
import { ArrowRight, CheckCheck, Clock4 } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW29_MOVE, isAwaitingFlow29Move, spellCount } from "@/lib/ask-nanci/data/flows.concept"
import { FRIDAY_AS_OF, FRIDAY_DATE, FRIDAY_DATE_PLAIN, MOVE, MOVE_TABLE, MOVE_TITLE, PACING_CHECK } from "@/lib/ask-nanci/data/panels/resy-friday"
import { PanelShell, PanelHeader, PanelBody, PanelItem, Callout } from "@/components/shared"
import { ResyConfirmCard } from "./ResyConfirmCard"

const FREED_TABLE = `${spellCount(MOVE.party)}-top`
const PROPOSAL = `Move the ${MOVE.guest} party, ${FRIDAY_DATE_PLAIN}, from ${MOVE.from.time} to ${MOVE.to.time} on Table ${MOVE.to.table}. Resy will send them the updated booking.`
const WHAT_CHANGES = `What changes in Resy: the booking moves to ${MOVE.to.time} PM on T${MOVE.to.table}, and the ${MOVE.from.time} ${FREED_TABLE} on T${MOVE.from.table} goes online. Nothing changes in Resy until you confirm.`

function BookingSlot({ label, time, table }: { label: string; time: string; table: number }) {
  return (
    <div className="min-w-0 flex-1 space-y-2">
      <p className="text-xs font-medium text-foreground">{label}</p>
      <PanelItem icon={Clock4}>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-sm font-medium tabular-nums text-foreground">{time} PM</p>
          <p className="text-xs text-muted-foreground">Table {table}</p>
        </div>
      </PanelItem>
    </div>
  )
}

function BeforeAfter() {
  return (
    <Card size="sm" className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-semibold group-data-[size=sm]/card:text-base">{MOVE.guest}</CardTitle>
        <CardDescription>Party of {MOVE.party}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <BookingSlot label="Before" time={MOVE.from.time} table={MOVE.from.table} />
          <ArrowRight className="mb-4 size-5 shrink-0 text-foreground" />
          <BookingSlot label="After" time={MOVE.to.time} table={MOVE.to.table} />
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">Table {MOVE.to.table} frees at {MOVE_TABLE.frees}, when its {MOVE_TABLE.earlier} party turns.</p>
          <p className="tabular-nums text-foreground">Pacing check · {PACING_CHECK.time}: {PACING_CHECK.before} → {PACING_CHECK.after} of {PACING_CHECK.cap}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function MoveConfirm() {
  return <ResyConfirmCard title={PROPOSAL} detail={WHAT_CHANGES} awaiting={isAwaitingFlow29Move} onConfirmTurn={CONCEPT_FLOW29_MOVE} />
}

function MoveDone() {
  return (
    <Callout variant="green" icon={CheckCheck} title={`Moved in Resy: ${MOVE.to.time} PM on T${MOVE.to.table}.`}>
      The {MOVE.from.time} {FREED_TABLE} on T{MOVE.from.table} is open online.
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
      <PanelHeader title={MOVE_TITLE} subtitle={`${FRIDAY_DATE} · ${FRIDAY_AS_OF}`} size="lg" onClose={() => closeDynamicPanel("resy-change")} />
      <PanelBody className="space-y-4">
        <BeforeAfter />
        <Body />
      </PanelBody>
    </PanelShell>
  )
}
