import { PhoneMissed, RefreshCw, Smartphone, WalletCards, WifiOff } from "lucide-react"
import type { CarrierRequestOption } from "./carrier-request"
import { CARRIER } from "../carrier"
import { CURRENT_PLAN, LINES, IDLE_LINES, IDLE_LINE_NAMES, MONTHLY_DIFFERENCE, spellCount } from "./unused-lines"
export { spellCount }
import { MISSED_IN_WINDOW, MISSED_WINDOW } from "./missed-calls"
import { OUTAGE_MINUTES, OUTAGE_CREDIT } from "./outage-impact"
import { PAYROLL, SHORTFALL } from "./cash-flow"
import { formatWholeCurrency } from "../../../../components/shared/format"

// Carrier story 42, Plan Value. Every figure is example data. The plan is the same one
// story 36 reads: its lines are priced there, and the internet is added here. The
// monthly and yearly costs are derived from those prices, so the chat and the panel
// quote the same numbers.

export const PLAN_VALUE_TITLE = "Plan Value"
export const MONTH_VALUE_TITLE = "November Value"
export const MONTH = "November"

// Invented price. No real plan or price is used.
const INTERNET_MONTHLY = 100

export const PLAN_MONTHLY = CURRENT_PLAN.monthly + INTERNET_MONTHLY
export const PLAN_YEARLY = PLAN_MONTHLY * 12
export const RENEWS_ON = "January 14"

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

// The monthly receipt Nanci opens on the 1st. Its catches are the other carrier stories,
// read from their own data, so the receipt cannot disagree with them. Only the outage
// credit and the lower plan have a figure, and only those count as savings.
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export const MONTH_CATCHES = [
  {
    id: "calls",
    icon: PhoneMissed,
    date: "Nov 6",
    title: "Missed lunch calls",
    detail: `${MISSED_IN_WINDOW} calls went unanswered between ${MISSED_WINDOW.from} and ${MISSED_WINDOW.to} on a Friday.`,
  },
  {
    id: "lines",
    icon: Smartphone,
    date: "Nov 9",
    title: `${capitalize(spellCount(IDLE_LINES.length))} idle lines`,
    detail: `${capitalize(IDLE_LINE_NAMES)}, unused for 60 days.`,
    saving: MONTHLY_DIFFERENCE,
    savingLabel: `${formatWholeCurrency(MONTHLY_DIFFERENCE)}/mo`,
  },
  {
    id: "outage",
    icon: WifiOff,
    date: "Nov 12",
    title: "Thursday's internet outage",
    detail: `${OUTAGE_MINUTES} minutes during dinner, credited by ${CARRIER.business}.`,
    saving: OUTAGE_CREDIT,
    savingLabel: formatWholeCurrency(OUTAGE_CREDIT),
  },
  {
    id: "payroll",
    icon: WalletCards,
    date: "Nov 16",
    title: "Payroll shortfall",
    detail: `Warned four days ahead that ${PAYROLL.day}'s payroll was about ${formatWholeCurrency(SHORTFALL)} short.`,
  },
]

export const MONTH_SAVINGS = MONTH_CATCHES.reduce((total, c) => total + (c.saving ?? 0), 0)
const COUNTED = MONTH_CATCHES.filter((c) => c.saving)

export const MONTH_INSIGHT = `${capitalize(spellCount(MONTH_CATCHES.length))} things on your account needed attention in ${MONTH}. ${capitalize(spellCount(COUNTED.length))} of them found ${formatWholeCurrency(MONTH_SAVINGS)} in savings.`

export const MONTH_TILES = [
  { label: "Savings Found", value: formatWholeCurrency(MONTH_SAVINGS), sublabel: `${formatWholeCurrency(OUTAGE_CREDIT)} credit and ${formatWholeCurrency(MONTHLY_DIFFERENCE)} a month on lines` },
  { label: "Issues Caught", value: String(MONTH_CATCHES.length), sublabel: "Each one listed below" },
  { label: "Plan Cost", value: formatWholeCurrency(PLAN_MONTHLY), sublabel: "Lines, internet and Ask Nanci" },
]

export const MONTH_CATCHES_TITLE = `Caught in ${MONTH}`

export const MONTH_NOTE = "Savings count only where there is a figure: the outage credit and the lower plan. Missed calls and the payroll warning are listed without one."

export const RENEWAL_REQUEST_TITLE = "Plan Renewal"

// The renewal request, reviewed before it goes.
export const RENEWAL_OPTION: CarrierRequestOption = {
  id: "renew",
  icon: RefreshCw,
  title: "Renew as it is",
  description: "Same lines, same internet, another 12 months.",
  requestLabel: "Renewal request",
  fields: [
    { label: "Plan", value: "Same plan, 12 months" },
    { label: "Includes", value: `${LINES.length} lines and business internet` },
    { label: "Monthly cost", value: formatWholeCurrency(PLAN_MONTHLY) },
    { label: "Starts", value: RENEWS_ON },
  ],
  reference: RENEWAL_REQUEST.reference,
  sendPrompt: "Send the renewal request",
}
