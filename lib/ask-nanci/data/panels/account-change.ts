export const CURRENT_ACCOUNT = { last4: "4432" }
export const NEW_ACCOUNT = { bank: "First National", last4: "7715" }
export const CONFIRMATION_EMAIL = "teresawalker@example.com"
export const CONFIRMED_AT = "3:40 PM"
export const REQUEST_REFERENCE = "DA-2201"
export const SENT_TO = "Deposit Operations team"

// Submission drawer (ChangeAuditSheet) shown after the account change is confirmed.
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
