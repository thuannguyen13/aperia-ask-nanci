// Carrier story 33, Missed Calls. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// The owner picks an option in the panel, so the script stops on the options answer. The
// panel's Send button then sends that option's turn, and its answer is the request on the
// record. Under ?autoplay the panel picks and sends by itself (see carrier-request.tsx).
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER } from "../carrier"
import { CARRIER_CITES } from "../sources"
import { isAwaitingTurn } from "../../is-awaiting-turn"
import { formatWholeCurrency } from "../../../../components/shared/format"
import { buildRequestConversations } from "../panels/carrier-request"
import {
  LUNCH_DROP_PCT, LUNCH_SHORTFALL, MISSED_IN_WINDOW, MISSED_WINDOW, NO_CALLBACK, CALLS_OPTIONS, CALLS_REQUEST_TIMESTAMP,
} from "../panels/missed-calls"

export const CALLS_PROMPT = "Why were Friday sales down?"
const CALLS_COVER = "What can I do about the lunch calls?"

// The answer the options wait on. The panel's Send button is live only while this is the
// last thing in the chat.
const CALLS_OPTIONS_ANSWER = `Two options would cover that window. Forward unanswered calls to a second phone during lunch, or add a second line so two calls can be taken at once. Pick one in the panel and I will fill in the request to ${CARRIER.business}.`

/** True while story 33 is parked on its options: idle, with the options answer as the last message. */
export const isAwaitingCallsRequest = (messages: { role: string; content: string }[], chatState: string) => isAwaitingTurn(messages, chatState, CALLS_OPTIONS_ANSWER)

export const CALLS_FLOW: FlowDef = {
  num: 33,
  section: "merchant",
  title: "Missed Calls",
  badge: "Calls",
  key: CALLS_PROMPT,
  slug: "33",
  scope: "carrier",
  followups: [CALLS_COVER, ...CALLS_OPTIONS.map((o) => o.sendPrompt)],
  description: "Friday lunch sales against the calls the business line missed in the same window, then a request to cover it.",
}

export const CALLS_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [CALLS_PROMPT]: [
    { role: "user", content: CALLS_PROMPT },
    {
      role: "assistant",
      content: `Friday lunch came in ${LUNCH_DROP_PCT}% under a usual Friday, about ${formatWholeCurrency(LUNCH_SHORTFALL)} less. Between ${MISSED_WINDOW.from} and ${MISSED_WINDOW.to} you also missed ${MISSED_IN_WINDOW} calls on your business line, and ${NO_CALLBACK} of those callers did not call back. That window is your busiest for both sales and calls.`,
      panel: "missed-calls",
      source: CARRIER_CITES.withSales,
      suggestions: [CALLS_COVER],
    },
  ],
  [CALLS_COVER]: [
    { role: "user", content: CALLS_COVER },
    {
      role: "assistant",
      content: CALLS_OPTIONS_ANSWER,
      panel: "missed-calls",
      view: "options",
      // The owner picks in the panel, so on a phone it comes up with the answer.
      revealPanel: true,
    },
  ],
  ...buildRequestConversations(CALLS_OPTIONS, "missed-calls", CALLS_REQUEST_TIMESTAMP),
}
