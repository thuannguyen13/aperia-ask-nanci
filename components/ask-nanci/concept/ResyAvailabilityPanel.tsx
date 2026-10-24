"use client"

import { ArrowRight } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW29_OPEN, isAwaitingFlow29Open } from "@/lib/ask-nanci/data/flows.concept"
import { AVAILABILITY, FRIDAY_AS_OF, FRIDAY_DATE, ONLINE_WINDOW, OPEN_INCREMENT, POST_OPEN, RELEASED_TABLES, SEAT_HOURS, STILL_OPEN, formatTurn } from "@/lib/ask-nanci/data/panels/resy-friday"
import { PanelShell, PanelHeader, PanelBody, Callout, PanelTable, Thead, Th, Td, formatCurrency, formatWholeCurrency } from "@/components/shared"
import { ResyConfirmCard } from "./ResyConfirmCard"

const FRIDAY_SHORT = FRIDAY_DATE.replace(",", "")
const TABLES = RELEASED_TABLES.map((t) => `T${t}`).join(" and ")
const PROPOSAL = `Change ${FRIDAY_SHORT} dinner only. ${TABLES} go online from ${ONLINE_WINDOW.from} to ${ONLINE_WINDOW.to}, and ${OPEN_INCREMENT} pacing goes from ${AVAILABILITY.pacing.before} to ${AVAILABILITY.pacing.after} covers. Other nights stay as they are.`
const WHAT_CHANGES = `What changes in Resy: a shift override for ${FRIDAY_SHORT} releases two held four-tops to online booking and raises ${OPEN_INCREMENT} pacing. Nothing changes in Resy until you confirm.`

const CHANGE_ROWS = [
  { label: `Online four-tops at ${OPEN_INCREMENT}`, ...AVAILABILITY.fourTops },
  { label: `Pacing at ${OPEN_INCREMENT}, per 15 min`, ...AVAILABILITY.pacing },
  { label: `${OPEN_INCREMENT}–8:30 half-hour total`, ...AVAILABILITY.halfHour },
]

const TABLE_STATUS = [
  { table: POST_OPEN.table, status: `Booked ${POST_OPEN.time} · party of ${POST_OPEN.party} · ${formatWholeCurrency(POST_OPEN.value)}` },
  ...STILL_OPEN.map((table) => ({ table, status: "Open online" })),
]

function ChangeRows() {
  return (
    <div className="rounded-xl border">
      <ul className="divide-y">
        {CHANGE_ROWS.map((r) => (
          <li key={r.label} className="flex items-center gap-2 px-4 py-3">
            <p className="min-w-0 flex-1 text-sm text-foreground">{r.label}</p>
            <span className="text-sm tabular-nums text-muted-foreground">{r.before}</span>
            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-sm font-semibold tabular-nums text-foreground">{r.after}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SeatHourTable() {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">Revenue per seat-hour, after card fees <span className="font-normal text-muted-foreground">· Fridays, October</span></p>
      <PanelTable>
        <Thead>
          <Th>Party</Th>
          <Th align="right">Turn</Th>
          <Th align="right">Card sales per cover, after fees</Th>
          <Th align="right">Per seat-hour</Th>
        </Thead>
        <tbody>
          {SEAT_HOURS.map((r) => (
            <tr key={r.tier}>
              <Td>{r.tier}</Td>
              <Td align="right" className="tabular-nums">{formatTurn(r.turn)}</Td>
              <Td align="right" className="tabular-nums">{formatCurrency(r.afterFees)}</Td>
              <Td align="right" className="font-semibold tabular-nums">{formatWholeCurrency(Math.round(r.perSeatHour))}</Td>
            </tr>
          ))}
        </tbody>
      </PanelTable>
    </div>
  )
}

function OpenConfirm() {
  return <ResyConfirmCard title={PROPOSAL} detail={WHAT_CHANGES} buttonLabel={CONCEPT_FLOW29_OPEN.replace(/\.$/, "")} awaiting={isAwaitingFlow29Open} onConfirmTurn={CONCEPT_FLOW29_OPEN} />
}

function OpenDone() {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300">
      <p className="text-xs font-semibold">Shift override · {FRIDAY_SHORT} only</p>
      <p className="mt-1 text-sm font-semibold">{AVAILABILITY.fourTops.after} four-tops online at {OPEN_INCREMENT}</p>
      <ul className="mt-2 space-y-1">
        {TABLE_STATUS.map((t) => <li key={t.table} className="text-sm tabular-nums"><span className="font-semibold">T{t.table}</span> · {t.status}</li>)}
      </ul>
    </div>
  )
}

const VIEW_BODY: Record<string, () => React.ReactElement> = { proposed: OpenConfirm, done: OpenDone }

export function ResyAvailabilityPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("resy-availability", "proposed")
  const Body = VIEW_BODY[view] ?? OpenConfirm

  return (
    <PanelShell>
      <PanelHeader title={`Open tables · ${OPEN_INCREMENT} PM`} subtitle={`${FRIDAY_DATE} · ${FRIDAY_AS_OF}`} size="lg" onClose={() => closeDynamicPanel("resy-availability")} />
      <PanelBody className="space-y-4">
        <ChangeRows />
        <SeatHourTable />
        <Callout variant="amber">That puts {AVAILABILITY.halfHour.after} covers into {OPEN_INCREMENT}–8:30 against your usual {AVAILABILITY.halfHour.before}. Give the kitchen a heads-up.</Callout>
        <Body />
      </PanelBody>
    </PanelShell>
  )
}
