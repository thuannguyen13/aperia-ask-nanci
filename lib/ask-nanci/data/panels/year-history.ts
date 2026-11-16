// Data for carrier story 42, Accumulated Value: this year's sales against last year's,
// month by month, beside nearby restaurants, and the history Ask Nanci holds. The value
// is the history, not the cost of leaving it: it is the owner's to download at any time.
//
// The best day before this year is Busiest Times' Saturday (sales-snapshot.ts), so the
// stories name the same record. Every figure is invented.
import { SATURDAY_DRILLDOWN } from "./sales-snapshot"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const HISTORY_TITLE = "Year over Year"

// Monthly sales, in thousands, for this year and last.
export const MONTHLY_SALES = [
  { month: "Jan", lastYear: 52, thisYear: 58 },
  { month: "Feb", lastYear: 55, thisYear: 60 },
  { month: "Mar", lastYear: 61, thisYear: 67 },
  { month: "Apr", lastYear: 63, thisYear: 69 },
  { month: "May", lastYear: 66, thisYear: 72 },
  { month: "Jun", lastYear: 64, thisYear: 70 },
  { month: "Jul", lastYear: 60, thisYear: 66 },
  { month: "Aug", lastYear: 62, thisYear: 69 },
  { month: "Sep", lastYear: 65, thisYear: 72 },
  { month: "Oct", lastYear: 68, thisYear: 75 },
  { month: "Nov", lastYear: 66, thisYear: 74 },
]
const NOVEMBER = MONTHLY_SALES.at(-1)!
export const NOVEMBER_CHANGE_PCT = Math.round((NOVEMBER.thisYear / NOVEMBER.lastYear - 1) * 100)

// The anonymous average of restaurants using Ask Nanci within two miles, same month.
export const NEARBY_CHANGE_PCT = 8

// This year's best day, against the record it beat.
export const BEST_DAY = { date: "Saturday, November 7", sales: 4480 }
const PREVIOUS_BEST = { date: "Saturday, May 16", sales: SATURDAY_DRILLDOWN.sales }

export const YEARS_OF_HISTORY = 3

export const HISTORY_INSIGHT = `November is up ${NOVEMBER_CHANGE_PCT}% on last year, ahead of nearby restaurants at ${NEARBY_CHANGE_PCT}%. ${BEST_DAY.date} was your best day since you opened.`

export const HISTORY_TILES = [
  { label: "November vs Last Year", value: `+${NOVEMBER_CHANGE_PCT}%`, sublabel: `${formatWholeCurrency(NOVEMBER.thisYear * 1000)} against ${formatWholeCurrency(NOVEMBER.lastYear * 1000)}` },
  { label: "Nearby Restaurants", value: `+${NEARBY_CHANGE_PCT}%`, sublabel: "Same month, within 2 miles" },
  { label: "Best Day Ever", value: formatWholeCurrency(BEST_DAY.sales), sublabel: BEST_DAY.date },
]

export const SALES_CHART = {
  title: "Monthly Sales",
  description: "This year against last year",
}

export const HELD_TITLE = "Your History in Ask Nanci"
export const HELD_ITEMS = [
  { id: "sales", title: `${YEARS_OF_HISTORY} years of sales`, detail: "Every day, item and hour from your register." },
  { id: "records", title: "Your records", detail: `Best day ${formatWholeCurrency(BEST_DAY.sales)} on ${BEST_DAY.date}, beating ${formatWholeCurrency(PREVIOUS_BEST.sales)} on ${PREVIOUS_BEST.date}.` },
  { id: "benchmarks", title: "Nearby benchmarks", detail: "How restaurants within 2 miles did each month, with no names." },
]

export const HISTORY_NOTE = "Sales are from your register. Nearby restaurants are an anonymous average of businesses using Ask Nanci within 2 miles. Your history is yours to download at any time."

export const EXPORT_NOTE = {
  title: "Download ready",
  body: `${YEARS_OF_HISTORY} years of sales by day, item and hour, as a spreadsheet. The link is in your email and works for 7 days.`,
}
