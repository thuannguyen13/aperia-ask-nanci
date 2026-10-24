import type { ChartWidget } from "../../types"

// Flow 25: what Resy no-shows cost a restaurant, read against its card data.
//
// Story: no-shows cluster on Friday and Saturday in parties of six or more, and the
// fees charged recover almost none of it. A deposit on exactly those bookings is the fix.
//
// Seats per party size and fees are the authored figures. Night totals and lost revenue
// are ALWAYS derived from them, never typed in, so the answers, chart and panel agree.

// Average card spend per cover, from the processor's side of the data.
export const CHECK_PER_COVER = 52

export const PERIOD = "Oct 1–22, 2026"

// The heatmap's rows. The last one is the bucket the deposit policy targets.
export const PARTY_SIZES = ["1–2", "3–5", "6+"]

interface NightRaw {
  night: string
  parties: number
  seatsBySize: [number, number, number] // seats lost per PARTY_SIZES bucket
  feesCharged: number
}

const NIGHTS_RAW: NightRaw[] = [
  { night: "Monday",    parties: 2,  seatsBySize: [2, 3, 0],   feesCharged: 0 },
  { night: "Tuesday",   parties: 3,  seatsBySize: [4, 3, 0],   feesCharged: 0 },
  { night: "Wednesday", parties: 3,  seatsBySize: [4, 4, 0],   feesCharged: 0 },
  { night: "Thursday",  parties: 5,  seatsBySize: [4, 4, 6],   feesCharged: 80 },
  { night: "Friday",    parties: 11, seatsBySize: [6, 10, 30], feesCharged: 240 },
  { night: "Saturday",  parties: 12, seatsBySize: [6, 10, 36], feesCharged: 320 },
  { night: "Sunday",    parties: 4,  seatsBySize: [4, 6, 0],   feesCharged: 0 },
]

export const NO_SHOW_NIGHTS = NIGHTS_RAW.map((n) => {
  const seats = n.seatsBySize.reduce((a, b) => a + b, 0)
  return { ...n, seats, largePartySeats: n.seatsBySize[2], lostRevenue: seats * CHECK_PER_COVER }
})

const sum = (pick: (n: (typeof NO_SHOW_NIGHTS)[number]) => number) => NO_SHOW_NIGHTS.reduce((total, n) => total + pick(n), 0)

export const NO_SHOW_TOTALS = {
  parties: sum((n) => n.parties),
  seats: sum((n) => n.seats),
  lostRevenue: sum((n) => n.lostRevenue),
  feesCharged: sum((n) => n.feesCharged),
}

export const RECOVERED_PCT = Math.round((NO_SHOW_TOTALS.feesCharged / NO_SHOW_TOTALS.lostRevenue) * 100)

export const PEAK_NIGHTS = ["Friday", "Saturday"]
const PEAK = NO_SHOW_NIGHTS.filter((n) => PEAK_NIGHTS.includes(n.night))
export const PEAK_LARGE_SEATS = PEAK.reduce((total, n) => total + n.largePartySeats, 0)
export const PEAK_LARGE_SHARE_PCT = Math.round((PEAK_LARGE_SEATS / NO_SHOW_TOTALS.seats) * 100)

// The chart under the first answer: what each night lost against what fees won back.
export const NO_SHOW_CHART: ChartWidget = {
  kind: "bar",
  title: "No-show cost vs fees charged, by night",
  labels: NO_SHOW_NIGHTS.map((n) => n.night.slice(0, 3)),
  datasets: [
    { label: "Lost revenue", data: NO_SHOW_NIGHTS.map((n) => n.lostRevenue) },
    { label: "Fees charged", data: NO_SHOW_NIGHTS.map((n) => n.feesCharged) },
  ],
}

// The policy the follow-up turns on in Resy.
export const DEPOSIT_POLICY = {
  perGuest: 25,
  nights: "Friday and Saturday",
  minParty: 6,
  refundWindowHours: 24,
  startsOn: "Nov 1",
}

// What October's peak large-party no-shows would have left in deposits.
export const DEPOSIT_WOULD_HAVE_KEPT = PEAK_LARGE_SEATS * DEPOSIT_POLICY.perGuest

// The first Friday under the policy: large parties already on the book, and where each
// deposit stands. Amounts are derived from party size.
export const BOOK_DATE = "Fri, Nov 6"

interface BookedPartyRaw {
  time: string
  guest: string
  party: number
  status: "paid" | "requested"
  note?: string
}

const BOOK_RAW: BookedPartyRaw[] = [
  { time: "6:30 PM", guest: "Maria Alvarez",  party: 8,  status: "paid", note: "Anniversary" },
  { time: "7:00 PM", guest: "David Chen",     party: 6,  status: "paid" },
  { time: "7:45 PM", guest: "Grace Okafor",   party: 10, status: "requested", note: "Link sent 2h ago" },
  { time: "8:30 PM", guest: "Liam Brennan",   party: 6,  status: "paid", note: "Regular · 9 visits" },
]

export const BOOK_PREVIEW = BOOK_RAW.map((b) => ({ ...b, deposit: b.party * DEPOSIT_POLICY.perGuest }))
export const BOOK_HELD = BOOK_PREVIEW.filter((b) => b.status === "paid").reduce((total, b) => total + b.deposit, 0)
export const BOOK_AWAITING = BOOK_PREVIEW.filter((b) => b.status === "requested")
