// Data for carrier story 40, Seasonal Pause: the owner closes for three weeks every
// January and thinks about cancelling the plan until they reopen. Last winter's register
// shows the closure, and the business line's call records show the phone kept ringing.
//
// The plan's monthly cost is story 42's, so the stories quote one price. Every figure is
// invented.
import { PauseCircle, PhoneForwarded } from "lucide-react"
import type { CarrierRequestOption } from "./carrier-request"
import { PLAN_MONTHLY } from "./plan-value"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const SEASONAL_CLOSURE_TITLE = "Closed in January"
export const SEASONAL_PAUSE_TITLE = "While You're Closed"

// Last year's closure, read from the register: no sales on these days.
export const CLOSURE = { from: "January 1", to: "21", reopen: "January 22", days: 21 }
export const CLOSURE_RANGE = `${CLOSURE.from} to ${CLOSURE.to}`

// Calls to the business line last winter, by week. The three closed weeks are the closure.
export const WEEKLY_CALLS = [
  { week: "Dec 11", calls: 112, closed: false },
  { week: "Dec 18", calls: 98, closed: false },
  { week: "Dec 25", calls: 74, closed: false },
  { week: "Jan 1", calls: 19, closed: true },
  { week: "Jan 8", calls: 15, closed: true },
  { week: "Jan 15", calls: 12, closed: true },
  { week: "Jan 22", calls: 96, closed: false },
  { week: "Jan 29", calls: 104, closed: false },
]
export const CALLS_WHILE_CLOSED = WEEKLY_CALLS.filter((w) => w.closed).reduce((total, w) => total + w.calls, 0)

// What the plan costs for the closed days: the monthly cost for 21 of January's 31 days.
export const PLAN_WHILE_CLOSED = Math.round((PLAN_MONTHLY * CLOSURE.days) / 31)

export const CLOSURE_INSIGHT = `You closed ${CLOSURE_RANGE} last year, and your phone kept ringing. ${CALLS_WHILE_CLOSED} calls came in while you were closed.`

export const CLOSURE_TILES = [
  { label: "Closed Last Year", value: `${CLOSURE.days} days`, sublabel: CLOSURE_RANGE },
  { label: "Calls While Closed", value: String(CALLS_WHILE_CLOSED), sublabel: "On your business line" },
  { label: "Plan While Closed", value: formatWholeCurrency(PLAN_WHILE_CLOSED), sublabel: "Three weeks at your monthly cost", tone: "amber" as const, toneScope: "value" as const },
]

export const CALLS_CHART = {
  title: "Calls to Your Business Line",
  description: "Last winter, by week",
}

export const CLOSURE_NOTE = `Closure dates are from your register, which took no sales ${CLOSURE_RANGE} last year. Calls are from your business line's call records. Plan cost is your monthly cost for ${CLOSURE.days} of January's 31 days.`

export const PAUSE_REQUEST_TIMESTAMP = "Today, 2:15 PM"

export const PAUSE_OPTIONS_HEADING = {
  title: "Pause Instead of Cancel",
  description: `Two ways to keep your number from ${CLOSURE_RANGE}.`,
}

const PAUSE_REASON = `Closed ${CLOSURE_RANGE} last year, with ${CALLS_WHILE_CLOSED} calls in that time`

export const PAUSE_OPTIONS: CarrierRequestOption[] = [
  {
    id: "pause",
    icon: PauseCircle,
    title: "Seasonal pause",
    description: `Lines and internet stop while you're closed. Your number stays yours, and callers hear that you reopen ${CLOSURE.reopen}.`,
    monthlyCost: 15,
    requestLabel: "Seasonal pause request",
    fields: [
      { label: "Service", value: "Pause lines and internet" },
      { label: "Dates", value: CLOSURE_RANGE },
      { label: "Callers hear", value: `Closed until ${CLOSURE.reopen}` },
      { label: "Number", value: "Kept" },
      { label: "Why", value: PAUSE_REASON },
    ],
    reference: "SP-3307",
    sendPrompt: "Send the seasonal pause request",
  },
  {
    id: "pause-forward",
    icon: PhoneForwarded,
    title: "Pause, and forward your business line",
    description: "Everything pauses except your business line, which rings your mobile so you can still take calls.",
    monthlyCost: 35,
    requestLabel: "Pause with forwarding request",
    fields: [
      { label: "Service", value: "Pause lines and internet" },
      { label: "Dates", value: CLOSURE_RANGE },
      { label: "Business line", value: "Forwards to your mobile" },
      { label: "Number", value: "Kept" },
      { label: "Why", value: PAUSE_REASON },
    ],
    reference: "SP-3308",
    sendPrompt: "Send the pause with forwarding request",
  },
]
