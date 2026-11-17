// Data for carrier story 41, Missed Calls: last Friday's lunch on the register against the
// calls the business line missed in the same window, then two ways to cover it.
//
// The sales side is the same mock business as Busiest Times and the Sales Snapshot. The
// usual Friday lunch adds up Friday's 11 AM, noon and 1 PM hours (busiest-times.ts), the
// same figures the heatmap shows, so it cannot disagree with either.
import { PhoneCall, PhoneForwarded } from "lucide-react"
import { HEATMAP_HOURS, HEATMAP_ROWS, salesAt } from "./busiest-times"
import type { CarrierRequestOption } from "./carrier-request"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const MISSED_CALLS_TITLE = "Missed Calls"
export const CALLS_COVER_TITLE = "Lunch Calls"

const roundTo10 = (n: number) => Math.round(n / 10) * 10

export const FRIDAY_ROW = HEATMAP_ROWS.find((r) => r.day === "Fri")!

// Lunch is 11 AM to 2 PM: the 11a, 12p and 1p cells.
const LUNCH_HOURS = ["11a", "12p", "1p"]

// The one authored figure on the sales side: how far last Friday's lunch fell.
export const LUNCH_DROP_PCT = 18
export const USUAL_FRIDAY_LUNCH = LUNCH_HOURS.reduce((sum, h) => sum + salesAt("Fri", h), 0)
export const LAST_FRIDAY_LUNCH = roundTo10(USUAL_FRIDAY_LUNCH * (1 - LUNCH_DROP_PCT / 100))
export const LUNCH_SHORTFALL = USUAL_FRIDAY_LUNCH - LAST_FRIDAY_LUNCH

// Calls the business line missed last Friday, one count per heatmap hour. The five in the
// 11a cell all rang after 11:30, so the window below is 11:30 to 1:00.
export const MISSED_BY_HOUR = [0, 5, 9, 0, 0, 0, 0, 0, 1, 0, 0]
export const MISSED_WINDOW = { from: "11:30", to: "1:00", hours: ["11a", "12p"] }
export const MISSED_IN_WINDOW = MISSED_WINDOW.hours.reduce((sum, h) => sum + MISSED_BY_HOUR[HEATMAP_HOURS.indexOf(h)], 0)
export const NO_CALLBACK = 9

export const MISSED_CALLS_INSIGHT = `Your busiest lunch hour is also when the phone goes unanswered. ${NO_CALLBACK} of the ${MISSED_IN_WINDOW} callers who could not get through last Friday did not try again.`

// The window as a panel writes it: time stamps with the zone, joined by an en dash.
const MISSED_STAMPS = "11:30 AM–01:00 PM CST"

export const MISSED_CALLS_TILES = [
  { label: "Lunch Sales vs Usual", value: `−${LUNCH_DROP_PCT}%`, sublabel: `${formatWholeCurrency(LAST_FRIDAY_LUNCH)} against a usual ${formatWholeCurrency(USUAL_FRIDAY_LUNCH)}`, emphasis: true },
  { label: "Missed Calls at Lunch", value: String(MISSED_IN_WINDOW), sublabel: `${MISSED_STAMPS}, business line` },
  { label: "Did Not Call Back", value: String(NO_CALLBACK), sublabel: `Of the ${MISSED_IN_WINDOW} callers` },
]

export const MISSED_CALLS_NOTE = "Sales are averaged from your register over the last four weeks. Missed calls are from your business line's call records for last Friday."

export const CALLS_REQUEST_TIMESTAMP = "Today, 10:42 AM"

export const CALLS_OPTIONS_HEADING = {
  title: "Cover the Lunch Window",
  description: "Two ways to answer more calls between 11:30 AM and 01:00 PM CST.",
}

const LUNCH_REASON = `${MISSED_IN_WINDOW} missed calls last Friday, ${MISSED_STAMPS}`

export const CALLS_OPTIONS: CarrierRequestOption[] = [
  {
    id: "forwarding",
    icon: PhoneForwarded,
    title: "Call forwarding at lunch",
    description: "Calls nobody picks up ring through to a second phone you choose, such as your mobile.",
    monthlyCost: 5,
    requestLabel: "Call Forwarding Request",
    fields: [
      { label: "Service", value: "Forward unanswered calls" },
      { label: "Line", value: "Your business line" },
      { label: "Forward To", value: "Your mobile" },
      { label: "When", value: `Every day, ${MISSED_STAMPS}` },
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
    requestLabel: "Second Line Request",
    fields: [
      { label: "Service", value: "Add a second line" },
      { label: "Number", value: "Same business number, two calls at once" },
      { label: "Rings On", value: "A second phone at the counter" },
      { label: "Why", value: LUNCH_REASON },
    ],
    reference: "SL-2042",
    sendPrompt: "Send the second line request",
  },
]
