// Carrier story 35, Outage Impact. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// Nanci speaks first. It texts the owner while the internet is down: the text travels over
// the cellular network, and the app runs on the connection that is down. The chat opens
// once the internet is back, on Nanci's report of what the outage cost and the credit.
// The owner's first question is how to keep taking cards next time.
//
// The owner picks an option in the panel, so the script stops on the options answer. The
// panel's Send button then sends that option's turn, and its answer is the request on the
// record. Under ?autoplay the panel picks and sends by itself (see carrier-request.tsx).
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER, nanciLink } from "../carrier"
import { CARRIER_CITES } from "../sources"
import { isAwaitingTurn } from "../../is-awaiting-turn"
import { formatWholeCurrency } from "../../../../components/shared/format"
import { buildRequestConversations } from "../panels/carrier-request"
import {
  OUTAGE, FAILED_PAYMENTS, ESTIMATED_SALES_AFFECTED, OUTAGE_OPTIONS, OUTAGE_REQUEST_TIMESTAMP,
  OUTAGE_ESTIMATED_FIX, OUTAGE_STREET, OUTAGE_CREDIT, formatClock, formatStamp,
} from "../panels/outage-impact"

// The flow opens on Nanci's text, so its key is an id rather than a prompt.
const OUTAGE_KEY = "__outage-text__"
const OUTAGE_BACKUP = "How do I keep taking cards if it happens again?"

// The answer the ranked options wait on. The panel's Send button is live only while this
// is the last thing in the chat.
const OUTAGE_OPTIONS_ANSWER = `A wireless backup keeps the register online when the main connection drops. Here are the options, ranked by fit for a business your size. Tap one and I will fill in the request to ${CARRIER.business}.`

/** True while story 35 is parked on its options: idle, with the options answer as the last message. */
export const isAwaitingOutageRequest = (messages: { role: string; content: string }[], chatState: string) => isAwaitingTurn(messages, chatState, OUTAGE_OPTIONS_ANSWER)

export const OUTAGE_FLOW: FlowDef = {
  num: 35,
  section: "merchant",
  title: "Outage Impact",
  badge: "Trust",
  key: OUTAGE_KEY,
  proactive: true,
  slug: "35",
  scope: "carrier",
  churn: { cause: "Outages", metric: "Churn, attach rate" },
  followups: [OUTAGE_BACKUP, ...OUTAGE_OPTIONS.map((o) => o.sendPrompt)],
  description: "Nanci texts the owner while the internet is down, reports the failed payments and the credit once it is back, then requests backup internet.",
}

export const OUTAGE_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [OUTAGE_KEY]: [
    // The text goes out during the outage, over the cellular network. The chat is where
    // the owner lands once the connection is back, so Nanci's first message there is the
    // report, with the work it did in between.
    {
      role: "assistant",
      content: `Your internet at ${OUTAGE_STREET} went down at ${formatClock(OUTAGE.start, true)}. ${CARRIER.business} expects it back by ${formatClock(OUTAGE_ESTIMATED_FIX, true)}. Until then your register cannot take cards. Cash still works.`,
      textFrom: CARRIER.business,
      textLink: nanciLink("o4Tz9"),
      chatContent: `Your internet is back. It was down from ${formatClock(OUTAGE.start)} to ${formatClock(OUTAGE.end, true)}, and in that time ${FAILED_PAYMENTS} card payments failed. Based on a usual Thursday dinner, that is about ${formatWholeCurrency(ESTIMATED_SALES_AFFECTED)} in card sales.\n\n${CARRIER.business} has applied a ${formatWholeCurrency(OUTAGE_CREDIT)} credit to your next bill for the outage.`,
      workTrail: {
        when: formatStamp(OUTAGE.end + 2),
        steps: [
          { text: `Saw your connection drop at ${formatClock(OUTAGE.start, true)} on ${CARRIER.business}'s service record` },
          { text: "Texted you while it was down" },
          { text: `Saw it come back at ${formatClock(OUTAGE.end, true)}` },
          { text: `Matched ${FAILED_PAYMENTS} failed card payments on your register` },
          { flag: true, text: `Flagged: about ${formatWholeCurrency(ESTIMATED_SALES_AFFECTED)} in card sales affected` },
        ],
      },
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
      panel: "outage-backup",
      // The owner picks in the panel, so on a phone it comes up with the answer.
      revealPanel: true,
    },
  ],
  ...buildRequestConversations(OUTAGE_OPTIONS, "outage-backup", OUTAGE_REQUEST_TIMESTAMP),
}
