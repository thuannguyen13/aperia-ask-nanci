"use client"

import { ArrowRight, CheckCheck } from "lucide-react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW29_OPEN, isAwaitingFlow29Open, spellCount, tableList } from "@/lib/ask-nanci/data/flows.concept"
import { AVAILABILITY, FRIDAY_AS_OF, FRIDAY_DATE, FRIDAY_DATE_PLAIN, ONLINE_WINDOW, OPEN_INCREMENT, OPEN_TITLE, POST_OPEN, RELEASED_TABLES, SEAT_HOURS, STILL_OPEN, toTime } from "@/lib/ask-nanci/data/panels/resy-friday"
import { PanelShell, PanelHeader, PanelBody, Callout, SectionHeader, PanelTable, Thead, Th, Td, formatCurrency, formatWholeCurrency } from "@/components/shared"
import { ResyConfirmCard } from "./ResyConfirmCard"

const PROPOSAL = `Change ${FRIDAY_DATE_PLAIN} dinner only. ${tableList(RELEASED_TABLES)} go online from ${ONLINE_WINDOW.from} to ${ONLINE_WINDOW.to}, and ${OPEN_INCREMENT} pacing goes from ${AVAILABILITY.pacing.before} to ${AVAILABILITY.pacing.after} covers. Other nights stay as they are.`
const WHAT_CHANGES = `What changes in Resy: a shift override for ${FRIDAY_DATE_PLAIN} releases ${spellCount(RELEASED_TABLES.length)} held four-tops to online booking and raises ${OPEN_INCREMENT} pacing. Nothing changes in Resy until you confirm.`

const CHANGE_ROWS = [
  { label: `Online four-tops at ${OPEN_INCREMENT}`, ...AVAILABILITY.fourTops },
  { label: `Pacing at ${OPEN_INCREMENT}, per 15 min`, ...AVAILABILITY.pacing },
  { label: `${OPEN_INCREMENT}–${ONLINE_WINDOW.to} half-hour total`, ...AVAILABILITY.halfHour },
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
      <SectionHeader title="Revenue per seat-hour, after card fees" description="Fridays, October" />
      <PanelTable>
        <Thead>
          <Th>Party</Th>
          <Th align="right">Turn</Th>
          <Th align="right">Card Sales per Cover (after fees)</Th>
          <Th align="right">Per Seat-Hour</Th>
        </Thead>
        <tbody>
          {SEAT_HOURS.map((r) => (
            <tr key={r.tier}>
              <Td>{r.tier}</Td>
              <Td align="right" className="tabular-nums">{toTime(r.turn)}</Td>
              <Td align="right" className="tabular-nums">{formatCurrency(r.afterFees)}</Td>
              <Td align="right" className="tabular-nums">{formatWholeCurrency(Math.round(r.perSeatHour))}</Td>
            </tr>
          ))}
        </tbody>
      </PanelTable>
    </div>
  )
}

function OpenConfirm() {
  return <ResyConfirmCard title={PROPOSAL} detail={WHAT_CHANGES} awaiting={isAwaitingFlow29Open} onConfirmTurn={CONCEPT_FLOW29_OPEN} />
}

function OpenDone() {
  return (
    <Callout variant="green" icon={CheckCheck} title={`${AVAILABILITY.fourTops.after} four-tops online at ${OPEN_INCREMENT}`}>
      <p>Shift override · {FRIDAY_DATE_PLAIN} only</p>
      {TABLE_STATUS.map((t) => <p key={t.table} className="text-green-700 tabular-nums dark:text-green-400"><span className="font-semibold">T{t.table}</span> · {t.status}</p>)}
    </Callout>
  )
}

const VIEW_BODY: Record<string, () => React.ReactElement> = { proposed: OpenConfirm, done: OpenDone }

export function ResyAvailabilityPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("resy-availability", "proposed")
  const Body = VIEW_BODY[view] ?? OpenConfirm

  return (
    <PanelShell>
      <PanelHeader title={OPEN_TITLE} subtitle={`${FRIDAY_DATE} · ${FRIDAY_AS_OF}`} size="lg" onClose={() => closeDynamicPanel("resy-availability")} />
      <PanelBody className="space-y-4">
        <ChangeRows />
        <Body />
        <SeatHourTable />
        <Callout variant="amber">That puts {AVAILABILITY.halfHour.after} covers into {OPEN_INCREMENT}–{ONLINE_WINDOW.to} against your usual {AVAILABILITY.halfHour.before}. Give the kitchen a heads-up.</Callout>
      </PanelBody>
    </PanelShell>
  )
}
