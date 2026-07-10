export const PAYOUT_DISCREPANCY = {
  batchId: "BT-05122026-01",
  batchDate: "05/12/2026",
  transactions: 89,
  grossSales: 3528.0,
  fees: 128.0,
  destinationLast4: "4432",
  netExpected: 3400.0,
  received: 2800.0,
  short: 600.0,
}

export const ESCALATION_PATHS = [
  { id: "call", label: "Book a Call", detail: "Next available slot: today at 4:30 PM" },
  { id: "ticket", label: "File a Ticket", detail: "Settlement team responds within 4 business hours" },
] as const

export const ESCALATION_BOOKING = {
  reference: "SR-2205",
  bookedFor: "4:30 PM today",
}
