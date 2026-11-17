// Carrier story 46, Second Location. Its definition and its script, one file per story, so the
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
  FIRST_LOCATION, NEW_LOCATION, FIRST_LOCATION_USE, SECOND_LOCATION_REQUEST, LOCATION_OPTION,
} from "../panels/second-location"
import { isAwaitingAny, requestView, sentView } from "../panels/carrier-request"

export const EXPANSION_PROMPT = "I'm opening a second location."
const SETUP_REQUEST = "Request that setup"

export const EXPANSION_FLOW: FlowDef = {
  num: 46,
  section: "merchant",
  title: "Second Location",
  badge: "Life Events",
  key: EXPANSION_PROMPT,
  slug: "46",
  scope: "carrier",
  churn: { cause: "Growth", metric: "ARPU" },
  followups: [SETUP_REQUEST, LOCATION_OPTION.sendPrompt],
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

// The answer the request waits on. Its Send button is live only while this is the last
// thing in the chat.
const SETUP_REVIEW_ANSWER = `Here is the request to ${CARRIER.business}, filled in from what ${FIRST_LOCATION.name} uses. Check it, then send it.`

/** True while story 46 waits on its request: idle, with the review answer as the last message. */
export const isAwaitingLocationRequest = (messages: { role: string; content: string }[], chatState: string) => isAwaitingAny(messages, chatState, [SETUP_REVIEW_ANSWER])

export const EXPANSION_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [EXPANSION_PROMPT]: [
    { role: "user", content: EXPANSION_PROMPT },
    {
      role: "assistant",
      content: `Congratulations. Your first location is at:\n\n${FIRST_LOCATION.address}\n\nWhat is the address of the new one? Include the street, city, state and ZIP, and I will check what service ${CARRIER.business} has there.`,
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
      suggestions: [SETUP_REQUEST],
    },
  ],
  // The owner reviews the request before it goes. The panel's Send button sends it.
  [SETUP_REQUEST]: [
    { role: "user", content: SETUP_REQUEST },
    { role: "assistant", content: SETUP_REVIEW_ANSWER, panel: "location-request", view: requestView(LOCATION_OPTION.id), revealPanel: true },
  ],
  [LOCATION_OPTION.sendPrompt]: [
    { role: "user", content: LOCATION_OPTION.sendPrompt },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business}: ${SECOND_LOCATION_REQUEST.summary}. Reference ${SECOND_LOCATION_REQUEST.reference}. Nothing on your account changes until they confirm, and they will be in touch to set an install date.`,
      panel: "location-request",
      view: sentView(LOCATION_OPTION.id),
      sheetAction: EXPANSION_SHEET,
    },
  ],
}
