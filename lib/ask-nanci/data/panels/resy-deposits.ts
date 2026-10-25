// Flow 31: no-show fees and events at the Tallis flagship, today, Sat Oct 24. Every
// figure is sample data. The booking, its timeline, the events and their sales come from
// Resy. Last year's wine-dinner spend comes from card payments matched to Resy tables
// through the POS. Fees and tickets pay out through the venue's Stripe account, not the
// processor. Authored figures are the rows below, and every total is derived from them,
// so the chat and the panels quote the same numbers.

import { formatWholeCurrency } from "../../../../components/shared/format"
import { FEE_POLICY, FEES_CHARGED } from "./resy-group"

// ─── Steps 1 and 2: last night's no-show and its evidence ─────────────────────

/** Fri Oct 23 is a fee night, so the policy applies. */
export const NO_SHOW_BOOKING = { guest: "Kessler", date: "Fri Oct 23", time: "7:30 PM", party: 4, table: 12, bookedOn: "Oct 12" }

export const NO_SHOW_FEE = NO_SHOW_BOOKING.party * FEE_POLICY.perGuest
/** October's no-show fees once this one is charged. */
export const FEES_AFTER_CHARGE = FEES_CHARGED + NO_SHOW_FEE

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2026-10-12 14:41" → "Oct 12, 2:41 PM". A day with no time reads "Oct 23". */
const formatStamp = (at: string) => {
  const [date, time] = at.split(" ")
  const [, month, day] = date.split("-").map(Number)
  const label = `${MONTHS[month - 1]} ${day}`
  if (!time) return label
  const [hour, minute] = time.split(":").map(Number)
  return `${label}, ${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`
}

const stamp = (at: string, text: string) => ({ at, label: formatStamp(at), text })

// The booking's Resy record, in order. "at" sorts as text.
export const EVIDENCE_TIMELINE = [
  stamp("2026-10-12 14:41", "Booked in the Resy app, policy shown, card saved"),
  stamp("2026-10-22 16:00", "Confirmation text sent"),
  stamp("2026-10-22 18:12", "Guest replied CONFIRM"),
  stamp("2026-10-23", "No cancellation logged"),
  stamp("2026-10-23 20:15", "Marked No-Show"),
  stamp("2026-10-24 15:20", `${formatWholeCurrency(NO_SHOW_FEE)} charged`),
]

// ─── Step 3: ticketed events through New Year's ───────────────────────────────

interface TicketedEvent {
  name: string
  date: string
  seatings: number
  perSeating: number // seats per seating
  sold: number
  price: number
  addOn: { sold: number; price: number; label: string } | null
}

const EVENT_ROWS: TicketedEvent[] = [
  { name: "Harvest Wine Dinner", date: "Thu Nov 12", seatings: 1, perSeating: 48, sold: 41, price: 165, addOn: { sold: 18, price: 65, label: "reserve pairing" } },
  { name: "Thanksgiving Prix Fixe", date: "Thu Nov 26", seatings: 2, perSeating: 70, sold: 96, price: 95, addOn: null },
  { name: "New Year's Eve Tasting", date: "Thu Dec 31", seatings: 1, perSeating: 96, sold: 52, price: 185, addOn: null },
]

const withValues = (e: TicketedEvent) => {
  const seats = e.seatings * e.perSeating
  const open = seats - e.sold
  const addOnValue = e.addOn ? e.addOn.sold * e.addOn.price : 0
  return { ...e, seats, open, soldValue: e.sold * e.price + addOnValue, openValue: open * e.price }
}

export const EVENTS = EVENT_ROWS.map(withValues)
type EventWithValues = (typeof EVENTS)[number]

const sumEvents = (pick: (e: EventWithValues) => number) => EVENTS.reduce((total, e) => total + pick(e), 0)

export const EVENT_TOTALS = {
  seats: sumEvents((e) => e.seats),
  sold: sumEvents((e) => e.sold),
  open: sumEvents((e) => e.open),
  soldValue: sumEvents((e) => e.soldValue),
  openValue: sumEvents((e) => e.openValue),
}

export const WINE_DINNER = EVENTS[0]

// ─── How each kind of money reaches the bank ──────────────────────────────────

/** Card sales per guest on last year's wine-dinner night, matched to its Resy covers. */
export const NIGHT_SPEND_PER_GUEST = 41
/** On-the-night card spend at the wine dinner if it sells out. */
export const NIGHT_ESTIMATE = WINE_DINNER.seats * NIGHT_SPEND_PER_GUEST

/** Stripe's usual U.S. payout delay after a sale, in business days. */
export const STRIPE_PAYOUT_DAYS = 2
