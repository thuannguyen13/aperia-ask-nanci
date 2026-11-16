// Carrier story 38, Cash Flow Warning. Its definition and its script, one file per story,
// so the stories are written side by side without touching each other.
//
// Nanci texts first. The owner asks what to do and sees three ways through payroll, and
// the first is the carrier's own: ABC Carrier moves this month's bill past payroll. Then
// cutting back, or working capital for the rest (flow 21's Business Loan Offer panel, as
// it is). Keeping a business open is how the carrier keeps it, and helping when money is
// tight is what the owner remembers.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER, nanciLink } from "../carrier"
import { CARRIER_CITES, CHASE_ACCOUNT } from "../sources"
import { isAwaitingAny, requestView, sentView } from "../panels/carrier-request"
import { formatWholeCurrency } from "../../../../components/shared/format"
import {
  DEPOSIT_DROP_PCT, PAYROLL, SHORTFALL, CUT_BACK_TOTAL, STILL_AFTER_CUTS, STILL_AFTER_BOTH, CARRIER_BILL, BILL_DATE_OPTION,
} from "../panels/cash-flow"

// Nanci opens the flow, so its key is an id rather than a prompt.
const CASH_KEY = "__cash-flow__"
const CASH_ASK = `What can I do before ${PAYROLL.day}?`
export const CASH_OFFER = "Show me the working capital offer"
const CASH_CUT = "I will cut back instead"
export const CASH_BILL = `Ask ${CARRIER.business} to move my bill`
// The owner opens the app on Nanci's text and asks the question it raises.
const CASH_WORRY = "Will I have enough for payroll?"
const PLAN_READ_MS = 5000

// The answers the plan's buttons wait on. Each button is live only while one of its
// answers is the last thing in the chat.
const CASH_PLAN_ANSWER = `${CARRIER.business} can move this month's ${formatWholeCurrency(CARRIER_BILL.amount)} bill to after payroll, and cutting back this week could cover about ${formatWholeCurrency(CUT_BACK_TOTAL)} more. Working capital could cover all of it. All three are under Before Payroll.`
const BILL_REVIEW_ANSWER = `Here is the request to ${CARRIER.business}. Check it, then send it.`
const BILL_SENT_ANSWER = `Sent to ${CARRIER.business} as a request to move this month's ${formatWholeCurrency(CARRIER_BILL.amount)} bill to ${CARRIER_BILL.movedTo}, reference ${BILL_DATE_OPTION.reference}. Nothing changes until they confirm. With the bill moved and the three cut-backs, you would be about ${formatWholeCurrency(STILL_AFTER_BOTH)} short, and working capital covers the rest.`

/** True while the plan's carrier button can be pressed: the plan answer is the last message. */
export const isAwaitingCashPlan = (messages: { role: string; content: string }[], chatState: string) => isAwaitingAny(messages, chatState, [CASH_PLAN_ANSWER])
/** True while the plan's offer button can be pressed: before or after the bill is moved. */
export const isAwaitingCashOffer = (messages: { role: string; content: string }[], chatState: string) => isAwaitingAny(messages, chatState, [CASH_PLAN_ANSWER, BILL_SENT_ANSWER])
/** True while the bill date request waits on its Send button. */
export const isAwaitingBillDate = (messages: { role: string; content: string }[], chatState: string) => isAwaitingAny(messages, chatState, [BILL_REVIEW_ANSWER])

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
  // The carrier's own lever comes first, so ?autoplay plays on into it, then the offer.
  followups: [CASH_ASK, CASH_BILL, BILL_DATE_OPTION.sendPrompt, CASH_OFFER, CASH_CUT],
  description: "Nanci texts the owner before payroll that deposits are running low. ABC Carrier moves its own bill past payroll, then cutting back or working capital covers the rest.",
}

export const CASH_FLOW_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [CASH_KEY]: [
    {
      role: "assistant",
      content: `Your deposits are running ${DEPOSIT_DROP_PCT}% below last month, and payroll of ${formatWholeCurrency(PAYROLL.amount)} is due ${PAYROLL.day}.`,
      textFrom: CARRIER.business,
      textLink: nanciLink("p5Vn1"),
      chatContent: `I checked your deposits against last month and against ${PAYROLL.day}'s payroll. Deposits are running ${DEPOSIT_DROP_PCT}% lower, and at this pace payroll of ${formatWholeCurrency(PAYROLL.amount)} will come up short.`,
      workTrail: {
        when: "06:45 AM CST",
        steps: [
          { text: `Checked deposits into ${CHASE_ACCOUNT.name}` },
          { text: "Compared them with the same weeks last month" },
          { text: `Projected your balance to ${PAYROLL.day}'s payroll` },
          { flag: true, text: `Flagged: about ${formatWholeCurrency(SHORTFALL)} short for payroll` },
        ],
      },
      source: CARRIER_CITES.cashFlow,
    },
    { role: "user", content: CASH_WORRY },
    {
      role: "assistant",
      content: `At this pace, not quite. You will be about ${formatWholeCurrency(SHORTFALL)} short when payroll of ${formatWholeCurrency(PAYROLL.amount)} goes out on ${PAYROLL.day}.`,
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
      suggestions: [CASH_BILL, CASH_OFFER, CASH_CUT],
    },
  ],
  // The carrier's lever: the owner reviews the request before it goes.
  [CASH_BILL]: [
    { role: "user", content: CASH_BILL },
    { role: "assistant", content: BILL_REVIEW_ANSWER, panel: "bill-date-request", view: requestView(BILL_DATE_OPTION.id), revealPanel: true },
  ],
  [BILL_DATE_OPTION.sendPrompt]: [
    { role: "user", content: BILL_DATE_OPTION.sendPrompt },
    {
      role: "assistant",
      content: BILL_SENT_ANSWER,
      panel: "bill-date-request",
      view: sentView(BILL_DATE_OPTION.id),
      sheetAction: {
        field: "Bill due date",
        fromValue: CARRIER_BILL.dueDate,
        toValue: CARRIER_BILL.movedToDate,
        status: "submitted",
        reference: BILL_DATE_OPTION.reference,
        sentTo: CARRIER.business,
        timestamp: "Today, 06:52 AM",
      },
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
      content: `Okay. Those three changes keep about ${formatWholeCurrency(CUT_BACK_TOTAL)} before ${PAYROLL.day}, which leaves about ${formatWholeCurrency(STILL_AFTER_CUTS)} to find, or ${formatWholeCurrency(STILL_AFTER_BOTH)} if ${CARRIER.business} moves your bill. I will check your deposits again on Wednesday and tell you where you stand.`,
    },
  ],
}
