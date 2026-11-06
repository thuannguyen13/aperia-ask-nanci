export const CURRENT_ACCOUNT = { last4: "4432" }
// `routing` and `number` are what the panel types in under ?autoplay. The number ends
// in `last4`, so the confirm step and the audit sheet show the account that was typed.
export const NEW_ACCOUNT = { bank: "First National", last4: "7715", routing: "074908594", number: "3820417715" }
export const CONFIRMATION_EMAIL = "teresawalker@example.com"
const CONFIRMED_AT = "3:40 PM"
const REQUEST_REFERENCE = "DA-2201"
const SENT_TO = "Deposit Operations team"

// Submission summary (ChangeAuditDialog) shown after the account change is confirmed.
export const ACCOUNT_CHANGE_SHEET: import("@/lib/ask-nanci/types").SheetActionData = {
  field: "Deposit Account",
  fromValue: `************${CURRENT_ACCOUNT.last4}`,
  toValue: `************${NEW_ACCOUNT.last4}`,
  timestamp: `Today, ${CONFIRMED_AT}`, // matches the chat line "Request submitted at 3:40 PM"
  status: "submitted",
  reference: REQUEST_REFERENCE,
  sentTo: SENT_TO,
  iconKind: "bank",
}
