// Data for carrier story 42, Outage Impact: Thursday evening's internet outage on the
// carrier's service record, matched to the card payments the register could not take.
//
// The estimate is the same mock business as Busiest Times and the Sales Snapshot: a usual
// Thursday 6 PM hour (busiest-times.ts), of which the 40 minutes are their share.
import { Cable, Smartphone, Wifi } from "lucide-react"
import { DAILY_SALES } from "./sales-snapshot"
import { HEATMAP_ROWS, salesAt } from "./busiest-times"
import type { CarrierRequestOption } from "./carrier-request"
import { CARRIER } from "../carrier"
import { FIRST_LOCATION } from "./second-location"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const OUTAGE_IMPACT_TITLE = "Outage Impact"
export const OUTAGE_BACKUP_TITLE = "Backup Internet"

const roundTo10 = (n: number) => Math.round(n / 10) * 10

// Minutes after midnight, so the timeline and the copy read from one pair of numbers.
export const OUTAGE = { start: 18 * 60 + 10, end: 18 * 60 + 50 }
export const OUTAGE_MINUTES = OUTAGE.end - OUTAGE.start

/** "6:10", or "6:10 PM" with the meridiem. */
export function formatClock(minutes: number, withMeridiem = false) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const clock = `${h % 12 || 12}:${String(m).padStart(2, "0")}`
  return withMeridiem ? `${clock} ${h < 12 ? "AM" : "PM"}` : clock
}

/** "06:10 PM CST": a time stamp as a panel writes it. Austin keeps Central time. */
export const formatStamp = (minutes: number, withZone = true) => `${formatClock(minutes, true).padStart(8, "0")}${withZone ? " CST" : ""}`

export const OUTAGE_WINDOW = `${formatStamp(OUTAGE.start, false)}–${formatStamp(OUTAGE.end)}`

// The fix estimate in Nanci's text is later than the actual fix, as estimates usually
// are. Nanci follows up in the chat two minutes after the connection is back.
export const OUTAGE_ESTIMATED_FIX = OUTAGE.start + 50
const OUTAGE_FOLLOWUP_AT = OUTAGE.end + 2
export const OUTAGE_STREET = FIRST_LOCATION.address.split(",")[0]

/** Invented, as every carrier figure is: the credit the carrier applies for the outage. */
export const OUTAGE_CREDIT = 25

const THURSDAY = DAILY_SALES.find((d) => d.day === "Thursday")!
export const THURSDAY_ROW = HEATMAP_ROWS.find((r) => r.day === "Thu")!
const OUTAGE_FRACTION = OUTAGE_MINUTES / 60

export const USUAL_DINNER_HOUR = salesAt("Thu", "6p")
export const ESTIMATED_SALES_AFFECTED = roundTo10(USUAL_DINNER_HOUR * OUTAGE_FRACTION)
// Payments at Thursday's usual ticket: the hour's share of the day's sales, in transactions.
export const FAILED_PAYMENTS = Math.round(THURSDAY.transactions * (USUAL_DINNER_HOUR / THURSDAY.sales) * OUTAGE_FRACTION)

// The conclusion in the owner's terms. The tiles, the timeline and the credit below break it down.
export const OUTAGE_INSIGHT = `Your register went offline during your dinner rush. ${FAILED_PAYMENTS} card payments failed, about ${formatWholeCurrency(ESTIMATED_SALES_AFFECTED)} in sales.`

export const OUTAGE_TILES = [
  { label: "Outage Length", value: `${OUTAGE_MINUTES} min`, sublabel: OUTAGE_WINDOW },
  { label: "Failed Card Payments", value: String(FAILED_PAYMENTS), sublabel: "Declined at the register" },
  { label: "Estimated Sales Affected", value: formatWholeCurrency(ESTIMATED_SALES_AFFECTED), sublabel: "From a usual Thursday dinner", tone: "amber" as const, toneScope: "value" as const },
]

// The evening the chart spans, 5 to 9 PM, each hour shaded by how busy a usual Thursday
// is, with the outage laid over it.
export const EVENING = { start: 17 * 60, end: 21 * 60 }
export const EVENING_HOURS = ["5p", "6p", "7p", "8p"]
export const EVENING_CHART = {
  title: "Thursday Evening",
  description: "How busy a usual Thursday is, 5–9 PM",
}

// The section breaks down what happened, so it is named for the incident and dated.
export const INCIDENT_TITLE = "Incident Details"
export const INCIDENT_WHEN = `Thursday, November 12, 2026, from ${formatStamp(OUTAGE.start, false)} to ${formatStamp(OUTAGE.end)}`

export const OUTAGE_EVENTS = [
  { at: OUTAGE.start, label: "Internet connection dropped", detail: `${CARRIER.business} service record`, down: true },
  { at: OUTAGE.start + 2, label: "First card payment failed", detail: "Register could not reach the card network", down: true },
  { at: OUTAGE.end, label: "Connection restored", detail: `${CARRIER.business} service record`, down: false },
  { at: OUTAGE.end + 2, label: "Card payments resumed", detail: "Register", down: false },
]

// The resolution, last: what was done about it, and that nothing is left to do.
export const OUTAGE_CREDIT_NOTE = {
  title: `${formatWholeCurrency(OUTAGE_CREDIT)} Credit Applied`,
  body: `Confirmed by ${CARRIER.business} for your next bill. No action needed.`,
}

// Why payments failed, then how the figure was worked out: one footnote, not a callout.
export const OUTAGE_ESTIMATE_NOTE = `Your register sends each card payment over the internet, so with the connection down it could not reach the card network. How this was estimated: a usual Thursday 6 to 7 PM brings in about ${formatWholeCurrency(USUAL_DINNER_HOUR)} on your register. The connection was down for ${OUTAGE_MINUTES} of those 60 minutes, so about ${formatWholeCurrency(ESTIMATED_SALES_AFFECTED)}.`

export const OUTAGE_REQUEST_TIMESTAMP = `Today, ${formatClock(OUTAGE_FOLLOWUP_AT + 6, true)}`

export const OUTAGE_OPTIONS_HEADING = {
  title: "Backup Internet, Ranked by Fit",
  description: "For one location with a register and card readers.",
}

const OUTAGE_REASON = `Internet down Thursday, ${OUTAGE_WINDOW}, about ${formatWholeCurrency(ESTIMATED_SALES_AFFECTED)} in card sales affected`

export const OUTAGE_OPTIONS: CarrierRequestOption[] = [
  {
    id: "wireless",
    icon: Wifi,
    title: "Wireless backup internet",
    description: "Switches the register to a cellular connection by itself when the main line drops.",
    monthlyCost: 35,
    fit: "Best fit. Nobody has to notice the outage first.",
    requestLabel: "Wireless Backup Internet Request",
    fields: [
      { label: "Service", value: "Wireless backup internet" },
      { label: "Covers", value: "Register and card readers" },
      { label: "Switches Over", value: "Automatically" },
      { label: "Why", value: OUTAGE_REASON },
    ],
    reference: "BI-3318",
    sendPrompt: "Send the wireless backup request",
  },
  {
    id: "hotspot",
    icon: Smartphone,
    title: "Mobile hotspot backup",
    description: "A hotspot device the register can join when the internet drops.",
    monthlyCost: 20,
    fit: "Works, but someone has to switch it on mid-service.",
    requestLabel: "Mobile hotspot backup request",
    fields: [
      { label: "Service", value: "Mobile hotspot device" },
      { label: "Covers", value: "Register and card readers" },
      { label: "Switches over", value: "By hand" },
      { label: "Why", value: OUTAGE_REASON },
    ],
    reference: "HS-3319",
    sendPrompt: "Send the hotspot backup request",
  },
  {
    id: "wired",
    icon: Cable,
    title: "A second wired connection",
    description: "A separate wired line into the building, with its own equipment.",
    monthlyCost: 70,
    fit: "Most resilient, and more than one location usually needs.",
    requestLabel: "Second wired connection request",
    fields: [
      { label: "Service", value: "Second wired internet connection" },
      { label: "Covers", value: "Whole location" },
      { label: "Switches Over", value: "Automatically" },
      { label: "Why", value: OUTAGE_REASON },
    ],
    reference: "WL-3320",
    sendPrompt: "Send the second connection request",
  },
]
