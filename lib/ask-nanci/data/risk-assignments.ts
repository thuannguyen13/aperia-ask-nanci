// Aperia Risk — the assignment registry, and the Assignment Management destination
// (Figma "4. Assignment Management").
//
// ponytail: generated demo content. Portfolio sizes are modeled on real client
// magnitudes (thousands of chargeback merchants, tens of thousands of scored
// transactions per portfolio) but every value here is invented; no client file is
// quoted. Dollar amounts are illustrative.
//
// ── Why this file owns identity and nothing else ────────────────────────────
// Assignments used to be named four different ways across four files — "MC Watch"
// here, "MC Watchlist (system)" on the dashboard bars, "MC Watchlist (system)" again
// in the re-alert table, and nothing at all in the queue data — and two assignments
// (MC Velocity, Authorizations) existed only in a chart, with no row behind them. So
// no chart could link to the assignment it was describing.
//
// Now: this list carries identity (id, names, type, status) and NOT counts. Every
// count lives in the metric table that measures it, keyed by `id`:
//   • today's alerts        → ALERT_VOLUME       (risk-dashboard.ts)
//   • period re-alert rates → REALERT_ROWS       (risk-dashboard.ts)
//   • standing queue state  → DETECTION_QUEUES   (risk-detection-queue.ts)
// That is what removed the old contradiction where this file claimed the Esquire
// Auths queue had alerted 7 merchants while the dashboard chart plotted 357 for it.

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
  id: string
  /** Full name, as the Assignment Management list and the queue cards show it. */
  name: string
  /**
   * Chart-width label. The dashboard bars and the re-alert table have a ~200px
   * column, so they render this instead of truncating the full name mid-word — which
   * is how "Phase 2 Parameters - Auths…" ended up looking like a different
   * assignment from the one the queue card names.
   */
  short: string
  system?: boolean // shows a "System" badge next to the name
  type: string
  status: AssignmentStatus
  lastProcessed: string
  /**
   * A just-created assignment that has not run yet. Its alert count renders "—"
   * rather than 0 — no alerts *yet* is a different claim from no alerts *today*, and
   * a fresh 0 beside an Active badge reads as a broken queue.
   */
  neverRun?: boolean
}

export const ASSIGNMENTS: Assignment[] = [
  { id: "mc-watch",          name: "MC Watch",                                        short: "MC Watch (system)",        system: true, type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  // Adopted from the dashboard charts, which plotted both of these with no assignment
  // behind them. MC Velocity in particular drives one of Nanci's three takes.
  { id: "mc-velocity",       name: "MC Velocity",                                     short: "MC Velocity (system)",     system: true, type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  { id: "mc-divergence",     name: "MC Divergence",                                   short: "MC Divergence (system)",   system: true, type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  { id: "esqr-phase2-auths", name: "Phase 2 Parameters - Auths - Detect Q",           short: "Phase 2 - Auths",          type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  // Was Expired while still carrying alerts on the dashboard's "Phase 2 - Auths
  // Detect Q" bar. A queue that alerted today is running, so it reads Active.
  { id: "esqr-phase2",       name: "Phase 2 Parameters - Detect Q",                   short: "Phase 2",                  type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  { id: "high-risk",         name: "High Risk Detection Queue",                       short: "High Risk DQ",             type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  { id: "high-risk-mcc",     name: "High Risk Detection Queue - By MCC",              short: "High Risk DQ - By MCC",    type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  { id: "low-risk",          name: "Low Risk Detection Queue",                        short: "Low Risk DQ",              type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  { id: "low-risk-mcc",      name: "Low Risk Detection Queue - By MCC - Auths",       short: "Low Risk DQ - By MCC",     type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  { id: "moderate-risk",     name: "Moderate Risk Detection Queue",                   short: "Moderate Risk DQ",         type: "DQ", status: "Expired", lastProcessed: "05/06/2026" },
  { id: "moderate-risk-mcc", name: "Moderate Risk Detection Queue - By MCC - Auths",  short: "Moderate Risk DQ - By MCC", type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  { id: "unacceptable-risk", name: "Unacceptable Risk Detection Queue",               short: "Unacceptable Risk DQ",     type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
  // Adopted from DETECTION_QUEUES, which rendered a card for it with no registry row.
  { id: "authorizations",    name: "Authorizations Assignment",                       short: "Authorizations",           type: "DQ", status: "Active",  lastProcessed: "05/06/2026" },
]

export const findAssignment = (id: string) => ASSIGNMENTS.find((a) => a.id === id)

export const AM_TOTAL = 28 // "Showing N of 28"
