import type { ChartWidget } from "../../types"
import { CHECK_PER_COVER } from "./resy-no-shows"

// Flow 26: one Saturday service run through Resy from the chat. Five Resy OS features,
// one per exchange: shift view, guest profiles, Waitlist & Notify, guest SMS, reports.
//
// Authored figures are covers, party sizes and sales. Totals, per-cover spend and the
// recovered table value are derived, so the answers and the panels cannot disagree.

export const SHIFT_DATE = "Sat, Oct 24"

// ─── Shift view ───────────────────────────────────────────────────────────────

// Covers the kitchen paces to per half-hour slot.
export const KITCHEN_PACE = 24

const SLOTS_RAW: [string, number][] = [
  ["5:00", 6], ["5:30", 10], ["6:00", 14], ["6:30", 18], ["7:00", 22],
  ["7:30", 16], ["8:00", 12], ["8:30", 10], ["9:00", 6], ["9:30", 4],
]

export const SHIFT_SLOTS = SLOTS_RAW.map(([time, covers]) => ({ time, covers }))
export const SHIFT_COVERS = SHIFT_SLOTS.reduce((total, s) => total + s.covers, 0)
export const SHIFT_PEAK = SHIFT_SLOTS.reduce((max, s) => (s.covers > max.covers ? s : max))
export const SHIFT_PARTIES = 41
export const SHIFT_WAITLIST = 6

// ─── Guest profiles ───────────────────────────────────────────────────────────

export interface GuestToKnow {
  name: string
  time: string
  party: number
  table: string
  tags: { label: string; tone: "occasion" | "alert" | "vip" | "new" }[]
  note: string
  visits: number
  avgSpend: number | null // per visit, from card transactions; null for a first visit
  lastVisit: string | null
}

export const GUESTS_TO_KNOW: GuestToKnow[] = [
  {
    name: "Maria Alvarez", time: "7:00 PM", party: 8, table: "41",
    tags: [{ label: "Birthday", tone: "occasion" }, { label: "Friend of Chef", tone: "vip" }],
    note: "Her sister is dropping a cake off at 6:30.",
    visits: 12, avgSpend: 412, lastVisit: "Sep 19",
  },
  {
    name: "James Whitfield", time: "7:30 PM", party: 2, table: "12",
    tags: [{ label: "Anniversary", tone: "occasion" }, { label: "Shellfish allergy", tone: "alert" }],
    note: "Proposed at this table in 2021.",
    visits: 6, avgSpend: 186, lastVisit: "Aug 30",
  },
  {
    name: "Priya Raman", time: "8:30 PM", party: 4, table: "22",
    tags: [{ label: "First visit", tone: "new" }, { label: "Food writer", tone: "vip" }],
    note: "Booked through Global Dining Access.",
    visits: 0, avgSpend: null, lastVisit: null,
  },
]

// ─── Waitlist & Notify ────────────────────────────────────────────────────────

export const CANCELLED = { guest: "the Chens", time: "8:00 PM", party: 4 }
export const RECOVERED_VALUE = CANCELLED.party * CHECK_PER_COVER

export interface NotifyEntry {
  name: string
  party: number
  window: string
  visits: number
  status: "booked" | "standby" | "no-fit"
  reason: string
}

// Ranked the way Nanci offered the table: exact fit and a regular first.
export const NOTIFY_LIST: NotifyEntry[] = [
  { name: "Sam Patel",   party: 4, window: "7:30–8:30 PM", visits: 5, status: "booked",  reason: "Accepted in 2 min" },
  { name: "Nora Kim",    party: 4, window: "7:45–9:00 PM", visits: 0, status: "standby", reason: "Next in line" },
  { name: "Jules Martin", party: 3, window: "7:00–8:00 PM", visits: 1, status: "standby", reason: "Fits, ranked lower" },
  { name: "Alex Rivera", party: 6, window: "8:00–9:00 PM", visits: 2, status: "no-fit",  reason: "Party too large" },
]

export const NOTIFY_TAKER = NOTIFY_LIST[0]

// ─── Guest SMS ────────────────────────────────────────────────────────────────

export const SMS_SLOT = "7:30 PM"
export const SMS_DELAY_MIN = 15
export const SMS_TEXT = `We're running about ${SMS_DELAY_MIN} minutes behind tonight, so sorry. Your table will be ready shortly, and your first round at the bar is on us.`

export interface SmsRecipient {
  name: string
  party: number
  status: "delivered" | "replied"
  reply?: string
  flagged?: boolean
}

export const SMS_RECIPIENTS: SmsRecipient[] = [
  { name: "James Whitfield", party: 2, status: "replied", reply: "No rush, thanks for the heads-up!" },
  { name: "Ana Torres",      party: 4, status: "replied", reply: "Can we still get the booth?", flagged: true },
  { name: "Kemi Okafor",     party: 4, status: "delivered" },
  { name: "Minh Nguyen",     party: 2, status: "delivered" },
  { name: "Lena Schmidt",    party: 4, status: "delivered" },
]

export const SMS_GUESTS = SMS_RECIPIENTS.reduce((total, r) => total + r.party, 0)

// ─── Report ───────────────────────────────────────────────────────────────────

// Card sales matched to tables, split by where the booking came from.
const SOURCES_RAW = [
  { source: "Resy",    covers: 112, sales: 6608 },
  { source: "Walk-in", covers: 19,  sales: 836 },
  { source: "Phone",   covers: 6,   sales: 300 },
]

export const REPORT_SOURCES = SOURCES_RAW.map((s) => ({ ...s, perCover: s.sales / s.covers }))
export const REPORT_COVERS = REPORT_SOURCES.reduce((total, s) => total + s.covers, 0)
export const REPORT_SALES = REPORT_SOURCES.reduce((total, s) => total + s.sales, 0)
export const REPORT_PER_COVER = REPORT_SALES / REPORT_COVERS
export const REPORT_NO_SHOWS = { parties: 2, seats: 10 }

const resy = REPORT_SOURCES[0]
const walkIn = REPORT_SOURCES[1]
export const RESY_PER_COVER = resy.perCover
export const RESY_LIFT_PER_COVER = resy.perCover - walkIn.perCover

export const REPORT_CHART: ChartWidget = {
  kind: "bar",
  title: "Spend per cover by booking source",
  labels: REPORT_SOURCES.map((s) => s.source),
  datasets: [{ label: "Per cover", data: REPORT_SOURCES.map((s) => Math.round(s.perCover * 100) / 100) }],
}
