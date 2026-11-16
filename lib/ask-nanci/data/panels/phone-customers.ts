// Data for carrier story 41, Phone Customers: three years of the business line's call
// records matched to the register's phone orders. The value builds up the longer the
// owner stays, and only the carrier holds it: which callers are regulars, what they
// order, and which have gone quiet. Dana P. and Luis M. are the regulars story 33 flags.
// Every figure is invented, and customers are first names only.
import { MessageSquareText } from "lucide-react"
import type { CarrierRequestOption } from "./carrier-request"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const PHONE_CUSTOMERS_TITLE = "Phone Customers"
export const WINBACK_TITLE = "Business Texting"

// Phone orders by month: calls on the business line that ended in an order on the
// register within the hour.
export const MONTHLY_PHONE_ORDERS = [
  { month: "Jan", lastYear: 150, thisYear: 170 },
  { month: "Feb", lastYear: 160, thisYear: 180 },
  { month: "Mar", lastYear: 170, thisYear: 195 },
  { month: "Apr", lastYear: 175, thisYear: 200 },
  { month: "May", lastYear: 180, thisYear: 205 },
  { month: "Jun", lastYear: 175, thisYear: 200 },
  { month: "Jul", lastYear: 165, thisYear: 190 },
  { month: "Aug", lastYear: 170, thisYear: 195 },
  { month: "Sep", lastYear: 180, thisYear: 205 },
  { month: "Oct", lastYear: 185, thisYear: 215 },
  { month: "Nov", lastYear: 180, thisYear: 210 },
]
const total = (key: "lastYear" | "thisYear") => MONTHLY_PHONE_ORDERS.reduce((sum, m) => sum + m[key], 0)
export const PHONE_ORDERS = total("thisYear")
export const PHONE_ORDERS_CHANGE_PCT = Math.round((PHONE_ORDERS / total("lastYear") - 1) * 100)
const AVG_PHONE_ORDER = 45
export const PHONE_SALES = Math.round((PHONE_ORDERS * AVG_PHONE_ORDER) / 100) * 100

// Regulars: callers with five or more phone orders. The ones gone quiet have not called
// in 60 days, and what they usually spend is what winning them back is worth.
export const REGULARS = 312
export const GONE_QUIET = { count: 18, days: 60, usualMonthly: 1600 }
export const YEARS_OF_HISTORY = 3

export const TOP_REGULARS = [
  { name: "Dana P.", habit: "Most Fridays", orders: 46, spend: 2180 },
  { name: "Luis M.", habit: "Office lunches, every other Friday", orders: 24, spend: 1860 },
  { name: "Priya S.", habit: "Weekday lunch", orders: 41, spend: 1520 },
  { name: "Marcus T.", habit: "Saturday family orders", orders: 19, spend: 1410 },
]

export const PHONE_INSIGHT = `${REGULARS} regulars order from you by phone, and phone orders are up ${PHONE_ORDERS_CHANGE_PCT}% on last year. ${GONE_QUIET.count} of those regulars have not called in ${GONE_QUIET.days} days.`

export const PHONE_TILES = [
  { label: "Phone Orders This Year", value: formatWholeCurrency(PHONE_SALES), sublabel: `${PHONE_ORDERS.toLocaleString("en-US")} orders, up ${PHONE_ORDERS_CHANGE_PCT}%` },
  { label: "Regulars", value: String(REGULARS), sublabel: "Five or more phone orders" },
  { label: "Gone Quiet", value: String(GONE_QUIET.count), sublabel: `No call in ${GONE_QUIET.days} days`, tone: "amber" as const, toneScope: "value" as const },
]

export const PHONE_CHART = {
  title: "Phone Orders",
  description: "By month, this year against last",
}

export const TOP_REGULARS_TITLE = "Your Top Phone Regulars"

export const HELD_TITLE = "Your History in Ask Nanci"
export const HELD_BODY = `${YEARS_OF_HISTORY} years of calls on your business line, matched to the orders on your register. It is yours to download at any time.`

export const PHONE_NOTE = `Calls are from your business line's call records. A phone order is a call followed by an order from the same number within the hour. Order values are from your register.`

export const EXPORT_NOTE = {
  title: "Download Ready",
  body: `${YEARS_OF_HISTORY} years of calls and phone orders, as a spreadsheet. The link is in your email and works for 7 days.`,
}

// Winning the quiet regulars back: a text from the business number, which is the
// carrier's business texting. Reviewed before it is sent.
export const WINBACK_OPTION: CarrierRequestOption = {
  id: "winback",
  icon: MessageSquareText,
  title: "Business texting",
  description: "Text customers from your business number.",
  monthlyCost: 15,
  requestLabel: "Business Texting Request",
  fields: [
    { label: "Service", value: "Texts from your business number" },
    { label: "First Text To", value: `The ${GONE_QUIET.count} regulars who have gone quiet` },
    { label: "Message", value: "It has been a while. Your usual is 10% off this week." },
    { label: "Why", value: `About ${formatWholeCurrency(GONE_QUIET.usualMonthly)} a month in usual orders` },
  ],
  reference: "BT-5521",
  sendPrompt: "Send the business texting request",
}

