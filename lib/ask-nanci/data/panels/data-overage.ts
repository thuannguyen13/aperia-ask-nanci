// Data for the second half of carrier story 37: a line heading over its data before the
// cycle ends. The fee in the first half has already landed. This charge has not, so the
// owner can stop it. The line is the kitchen's, from story 36's account. Every figure and
// price is invented.
import { Gauge, Infinity as Unlimited } from "lucide-react"
import { LINES } from "./unused-lines"
import type { CarrierRequestOption } from "./carrier-request"
import { CARRIER } from "../carrier"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const DATA_OVERAGE_TITLE = "Kitchen Line Data"

export const KITCHEN_LINE = LINES.find((line) => line.label === "Kitchen")!

// The cycle so far, and where this pace ends it.
export const DATA = { usedGb: 9, limitGb: 10, daysIn: 21, daysLeft: 9 }
const PER_DAY = DATA.usedGb / DATA.daysIn
export const PROJECTED_GB = Math.round(DATA.usedGb + PER_DAY * DATA.daysLeft)
export const OVER_GB = PROJECTED_GB - DATA.limitGb
const PER_GB = 10
export const OVERAGE_COST = OVER_GB * PER_GB

export const UNLIMITED_EXTRA = 10

export const OVERAGE_INSIGHT = `Your kitchen line will run out of data before the cycle ends. At this pace it goes about ${OVER_GB} GB over, which adds about ${formatWholeCurrency(OVERAGE_COST)} to your next bill.`

export const OVERAGE_TILES = [
  { label: "Data Used", value: `${DATA.usedGb} of ${DATA.limitGb} GB`, sublabel: `Line ending ${KITCHEN_LINE.ending}` },
  { label: "Days Left", value: String(DATA.daysLeft), sublabel: "In this billing cycle" },
  { label: "Estimated Overage", value: formatWholeCurrency(OVERAGE_COST), sublabel: `About ${OVER_GB} GB at ${formatWholeCurrency(PER_GB)} each`, tone: "amber" as const, toneScope: "value" as const },
]

export const USAGE_METER = {
  title: "This Cycle",
  description: `Projected from the last ${DATA.daysIn} days`,
  usedLabel: "Used so far",
  projectedLabel: "Projected by cycle end",
  limitLabel: `${DATA.limitGb} GB included`,
}

export const OVERAGE_NOTE = `Usage is from your ${CARRIER.business} account. The projection assumes the kitchen line keeps its pace of the last ${DATA.daysIn} days.`

export const OVERAGE_REQUEST = {
  reference: "DU-6142",
  timestamp: "Today, 10:46 AM",
  sentTo: CARRIER.business,
}

export const OVERAGE_REQUEST_TITLE = "Kitchen Line Request"

export const OVERAGE_OPTIONS_HEADING = {
  title: "Before the Charge Lands",
  description: `Two ways to keep the kitchen line from adding about ${formatWholeCurrency(OVERAGE_COST)}.`,
}

const OVERAGE_REASON = `On pace to go about ${OVER_GB} GB over, about ${formatWholeCurrency(OVERAGE_COST)}`
const LINE_FIELD = { label: "Line", value: `Kitchen, ending ${KITCHEN_LINE.ending}` }

export const OVERAGE_OPTIONS: CarrierRequestOption[] = [
  {
    id: "unlimited",
    icon: Unlimited,
    title: "Unlimited data",
    description: "The kitchen line never runs out or adds a charge.",
    requestLabel: "Unlimited Data Request",
    fields: [
      LINE_FIELD,
      { label: "Data", value: `${DATA.limitGb} GB a month to unlimited` },
      { label: "Monthly Cost", value: `${formatWholeCurrency(UNLIMITED_EXTRA)} more` },
      { label: "Why", value: OVERAGE_REASON },
    ],
    reference: OVERAGE_REQUEST.reference,
    sendPrompt: "Send the unlimited data request",
  },
  {
    id: "slow",
    icon: Gauge,
    title: "Slow it down",
    description: `The kitchen line slows at ${DATA.limitGb} GB instead of adding charges.`,
    requestLabel: "Slowdown Request",
    fields: [
      LINE_FIELD,
      { label: "At the Limit", value: `Slows at ${DATA.limitGb} GB, no charge` },
      { label: "Monthly Cost", value: "No change" },
      { label: "Why", value: OVERAGE_REASON },
    ],
    reference: OVERAGE_REQUEST.reference,
    sendPrompt: "Send the slowdown request",
  },
]
