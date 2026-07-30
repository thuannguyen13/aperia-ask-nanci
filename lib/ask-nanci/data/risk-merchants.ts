// Aperia Risk — Barometer Report merchant list + Risk Report detail.
//
// ponytail: MIDs, MCC codes and MC scores are REAL values from the PO's client
// analyses (Sept–Dec 2025, see wiki/aperia-risk/demo-data-spec.md). Merchant
// business names, addresses and phone numbers are invented — the source data
// never carried them. See REAL_DATA_NOTICE below before this leaves the building.
//
// MC scores are on the 0–1000 scale (the spec's MinScore/MaxScore). Do not paste
// `prediction_caliberated` values in here — that field is 0–100 and is a
// calibrated probability, not this score.

/**
 * Every real client identifier that reaches the screen, in one place, so
 * anonymizing before an external demo is a single-file edit.
 */
export const REAL_DATA_NOTICE =
  "Real merchant IDs from Clearent, Woodforest and ESQR portfolios (Sept–Dec 2025). Anonymize before external use."

export type RiskLevel = "High" | "Medium" | "Low"
export type WorkStatus = "mark-work" | "wip" | "worked"

/**
 * The band one model's score falls in, as a share of that model's own scale.
 * The Risk Report badges each score card with this rather than the merchant's
 * combined `risk`, so the two cards are free to disagree — which, in this data,
 * they routinely do (Meridian is VW High / MC Low, Cascade is the reverse).
 */
export const scoreLevel = (score: number, scale: 100 | 1000): RiskLevel =>
  score / scale >= 0.7 ? "High" : score / scale >= 0.4 ? "Medium" : "Low"

export interface RiskMerchant {
  id: string
  name: string
  /** Real MID. 16-digit = Clearent/ESQR, 12-digit = Woodforest. */
  mid: string
  mcc: string
  mccDesc: string
  alertTag: number // red triangle count
  listTag: number // yellow list count
  vw: number // VisionWeb score /100
  mc: number // MC/Brighterion score /1000
  risk: RiskLevel
  status: WorkStatus
}

// Merchant List shown on the Barometer Report (Figma order = descending VW score).
// The two models deliberately disagree down this list: Meridian is a VisionWeb-only
// catch, Cascade is a Mastercard-only catch and ranks last on VW. That divergence is
// the argument for showing both scores side by side, and it is what the real data says.
export const RISK_MERCHANTS: RiskMerchant[] = [
  { id: "regency",    name: "REGENCY FURNITURE MANCHESTER",   mid: "6588000002563435", mcc: "5712", mccDesc: "Furniture, Home Furnishings", alertTag: 3, listTag: 4, vw: 89, mc: 737.33, risk: "High",   status: "mark-work" },
  { id: "meridian",   name: "MERIDIAN DENTAL GROUP",          mid: "6588000002811586", mcc: "8021", mccDesc: "Dentists, Orthodontists",     alertTag: 4, listTag: 2, vw: 87, mc: 95.99,  risk: "High",   status: "wip" },
  { id: "pbbiller",   name: "PBBILLER.COM",                   mid: "6588000002907459", mcc: "5967", mccDesc: "Direct Marketing — Inbound",  alertTag: 3, listTag: 2, vw: 76, mc: 83.69,  risk: "Medium", status: "mark-work" },
  { id: "ashley",     name: "ASHLEY HOMESTORE - MECHANICSBU", mid: "9180675172134302", mcc: "5712", mccDesc: "Furniture, Home Furnishings", alertTag: 4, listTag: 1, vw: 74, mc: 701.05, risk: "High",   status: "worked" },
  { id: "jbhealth",   name: "JB HEALTH SHOP",                 mid: "460100000172",     mcc: "5912", mccDesc: "Drug Stores, Pharmacies",     alertTag: 3, listTag: 4, vw: 71, mc: 339.64, risk: "Medium", status: "wip" },
  { id: "jbvitality", name: "JB VITALITY BEAUTY",             mid: "460100003142",     mcc: "5977", mccDesc: "Cosmetic Stores",             alertTag: 8, listTag: 3, vw: 68, mc: 329.52, risk: "Medium", status: "worked" },
  { id: "cascade",    name: "CASCADE AUTO PARTS WAREHOUSE",   mid: "6588000002940328", mcc: "5533", mccDesc: "Automotive Parts, Accessories", alertTag: 2, listTag: 4, vw: 62, mc: 711.08, risk: "High",  status: "mark-work" },
]

export const findMerchant = (id: string) => RISK_MERCHANTS.find((m) => m.id === id)

// Risk Report detail. The MID and MCC live on the merchant row above, so they are
// not repeated here — one source each.
interface RiskReportDetail {
  violations: number
  inQueues: number
  vwDelta30: string
  vwParams: number
  mcDelta7: string
  mcDelta30: string
  mcParams: number
  mcTxns: string
  /** Rendered as "MCC {merchant.mcc} · {this}". */
  mccPercentile: string
  lastUpdate: string
  profile: { status: string; profile: string; multiWatch: string; classification: string }
  account: { lastBatch: string; lastStatement: string; phone: string; address: string }
}

export const RISK_REPORT_DETAILS: Record<string, RiskReportDetail> = {
  regency: {
    violations: 3,
    inQueues: 4,
    vwDelta30: "+28",
    vwParams: 3,
    mcDelta7: "+180",
    mcDelta30: "+410",
    mcParams: 6,
    mcTxns: "1,247 Transactions last 30 Days",
    mccPercentile: "Top 2% of peers",
    lastUpdate: "05/03/2026 06:14 AM",
    profile: { status: "In Review", profile: "No-Profile", multiWatch: "ISO", classification: "—" },
    account: { lastBatch: "05/12/2026", lastStatement: "05/12/2026", phone: "(972) 392-2882", address: "PAPILLION, FL 010853016" },
  },
  // The two bust-out case studies. Their score shapes are the point: Meridian is
  // near-zero on MC and critical on VW, Cascade is the reverse.
  meridian: {
    violations: 4,
    inQueues: 3,
    vwDelta30: "+34",
    vwParams: 4,
    mcDelta7: "+0",
    mcDelta30: "+96",
    mcParams: 1,
    mcTxns: "318 Transactions last 30 Days",
    mccPercentile: "Bottom 40% of peers",
    lastUpdate: "05/03/2026 06:14 AM",
    profile: { status: "Terminated", profile: "No-Profile", multiWatch: "ISO", classification: "Bust-out" },
    account: { lastBatch: "12/19/2025", lastStatement: "12/19/2025", phone: "(972) 771-4408", address: "MESQUITE, TX 751490112" },
  },
  cascade: {
    violations: 2,
    inQueues: 2,
    vwDelta30: "+4",
    vwParams: 1,
    mcDelta7: "+240",
    mcDelta30: "+611",
    mcParams: 5,
    mcTxns: "902 Transactions last 30 Days",
    mccPercentile: "Top 8% of peers",
    lastUpdate: "05/03/2026 06:14 AM",
    profile: { status: "Terminated", profile: "No-Profile", multiWatch: "ISO", classification: "Bust-out" },
    account: { lastBatch: "11/07/2025", lastStatement: "11/07/2025", phone: "(918) 244-6035", address: "BROKEN ARROW, OK 740121884" },
  },
}

// Fallback detail so any merchant row drills into a plausible report.
export const DEFAULT_RISK_DETAIL: RiskReportDetail = {
  violations: 2,
  inQueues: 2,
  vwDelta30: "+12",
  vwParams: 2,
  mcDelta7: "+40",
  mcDelta30: "+120",
  mcParams: 4,
  mcTxns: "820 Transactions last 30 Days",
  mccPercentile: "Top 25% of peers",
  lastUpdate: "05/03/2026 06:14 AM",
  profile: { status: "In Review", profile: "No-Profile", multiWatch: "ISO", classification: "—" },
  account: { lastBatch: "05/12/2026", lastStatement: "05/12/2026", phone: "(972) 000-0000", address: "PAPILLION, FL 010853016" },
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
// Keyed by merchant so the two bust-out case studies carry their own history; the
// Add Notes popover prepends to whichever list the open merchant resolved to.
export interface NoteEntry { author: string; initials: string; timestamp: string; source: string; body: string }

const TW = { author: "Teresa Walker", initials: "TW", source: "Aperia Risk" }

export const MERCHANT_NOTES_SEED: Record<string, NoteEntry[]> = {
  regency: [
    { ...TW, timestamp: "06/22/2026 02:12:29 PM", body: "MC Score 737.33/1000 (High), +410 (30d), top 2% for MCC 5712 across 1,247 txns. Holding funds pending review given velocity and peer-percentile severity. Exposure $14,896.06." },
  ],
  meridian: [
    { ...TW, timestamp: "06/22/2026 11:04:51 AM", body: "Retro review (Sept–Dec 2025 analysis): VisionWeb alerted this merchant 98 days before it closed. Mastercard only scored it on the day of closure, so the MC score here reads 95.99 — near the bottom of its MCC. A Mastercard-only detection strategy would have missed this bust-out entirely." },
  ],
  cascade: [
    { ...TW, timestamp: "06/22/2026 10:47:16 AM", body: "Retro review (Sept–Dec 2025 analysis): Mastercard flagged this merchant 5 days before VisionWeb did, at MC 711.08 while VW still had it at 62. The inverse of Meridian — neither system consistently leads, which is why both scores sit side by side on this report." },
  ],
}

export const DEFAULT_MERCHANT_NOTES: NoteEntry[] = [
  { ...TW, timestamp: "06/22/2026 09:31:02 AM", body: "Reviewed against MC and VW scores. No disposition set yet." },
]

// Cross-Queue Presence — opened from the "In N Queues" badge on the Risk Report.
interface QueueRow { name: string; status: string; alertedAt: string }
export const CROSS_QUEUE_ROWS: QueueRow[] = [
  { name: "DQ-Cash Advance", status: "Ready to Work", alertedAt: "alerted 05/03/2026 06:14 AM" },
  { name: "Phase 2 Parameters", status: "Ready to Work", alertedAt: "alerted 05/03/2026 06:14 AM" },
  { name: "High Risk DQ — By MCC", status: "Ready to Work", alertedAt: "alerted 05/03/2026 06:14 AM" },
  { name: "⚹ MC Watch (system)", status: "Ready to Work", alertedAt: "alerted 05/03/2026 06:14 AM" },
]
