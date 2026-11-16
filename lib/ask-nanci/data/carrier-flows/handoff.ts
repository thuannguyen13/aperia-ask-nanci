// Carrier story 37, Billing Question. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// Nanci speaks first, in the app, when the bill posts with a fee it has not seen before.
// Then the other side of bill shock: a charge that has not landed yet. The kitchen line is
// heading over its data, Nanci can explain that one, and the owner can stop it. It ends in
// a request to the carrier, or in leaving it as it is.
// Escalation (flow 17) is the model for the hand-off: what Ask Nanci can see, the ways a person can pick
// it up, then the hand-off with a reference. Short on purpose.
import type { ConceptScriptedTurn, SheetActionData } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER } from "../carrier"
import { CARRIER_CITES } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"
import { BILL_CHARGE, HANDOFF_REQUEST } from "../panels/bill-handoff"
import { DATA, OVER_GB, OVERAGE_COST, UNLIMITED_EXTRA, KITCHEN_LINE, OVERAGE_REQUEST, OVERAGE_OPTIONS } from "../panels/data-overage"
import { isAwaitingAny, requestView, sentView } from "../panels/carrier-request"

// Nanci opens the flow, so its key is an id rather than a prompt.
const HANDOFF_KEY = "__bill-question__"
// The hand-off is done before Nanci raises the next thing. The extra beat lets it land.
const OVERAGE_PAUSE_MS = 2000
const OVERAGE_UNLIMITED = "Move it to unlimited"
const OVERAGE_SLOW = "Slow it down instead"
const OVERAGE_LEAVE = "Leave it as it is"
const [UNLIMITED_OPTION, SLOW_OPTION] = OVERAGE_OPTIONS

// The answers the request waits on, one per option. The panel's Send button is live only
// while one of them is the last thing in the chat.
const OVERAGE_REVIEW_ANSWER = `Here is the request to ${CARRIER.business} for the kitchen line. Check it, then send it.`

/** True while story 37 waits on a kitchen line request: idle, with the review answer last. */
export const isAwaitingOverageRequest = (messages: { role: string; content: string }[], chatState: string) => isAwaitingAny(messages, chatState, [OVERAGE_REVIEW_ANSWER])

export const HANDOFF_FLOW: FlowDef = {
  num: 37,
  section: "merchant",
  title: "Billing Question",
  badge: "Support",
  key: HANDOFF_KEY,
  proactive: true,
  slug: "37",
  scope: "carrier",
  churn: { cause: "Bill shock", metric: "Churn" },
  // Unlimited comes first, so ?autoplay plays on into it.
  followups: [OVERAGE_UNLIMITED, OVERAGE_SLOW, ...OVERAGE_OPTIONS.map((o) => o.sendPrompt), OVERAGE_LEAVE],
  description: "Nanci flags a new fee it cannot explain and hands it to a specialist, then warns that a line is heading over its data before the charge lands.",
}

const HANDOFF_SHEET: SheetActionData = {
  field: "Billing question",
  requestLabel: "Specialist hand-off",
  submittedTitle: "Hand-off Sent",
  product: `$${BILL_CHARGE.amount} ${BILL_CHARGE.label.toLowerCase()}, call back ${HANDOFF_REQUEST.callWindow}`,
  status: "submitted",
  reference: HANDOFF_REQUEST.reference,
  sentTo: CARRIER.business,
  timestamp: HANDOFF_REQUEST.timestamp,
}

function overageSheet(fromValue: string, toValue: string): SheetActionData {
  return {
    field: `Kitchen line data, ending ${KITCHEN_LINE.ending}`,
    fromValue,
    toValue,
    timestamp: OVERAGE_REQUEST.timestamp,
    status: "submitted",
    reference: OVERAGE_REQUEST.reference,
    sentTo: OVERAGE_REQUEST.sentTo,
    iconKind: "phone",
  }
}

export const HANDOFF_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [HANDOFF_KEY]: [
    {
      role: "assistant",
      content: `Your bill posted today with a $${BILL_CHARGE.amount} ${BILL_CHARGE.label.toLowerCase()} on it, added on ${BILL_CHARGE.added}. It is the first one in 12 months. I can see when it was added, but not why, and I cannot remove it.`,
      panel: "bill-handoff",
      source: CARRIER_CITES.account,
    },
    { role: "user", content: "Who can sort it out?" },
    {
      role: "assistant",
      content: `A specialist at ${CARRIER.business} can. I can pass this to one with the details attached, so you do not have to explain it again. They can call you back ${HANDOFF_REQUEST.callWindow}, after your lunch rush, or reply by message within one business day.`,
      panel: "bill-handoff",
      view: "summary",
    },
    { role: "user", content: "Call me back" },
    {
      role: "assistant",
      content: `Done. A specialist will call you ${HANDOFF_REQUEST.callWindow} with this summary in front of them. Reference ${HANDOFF_REQUEST.reference}. Nothing on your bill changes until ${CARRIER.business} confirms.`,
      panel: "bill-handoff",
      view: "sent",
      sheetAction: HANDOFF_SHEET,
    },
    {
      role: "assistant",
      content: `One more thing before your next bill. Your kitchen line has used ${DATA.usedGb} of its ${DATA.limitGb} GB with ${DATA.daysLeft} days left. At this pace it goes about ${OVER_GB} GB over, which adds about ${formatWholeCurrency(OVERAGE_COST)}.\n\nUnlimited data on that line costs ${formatWholeCurrency(UNLIMITED_EXTRA)} more a month. Or I can ask ${CARRIER.business} to slow it down at ${DATA.limitGb} GB, so nothing is added.`,
      pauseBefore: OVERAGE_PAUSE_MS,
      panel: "data-overage",
      source: CARRIER_CITES.account,
      suggestions: [OVERAGE_UNLIMITED, OVERAGE_SLOW, OVERAGE_LEAVE],
    },
  ],
  // Each choice opens its request for review. The panel's Send button sends it, and Back
  // shows the other option.
  [OVERAGE_UNLIMITED]: [
    { role: "user", content: OVERAGE_UNLIMITED },
    { role: "assistant", content: OVERAGE_REVIEW_ANSWER, panel: "overage-request", view: requestView(UNLIMITED_OPTION.id), revealPanel: true },
  ],
  [OVERAGE_SLOW]: [
    { role: "user", content: OVERAGE_SLOW },
    { role: "assistant", content: OVERAGE_REVIEW_ANSWER, panel: "overage-request", view: requestView(SLOW_OPTION.id), revealPanel: true },
  ],
  [UNLIMITED_OPTION.sendPrompt]: [
    { role: "user", content: UNLIMITED_OPTION.sendPrompt },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business} as a request to move the kitchen line to unlimited data, for ${formatWholeCurrency(UNLIMITED_EXTRA)} more a month. Reference ${OVERAGE_REQUEST.reference}. Nothing changes until they confirm.`,
      panel: "overage-request",
      view: sentView(UNLIMITED_OPTION.id),
      sheetAction: overageSheet(`${DATA.limitGb} GB a month`, `Unlimited, ${formatWholeCurrency(UNLIMITED_EXTRA)} more a month`),
    },
  ],
  [SLOW_OPTION.sendPrompt]: [
    { role: "user", content: SLOW_OPTION.sendPrompt },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business} as a request to slow the kitchen line at ${DATA.limitGb} GB instead of charging for more. Reference ${OVERAGE_REQUEST.reference}. Nothing changes until they confirm.`,
      panel: "overage-request",
      view: sentView(SLOW_OPTION.id),
      sheetAction: overageSheet(`Charged past ${DATA.limitGb} GB`, `Slowed at ${DATA.limitGb} GB`),
    },
  ],
  [OVERAGE_LEAVE]: [
    { role: "user", content: OVERAGE_LEAVE },
    {
      role: "assistant",
      content: `Okay. Nothing was sent to ${CARRIER.business}. I will tell you if the kitchen line goes over.`,
    },
  ],
}
