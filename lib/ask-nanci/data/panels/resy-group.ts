// Tallis Hospitality Group, the fictional Resy restaurant group behind the Resy flows.
// Every figure is sample data. Covers and fees come from Resy; card sales come from the
// processor. Authored figures are the weekly rows; every total is derived from them.

// ─── Flagship settings in Resy ────────────────────────────────────────────────

// Resy paces per 15 minutes; the arrival charts bucket by half hour.
export const PACING_PER_15_MIN = 16
export const PACING_PER_HALF_HOUR = PACING_PER_15_MIN * 2

/** Turn times by party size, in minutes, as set in Resy and measured on Fridays. */
export const TURN_TIMES = { "2": 90, "4": 105, "6+": 135 }
export type PartyTier = keyof typeof TURN_TIMES

/** Blended processing fees on the flagship's card sales. */
export const CARD_FEE_RATE = 0.027

// ─── Flagship month to date (Oct 1–23) ────────────────────────────────────────

interface FlagshipWeek {
  label: string
  nights: number
  booked: number // Resy booked covers
  noShows: number // Resy no-show covers
  walkIns: number
  cardSales: number // processor card sales, before tips
}

export const FLAGSHIP_WEEKS: FlagshipWeek[] = [
  { label: "Oct 1–9", nights: 8, booked: 1222, noShows: 41, walkIns: 221, cardSales: 109358 },
  { label: "Oct 10–16", nights: 6, booked: 1045, noShows: 41, walkIns: 210, cardSales: 94690 },
  { label: "Oct 17–23", nights: 6, booked: 1128, noShows: 36, walkIns: 220, cardSales: 102330 },
]

const sumWeeks = (pick: (w: FlagshipWeek) => number) => FLAGSHIP_WEEKS.reduce((total, w) => total + pick(w), 0)

/** Seated covers: booked covers that showed, plus walk-ins. */
export const seatedCovers = (w: Pick<FlagshipWeek, "booked" | "noShows" | "walkIns">) => w.booked - w.noShows + w.walkIns

const booked = sumWeeks((w) => w.booked)
const noShows = sumWeeks((w) => w.noShows)
const walkIns = sumWeeks((w) => w.walkIns)

export const MONTH_TO_DATE = {
  booked,
  noShows,
  walkIns,
  seated: seatedCovers({ booked, noShows, walkIns }),
  cardSales: sumWeeks((w) => w.cardSales),
}

const pct = (part: number, whole: number, decimals = 0) => Number(((part / whole) * 100).toFixed(decimals))

export const NO_SHOW_RATE_PCT = pct(MONTH_TO_DATE.noShows, MONTH_TO_DATE.booked, 1)

// Booked covers split by whether the party answered Resy's confirmation text.
export const CONFIRMATION_SPLIT = {
  unconfirmed: { covers: 509, noShows: 61 },
  confirmed: { covers: 2886, noShows: 57 },
}
export const UNCONFIRMED_NO_SHOW_PCT = pct(CONFIRMATION_SPLIT.unconfirmed.noShows, CONFIRMATION_SPLIT.unconfirmed.covers)
export const CONFIRMED_NO_SHOW_PCT = pct(CONFIRMATION_SPLIT.confirmed.noShows, CONFIRMATION_SPLIT.confirmed.covers)

// ─── What a cover is worth, and what no-shows cost ────────────────────────────

/** Card sales per seated cover, in whole dollars: processor sales ÷ Resy seated covers. */
export const CARD_PER_COVER = Math.round(MONTH_TO_DATE.cardSales / MONTH_TO_DATE.seated)

// The flagship's no-show fee in Resy: a card on file, charged by staff afterwards.
export const FEE_POLICY = { perGuest: 25, nights: "Fri and Sat", cancelByHours: 24 }
const FEE_COVERS_CHARGED = 38
export const FEES_CHARGED = FEE_COVERS_CHARGED * FEE_POLICY.perGuest

export const NO_SHOW_COST = MONTH_TO_DATE.noShows * CARD_PER_COVER
export const NO_SHOW_NET = NO_SHOW_COST - FEES_CHARGED

// ─── October card sales by card brand (processor) ─────────────────────────────

// The processor carries the brand of the card that paid, so this is Amex cards on the
// flagship's card processing, not who is a Card Member. Authored: Amex's transactions
// and amount, and the other brands' transaction count. Other brands' sales are the rest.
const AMEX_OCTOBER = { transactions: 511, sales: 95046 }
const OTHER_TRANSACTIONS = 1601

const averagePayment = (sales: number, transactions: number) => Math.round(sales / transactions)
const otherSales = MONTH_TO_DATE.cardSales - AMEX_OCTOBER.sales

/** October card sales split by brand. Average payment is per transaction, not per cover. */
export const CARD_BRANDS = {
  amex: { ...AMEX_OCTOBER, averagePayment: averagePayment(AMEX_OCTOBER.sales, AMEX_OCTOBER.transactions) },
  other: { transactions: OTHER_TRANSACTIONS, sales: otherSales, averagePayment: averagePayment(otherSales, OTHER_TRANSACTIONS) },
  /** Amex share of card sales, as a percentage with one decimal: 31.0. */
  amexSharePct: ((AMEX_OCTOBER.sales / MONTH_TO_DATE.cardSales) * 100).toFixed(1),
}
