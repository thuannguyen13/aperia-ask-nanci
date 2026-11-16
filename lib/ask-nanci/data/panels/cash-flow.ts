// Data for carrier story 39, Cash Flow Warning: deposits running below last month with
// payroll due Friday, then what to cut back or how to bridge the gap.
//
// The shortfall, the payroll day and the catering invoices are the ones the Business Loan
// Offer panel (flow 21) already states, so the story can hand over to that panel as it is.
// Every figure is invented.
import { Landmark, Megaphone, Package, Users } from "lucide-react"
import { CHASE_ACCOUNT } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const CASH_FLOW_TITLE = "Cash Flow"
export const CASH_PLAN_TITLE = "Before Payroll"

const roundTo100 = (n: number) => Math.round(n / 100) * 100

// Deposits into the business checking account, by week. The last two weeks are this
// month; the two weeks a month before them are what "last month" compares against.
export const WEEKLY_DEPOSITS = [
  { week: "Sep 21", amount: 7900, thisMonth: false },
  { week: "Sep 28", amount: 7600, thisMonth: false },
  { week: "Oct 5", amount: 7800, thisMonth: false },
  { week: "Oct 12", amount: 7600, thisMonth: false },
  { week: "Oct 19", amount: 7400, thisMonth: false },
  { week: "Oct 26", amount: 7200, thisMonth: false },
  { week: "Nov 2", amount: 6100, thisMonth: true },
  { week: "Nov 9", amount: 5900, thisMonth: true },
]
const sum = (rows: { amount: number }[]) => rows.reduce((total, r) => total + r.amount, 0)
const MONTH_TO_DATE = sum(WEEKLY_DEPOSITS.filter((w) => w.thisMonth))
const SAME_WEEKS_LAST_MONTH = sum(WEEKLY_DEPOSITS.filter((w) => w.week === "Oct 5" || w.week === "Oct 12"))
export const DEPOSIT_DROP_PCT = Math.round((1 - MONTH_TO_DATE / SAME_WEEKS_LAST_MONTH) * 100)

// Friday from today: the balance, deposits at this month's pace through Thursday, and
// the payroll the bank paid two weeks ago.
export const PAYROLL = { amount: 10800, day: "Friday", date: "Friday, November 20" }
const BALANCE_TODAY = 3170
const DAYS_TO_PAYROLL = 4
const EXPECTED_DEPOSITS = roundTo100((MONTH_TO_DATE / 14) * DAYS_TO_PAYROLL)
export const SHORTFALL = PAYROLL.amount - BALANCE_TODAY - EXPECTED_DEPOSITS
const INVOICES = { amount: 6800, due: "Tuesday, November 24" }

export const CASH_FLOW_INSIGHT = `Deposits are running ${DEPOSIT_DROP_PCT}% below last month. With payroll on ${PAYROLL.day}, you are on track to be about ${formatWholeCurrency(SHORTFALL)} short.`

export const CASH_FLOW_TILES = [
  { label: "Deposits vs Last Month", value: `−${DEPOSIT_DROP_PCT}%`, sublabel: `${formatWholeCurrency(MONTH_TO_DATE)} so far this month` },
  { label: "Payroll Due", value: formatWholeCurrency(PAYROLL.amount), sublabel: PAYROLL.date },
  { label: "Projected Shortfall", value: formatWholeCurrency(SHORTFALL), sublabel: `After payroll on ${PAYROLL.day}`, tone: "amber" as const, toneScope: "value" as const },
]

export const DEPOSITS_CHART = {
  title: "Weekly Deposits",
  description: `Into ${CHASE_ACCOUNT.name}`,
}

export const FRIDAY_TITLE = "How Friday Looks"
export const FRIDAY_ROWS = [
  { label: "Balance today", value: formatWholeCurrency(BALANCE_TODAY) },
  { label: "Expected deposits through Thursday", value: `+${formatWholeCurrency(EXPECTED_DEPOSITS)}` },
  { label: `Payroll on ${PAYROLL.day}`, value: `(${formatWholeCurrency(PAYROLL.amount)})` },
]
export const FRIDAY_RESULT = { label: "Short by", value: formatWholeCurrency(SHORTFALL) }

export const CASH_FLOW_NOTE = `Projected from your balance today, deposits at this month's pace through Thursday, and the payroll your bank paid two weeks ago. Catering invoices of ${formatWholeCurrency(INVOICES.amount)} are due ${INVOICES.due}, after payroll.`

// The plan: three changes the owner can make this week, or working capital for all of it.
export const CUT_BACKS = [
  { id: "offer", icon: Megaphone, title: "Send a weekday offer to your regulars", detail: "Your 40 most frequent customers, Tuesday to Thursday.", amount: 1400 },
  { id: "order", icon: Package, title: "Trim this week's produce order", detail: "Last week's order left about a third unused.", amount: 1100 },
  { id: "shifts", icon: Users, title: "Drop two slow weekday shifts", detail: "Tuesday and Wednesday afternoons, your quietest hours.", amount: 700 },
]
export const CUT_BACK_TOTAL = sum(CUT_BACKS)
export const STILL_TO_FIND = SHORTFALL - CUT_BACK_TOTAL

export const CUT_BACK_HEADING = {
  title: "Cut Back This Week",
  description: `Covers about ${formatWholeCurrency(CUT_BACK_TOTAL)} of the ${formatWholeCurrency(SHORTFALL)} gap.`,
}
export const BRIDGE_HEADING = {
  title: "Or Bridge the Gap",
  description: `Covers all ${formatWholeCurrency(SHORTFALL)}.`,
}
export const BRIDGE = {
  icon: Landmark,
  title: "Working capital",
  detail: "$4,500 over 12 monthly payments, from a lending partner.",
  action: "See the Offer",
}
