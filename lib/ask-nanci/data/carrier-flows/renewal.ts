// Carrier story 42, Plan Value. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// Nanci speaks first, in the app, on the 1st: a receipt of what it caught on the account
// that month, which are the other carrier stories. Value shown every month, not only when
// the owner is deciding whether to renew. The owner then asks about renewal, and Ask Nanci
// lays out a year of its own work beside what the plan costs and leaves the decision to
// the owner. It ends in a renewal request to the carrier, or in a neutral
// list of options. There is no "what you lose if you switch" step. The figures are read
// from the panel's data, so the chat and the panel cannot disagree.
import type { ConceptScriptedTurn, SheetActionData } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER, nanciLink } from "../carrier"
import { CARRIER_SOURCE, CARRIER_CITES } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"
import {
  PLAN_MONTHLY, PLAN_YEARLY, RENEWS_ON, YEAR_WITH_NANCI, RENEWAL_OPTIONS, RENEWAL_REQUEST, RENEWAL_OPTION, MONTH, MONTH_CATCHES, MONTH_SAVINGS, spellCount,
} from "../panels/plan-value"
import { isAwaitingAny, requestView, sentView } from "../panels/carrier-request"

// Nanci opens the flow, so its key is an id rather than a prompt.
const MONTH_KEY = "__plan-value__"
// The owner opens the app on Nanci's text and asks for the month.
const MONTH_ASK = `Show me the ${spellCount(MONTH_CATCHES.length)} things`
export const RENEWAL_PROMPT = "My plan renews next month. Is it worth keeping?"
const RENEWAL_RENEW = "Renew my plan"
const RENEWAL_OPTIONS_ASK = "Show me other options"

// The answer the request waits on. Its Send button is live only while this is the last
// thing in the chat.
const RENEWAL_REVIEW_ANSWER = `Here is the renewal request to ${CARRIER.business}. Check it, then send it.`

/** True while story 42 waits on its request: idle, with the review answer as the last message. */
export const isAwaitingRenewalRequest = (messages: { role: string; content: string }[], chatState: string) => isAwaitingAny(messages, chatState, [RENEWAL_REVIEW_ANSWER])

export const RENEWAL_FLOW: FlowDef = {
  num: 42,
  section: "merchant",
  title: "Plan Value",
  badge: "Renewal",
  key: MONTH_KEY,
  proactive: true,
  slug: "42",
  scope: "carrier",
  churn: { cause: "Price shopping at renewal", metric: "Churn" },
  // The renewal comes first, so ?autoplay plays on into it.
  followups: [RENEWAL_PROMPT, RENEWAL_RENEW, RENEWAL_OPTION.sendPrompt, RENEWAL_OPTIONS_ASK],
  description: "Nanci texts a monthly receipt of what it caught on the account, then a year beside the plan's cost when the owner asks about renewal.",
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
  [MONTH_KEY]: [
    {
      role: "assistant",
      content: `Your ${MONTH} summary is ready: ${MONTH_CATCHES.length} things caught on your account, ${formatWholeCurrency(MONTH_SAVINGS)} in savings found.`,
      textFrom: CARRIER.business,
      textLink: nanciLink("s3Jx7"),
      chatContent: `${MONTH} is done, so I put together what your plan did this month. I caught ${spellCount(MONTH_CATCHES.length)} things on your account, and ${spellCount(MONTH_CATCHES.filter((c) => c.saving).length)} of them found ${formatWholeCurrency(MONTH_SAVINGS)} in savings.`,
      workTrail: {
        when: "07:00 AM CST",
        steps: [
          { text: `Went back through ${MONTH} on your ${CARRIER.business} account` },
          { text: "Counted savings only where there is a figure" },
          { flag: true, text: `Ready: ${MONTH_CATCHES.length} things caught, ${formatWholeCurrency(MONTH_SAVINGS)} in savings` },
        ],
      },
      source: CARRIER_CITES.account,
    },
    { role: "user", content: MONTH_ASK },
    {
      role: "assistant",
      content: `Here they are, in date order. Two came with a figure: the outage credit and the lower plan. Your plan costs ${formatWholeCurrency(PLAN_MONTHLY)} a month.`,
      panel: "month-value",
      source: CARRIER_CITES.account,
      suggestions: [RENEWAL_PROMPT],
    },
  ],
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
  // The owner reviews the request before it goes. The panel's Send button sends it.
  [RENEWAL_RENEW]: [
    { role: "user", content: RENEWAL_RENEW },
    { role: "assistant", content: RENEWAL_REVIEW_ANSWER, panel: "renewal-request", view: requestView(RENEWAL_OPTION.id), revealPanel: true },
  ],
  [RENEWAL_OPTION.sendPrompt]: [
    { role: "user", content: RENEWAL_OPTION.sendPrompt },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business} as a request to renew the same plan for another 12 months. Nothing on your account changes until they confirm, and your plan runs as it is until ${RENEWS_ON}.`,
      panel: "renewal-request",
      view: sentView(RENEWAL_OPTION.id),
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
