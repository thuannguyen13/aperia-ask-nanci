// Data for carrier story 34, Outage Impact: Thursday evening's internet outage on the
// carrier's service record, matched to the card payments the register could not take.
//
// The estimate is the same mock business as Busiest Times and the Sales Snapshot.
// Thursday's sales and transactions (sales-snapshot.ts) are shared across the hours by
// the Thursday row of the heatmap (busiest-times.ts), where 6 PM is "busy". The 40
// minutes are then that share of the 6 PM hour.
import { Cable, Smartphone, Wifi } from "lucide-react"
import { DAILY_SALES } from "./sales-snapshot"
import { HEATMAP_HOURS, HEATMAP_ROWS } from "./busiest-times"
import type { CarrierRequestOption } from "./carrier-request"
import { CARRIER } from "../carrier"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const OUTAGE_IMPACT_TITLE = "Outage Impact"

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

export const OUTAGE_WINDOW = `${formatClock(OUTAGE.start)} to ${formatClock(OUTAGE.end, true)}`

const THURSDAY = DAILY_SALES.find((d) => d.day === "Thursday")!
export const THURSDAY_ROW = HEATMAP_ROWS.find((r) => r.day === "Thu")!
const THURSDAY_LEVEL_TOTAL = THURSDAY_ROW.levels.reduce((sum, l) => sum + l, 0)
const DINNER_SHARE = THURSDAY_ROW.levels[HEATMAP_HOURS.indexOf("6p")] / THURSDAY_LEVEL_TOTAL
const OUTAGE_FRACTION = OUTAGE_MINUTES / 60

export const USUAL_DINNER_HOUR = roundTo10(THURSDAY.sales * DINNER_SHARE)
export const ESTIMATED_SALES_AFFECTED = roundTo10(THURSDAY.sales * DINNER_SHARE * OUTAGE_FRACTION)
export const FAILED_PAYMENTS = Math.round(THURSDAY.transactions * DINNER_SHARE * OUTAGE_FRACTION)

export const OUTAGE_INSIGHT = "This was not a slow night. Thursday 6 to 7 is one of your busier dinner hours, and the register could not take cards for most of it."

export const OUTAGE_TILES = [
  { label: "Outage length", value: `${OUTAGE_MINUTES} min`, sublabel: OUTAGE_WINDOW },
  { label: "Failed card payments", value: String(FAILED_PAYMENTS), sublabel: "declined at the register" },
  { label: "Estimated sales affected", value: formatWholeCurrency(ESTIMATED_SALES_AFFECTED), sublabel: "from a usual Thursday dinner", tone: "amber" as const },
]

export const OUTAGE_WHY = {
  title: "Why card payments failed",
  body: "Your register sends each card payment over the internet. With the connection down it could not reach the card network, so payments were declined at the counter.",
}

// The evening the timeline spans, 5 to 9 PM, shaded by how busy a usual Thursday is.
export const EVENING = { start: 17 * 60, end: 21 * 60 }
export const EVENING_HOURS = ["5p", "6p", "7p", "8p"]

export const OUTAGE_EVENTS = [
  { at: OUTAGE.start, label: "Internet connection dropped", detail: `${CARRIER.business} service record`, down: true },
  { at: OUTAGE.start + 2, label: "First card payment failed", detail: "Register could not reach the card network", down: true },
  { at: OUTAGE.end, label: "Connection restored", detail: `${CARRIER.business} service record`, down: false },
  { at: OUTAGE.end + 2, label: "Card payments going through again", detail: "Register", down: false },
]

export const OUTAGE_ESTIMATE_NOTE = `How this was estimated: a usual Thursday 6 to 7 PM brings in about ${formatWholeCurrency(USUAL_DINNER_HOUR)} on your register. The connection was down for ${OUTAGE_MINUTES} of those 60 minutes, so about ${formatWholeCurrency(ESTIMATED_SALES_AFFECTED)}.`

export const OUTAGE_REQUEST_TIMESTAMP = "Today, 9:15 AM"

export const OUTAGE_OPTIONS_HEADING = {
  title: "Backup internet, ranked by fit",
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
    requestLabel: "Wireless backup internet request",
    fields: [
      { label: "Service", value: "Wireless backup internet" },
      { label: "Covers", value: "Register and card readers" },
      { label: "Switches over", value: "Automatically" },
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
      { label: "Switches over", value: "Automatically" },
      { label: "Why", value: OUTAGE_REASON },
    ],
    reference: "WL-3320",
    sendPrompt: "Send the second connection request",
  },
]
