// Aperia Risk — Assignment Management destination (Figma "4. Assignment Management").
// ponytail: the eligible count and the scored-transaction total are REAL portfolio
// sizes summed across the four scored client portfolios (ESQR 4,681 / Maverick
// 4,606 / Clearent 1,586 / Nuvei 1,251 chargeback merchants; 72,985 / 41,062 /
// 53,156 / 53,771 MC-scored transactions, Sept–Dec 2025 — see
// wiki/aperia-risk/demo-data-spec.md). The dollar amounts and the per-assignment
// alert counts below are still illustrative; the source data carried no dollars.

export const AM_INTEGRATION = {
  name: "Mastercard Brighterion",
  status: "Connected",
  lastSync: "Today 06:14 AM",
  scored: "220,974 transactions scored across 4 portfolios (Sept–Dec 2025)",
}

// Distinct Merchant Summary — four stat cards (count + dollar amount).
export const AM_SUMMARY: { label: string; count: string; amount: string }[] = [
  { label: "Eligible",  count: "12,124", amount: "$107,912,116.30" },
  { label: "Alerted",   count: "364",    amount: "$18,082,415.58" },
  { label: "Worked",    count: "0",      amount: "$0.00" },
  { label: "Remaining", count: "364",    amount: "$18,082,415.58" },
]

export type AssignmentStatus = "Active" | "Expired"

export interface Assignment {
  name: string
  system?: boolean // shows a "System" badge next to the name
  type: string
  alerted: number | null // null → "—", a brand-new assignment that hasn't run yet
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
