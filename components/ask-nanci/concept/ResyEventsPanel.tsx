"use client"

import { Banknote, CreditCard, Ticket } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { EVENTS, EVENT_TOTALS, WINE_DINNER, NIGHT_SPEND_PER_GUEST, NIGHT_ESTIMATE, STRIPE_PAYOUT_DAYS } from "@/lib/ask-nanci/data/panels/resy-deposits"
import { PanelShell, PanelHeader, PanelBody, PanelTable, Thead, Th, Td, formatWholeCurrency } from "@/components/shared"

type EventRow = (typeof EVENTS)[number]

const eventName = (e: EventRow) => (e.seatings > 1 ? `${e.name} (${e.seatings} seatings)` : e.name)
const addOns = (e: EventRow) => (e.addOn ? `${e.addOn.sold} × ${formatWholeCurrency(e.addOn.price)} ${e.addOn.label}` : "none")

const CASH_TIMELINE = [
  { icon: Ticket, label: "Tickets", text: `Stripe payout typically about ${STRIPE_PAYOUT_DAYS} business days after each sale, less Stripe and Resy fees.` },
  { icon: CreditCard, label: "On-the-night spend", text: "through your card processing, next business day." },
  { icon: Banknote, label: `${WINE_DINNER.date.slice(4)} estimate`, text: `${WINE_DINNER.seats} × ${formatWholeCurrency(NIGHT_SPEND_PER_GUEST)} = ${formatWholeCurrency(NIGHT_ESTIMATE)} if it sells out.` },
]

function EventsTable() {
  return (
    <PanelTable pinFirst>
      <Thead>
        <Th>Event</Th>
        <Th>Date</Th>
        <Th align="right">Seats</Th>
        <Th align="right">Sold</Th>
        <Th align="right">Price</Th>
        <Th>Add-ons</Th>
        <Th align="right">Sold value</Th>
        <Th align="right">Open value</Th>
      </Thead>
      <tbody>
        {EVENTS.map((e) => (
          <tr key={e.name}>
            <Td>{eventName(e)}</Td>
            <Td className="whitespace-nowrap">{e.date}</Td>
            <Td align="right" className="tabular-nums">{e.seats}</Td>
            <Td align="right" className="tabular-nums">{e.sold}</Td>
            <Td align="right" className="tabular-nums">{formatWholeCurrency(e.price)}</Td>
            <Td>{addOns(e)}</Td>
            <Td align="right" className="tabular-nums">{formatWholeCurrency(e.soldValue)}</Td>
            <Td align="right" className="tabular-nums">{formatWholeCurrency(e.openValue)}</Td>
          </tr>
        ))}
        <tr className="bg-muted/50 font-semibold">
          <Td>Total</Td>
          <Td />
          <Td align="right" className="tabular-nums">{EVENT_TOTALS.seats}</Td>
          <Td align="right" className="tabular-nums">{EVENT_TOTALS.sold}</Td>
          <Td />
          <Td />
          <Td align="right" className="tabular-nums">{formatWholeCurrency(EVENT_TOTALS.soldValue)}</Td>
          <Td align="right" className="tabular-nums">{formatWholeCurrency(EVENT_TOTALS.openValue)}</Td>
        </tr>
      </tbody>
    </PanelTable>
  )
}

function CashTimeline() {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm font-semibold text-foreground">How the money reaches your bank</p>
      <ul className="mt-3 space-y-2.5">
        {CASH_TIMELINE.map(({ icon: Icon, label, text }) => (
          <li key={label} className="flex gap-2.5 text-sm">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-foreground"><span className="font-semibold">{label}:</span> {text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ResyEventsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader title="Ticketed events" subtitle="Resy events · card payments matched through your POS" size="lg" onClose={() => closeDynamicPanel("resy-events")} />
      <PanelBody className="space-y-4">
        <EventsTable />
        <CashTimeline />
      </PanelBody>
    </PanelShell>
  )
}
