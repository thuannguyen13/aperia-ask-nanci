import { CARRIER } from "../carrier"
import { CURRENT_PLAN, LINES } from "./unused-lines"

// Carrier story 37, Plan Value. Every figure is example data. The plan is the same one
// story 35 reads: its lines are priced there, and the internet is added here. The
// monthly and yearly costs are derived from those prices, so the chat and the panel
// quote the same numbers.

export const PLAN_VALUE_TITLE = "Plan Value"

// Invented price. No real plan or price is used.
const INTERNET_MONTHLY = 100

export const PLAN_MONTHLY = CURRENT_PLAN.monthly + INTERNET_MONTHLY
export const PLAN_YEARLY = PLAN_MONTHLY * 12
export const RENEWS_ON = "the 14th"

// A year of Ask Nanci, counted from its own activity.
export const YEAR_WITH_NANCI = {
  priceIncreasesCaught: 11,
  billQuestionsAnswered: 23,
  /** Only the savings with a figure behind them. */
  estimatedSavings: 1840,
}

// What the plan includes, in plain words. No real product names.
export const PLAN_INCLUDES = [
  { kind: "lines", title: `${LINES.length} phone lines`, detail: "Calls, texts and data on each line" },
  { kind: "internet", title: "Business internet", detail: "One connection at the restaurant" },
  { kind: "assistant", title: "Ask Nanci", detail: "Connected to your register, your bank and this account" },
  { kind: "support", title: "Business support", detail: `${CARRIER.business} specialists by phone and chat` },
] as const

// The options branch, listed neutrally. Ask Nanci lays them out and does not argue for one.
export const RENEWAL_OPTIONS = [
  { title: "Renew as it is.", detail: "Same lines, same internet, another 12 months." },
  { title: "Renew with changes.", detail: `Fewer lines or a different internet speed, agreed before ${RENEWS_ON}.` },
  { title: "Talk it through.", detail: `A specialist at ${CARRIER.business} can walk you through other plans.` },
  { title: "Let it end.", detail: `Tell ${CARRIER.business} before ${RENEWS_ON} that you won't renew.` },
]

// The request the renewal branch ends in. Nothing on the account changes until the carrier confirms.
export const RENEWAL_REQUEST = {
  reference: "RN-5126",
  timestamp: "Today, 11:05 AM",
  sentTo: CARRIER.business,
}
