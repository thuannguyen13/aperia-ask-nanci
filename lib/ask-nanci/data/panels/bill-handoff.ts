// Data for carrier story 38, Bill Question. Ask Nanci can read the charge but not the
// reason for it, so the panel is the summary a specialist picks up, not a bill lookup.
import { CARRIER } from "../carrier"

export const BILL_CHARGE = {
  amount: 45,
  label: "One-time fee",
  added: "the 3rd",
  appliesTo: "The account, not a line",
  seenBefore: "First in 12 months",
}

export const HANDOFF_SUMMARY = {
  asked: "Why a charge on this month's bill looks wrong.",
  found: `A ${BILL_CHARGE.label.toLowerCase()} of $${BILL_CHARGE.amount}, added on ${BILL_CHARGE.added}. It applies to the account, not a line, and is the first in 12 months.`,
  open: "Why it was added, and whether it can be credited.",
}

// The call back sits after the lunch rush (busiest-times.ts: noon to 1 is the peak and
// the afternoon is the lull), so the owner is free to take it.
export const HANDOFF_PATHS = [
  { id: "call", label: "Call back today", detail: "2 to 4 PM, after your lunch rush" },
  { id: "message", label: "Reply by message", detail: "Within one business day" },
] as const

export const HANDOFF_REQUEST = {
  reference: "BQ-4817",
  timestamp: "Today, 10:42 AM",
  sentTo: CARRIER.business,
  callWindow: "today between 2 and 4 PM",
}
