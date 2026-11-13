// Carrier story 34, Outage Impact. Its definition and its script, one file per story, so the
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
  OUTAGE_MINUTES, OUTAGE_WINDOW, FAILED_PAYMENTS, ESTIMATED_SALES_AFFECTED, OUTAGE_OPTIONS, OUTAGE_REQUEST_TIMESTAMP,
} from "../panels/outage-impact"

export const OUTAGE_PROMPT = "What happened Thursday evening?"
const OUTAGE_BACKUP = "How do I keep taking cards if it happens again?"

// The answer the ranked options wait on. The panel's Send button is live only while this
// is the last thing in the chat.
const OUTAGE_OPTIONS_ANSWER = `A wireless backup keeps the register online when the main connection drops. Here are the options, ranked by fit for a business your size. Tap one and I will fill in the request to ${CARRIER.business}.`

/** True while story 34 is parked on its options: idle, with the options answer as the last message. */
export const isAwaitingOutageRequest = (messages: { role: string; content: string }[], chatState: string) => isAwaitingTurn(messages, chatState, OUTAGE_OPTIONS_ANSWER)

export const OUTAGE_FLOW: FlowDef = {
  num: 34,
  section: "merchant",
  title: "Outage Impact",
  badge: "Outage",
  key: OUTAGE_PROMPT,
  slug: "34",
  scope: "carrier",
  followups: [OUTAGE_BACKUP, ...OUTAGE_OPTIONS.map((o) => o.sendPrompt)],
  description: "An internet outage matched to the card payments that failed during it, then a request for backup internet.",
}

export const OUTAGE_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [OUTAGE_PROMPT]: [
    { role: "user", content: OUTAGE_PROMPT },
    {
      role: "assistant",
      content: `Your internet was down for ${OUTAGE_MINUTES} minutes on Thursday, from ${OUTAGE_WINDOW}. Your register could not take cards in that window, and ${FAILED_PAYMENTS} card payments failed. Based on a usual Thursday dinner, that is about ${formatWholeCurrency(ESTIMATED_SALES_AFFECTED)} in card sales.`,
      panel: "outage-impact",
      source: CARRIER_CITES.withSales,
      suggestions: [OUTAGE_BACKUP],
    },
  ],
  [OUTAGE_BACKUP]: [
    { role: "user", content: OUTAGE_BACKUP },
    {
      role: "assistant",
      content: OUTAGE_OPTIONS_ANSWER,
      panel: "outage-impact",
      view: "options",
      // The owner picks in the panel, so on a phone it comes up with the answer.
      revealPanel: true,
    },
  ],
  ...buildRequestConversations(OUTAGE_OPTIONS, "outage-impact", OUTAGE_REQUEST_TIMESTAMP),
}
