// Carrier story 40, Seasonal Pause. Its definition and its script, one file per story, so
// the stories are written side by side without touching each other.
//
// The owner closes for three weeks every January and asks whether to cancel until they
// reopen. Ask Nanci reads last winter from the register and the call records, then lays
// out a pause beside cancelling. It ends in a pause request to the carrier, or in a
// neutral answer if the owner still wants to cancel.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER } from "../carrier"
import { CARRIER_CITES } from "../sources"
import { isAwaitingTurn } from "../../is-awaiting-turn"
import { formatWholeCurrency } from "../../../../components/shared/format"
import { buildRequestConversations } from "../panels/carrier-request"
import {
  CLOSURE, CLOSURE_RANGE, CALLS_WHILE_CLOSED, PLAN_WHILE_CLOSED, PAUSE_OPTIONS, PAUSE_REQUEST_TIMESTAMP,
} from "../panels/seasonal-closure"

export const SEASONAL_PROMPT = "We close for three weeks every January. Should I cancel my plan until we reopen?"
const SEASONAL_PAUSE_ASK = "What would a pause look like?"
const SEASONAL_CANCEL = "I would still rather cancel"

// The answer the options wait on. The panel's Send button is live only while this is the
// last thing in the chat.
const SEASONAL_OPTIONS_ANSWER = `A pause stops your lines and internet while you're closed and keeps your number. Here are two ways to do it. Tap one and I will fill in the request to ${CARRIER.business}.`

/** True while story 40 is parked on its options: idle, with the options answer as the last message. */
export const isAwaitingPauseRequest = (messages: { role: string; content: string }[], chatState: string) => isAwaitingTurn(messages, chatState, SEASONAL_OPTIONS_ANSWER)

export const SEASONAL_FLOW: FlowDef = {
  num: 40,
  section: "merchant",
  title: "Seasonal Pause",
  badge: "Life Events",
  key: SEASONAL_PROMPT,
  slug: "40",
  scope: "carrier",
  churn: { cause: "Seasonal cancellation", metric: "Churn" },
  // The pause comes first, so ?autoplay plays on into it.
  followups: [SEASONAL_PAUSE_ASK, ...PAUSE_OPTIONS.map((o) => o.sendPrompt), SEASONAL_CANCEL],
  description: "An owner about to cancel for the off-season sees last winter's closure and calls, then requests a pause that keeps the number.",
}

export const SEASONAL_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [SEASONAL_PROMPT]: [
    { role: "user", content: SEASONAL_PROMPT },
    {
      role: "assistant",
      content: `Last year your register took no sales from ${CLOSURE_RANGE}, but your business line still took ${CALLS_WHILE_CLOSED} calls in those weeks. Keeping the plan as it is would cost about ${formatWholeCurrency(PLAN_WHILE_CLOSED)} for the time you're closed.\n\nCancelling stops that cost and releases your business number. A pause also stops most of the cost and keeps the number. Which you choose is up to you.`,
      panel: "seasonal-closure",
      source: CARRIER_CITES.withSales,
      suggestions: [SEASONAL_PAUSE_ASK, SEASONAL_CANCEL],
    },
  ],
  [SEASONAL_PAUSE_ASK]: [
    { role: "user", content: SEASONAL_PAUSE_ASK },
    {
      role: "assistant",
      content: SEASONAL_OPTIONS_ANSWER,
      panel: "seasonal-pause",
      // The owner picks in the panel, so on a phone it comes up with the answer.
      revealPanel: true,
    },
  ],
  ...buildRequestConversations(PAUSE_OPTIONS, "seasonal-pause", PAUSE_REQUEST_TIMESTAMP),
  [SEASONAL_CANCEL]: [
    { role: "user", content: SEASONAL_CANCEL },
    {
      role: "assistant",
      content: `Okay. I can send ${CARRIER.business} a request to cancel from ${CLOSURE.from}. Your business number is released once the plan ends, so callers will not reach you on it when you reopen. Tell me when you want it sent.`,
    },
  ],
}
