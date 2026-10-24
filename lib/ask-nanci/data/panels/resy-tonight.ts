import { CARD_PER_COVER } from "./resy-group"

// Flow 28: tonight's service at the Tallis flagship, Sat Oct 24. Every figure is sample
// data from Resy unless it says otherwise. Authored figures are the rows below: slots,
// party mix, unconfirmed parties and waitlist parties. Every total is derived from them,
// so the chat and the panels quote the same numbers.

export const TONIGHT_DATE = "Sat, Oct 24"
export const BOOK_AS_OF = "3:00pm"
export const REPLIES_AS_OF = "3:03pm"
export const WAITLIST_AS_OF = "7:40pm"

// ─── Tonight's book ───────────────────────────────────────────────────────────

// Resy paces per 15 minutes; the arrival chart buckets by half hour.
export const PACING_PER_15_MIN = 16
export const PACING_PER_HALF_HOUR = PACING_PER_15_MIN * 2

const SLOTS_RAW: [string, number][] = [
  ["5:00", 12], ["5:30", 18], ["6:00", 24], ["6:30", 28], ["7:00", 32],
  ["7:30", 30], ["8:00", 26], ["8:30", 20], ["9:00", 14], ["9:30", 10],
]

export const BOOK_SLOTS = SLOTS_RAW.map(([time, covers]) => ({ time, covers }))
export const BOOK_PEAK = BOOK_SLOTS.reduce((max, s) => (s.covers > max.covers ? s : max))
export const BOOK_COVERS = BOOK_SLOTS.reduce((total, s) => total + s.covers, 0)

// Parties by size. Large parties are listed one by one.
export const PARTY_MIX = [
  { size: 2, count: 42 },
  { size: 3, count: 11 },
  { size: 4, count: 15 },
  { size: 5, count: 2 },
]
export const LARGE_PARTIES = [8, 7, 6, 6]
export const BOOK_PARTIES = PARTY_MIX.reduce((total, p) => total + p.count, 0) + LARGE_PARTIES.length
export const PARTY_MIX_COVERS = PARTY_MIX.reduce((total, p) => total + p.size * p.count, 0) + LARGE_PARTIES.reduce((total, n) => total + n, 0)

export const TO_KNOW = { vips: 6, allergies: 9, birthdays: 7, anniversaries: 4, repeatGuests: 31 }
export const CELEBRATIONS = TO_KNOW.birthdays + TO_KNOW.anniversaries

// ─── Unconfirmed parties, and their replies to the follow-up ──────────────────

export type ConfirmReply = "confirmed" | "cancelled" | "none"

export interface UnconfirmedParty {
  time: string
  name: string
  party: number
  booked: string // the date the booking was made
  reply: ConfirmReply // the reply to Resy's confirmation follow-up
}

// Excludes today's six bookings, which Resy auto-confirmed. Every booking predates
// yesterday's 4pm confirmation text, so the latest is Oct 22.
export const UNCONFIRMED: UnconfirmedParty[] = [
  { time: "7:00", name: "Okafor", party: 7, booked: "Oct 2", reply: "confirmed" },
  { time: "7:15", name: "Brandt", party: 6, booked: "Oct 8", reply: "none" },
  { time: "6:30", name: "Lindqvist", party: 4, booked: "Oct 13", reply: "none" },
  { time: "8:00", name: "Ferreira", party: 4, booked: "Oct 16", reply: "confirmed" },
  { time: "6:00", name: "Huang", party: 2, booked: "Oct 18", reply: "confirmed" },
  { time: "6:45", name: "Delacroix", party: 2, booked: "Oct 19", reply: "confirmed" },
  { time: "7:30", name: "Novak", party: 2, booked: "Oct 20", reply: "confirmed" },
  { time: "8:30", name: "Sato", party: 2, booked: "Oct 21", reply: "cancelled" },
  { time: "9:00", name: "Abernathy", party: 2, booked: "Oct 22", reply: "none" },
]

export const UNCONFIRMED_COVERS = UNCONFIRMED.reduce((total, p) => total + p.party, 0)
export const LARGEST_UNCONFIRMED = UNCONFIRMED.reduce((max, p) => (p.party > max.party ? p : max))

export const partiesWithReply = (reply: ConfirmReply) => UNCONFIRMED.filter((p) => p.reply === reply)
export const coversWithReply = (reply: ConfirmReply) => partiesWithReply(reply).reduce((total, p) => total + p.party, 0)

const cancelled = partiesWithReply("cancelled")
export const BOOK_AFTER = {
  covers: BOOK_COVERS - coversWithReply("cancelled"),
  parties: BOOK_PARTIES - cancelled.length,
}

// ─── Walk-in waitlist at 7:40pm ───────────────────────────────────────────────

export type WaitStatus = "seated" | "left" | "waiting"

export interface WaitParty {
  id: number
  party: number
  quoted: number // minutes quoted at the door
  waited: number // minutes waited until seated, until they left, or so far
  status: WaitStatus
}

const WAITLIST_RAW: [number, number, number, WaitStatus][] = [
  [2, 30, 22, "seated"], [4, 45, 37, "seated"], [2, 35, 27, "seated"], [3, 40, 31, "seated"],
  [2, 40, 30, "seated"], [4, 45, 36, "seated"], [2, 45, 34, "seated"],
  [2, 50, 41, "left"], [4, 60, 48, "left"],
  [4, 55, 33, "waiting"], [2, 35, 29, "waiting"], [3, 45, 24, "waiting"], [2, 35, 21, "waiting"], [2, 35, 16, "waiting"],
  [4, 55, 12, "waiting"], [3, 45, 9, "waiting"], [2, 35, 6, "waiting"], [2, 35, 3, "waiting"],
]

export const WAITLIST: WaitParty[] = WAITLIST_RAW.map(([party, quoted, waited, status], i) => ({ id: i + 1, party, quoted, waited, status }))

export const waitPartiesWith = (status: WaitStatus) => WAITLIST.filter((p) => p.status === status)
const sumParty = (rows: WaitParty[]) => rows.reduce((total, p) => total + p.party, 0)
const average = (rows: WaitParty[], pick: (p: WaitParty) => number) => Math.round(rows.reduce((total, p) => total + pick(p), 0) / rows.length)

export const WAITING = waitPartiesWith("waiting")
export const WAITING_GUESTS = sumParty(WAITING)
export const WAIT_SUMMARY = {
  joined: WAITLIST.length,
  seated: waitPartiesWith("seated").length,
  left: waitPartiesWith("left").length,
  waiting: WAITING.length,
  avgWaited: average(waitPartiesWith("seated"), (p) => p.waited),
  avgQuoted: average(waitPartiesWith("seated"), (p) => p.quoted),
}

/** The current quote for a party size: what the waiting parties of that size were quoted. */
export const quoteFor = (size: number) => WAITING.find((p) => p.party === size)?.quoted ?? 0

export const LEFT_QUOTES = waitPartiesWith("left").map((p) => p.quoted)
export const WALKOUT_COVERS = sumParty(waitPartiesWith("left"))
export const WALKOUT_VALUE = WALKOUT_COVERS * CARD_PER_COVER
