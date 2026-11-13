// Carrier story 38, Bill Question. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// Escalation (flow 17) is the model: what Ask Nanci can see, the ways a person can pick
// it up, then the hand-off with a reference. Short on purpose.
import type { ConceptScriptedTurn, SheetActionData } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER } from "../carrier"
import { BILL_CHARGE, HANDOFF_REQUEST } from "../panels/bill-handoff"

export const HANDOFF_PROMPT = "This charge on my bill doesn't look right."

export const HANDOFF_FLOW: FlowDef = {
  num: 38,
  section: "merchant",
  title: "Bill Question",
  badge: "Handoff",
  key: HANDOFF_PROMPT,
  slug: "38",
  scope: "carrier",
  description: "A charge Ask Nanci can see but not explain, handed to a business specialist with the details attached.",
}

const HANDOFF_SHEET: SheetActionData = {
  field: "Bill question",
  requestLabel: "Specialist hand-off",
  submittedTitle: "Hand-off Sent",
  product: `$${BILL_CHARGE.amount} ${BILL_CHARGE.label.toLowerCase()}, call back ${HANDOFF_REQUEST.callWindow}`,
  status: "submitted",
  reference: HANDOFF_REQUEST.reference,
  sentTo: CARRIER.business,
  timestamp: HANDOFF_REQUEST.timestamp,
}

export const HANDOFF_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [HANDOFF_PROMPT]: [
    { role: "user", content: HANDOFF_PROMPT },
    {
      role: "assistant",
      content: `I can see a $${BILL_CHARGE.amount} charge on this month's bill, labelled as a ${BILL_CHARGE.label.toLowerCase()}. It was added on ${BILL_CHARGE.added}. I can tell you when it was added, but I can't see why, and I can't remove it.`,
      panel: "bill-handoff",
    },
    { role: "user", content: "Who can sort it out?" },
    {
      role: "assistant",
      content: `A specialist at ${CARRIER.business} can. I can pass this to one with the details attached, so you don't have to explain it again. They can call you back ${HANDOFF_REQUEST.callWindow}, after your lunch rush, or reply by message within one business day.`,
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
  ],
}
