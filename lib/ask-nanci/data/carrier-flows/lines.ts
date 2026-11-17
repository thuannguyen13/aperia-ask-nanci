// Carrier story 43, Unused Lines. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// Nanci speaks first, in the app, before the bill posts: two idle lines and a smaller
// plan, advice in the owner's interest at a small cost to the carrier. It ends in a request to the carrier, or in a short acknowledgement if the
// owner keeps all six. The figures are read from the panel's data, so the chat and the
// panel cannot disagree.
import type { ConceptScriptedTurn, SheetActionData } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER, nanciLink } from "../carrier"
import { CARRIER_SOURCE } from "../sources"
import { isAwaitingAny, requestView, sentView } from "../panels/carrier-request"
import { formatWholeCurrency } from "../../../../components/shared/format"
import {
  IDLE_DAYS, LINES, IDLE_LINES, IDLE_LINE_NAMES, CURRENT_PLAN, SUGGESTED_PLAN, MONTHLY_DIFFERENCE, YEARLY_DIFFERENCE, LINES_REQUEST, LINES_OPTION, spellCount,
} from "../panels/unused-lines"

// Nanci opens the flow, so its key is an id rather than a prompt.
const LINES_KEY = "__unused-lines__"
const LINES_SEND = "Request the lower plan"
const LINES_KEEP = `Keep all ${spellCount(LINES.length)}`

// The owner opens the app on Nanci's text and asks which lines.
const LINES_ASK = "Which lines aren't being used?"

// The answer the request waits on. Its Send button is live only while this is the last
// thing in the chat.
const LINES_REVIEW_ANSWER = `Here is the request to ${CARRIER.business}, filled in from your lines. Check it, then send it.`

/** True while story 43 waits on its request: idle, with the review answer as the last message. */
export const isAwaitingLinesRequest = (messages: { role: string; content: string }[], chatState: string) => isAwaitingAny(messages, chatState, [LINES_REVIEW_ANSWER])

export const LINES_FLOW: FlowDef = {
  num: 43,
  section: "merchant",
  title: "Unused Lines",
  badge: "Billing",
  key: LINES_KEY,
  proactive: true,
  slug: "43",
  scope: "carrier",
  churn: { cause: "Plan mismatch", metric: "Churn" },
  // The request comes first, so ?autoplay plays on into it.
  followups: [LINES_SEND, LINES_OPTION.sendPrompt, LINES_KEEP],
  description: "Before the bill posts, Nanci texts the owner about two lines with no use in 60 days and offers a request to move to a lower plan.",
}

const planLabel = (plan: { lines: number; monthly: number }) => `${plan.lines} lines, ${formatWholeCurrency(plan.monthly)} a month`

const LINES_SHEET: SheetActionData = {
  field: "Phone lines",
  fromValue: planLabel(CURRENT_PLAN),
  toValue: planLabel(SUGGESTED_PLAN),
  timestamp: LINES_REQUEST.timestamp,
  status: "submitted",
  reference: LINES_REQUEST.reference,
  sentTo: LINES_REQUEST.sentTo,
  iconKind: "phone",
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export const LINES_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [LINES_KEY]: [
    {
      role: "assistant",
      content: `${capitalize(spellCount(IDLE_LINES.length))} of your ${spellCount(LINES.length)} lines have had no use in ${IDLE_DAYS} days. Moving to a lower plan before your bill posts on Friday would save ${formatWholeCurrency(MONTHLY_DIFFERENCE)} a month.`,
      textFrom: CARRIER.business,
      textLink: nanciLink("l2Hm6"),
      chatContent: `Before your bill posts on Friday, I went through your lines. ${capitalize(spellCount(IDLE_LINES.length))} of your ${spellCount(LINES.length)} have had no use in ${IDLE_DAYS} days, and a lower plan would save ${formatWholeCurrency(MONTHLY_DIFFERENCE)} a month.`,
      workTrail: {
        when: "08:00 AM CST",
        steps: [
          { text: `Checked calls, texts and data on all ${LINES.length} lines` },
          { text: `Priced a plan with ${SUGGESTED_PLAN.lines} lines` },
          { flag: true, text: `Flagged: ${IDLE_LINES.length} lines unused for ${IDLE_DAYS} days` },
        ],
      },
      source: CARRIER_SOURCE.name,
    },
    { role: "user", content: LINES_ASK },
    {
      role: "assistant",
      content: `${capitalize(IDLE_LINE_NAMES)}. Neither has made a call, sent a text or used data in the last ${IDLE_DAYS} days. A plan with ${spellCount(SUGGESTED_PLAN.lines)} lines would cost ${formatWholeCurrency(MONTHLY_DIFFERENCE)} less each month, or ${formatWholeCurrency(YEARLY_DIFFERENCE)} over a year.\n\nI can send ${CARRIER.business} a request to move you to the lower plan.`,
      panel: "unused-lines",
      source: CARRIER_SOURCE.name,
      suggestions: [LINES_SEND, LINES_KEEP],
    },
  ],
  // The owner reviews the request before it goes. The panel's Send button sends it.
  [LINES_SEND]: [
    { role: "user", content: LINES_SEND },
    {
      role: "assistant",
      content: LINES_REVIEW_ANSWER,
      panel: "lines-request",
      view: requestView(LINES_OPTION.id),
      revealPanel: true,
    },
  ],
  [LINES_OPTION.sendPrompt]: [
    { role: "user", content: LINES_OPTION.sendPrompt },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business} as a request to move from ${spellCount(CURRENT_PLAN.lines)} lines to ${spellCount(SUGGESTED_PLAN.lines)}, dropping ${IDLE_LINE_NAMES}. Nothing on your account changes until they confirm.`,
      panel: "lines-request",
      view: sentView(LINES_OPTION.id),
      sheetAction: LINES_SHEET,
    },
  ],
  [LINES_KEEP]: [
    { role: "user", content: LINES_KEEP },
    {
      role: "assistant",
      content: `Okay. All ${spellCount(LINES.length)} lines stay as they are, and nothing was sent to ${CARRIER.business}.`,
      panel: "unused-lines",
      view: "kept",
    },
  ],
}
