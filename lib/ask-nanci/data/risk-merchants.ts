// Aperia Risk — Barometer Report merchant list + Risk Report detail.
// ponytail: illustrative demo data for the detection-queue narrative, not a live feed.

type RiskLevel = "High" | "Medium" | "Low"
export type WorkStatus = "mark-work" | "wip" | "worked"

export interface RiskMerchant {
  id: string
  name: string
  alertTag: number // red triangle count
  listTag: number // yellow list count
  vw: number // VisionWeb score /100
  mc: number // MC/Brighterion score /1000
  risk: RiskLevel
  status: WorkStatus
}

// Merchant List shown on the Barometer Report (Figma order = descending VW score).
export const RISK_MERCHANTS: RiskMerchant[] = [
  { id: "regency",   name: "REGENCY FURNITURE MANCHESTER",   alertTag: 3, listTag: 4, vw: 89, mc: 940, risk: "High",   status: "mark-work" },
  { id: "pbbiller",  name: "PBBILLER.COM",                   alertTag: 3, listTag: 2, vw: 83, mc: 920, risk: "High",   status: "wip" },
  { id: "ashley",    name: "ASHLEY HOMESTORE - MECHANICSBU", alertTag: 4, listTag: 1, vw: 81, mc: 830, risk: "High",   status: "worked" },
  { id: "jbhealth",  name: "JB HEALTH SHOP",                 alertTag: 3, listTag: 4, vw: 74, mc: 760, risk: "Medium", status: "wip" },
  { id: "jbvitality",name: "JB VITALITY BEAUTY",             alertTag: 8, listTag: 3, vw: 71, mc: 720, risk: "Medium", status: "worked" },
  { id: "icupid",    name: "ICUPID.COM",                     alertTag: 2, listTag: 4, vw: 68, mc: 640, risk: "Medium", status: "mark-work" },
  { id: "fitnesshub",name: "FITNESSHUB.CLUB",                alertTag: 3, listTag: 1, vw: 65, mc: 640, risk: "Medium", status: "mark-work" },
  { id: "powerpth",  name: "POWERPTH.COM",                   alertTag: 4, listTag: 4, vw: 62, mc: 600, risk: "Medium", status: "mark-work" },
  { id: "probiller", name: "PROBILLER.COM",                  alertTag: 1, listTag: 3, vw: 59, mc: 610, risk: "Medium", status: "mark-work" },
]

export const findMerchant = (id: string) => RISK_MERCHANTS.find((m) => m.id === id)

// Risk Report detail. Fully specified for Regency (the drill-in from the Figma);
// other merchants render from their list row + these shared defaults.
interface RiskReportDetail {
  mid: string
  violations: number
  inQueues: number
  vwDelta30: string
  vwParams: number
  mcDelta7: string
  mcDelta30: string
  mcParams: number
  mcTxns: string
  mccPercentile: string
  lastUpdate: string
  profile: { status: string; profile: string; multiWatch: string; classification: string }
  account: { lastBatch: string; lastStatement: string; sicMcc: string; phone: string; address: string }
}

export const RISK_REPORT_DETAILS: Record<string, RiskReportDetail> = {
  regency: {
    mid: "4783790283001691",
    violations: 3,
    inQueues: 4,
    vwDelta30: "+28",
    vwParams: 3,
    mcDelta7: "+180",
    mcDelta30: "+410",
    mcParams: 6,
    mcTxns: "1,247 Transactions last 30 Days",
    mccPercentile: "MCC 6051 Top",
    lastUpdate: "05/03/2026 06:14 AM",
    profile: { status: "In Review", profile: "No-Profile", multiWatch: "ISO", classification: "—" },
    account: { lastBatch: "05/12/2026", lastStatement: "05/12/2026", sicMcc: "5099", phone: "(972) 392-2882", address: "PAPILLION, FL 010853016" },
  },
}

// Fallback detail so any merchant row drills into a plausible report.
export const DEFAULT_RISK_DETAIL: RiskReportDetail = {
  mid: "4783790283000000",
  violations: 2,
  inQueues: 2,
  vwDelta30: "+12",
  vwParams: 2,
  mcDelta7: "+40",
  mcDelta30: "+120",
  mcParams: 4,
  mcTxns: "820 Transactions last 30 Days",
  mccPercentile: "MCC 5999 Top",
  lastUpdate: "05/03/2026 06:14 AM",
  profile: { status: "In Review", profile: "No-Profile", multiWatch: "ISO", classification: "—" },
  account: { lastBatch: "05/12/2026", lastStatement: "05/12/2026", sicMcc: "5999", phone: "(972) 000-0000", address: "PAPILLION, FL 010853016" },
}

// Transaction Volume Analysis rows (illustrative — mostly zero, matching the Figma).
export const TXN_VOLUME_ROWS = [
  "Today", "7-Day", "30-Day", "Monthly Average", "Contract Expected", "June 2026", "May 2026", "April 2026",
]

// Parameter Violation Details — opened from the "N Violations" pill on the Risk Report.
export interface ViolationRow {
  pNum: string; wk: string; alertOn: string; assignment: string; parameter: string
  reAlert: string; paramIndicator: string; actualIndicator: string
  paramThreshold: string; actualThreshold: string; disposition: string
  workedOn: string; userName: string; fileType: string
}

export const RISK_VIOLATION_CYCLE = "06/25/2026"

const ASSIGNMENT = "Esquire - Phase 2 Parameters - Auths - Detect Q"
export const VIOLATION_ROWS: ViolationRow[] = [
  { pNum: "P-MC1", wk: "Ready to Work", alertOn: "05/03/2026 10:10:00 AM", assignment: ASSIGNMENT, parameter: "Score Threshold", reAlert: "No", paramIndicator: "2", actualIndicator: "2", paramThreshold: "N/A", actualThreshold: "N/A", disposition: "-", workedOn: "-", userName: "-", fileType: "Transaction" },
  { pNum: "P-MC2", wk: "Ready to Work", alertOn: "05/03/2026 06:25:30 AM", assignment: ASSIGNMENT, parameter: "Score Velocity", reAlert: "No", paramIndicator: "1", actualIndicator: "1", paramThreshold: "N/A", actualThreshold: "N/A", disposition: "-", workedOn: "-", userName: "-", fileType: "Transaction" },
  { pNum: "P-MC3", wk: "Ready to Work", alertOn: "05/03/2026 07:14:30 AM", assignment: ASSIGNMENT, parameter: "High-MC Txn %", reAlert: "No", paramIndicator: "2", actualIndicator: "2", paramThreshold: "N/A", actualThreshold: "N/A", disposition: "-", workedOn: "-", userName: "-", fileType: "Transaction" },
]

// Merchant Notes — shown in the Risk Report's "Notes and Case History" tab.
// The Add Notes popover appends new entries to this list.
export interface NoteEntry { author: string; initials: string; timestamp: string; source: string; body: string }
export const MERCHANT_NOTES_SEED: NoteEntry[] = [
  {
    author: "Teresa Walker",
    initials: "TW",
    timestamp: "06/22/2026 02:12:29 PM",
    source: "Aperia Risk",
    body: "MC Score 940/1000 (High), +410 (30d), top percentile for MCC 6051 across 1,247 txns. Holding funds pending review given velocity and peer-percentile severity.",
  },
]

// Cross-Queue Presence — opened from the "In N Queues" badge on the Risk Report.
interface QueueRow { name: string; status: string; alertedAt: string }
export const CROSS_QUEUE_ROWS: QueueRow[] = [
  { name: "DQ-Cash Advance", status: "Ready to Work", alertedAt: "alerted 05/03/2026 06:14 AM" },
  { name: "Phase 2 Parameters", status: "Ready to Work", alertedAt: "alerted 05/03/2026 06:14 AM" },
  { name: "High Risk DQ — By MCC", status: "Ready to Work", alertedAt: "alerted 05/03/2026 06:14 AM" },
  { name: "⚹ MC Watch (system)", status: "Ready to Work", alertedAt: "alerted 05/03/2026 06:14 AM" },
]
