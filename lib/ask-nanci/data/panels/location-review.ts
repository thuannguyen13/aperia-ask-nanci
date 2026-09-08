// Data for Flow 24 — Location Review: the mobile adaptation showcase. One panel that
// carries every element the mobile checklist (docs/generated/mobile-adaptation-handoff)
// has a rule for: a tab strip that has to become a dropdown, a chart with a legend and
// more x labels than a phone can draw, a table wider than any phone, stat tiles, a
// callout with a default-size button, and a dialog with a text field.
//
// Every period derives from one set of base figures via a factor, so the six tabs each
// show different numbers without six hand-typed tables that could drift apart.

export interface ReviewPeriod {
  id: string
  label: string
  /** The date range the tab covers, for the subtitle. */
  range: string
  /** Sales in this period relative to the base quarter. */
  factor: number
  /** X-axis labels for the trend chart. Long lists are the point: a phone drops some. */
  points: string[]
}

export const REVIEW_PERIODS: ReviewPeriod[] = [
  { id: "week", label: "This week", range: "Jun 22–28", factor: 1 / 13, points: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { id: "month", label: "This month", range: "Jun 1–30", factor: 1 / 3, points: ["Jun 1", "Jun 8", "Jun 15", "Jun 22", "Jun 29"] },
  {
    id: "quarter",
    label: "This quarter",
    range: "Apr 1 – Jun 30",
    factor: 1,
    points: ["Apr 6", "Apr 13", "Apr 20", "Apr 27", "May 4", "May 11", "May 18", "May 25", "Jun 1", "Jun 8", "Jun 15", "Jun 22", "Jun 29"],
  },
  {
    id: "year",
    label: "This year",
    range: "Jan 1 – Jun 30",
    factor: 2,
    points: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  { id: "all", label: "All time", range: "Since Mar 2022", factor: 17, points: ["2022", "2023", "2024", "2025", "2026"] },
  { id: "custom", label: "Custom range", range: "Pick two dates", factor: 0.6, points: ["May 1", "May 8", "May 15", "May 22", "May 29", "Jun 5", "Jun 12"] },
]

export const DEFAULT_REVIEW_PERIOD = "quarter"

export interface ReviewLocation {
  id: string
  name: string
  /** Sales over the base quarter. */
  sales: number
  /** Change against the prior quarter, in percent. */
  changePct: number
  transactions: number
  refunds: number
  chargebacks: number
  topItem: string
  manager: string
  /** How this location's share of sales moves along the trend, one weight per point. */
  shape: number[]
}

// Sales are derived from transactions × ticket in the panel, never typed twice.
export const REVIEW_LOCATIONS: ReviewLocation[] = [
  { id: "harbor", name: "Harbor View", sales: 128_400, changePct: 9, transactions: 3_010, refunds: 14, chargebacks: 1, topItem: "Crab roll", manager: "Dana Whitfield", shape: [0.9, 1, 1.1, 1.05] },
  { id: "midtown", name: "Midtown", sales: 84_900, changePct: -11, transactions: 2_290, refunds: 22, chargebacks: 3, topItem: "Italian combo", manager: "Luis Ortega", shape: [1.15, 1.05, 0.9, 0.8] },
  { id: "riverside", name: "Riverside", sales: 102_600, changePct: 4, transactions: 2_640, refunds: 9, chargebacks: 0, topItem: "Smash burger", manager: "Priya Natarajan", shape: [0.95, 1, 1, 1.05] },
  { id: "airport", name: "Airport Concourse B", sales: 96_300, changePct: 21, transactions: 4_110, refunds: 31, chargebacks: 2, topItem: "Cold brew", manager: "Sam Okafor", shape: [0.8, 0.9, 1.1, 1.2] },
]

export const REVIEW_TOTAL_SALES = REVIEW_LOCATIONS.reduce((sum, l) => sum + l.sales, 0)

// Weighted by sales, so the headline change is what the four locations add up to.
export const REVIEW_TOTAL_CHANGE_PCT = Math.round(
  REVIEW_LOCATIONS.reduce((sum, l) => sum + l.sales * l.changePct, 0) / REVIEW_TOTAL_SALES,
)

export const REVIEW_LEADER = [...REVIEW_LOCATIONS].sort((a, b) => b.sales - a.sales)[0]

// The follow-up turn is about the one location that fell.
export const REVIEW_WATCH = REVIEW_LOCATIONS.find((l) => l.changePct < 0) ?? REVIEW_LOCATIONS[0]

// Midtown's lunch count, start and end of the quarter, quoted by the follow-up answer.
export const WATCH_TRANSACTIONS = { from: { month: "April", count: 2_610 }, to: { month: "June", count: 2_140 } }

export function averageTicket(l: ReviewLocation) {
  return l.sales / l.transactions
}

/** One trend point per label, every location as a series. */
export function trendFor(period: ReviewPeriod) {
  const n = period.points.length
  return period.points.map((label, i) => {
    // Position along the period, 0 at the start and 1 at the end, mapped onto the
    // four-step shape so a short period and a long one draw the same curve.
    const t = n === 1 ? 0 : (i / (n - 1)) * 3
    const lo = Math.floor(t)
    const hi = Math.min(lo + 1, 3)
    const frac = t - lo
    const row: Record<string, number | string> = { label }
    for (const l of REVIEW_LOCATIONS) {
      const w = l.shape[lo] + (l.shape[hi] - l.shape[lo]) * frac
      row[l.id] = Math.round((l.sales * period.factor * w) / n)
    }
    return row
  })
}
