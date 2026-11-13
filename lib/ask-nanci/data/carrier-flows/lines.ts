// Carrier story 35, Unused Lines. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
//
// Advice in the owner's interest, at a small cost to the carrier: two idle lines and a
// smaller plan. It ends in a request to the carrier, or in a short acknowledgement if the
// owner keeps all six. The figures are read from the panel's data, so the chat and the
// panel cannot disagree.
import type { ConceptScriptedTurn, SheetActionData } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER } from "../carrier"
import { CARRIER_SOURCE } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"
import {
  IDLE_DAYS, LINES, IDLE_LINES, IDLE_LINE_NAMES, CURRENT_PLAN, SUGGESTED_PLAN, MONTHLY_DIFFERENCE, YEARLY_DIFFERENCE, LINES_REQUEST, spellCount,
} from "../panels/unused-lines"

export const LINES_PROMPT = "Am I paying for more than I need?"
const LINES_SEND = "Request the smaller plan"
const LINES_KEEP = `Keep all ${spellCount(LINES.length)}`

export const LINES_FLOW: FlowDef = {
  num: 35,
  section: "merchant",
  title: "Unused Lines",
  badge: "Lines",
  key: LINES_PROMPT,
  slug: "35",
  scope: "carrier",
  // The request comes first, so ?autoplay plays on into it.
  followups: [LINES_SEND, LINES_KEEP],
  description: "Two lines with no use in 60 days, and a request to move to a smaller plan.",
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
  [LINES_PROMPT]: [
    { role: "user", content: LINES_PROMPT },
    {
      role: "assistant",
      content: `You have ${spellCount(LINES.length)} lines. ${capitalize(spellCount(IDLE_LINES.length))} of them, ${IDLE_LINE_NAMES}, have had no calls, texts or data in the last ${IDLE_DAYS} days. A plan with ${spellCount(SUGGESTED_PLAN.lines)} lines would cost ${formatWholeCurrency(MONTHLY_DIFFERENCE)} less each month, or ${formatWholeCurrency(YEARLY_DIFFERENCE)} over a year.\n\nI can send ${CARRIER.business} a request to move you to the smaller plan.`,
      panel: "unused-lines",
      source: CARRIER_SOURCE.name,
      suggestions: [LINES_SEND, LINES_KEEP],
    },
  ],
  [LINES_SEND]: [
    { role: "user", content: LINES_SEND },
    {
      role: "assistant",
      content: `Sent to ${CARRIER.business} as a request to move from ${spellCount(CURRENT_PLAN.lines)} lines to ${spellCount(SUGGESTED_PLAN.lines)}, dropping ${IDLE_LINE_NAMES}. Nothing on your account changes until they confirm.`,
      panel: "unused-lines",
      view: "requested",
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
