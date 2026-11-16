// Carrier story 41, Phone Customers. Its definition and its script, one file per story,
// so the stories are written side by side without touching each other.
//
// Value that builds up the longer the owner stays, and that only the carrier holds:
// years of calls on the business line matched to the register, so Nanci knows which
// callers are regulars and which have gone quiet. It ends on winning the quiet ones back
// with the carrier's business texting, or on downloading the whole history, which keeps
// it about value earned rather than the cost of leaving.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER } from "../carrier"
import { CARRIER_CITES } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"
import { isAwaitingAny, requestView, sentView } from "../panels/carrier-request"
import {
  REGULARS, GONE_QUIET, PHONE_ORDERS_CHANGE_PCT, PHONE_SALES, TOP_REGULARS, YEARS_OF_HISTORY, WINBACK_OPTION,
} from "../panels/phone-customers"

export const CALLERS_PROMPT = "Who are my best phone customers?"
const CALLERS_WINBACK = `Text the ${GONE_QUIET.count} who went quiet`
const CALLERS_EXPORT = "Can I download all of my history?"

// The answer the request waits on. Its Send button is live only while this is the last
// thing in the chat.
const WINBACK_REVIEW_ANSWER = `Here is the request to ${CARRIER.business}. Business texting sends from your own number, so they see it is you. Check it, then send it.`

/** True while story 41 waits on its request: idle, with the review answer as the last message. */
export const isAwaitingWinback = (messages: { role: string; content: string }[], chatState: string) => isAwaitingAny(messages, chatState, [WINBACK_REVIEW_ANSWER])

export const CALLERS_FLOW: FlowDef = {
  num: 41,
  section: "merchant",
  title: "Phone Customers",
  badge: "Accumulated Value",
  key: CALLERS_PROMPT,
  slug: "41",
  scope: "carrier",
  churn: { cause: "Short tenure", metric: "Churn, attach rate" },
  // Winning them back comes first, so ?autoplay plays on into it.
  followups: [CALLERS_WINBACK, WINBACK_OPTION.sendPrompt, CALLERS_EXPORT],
  description: "Three years of calls matched to the register: the regulars who order by phone, the ones gone quiet, and a text from the business number to win them back.",
}

export const CALLERS_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [CALLERS_PROMPT]: [
    { role: "user", content: CALLERS_PROMPT },
    {
      role: "assistant",
      content: `You have ${REGULARS} regulars who order by phone, and phone orders are up ${PHONE_ORDERS_CHANGE_PCT}% on last year, about ${formatWholeCurrency(PHONE_SALES)} so far. ${TOP_REGULARS[0].name} tops the list with ${TOP_REGULARS[0].orders} orders, most of them on Fridays.\n\n${GONE_QUIET.count} of your regulars have not called in ${GONE_QUIET.days} days. Between them they usually order about ${formatWholeCurrency(GONE_QUIET.usualMonthly)} a month.`,
      panel: "phone-customers",
      source: CARRIER_CITES.withSales,
      suggestions: [CALLERS_WINBACK, CALLERS_EXPORT],
    },
  ],
  // The owner reviews the request before it goes. The panel's Send button sends it.
  [CALLERS_WINBACK]: [
    { role: "user", content: CALLERS_WINBACK },
    { role: "assistant", content: WINBACK_REVIEW_ANSWER, panel: "winback-request", view: requestView(WINBACK_OPTION.id), revealPanel: true },
  ],
  [WINBACK_OPTION.sendPrompt]: [
    { role: "user", content: WINBACK_OPTION.sendPrompt },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business} as a request for business texting, reference ${WINBACK_OPTION.reference}. Once they confirm, your first text goes to the ${GONE_QUIET.count} regulars, and I will tell you who orders again.`,
      panel: "winback-request",
      view: sentView(WINBACK_OPTION.id),
      sheetAction: {
        field: WINBACK_OPTION.requestLabel,
        requestLabel: WINBACK_OPTION.requestLabel,
        submittedTitle: `Request Sent to ${CARRIER.business}`,
        product: "Business texting",
        sentTo: CARRIER.business,
        reference: WINBACK_OPTION.reference,
        timestamp: "Today, 11:20 AM",
        status: "submitted",
      },
      suggestions: [CALLERS_EXPORT],
    },
  ],
  [CALLERS_EXPORT]: [
    { role: "user", content: CALLERS_EXPORT },
    {
      role: "assistant",
      content: `Yes, it is yours. I have sent a link to your email with ${YEARS_OF_HISTORY} years of calls and phone orders, as a spreadsheet. It works for 7 days, and you can ask for a new one any time.`,
      panel: "phone-customers",
      view: "exported",
    },
  ],
}
