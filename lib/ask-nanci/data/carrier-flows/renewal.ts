// Carrier story 37, Plan Value. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// Ask Nanci lays out a year of its own work beside what the plan costs and leaves the
// decision to the owner. It ends in a renewal request to the carrier, or in a neutral
// list of options. There is no "what you lose if you switch" step. The figures are read
// from the panel's data, so the chat and the panel cannot disagree.
import type { ConceptScriptedTurn, SheetActionData } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER } from "../carrier"
import { CARRIER_SOURCE } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"
import { PLAN_MONTHLY, PLAN_YEARLY, RENEWS_ON, YEAR_WITH_NANCI, RENEWAL_OPTIONS, RENEWAL_REQUEST } from "../panels/plan-value"

export const RENEWAL_PROMPT = "My plan renews next month. Is it worth keeping?"
const RENEWAL_RENEW = "Renew my plan"
const RENEWAL_OPTIONS_ASK = "Show me other options"

export const RENEWAL_FLOW: FlowDef = {
  num: 37,
  section: "merchant",
  title: "Plan Value",
  badge: "Renewal",
  key: RENEWAL_PROMPT,
  slug: "37",
  scope: "carrier",
  // The renewal comes first, so ?autoplay plays on into it.
  followups: [RENEWAL_RENEW, RENEWAL_OPTIONS_ASK],
  description: "A year of Ask Nanci beside the plan's cost, then renew or review options.",
}

const RENEWAL_SHEET: SheetActionData = {
  field: "Plan renewal",
  requestLabel: "Renewal request",
  product: "Same plan, 12 months",
  submittedTitle: "Renewal Request Submitted",
  timestamp: RENEWAL_REQUEST.timestamp,
  status: "submitted",
  reference: RENEWAL_REQUEST.reference,
  sentTo: RENEWAL_REQUEST.sentTo,
}

export const RENEWAL_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [RENEWAL_PROMPT]: [
    { role: "user", content: RENEWAL_PROMPT },
    {
      role: "assistant",
      content: `Your plan renews on ${RENEWS_ON}. Over the past year I flagged ${YEAR_WITH_NANCI.priceIncreasesCaught} supplier price increases and answered ${YEAR_WITH_NANCI.billQuestionsAnswered} questions about your bill. The savings I can put a number on come to about ${formatWholeCurrency(YEAR_WITH_NANCI.estimatedSavings)}.\n\nYour plan costs ${formatWholeCurrency(PLAN_MONTHLY)} a month, or ${formatWholeCurrency(PLAN_YEARLY)} over a year. Whether to keep it is your call. I can send a renewal request, or lay out the other options.`,
      panel: "plan-value",
      source: CARRIER_SOURCE.name,
      suggestions: [RENEWAL_RENEW, RENEWAL_OPTIONS_ASK],
    },
  ],
  [RENEWAL_RENEW]: [
    { role: "user", content: RENEWAL_RENEW },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business} as a request to renew the same plan for another 12 months. Nothing on your account changes until they confirm, and your plan runs as it is until ${RENEWS_ON}.`,
      panel: "plan-value",
      view: "renewal-requested",
      sheetAction: RENEWAL_SHEET,
    },
  ],
  [RENEWAL_OPTIONS_ASK]: [
    { role: "user", content: RENEWAL_OPTIONS_ASK },
    {
      role: "assistant",
      content: `Here is what you can do before ${RENEWS_ON}.\n\n${RENEWAL_OPTIONS.map((o) => `- **${o.title}** ${o.detail}`).join("\n")}\n\nWhichever you choose, I can send it to ${CARRIER.business} as a request.`,
    },
  ],
}
