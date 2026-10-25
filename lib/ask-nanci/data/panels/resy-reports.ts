// Flow 32: how the Tallis group is doing, as of Sat Oct 24. Every figure is sample data.
// Covers, turns, cancellations, repeat parties, surveys and the venues' no-shows come
// from Resy. Card sales and Amex share come from the processor, one MID per venue.
// Authored figures are the rows below and the flagship's weeks in resy-group; every
// rate, cost, share and total is derived, so the chat and the panels quote the same
// numbers.

import { formatWholeCurrency } from "../../../../components/shared/format"
import { CARD_BRANDS, CARD_PER_COVER, COMPARED_WEEKS, MONTH_TO_DATE, NO_SHOW_COST, seatedCovers } from "./resy-group"
import { FEES_AFTER_CHARGE } from "./resy-deposits"
import { toTime } from "./resy-friday"

const count = (n: number) => n.toLocaleString("en-US")
const share = (part: number, whole: number) => ((part / whole) * 100).toFixed(1)
const changePct = (now: number, before: number) => Math.round(((now - before) / before) * 100)
// A true minus sign, so "−6 min" reads as a figure rather than a hyphen.
const signed = (n: number, unit: string) => `${n < 0 ? "−" : "+"}${Math.abs(n)}${unit}`

// ─── Step 1: this week against last ───────────────────────────────────────────

const { prior, latest } = COMPARED_WEEKS
const covers = { prior: seatedCovers(prior), latest: seatedCovers(latest) }
const coversChange = changePct(covers.latest, covers.prior)
const salesChange = changePct(latest.cardSales, prior.cardSales)
const turnChange = latest.turnMinutes - prior.turnMinutes
const amexShare = { prior: share(prior.amexSales, prior.cardSales), latest: share(latest.amexSales, latest.cardSales) }

export const WEEK_REPORT = {
  latest: latest.label,
  prior: prior.label,
  nights: latest.nights,
  covers: { ...covers, changePct: coversChange, delta: signed(coversChange, "%") },
  turn: { prior: toTime(prior.turnMinutes), latest: toTime(latest.turnMinutes), minutesFaster: -turnChange, delta: signed(turnChange, " min") },
  cardSales: { prior: prior.cardSales, latest: latest.cardSales, changePct: salesChange, delta: signed(salesChange, "%") },
  amexShare: { ...amexShare, delta: `from ${amexShare.prior}%` },
  cancellations: { prior: prior.cancellations, latest: latest.cancellations },
  repeatPct: { prior: prior.repeatPct, latest: latest.repeatPct },
  perCover: { prior: Math.round(prior.cardSales / covers.prior), latest: Math.round(latest.cardSales / covers.latest) },
}

/** The week-against-week table: label, then Oct 17–23, then Oct 10–16. */
export const WEEK_ROWS = [
  { label: "Booked covers", latest: count(latest.booked), prior: count(prior.booked) },
  { label: "No-show covers", latest: count(latest.noShows), prior: count(prior.noShows) },
  { label: "Walk-in covers", latest: count(latest.walkIns), prior: count(prior.walkIns) },
  { label: "Cancellations", latest: count(latest.cancellations), prior: count(prior.cancellations) },
  { label: "Repeat-guest parties", latest: `${latest.repeatPct}%`, prior: `${prior.repeatPct}%` },
]

// ─── Step 2: private guest surveys ────────────────────────────────────────────

export const SURVEY_SUMMARY = { window: latest.label, responses: 58, average: 4.6, lowAtMost: 2 }

interface LowRating {
  date: string
  time: string
  party: number
  table: string
  stars: number
  visits: number
  server?: string
  waitedPastBooking?: number // minutes
  comment?: string
}

// Resy Surveys attribute each response to its reservation, so the table, server and
// visit count come with it. T19, not T22: flow 29 holds T22 back for walk-ins at 8:00.
const LOW_RATING_ROWS: LowRating[] = [
  { date: "Fri Oct 23", time: "8:00 PM", party: 4, table: "T19", server: "Noor", waitedPastBooking: 24, visits: 9, stars: 2 },
  { date: "Fri Oct 23", time: "8:15 PM", party: 2, table: "T08", server: "Jordan", waitedPastBooking: 21, visits: 5, stars: 2 },
  { date: "Sat Oct 17", time: "7:30 PM", party: 4, table: "Back room", visits: 1, stars: 2, comment: "Too loud to talk." },
]

const visitLabel = (n: number) => `${n} ${n === 1 ? "visit" : "visits"}`

const ratingFacts = (r: LowRating) =>
  [
    `Party of ${r.party}`,
    r.table,
    r.server && `Server ${r.server}`,
    r.waitedPastBooking && `Waited ${r.waitedPastBooking} min past booking`,
    visitLabel(r.visits),
  ].filter(Boolean) as string[]

export const LOW_RATINGS = LOW_RATING_ROWS.map((r) => ({ ...r, facts: ratingFacts(r) }))

/** The low ratings from Friday's 8:00 seatings, the slot flow 29 opens up. */
export const FRIDAY_LOW_RATINGS = LOW_RATINGS.filter((r) => r.date.startsWith("Fri"))

// ─── Step 3: no-shows by location, Oct 1–23 ───────────────────────────────────

export const LOCATIONS_WINDOW = "Oct 1–23 · so far"

interface VenueFigures {
  booked: number
  noShows: number
  walkIns: number
  perCover: number // card sales per seated cover, before tips
  cardSales: number
  amexSales: number
  fees: number // no-show fees charged in Resy
}

// `short` is how the chat names the venue after its first mention.
const venue = (name: string, short: string, v: VenueFigures) => ({ name, short, ...v, ratePct: share(v.noShows, v.booked), cost: v.noShows * v.perCover, amexSharePct: share(v.amexSales, v.cardSales) })

// The other venues: authored from Resy and their own MIDs. Card sales are seated covers
// at the venue's per-cover figure. Neither venue has a no-show fee in Resy.
const otherVenue = (name: string, short: string, v: Omit<VenueFigures, "cardSales" | "fees">) => venue(name, short, { ...v, cardSales: seatedCovers(v) * v.perCover, fees: 0 })

// The flagship's row reuses resy-group's cost and Amex share rather than recomputing them.
export const FLAGSHIP_VENUE = {
  ...venue("Tallis", "Tallis", { ...MONTH_TO_DATE, perCover: CARD_PER_COVER, amexSales: CARD_BRANDS.amex.sales, fees: FEES_AFTER_CHARGE }),
  cost: NO_SHOW_COST,
  amexSharePct: CARD_BRANDS.amexSharePct,
}

export const VENUES = [
  FLAGSHIP_VENUE,
  otherVenue("Little Tallis", "Little Tallis", { booked: 1520, noShows: 41, walkIns: 221, perCover: 54, amexSales: 20563 }),
  otherVenue("Tallis Market", "Market", { booked: 1980, noShows: 96, walkIns: 266, perCover: 61, amexSales: 35542 }),
]

const sumVenues = (pick: (v: (typeof VENUES)[number]) => number) => VENUES.reduce((total, v) => total + pick(v), 0)

const group = {
  booked: sumVenues((v) => v.booked),
  noShows: sumVenues((v) => v.noShows),
  cost: sumVenues((v) => v.cost),
  fees: sumVenues((v) => v.fees),
  cardSales: sumVenues((v) => v.cardSales),
  amexSales: sumVenues((v) => v.amexSales),
}

export const GROUP = { ...group, ratePct: share(group.noShows, group.booked), amexSharePct: share(group.amexSales, group.cardSales) }

export const MOST_NO_SHOWS = VENUES.reduce((most, v) => (v.noShows > most.noShows ? v : most))
export const HIGHEST_RATE = VENUES.reduce((most, v) => (Number(v.ratePct) > Number(most.ratePct) ? v : most))

const money = formatWholeCurrency

/** The seven-row venue table: one value per venue, then the group ("" where none). */
export const LOCATION_ROWS = [
  { label: "Booked covers", values: [...VENUES.map((v) => count(v.booked)), count(GROUP.booked)] },
  { label: "No-show covers", values: [...VENUES.map((v) => count(v.noShows)), count(GROUP.noShows)] },
  { label: "No-show rate", values: [...VENUES.map((v) => `${v.ratePct}%`), `${GROUP.ratePct}%`] },
  { label: "Card sales per cover", values: [...VENUES.map((v) => money(v.perCover)), ""] },
  { label: "No-show cost", values: [...VENUES.map((v) => money(v.cost)), money(GROUP.cost)] },
  { label: "Fees charged", values: [...VENUES.map((v) => money(v.fees)), money(GROUP.fees)] },
  { label: "Amex share of card sales", values: [...VENUES.map((v) => `${v.amexSharePct}%`), `${GROUP.amexSharePct}%`] },
]
