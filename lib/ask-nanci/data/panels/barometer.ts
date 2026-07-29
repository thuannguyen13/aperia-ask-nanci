export const STATUS_ROWS = [
  { label: "Alerted",          count: 14, amount: "$380,000.00" },
  { label: "Ready to Work",    count: 11, amount: "$290,000.00" },
  { label: "Work In Progress", count: 3,  amount: "$90,000.00"  },
  { label: "Worked",           count: 0,  amount: "$0.00"       },
  { label: "Requeue",          count: 2,  amount: "$52,000.00"  },
]

// The status rows are the breakdown of the eligible population, so the total is the
// eligible count — derived, because the two used to be edited apart and drifted (14 vs 30).
export const eligibleMerchantCount = STATUS_ROWS.reduce((total, row) => total + row.count, 0)

// The one assignment both the Detection Queue and its Barometer Report describe.
export const ASSIGNMENT = {
  name: "High Velocity Watch",
  date: "05/24/2026",
  generalInfo: [
    { label: "Assignment Name",         value: "High Velocity Watch" },
    { label: "Assignment Type",         value: "DQ" },
    { label: "Eligible Merchant Count", value: String(eligibleMerchantCount) },
    { label: "Percent Worked",          value: "0%" },
  ],
}

export const MERCHANT_ROWS = [
  { id: "00078166655", name: "Coastal Merchant Solutions",  score: 89, status: "Alerted",          amount: "$42,000.00",  delta: "+45" },
  { id: "00041293847", name: "Pacific Trade Group",         score: 83, status: "Ready to Work",    amount: "$28,500.00",  delta: "+18" },
  { id: "00065432198", name: "Harbor Bay Distributors",     score: 81, status: "Ready to Work",    amount: "$19,200.00",  delta: "+12" },
  { id: "00029384756", name: "Summit Retail Partners",      score: 74, status: "Ready to Work",    amount: "$33,800.00",  delta: "+8"  },
  { id: "00093847561", name: "Westbrook Commerce LLC",      score: 71, status: "Work In Progress", amount: "$21,600.00",  delta: "+5"  },
  { id: "00047382910", name: "Blue Water Imports",          score: 68, status: "Alerted",          amount: "$15,400.00",  delta: "+22" },
  { id: "00018273645", name: "Inland Valley Merchants",     score: 65, status: "Ready to Work",    amount: "$11,700.00",  delta: "+3"  },
  { id: "00056473829", name: "Cascade Trading Co.",         score: 62, status: "Work In Progress", amount: "$8,900.00",   delta: "+9"  },
  { id: "00072938471", name: "Sunrise Enterprise Group",    score: 58, status: "Alerted",          amount: "$27,300.00",  delta: "+31" },
  { id: "00034829173", name: "Ridgeline Merchant Services", score: 55, status: "Ready to Work",    amount: "$9,100.00",   delta: "+7"  },
]
