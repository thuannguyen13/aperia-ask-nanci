// Data for carrier story 39, Second Location. The first location is the address flow 19
// has on file, so the two stories describe one business. "Lines in daily use" is four
// because story 36 has six lines with two idle: the same account, read from two sides.
import { MapPin } from "lucide-react"
import { CARRIER } from "../carrier"
import type { CarrierRequestOption } from "./carrier-request"

export const FIRST_LOCATION = {
  name: "Oak Street",
  address: "142 Oak Street, Austin, TX 78701",
  lat: 30.2645,
  lng: -97.743,
}

export const NEW_LOCATION = {
  short: "1600 E 6th St",
  address: "1600 E 6th St, Austin, TX 78702",
  lat: 30.2629,
  lng: -97.7265,
}

// What the first location runs on, and how it got there. The suggested setup below is
// derived from these, so the chat, the tiles and the request all quote one figure.
export const FIRST_LOCATION_USE = {
  lines: 4,
  openedWithLines: 3,
  addedInMonth: 2,
  internet: 1,
}

export const COVERAGE = {
  status: "Same service as today",
  detail: "Lines and internet are both available at this address.",
}

export const SUGGESTED_SETUP = [
  {
    kind: "lines",
    item: `${FIRST_LOCATION_USE.lines} lines`,
    reason: `What ${FIRST_LOCATION.name} settled on. Starting there saves adding one in month ${FIRST_LOCATION_USE.addedInMonth}.`,
  },
  {
    kind: "internet",
    item: `${FIRST_LOCATION_USE.internet} internet connection`,
    reason: "Runs the register and card payments, the same as today.",
  },
] as const

export const SECOND_LOCATION_REQUEST = {
  reference: "NL-5120",
  timestamp: "Today, 3:05 PM",
  sentTo: CARRIER.business,
  summary: `${FIRST_LOCATION_USE.lines} lines and ${FIRST_LOCATION_USE.internet} internet connection at ${NEW_LOCATION.short}`,
}

export const LOCATION_REQUEST_TITLE = "New Location Service"

// The one request this story sends, reviewed before it goes.
export const LOCATION_OPTION: CarrierRequestOption = {
  id: "setup",
  icon: MapPin,
  title: "The suggested setup",
  description: SECOND_LOCATION_REQUEST.summary,
  requestLabel: "New Location Service Request",
  fields: [
    { label: "Address", value: NEW_LOCATION.address },
    { label: "Lines", value: String(FIRST_LOCATION_USE.lines) },
    { label: "Internet", value: `${FIRST_LOCATION_USE.internet} connection` },
    { label: "Coverage", value: COVERAGE.status },
    { label: "Why", value: `What ${FIRST_LOCATION.name} settled on` },
  ],
  reference: SECOND_LOCATION_REQUEST.reference,
  sendPrompt: "Send the new location request",
}
