// Aperia Risk — Assignment Management destination (Figma "4. Assignment Management").
// ponytail: illustrative demo data, not a live feed.

export const AM_INTEGRATION = {
  name: "Mastercard Brighterion",
  status: "Connected",
  lastSync: "Today 06:14 AM",
  scored: "1,284,592 transactions scored in last 24h",
}

// Distinct Merchant Summary — four stat cards (count + dollar amount).
export const AM_SUMMARY: { label: string; count: string; amount: string }[] = [
  { label: "Eligible",  count: "90,669", amount: "$107,912,116.30" },
  { label: "Alerted",   count: "364",    amount: "$18,082,415.58" },
  { label: "Worked",    count: "0",      amount: "$0.00" },
  { label: "Remaining", count: "364",    amount: "$18,082,415.58" },
]

export type AssignmentStatus = "Active" | "Expired"

export interface Assignment {
  name: string
  system?: boolean // shows a "System" badge next to the name
  type: string
  alerted: number
  status: AssignmentStatus
  lastProcessed: string
}

export const ASSIGNMENTS: Assignment[] = [
  { name: "MC Watch", system: true, type: "DQ", alerted: 67, status: "Active",  lastProcessed: "05/06/2026" },
  { name: "Esquire - Phase 2 Parameters - Auths - Detect Q", type: "DQ", alerted: 7,  status: "Active",  lastProcessed: "05/06/2026" },
  { name: "Esquire - Phase 2 Parameters - Detect Q",         type: "DQ", alerted: 37, status: "Expired", lastProcessed: "05/06/2026" },
  { name: "High Risk Detection Queue",                       type: "DQ", alerted: 25, status: "Active",  lastProcessed: "05/06/2026" },
  { name: "High Risk Detection Queue - By MCC",              type: "DQ", alerted: 3,  status: "Active",  lastProcessed: "05/06/2026" },
  { name: "Low Risk Detection Queue",                        type: "DQ", alerted: 12, status: "Active",  lastProcessed: "05/06/2026" },
  { name: "Low Risk Detection Queue - By MCC - Auths",       type: "DQ", alerted: 3,  status: "Active",  lastProcessed: "05/06/2026" },
  { name: "Moderate Risk Detection Queue",                   type: "DQ", alerted: 19, status: "Expired", lastProcessed: "05/06/2026" },
  { name: "Moderate Risk Detection Queue - By MCC - Auths",  type: "DQ", alerted: 0,  status: "Active",  lastProcessed: "05/06/2026" },
  { name: "Unacceptable Risk Detection Queue",              type: "DQ", alerted: 10, status: "Expired", lastProcessed: "05/06/2026" },
]

export const AM_TOTAL = 28 // "Showing 10 of 28"
