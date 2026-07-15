export const BATCHES = [
  { day: "Friday",   date: "05/15/2026", batchId: "161", status: "In Transit", txns: 84, gross: 2650, fees: 110, net: 2540, expected: "05/18/2026", isHeld: false },
  { day: "Saturday", date: "05/16/2026", batchId: "162", status: "In Transit", txns: 72, gross: 2430, fees: 110, net: 2320, expected: "05/18/2026", isHeld: false },
  { day: "Sunday",   date: "05/17/2026", batchId: "163", status: "On Hold",    txns: 91, gross: 2780, fees: 145, net: 2635, expected: "05/20/2026", isHeld: true  },
]

// Cash lands directly in the bank account — only the bank connection knows it,
// the processor never sees it. Already posted, unlike the still-settling card batches.
export const DEPOSIT_ACCOUNT_LAST4 = "4432"

export const CASH_DEPOSITS = [
  { date: "05/15/2026", source: "Branch deposit", amount: 520, status: "Posted" },
  { date: "05/16/2026", source: "Branch deposit", amount: 420, status: "Posted" },
]

export const HELD_TXN = {
  counterparty: "Virtual Reality Solutions",
  date: "05/17/2026",
  paymentType: "Credit Card",
  amount: 2190,
  expectedClear: "05/20/2026",
}
