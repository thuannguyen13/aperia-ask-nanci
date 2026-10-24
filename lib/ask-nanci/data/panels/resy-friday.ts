import { CARD_FEE_RATE, PACING_PER_15_MIN, PACING_PER_HALF_HOUR, TURN_TIMES, type PartyTier } from "./resy-group"

// Flow 29: filling the book for Fri Oct 30 at the Tallis flagship, planned today, Sat
// Oct 24. Every figure is sample data. The book, Notify and table records come from
// Resy; per-cover sales come from card checks matched to Resy tables. Authored figures
// are the rows below, and every total is derived from them, so the chat and the panels
// quote the same numbers.

export const FRIDAY_DATE = "Fri, Oct 30"
export const FRIDAY_AS_OF = "Resy book as of Sat, Oct 24"

// Clock times are evening "h:mm" strings.
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}
const toTime = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`

/** A turn time as Resy shows it, "1:45". */
export const formatTurn = (minutes: number) => toTime(minutes)

// ─── Step 1: move the Marsh party ─────────────────────────────────────────────

export const MOVE = {
  guest: "Marsh",
  party: 6,
  from: { time: "8:00", table: 30 },
  to: { time: "7:30", table: 31 },
}

// Table 31's earlier party: a 5:00 six-top on the 6+ turn.
const T31_EARLIER = { time: "5:00", tier: "6+" as PartyTier }

/** When Table 31 turns and is free for the Marsh party. */
export const MOVE_TABLE_FREES = toTime(toMinutes(T31_EARLIER.time) + TURN_TIMES[T31_EARLIER.tier])

// Covers already booked in the 7:30 half hour.
const BOOKED_AT_730 = 26

export const PACING_CHECK = {
  time: MOVE.to.time,
  before: BOOKED_AT_730,
  after: BOOKED_AT_730 + MOVE.party,
  cap: PACING_PER_HALF_HOUR,
}

// ─── Friday per cover, turns and seat-hours ───────────────────────────────────

// Card sales per cover on October Fridays, by party size: checks matched to Resy tables.
const FRIDAY_PER_COVER: Record<PartyTier, number> = { "2": 76, "4": 80, "6+": 88 }

const round2 = (n: number) => Math.round(n * 100) / 100

export const SEAT_HOURS = (Object.keys(TURN_TIMES) as PartyTier[]).map((tier) => {
  const afterFees = FRIDAY_PER_COVER[tier] * (1 - CARD_FEE_RATE)
  return { tier, turn: TURN_TIMES[tier], afterFees: round2(afterFees), perSeatHour: afterFees / (TURN_TIMES[tier] / 60) }
})

const seatHourFor = (tier: PartyTier) => SEAT_HOURS.find((r) => r.tier === tier)!.perSeatHour

/** A booked Friday four-top, after card fees, per seat-hour. */
export const FOUR_TOP_SEAT_HOUR = Math.round(seatHourFor("4"))

// ─── Step 2: Notify for Friday ────────────────────────────────────────────────

// The automatic Notify alert that refilled the six-top the move freed.
const REBOOK_RAW = { party: 5, minutes: 11, table: MOVE.from.table, time: MOVE.from.time, tier: "6+" as PartyTier }
export const REBOOK = { ...REBOOK_RAW, perCover: FRIDAY_PER_COVER[REBOOK_RAW.tier], value: REBOOK_RAW.party * FRIDAY_PER_COVER[REBOOK_RAW.tier] }

export const NOTIFY_SIZES = [2, 3, 4, 6]

// Parties still on Notify after the rebook, by requested half hour and party size.
const NOTIFY_CELLS: Record<string, Record<number, number>> = {
  "6:00": { 2: 2, 3: 1 },
  "6:30": { 2: 2, 3: 1, 4: 1, 6: 1 },
  "7:00": { 2: 3, 3: 2, 4: 1 },
  "7:30": { 2: 6, 4: 4 },
  "8:00": { 2: 6, 4: 5 },
  "8:30": { 2: 1, 3: 1 },
}

export const NOTIFY_HISTOGRAM = Object.entries(NOTIFY_CELLS).map(([time, bySize]) => ({
  time,
  counts: NOTIFY_SIZES.map((size) => bySize[size] ?? 0),
}))

const countParties = (times: string[], size?: number) =>
  NOTIFY_HISTOGRAM.filter((h) => times.includes(h.time)).reduce((total, h) => total + h.counts.reduce((t, c, i) => t + (size === undefined || NOTIFY_SIZES[i] === size ? c : 0), 0), 0)
const countGuests = (times: string[]) =>
  NOTIFY_HISTOGRAM.filter((h) => times.includes(h.time)).reduce((total, h) => total + h.counts.reduce((t, c, i) => t + c * NOTIFY_SIZES[i], 0), 0)

const ALL_TIMES = NOTIFY_HISTOGRAM.map((h) => h.time)
export const NOTIFY_PARTIES = countParties(ALL_TIMES)
export const NOTIFY_GUESTS = countGuests(ALL_TIMES)
export const NOTIFY_BY_SIZE = NOTIFY_SIZES.map((size) => ({ size, parties: countParties(ALL_TIMES, size) }))

// The window most of the list wants, and nothing is open in.
const WINDOW_TIMES = ["7:30", "8:00"]
export const PEAK_WINDOW = {
  label: "7:30–8:30",
  times: WINDOW_TIMES,
  twos: countParties(WINDOW_TIMES, 2),
  fours: countParties(WINDOW_TIMES, 4),
  parties: countParties(WINDOW_TIMES),
  guests: countGuests(WINDOW_TIMES),
}

export type NotifyStatus = "booked" | "waiting"
export interface NotifyRow {
  name: string
  party: number
  window: string
  visits: number
  status: NotifyStatus
  reason: string
}

// The top of the list, ranked by fit, then visits.
export const NOTIFY_TOP: NotifyRow[] = [
  { name: "Reyes", party: REBOOK.party, window: "7:30–8:30", visits: 4, status: "booked", reason: `Took T${REBOOK.table} at ${REBOOK.time}` },
  { name: "Whitfield", party: 4, window: "7:30–8:30", visits: 6, status: "waiting", reason: "No four-top open" },
  { name: "Osei", party: 2, window: "8:00–8:30", visits: 3, status: "waiting", reason: "No two-top open" },
  { name: "Kaplan", party: 4, window: "7:45–8:30", visits: 2, status: "waiting", reason: "No four-top open" },
  { name: "Moreau", party: 2, window: "7:30–8:00", visits: 0, status: "waiting", reason: "No two-top open" },
]

// ─── Step 3: open two 8:00 four-tops ──────────────────────────────────────────

const FOUR_TOP_SEATS = 4
export const RELEASED_TABLES = [21, 22]
export const ONLINE_WINDOW = { from: "7:45", to: "8:30" }
export const OPEN_INCREMENT = "8:00"

const raisedPacing = PACING_PER_15_MIN + RELEASED_TABLES.length * FOUR_TOP_SEATS

export const AVAILABILITY = {
  fourTops: { before: 0, after: RELEASED_TABLES.length },
  pacing: { before: PACING_PER_15_MIN, after: raisedPacing },
  halfHour: { before: PACING_PER_HALF_HOUR, after: PACING_PER_HALF_HOUR - PACING_PER_15_MIN + raisedPacing },
}

// Minutes a walk-in sat at T21 and T22 between 7:45 and 9:30 on each October Friday,
// from Resy seat records. The window is one four-top turn long.
const HELD_SEATED_MINUTES: Record<number, number[]> = { 21: [105, 60, 75, 45], 22: [60, 45, 60, 54] }

const heldMinutes = Object.values(HELD_SEATED_MINUTES).flat()
const heldFill = heldMinutes.reduce((total, m) => total + m, 0) / (heldMinutes.length * TURN_TIMES["4"])

export const HELD_FILL_PCT = Math.round(heldFill * 100)
export const HELD_EMPTY_PCT = 100 - HELD_FILL_PCT
/** What a held four-top earns per seat-hour, at its walk-in fill. */
export const HELD_SEAT_HOUR = seatHourFor("4") * heldFill

// What Notify brought in once the tables went online.
const POST_OPEN_RAW = { table: RELEASED_TABLES[0], time: OPEN_INCREMENT, minutes: 6, party: FOUR_TOP_SEATS }
export const POST_OPEN = { ...POST_OPEN_RAW, value: POST_OPEN_RAW.party * FRIDAY_PER_COVER["4"] }
export const STILL_OPEN = RELEASED_TABLES.filter((t) => t !== POST_OPEN.table)
