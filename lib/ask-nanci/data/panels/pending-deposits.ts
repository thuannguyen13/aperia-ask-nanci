export const BATCHES = [
  { day: "Friday",   date: "05/15/2026", batchId: "832628088", status: "In Transit", gross: 2650, fees: 110, net: 2540, isHeld: false },
  { day: "Saturday", date: "05/16/2026", batchId: "832628074", status: "In Transit", gross: 2430, fees: 110, net: 2320, isHeld: false },
  { day: "Sunday",   date: "05/17/2026", batchId: "832628067", status: "On Hold",    gross: 2780, fees: 145, net: 2635, isHeld: true  },
]

export const HELD_TXN = {
  counterparty: "Virtual Reality Solutions",
  date: "05/17/2026",
  paymentType: "Credit Card",
  amount: 2190,
  expectedClear: "05/20/2026",
}
