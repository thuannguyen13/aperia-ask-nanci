// Data for carrier story 33, Missed Calls: last Friday's lunch on the register against the
// calls the business line missed in the same window, then two ways to cover it.
//
// The sales side is the same mock business as Busiest Times and the Sales Snapshot. The
// usual Friday lunch is Friday's sales (sales-snapshot.ts) shared across the hours by the
// Friday row of the heatmap (busiest-times.ts), so it cannot disagree with either.
import { PhoneCall, PhoneForwarded } from "lucide-react"
import { DAILY_SALES } from "./sales-snapshot"
import { HEATMAP_HOURS, HEATMAP_ROWS } from "./busiest-times"
import type { CarrierRequestOption } from "./carrier-request"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const MISSED_CALLS_TITLE = "Missed Calls"

const roundTo10 = (n: number) => Math.round(n / 10) * 10

const FRIDAY_SALES = DAILY_SALES.find((d) => d.day === "Friday")!
export const FRIDAY_ROW = HEATMAP_ROWS.find((r) => r.day === "Fri")!

// Lunch is 11 AM to 2 PM: the 11a, 12p and 1p cells.
const LUNCH_HOURS = ["11a", "12p", "1p"]
const levelOf = (hour: string) => FRIDAY_ROW.levels[HEATMAP_HOURS.indexOf(hour)]
const FRIDAY_LEVEL_TOTAL = FRIDAY_ROW.levels.reduce((sum, l) => sum + l, 0)
const LUNCH_SHARE = LUNCH_HOURS.reduce((sum, h) => sum + levelOf(h), 0) / FRIDAY_LEVEL_TOTAL

// The one authored figure on the sales side: how far last Friday's lunch fell.
export const LUNCH_DROP_PCT = 18
export const USUAL_FRIDAY_LUNCH = roundTo10(FRIDAY_SALES.sales * LUNCH_SHARE)
export const LAST_FRIDAY_LUNCH = roundTo10(USUAL_FRIDAY_LUNCH * (1 - LUNCH_DROP_PCT / 100))
export const LUNCH_SHORTFALL = USUAL_FRIDAY_LUNCH - LAST_FRIDAY_LUNCH

// Calls the business line missed last Friday, one count per heatmap hour. The five in the
// 11a cell all rang after 11:30, so the window below is 11:30 to 1:00.
export const MISSED_BY_HOUR = [0, 5, 9, 0, 0, 0, 0, 0, 1, 0, 0]
export const MISSED_WINDOW = { from: "11:30", to: "1:00", hours: ["11a", "12p"] }
export const MISSED_IN_WINDOW = MISSED_WINDOW.hours.reduce((sum, h) => sum + MISSED_BY_HOUR[HEATMAP_HOURS.indexOf(h)], 0)
export const NO_CALLBACK = 9

export const MISSED_CALLS_INSIGHT = `Your busiest lunch hour is also when the phone goes unanswered. ${NO_CALLBACK} of the ${MISSED_IN_WINDOW} callers who could not get through last Friday did not try again.`

export const MISSED_CALLS_TILES = [
  { label: "Lunch sales vs usual", value: `−${LUNCH_DROP_PCT}%`, sublabel: `${formatWholeCurrency(LAST_FRIDAY_LUNCH)} against a usual ${formatWholeCurrency(USUAL_FRIDAY_LUNCH)}`, emphasis: true },
  { label: `Missed calls, ${MISSED_WINDOW.from} to ${MISSED_WINDOW.to}`, value: String(MISSED_IN_WINDOW), sublabel: "on your business line" },
  { label: "Did not call back", value: String(NO_CALLBACK), sublabel: `of the ${MISSED_IN_WINDOW} callers` },
]

export const MISSED_CALLS_NOTE = "Sales are averaged from your register over the last four weeks. Missed calls are from your business line's call records for last Friday."

export const CALLS_REQUEST_TIMESTAMP = "Today, 10:42 AM"

export const CALLS_OPTIONS_HEADING = {
  title: "Cover the lunch window",
  description: `Two ways to answer more calls between ${MISSED_WINDOW.from} and ${MISSED_WINDOW.to}.`,
}

const LUNCH_REASON = `${MISSED_IN_WINDOW} missed calls last Friday, ${MISSED_WINDOW.from} to ${MISSED_WINDOW.to}`

export const CALLS_OPTIONS: CarrierRequestOption[] = [
  {
    id: "forwarding",
    icon: PhoneForwarded,
    title: "Call forwarding at lunch",
    description: "Calls nobody picks up ring through to a second phone you choose, such as your mobile.",
    monthlyCost: 5,
    requestLabel: "Call forwarding request",
    fields: [
      { label: "Service", value: "Forward unanswered calls" },
      { label: "Line", value: "Your business line" },
      { label: "Forward to", value: "Your mobile" },
      { label: "When", value: "Every day, 11:30 AM to 1:00 PM" },
      { label: "Why", value: LUNCH_REASON },
    ],
    reference: "CF-2041",
    sendPrompt: "Send the call forwarding request",
  },
  {
    id: "second-line",
    icon: PhoneCall,
    title: "A second line",
    description: "Two calls can come in at once, so a second person can pick up during the rush.",
    monthlyCost: 30,
    requestLabel: "Second line request",
    fields: [
      { label: "Service", value: "Add a second line" },
      { label: "Number", value: "Same business number, two calls at once" },
      { label: "Rings on", value: "A second phone at the counter" },
      { label: "Why", value: LUNCH_REASON },
    ],
    reference: "SL-2042",
    sendPrompt: "Send the second line request",
  },
]
