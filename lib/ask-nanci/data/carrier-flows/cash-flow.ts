// Carrier story 38, Cash Flow Warning. Its definition and its script, one file per story,
// so the stories are written side by side without touching each other.
//
// Nanci speaks first, in the app: nothing is down and payroll is days away, so opening the
// app is the honest channel. The owner asks what to do, sees what cutting back covers and
// what working capital covers, and either takes the Business Loan Offer (flow 21's panel,
// as it is) or keeps the changes. Keeping a business open is how the carrier keeps it.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER_CITES } from "../sources"
import { isAwaitingTurn } from "../../is-awaiting-turn"
import { formatWholeCurrency } from "../../../../components/shared/format"
import { DEPOSIT_DROP_PCT, PAYROLL, SHORTFALL, CUT_BACK_TOTAL, STILL_TO_FIND } from "../panels/cash-flow"

// Nanci opens the flow, so its key is an id rather than a prompt.
const CASH_KEY = "__cash-flow__"
const CASH_ASK = `What can I do before ${PAYROLL.day}?`
export const CASH_OFFER = "Show me the working capital offer"
const CASH_CUT = "I will cut back instead"
const PLAN_READ_MS = 5000

// The answer the plan waits on. The panel's offer button is live only while this is the
// last thing in the chat.
const CASH_PLAN_ANSWER = `Cutting back this week could cover about ${formatWholeCurrency(CUT_BACK_TOTAL)} of it. Working capital could cover all of it. Both are under Before Payroll.`

/** True while story 38 is parked on its plan: idle, with the plan answer as the last message. */
export const isAwaitingCashPlan = (messages: { role: string; content: string }[], chatState: string) => isAwaitingTurn(messages, chatState, CASH_PLAN_ANSWER)

export const CASH_FLOW_FLOW: FlowDef = {
  num: 38,
  section: "merchant",
  title: "Cash Flow Warning",
  badge: "Involuntary Churn",
  key: CASH_KEY,
  proactive: true,
  slug: "38",
  scope: "carrier",
  churn: { cause: "Business closing", metric: "Churn" },
  // The offer comes first, so ?autoplay plays on into it.
  followups: [CASH_ASK, CASH_OFFER, CASH_CUT],
  description: "Nanci warns before payroll that deposits are running low, lays out what cutting back covers, and offers working capital for the rest.",
}

export const CASH_FLOW_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [CASH_KEY]: [
    {
      role: "assistant",
      content: `Your deposits are running ${DEPOSIT_DROP_PCT}% below last month, and payroll of ${formatWholeCurrency(PAYROLL.amount)} is due ${PAYROLL.day}. At this pace you will be about ${formatWholeCurrency(SHORTFALL)} short.`,
      panel: "cash-flow",
      source: CARRIER_CITES.cashFlow,
      suggestions: [CASH_ASK],
    },
  ],
  [CASH_ASK]: [
    { role: "user", content: CASH_ASK },
    {
      role: "assistant",
      content: CASH_PLAN_ANSWER,
      panel: "cash-plan",
      // The owner chooses in the panel, so on a phone it comes up with the answer.
      revealPanel: true,
      suggestions: [CASH_OFFER, CASH_CUT],
    },
  ],
  // The offer opens flow 21's panel in place of the plan. It ends on the application.
  // Under ?autoplay the plan stays up long enough to read before the offer replaces it.
  [CASH_OFFER]: [
    { role: "user", content: CASH_OFFER, closePanel: "cash-plan", panel: "business-loan-offer", pauseBefore: PLAN_READ_MS },
  ],
  [CASH_CUT]: [
    { role: "user", content: CASH_CUT },
    {
      role: "assistant",
      content: `Okay. Those three changes keep about ${formatWholeCurrency(CUT_BACK_TOTAL)} before ${PAYROLL.day}, which leaves about ${formatWholeCurrency(STILL_TO_FIND)} to find. I will check your deposits again on Wednesday and tell you where you stand.`,
    },
  ],
}
