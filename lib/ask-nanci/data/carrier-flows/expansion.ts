// Carrier story 36, Second Location. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// Address Change (flow 19) is the model: the current address on an inline map, the new
// one on a second map, then a request rather than a change. The panel adds what the
// first location uses and the setup that follows from it.
import type { ConceptScriptedTurn, SheetActionData } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER } from "../carrier"
import { CARRIER_CITES } from "../sources"
import {
  FIRST_LOCATION, NEW_LOCATION, FIRST_LOCATION_USE, SECOND_LOCATION_REQUEST,
} from "../panels/second-location"

export const EXPANSION_PROMPT = "I'm opening a second location."

export const EXPANSION_FLOW: FlowDef = {
  num: 36,
  section: "merchant",
  title: "Second Location",
  badge: "Expansion",
  key: EXPANSION_PROMPT,
  slug: "36",
  scope: "carrier",
  description: "Coverage at the new address and what the first location uses, then a request for lines and internet there.",
}

const SPELLED = ["zero", "one", "two", "three", "four", "five", "six"]
const spell = (n: number) => SPELLED[n] ?? String(n)
const ORDINALS = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth"]
const ordinal = (n: number) => ORDINALS[n] ?? `${n}th`

const EXPANSION_SHEET: SheetActionData = {
  field: "New location service",
  requestLabel: "Service request",
  submittedTitle: "Service Request Submitted",
  product: SECOND_LOCATION_REQUEST.summary,
  status: "submitted",
  reference: SECOND_LOCATION_REQUEST.reference,
  sentTo: CARRIER.business,
  timestamp: SECOND_LOCATION_REQUEST.timestamp,
}

const SETUP_REQUEST = "Request that setup"

export const EXPANSION_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [EXPANSION_PROMPT]: [
    { role: "user", content: EXPANSION_PROMPT },
    {
      role: "assistant",
      content: `Congratulations. Your first location is at:\n\n${FIRST_LOCATION.address}\n\nWhat's the address of the new one? Include the street, city, state and ZIP, and I'll check what service ${CARRIER.business} has there.`,
      map: { address: FIRST_LOCATION.address, lat: FIRST_LOCATION.lat, lng: FIRST_LOCATION.lng },
    },
    { role: "user", content: NEW_LOCATION.address },
    {
      role: "assistant",
      content:
        `Here is the new address. Coverage there supports the same service you have today.\n\n{{MAP}}\n\nYour first location runs on ${spell(FIRST_LOCATION_USE.lines)} lines and ${spell(FIRST_LOCATION_USE.internet)} internet connection. It opened with ${spell(FIRST_LOCATION_USE.openedWithLines)} lines and needed a ${ordinal(FIRST_LOCATION_USE.lines)} by its ${ordinal(FIRST_LOCATION_USE.addedInMonth)} month, so the suggested setup starts the new site with ${spell(FIRST_LOCATION_USE.lines)}. I can send it to ${CARRIER.business} as a request.`,
      map: { address: NEW_LOCATION.address, lat: NEW_LOCATION.lat, lng: NEW_LOCATION.lng },
      panel: "second-location",
      source: CARRIER_CITES.account,
    },
    { role: "user", content: SETUP_REQUEST },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business}: ${SECOND_LOCATION_REQUEST.summary}. Reference ${SECOND_LOCATION_REQUEST.reference}. Nothing on your account changes until they confirm, and they'll be in touch to set an install date.`,
      panel: "second-location",
      view: "requested",
      sheetAction: EXPANSION_SHEET,
    },
  ],
}
