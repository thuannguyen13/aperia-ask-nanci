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
  "Real merchant IDs from the Clearent and ESQR portfolios (Sept–Dec 2025). Anonymize before external use."

export type RiskLevel = "High" | "Medium" | "Low"
export type WorkStatus = "mark-work" | "wip" | "worked"

/**
 * The disposition choices in "Mark Work and Disposition". Mutually exclusive with
 * each other and with "Work in Progress" — picking any of these ends the work,
 * which is why the panel is one radio group rather than two.
 */
export const DISPOSITIONS = [
  "Cleared — No Action", "Hold Funds",
  "Escalated — Phase 2", "Termination Recommended",
  "Contact Merchant", "Other (Specify)",
]

/** "Work in Progress" is the one choice that does not close the item out. */
export const statusForDisposition = (choice: string): WorkStatus =>
  choice === "Work in Progress" ? "wip" : "worked"

/**
 * MC scores are 2dp in the source data, so they render 2dp — otherwise 712.40
 * prints as "712.4" and sits in a column next to 737.33, which reads as sloppy
 * rather than precise. VW scores are whole numbers and need no formatting.
 */
export const formatMcScore = (mc: number) => mc.toFixed(2)

/**
 * Merchant names arrive from the processor in caps, which reads as shouting in a
 * list of thirty. Rendered in normal case instead — the same way the assistant
 * already writes them in prose ("Harbor Point Marine Svcs"). Tokens that are
 * acronyms rather than words keep their caps; everything else takes one capital.
 */
const NAME_KEEPS_CAPS = new Set(["LLC", "INC", "LP", "LTD", "CO", "USA", "TX", "PC", "JB", "DQ", "MCC"])
export const formatMerchantName = (name: string) =>
  name
    .split(" ")
    .map((word) => (NAME_KEEPS_CAPS.has(word) ? word : word.charAt(0) + word.slice(1).toLowerCase()))
    .join(" ")

// Each model gets its own bands rather than a shared percentage: 700 is the real
// P-MC1 Score Threshold floor from the spec, 65 is the VW critical line the
// dashboard scatter already draws its quadrants on.
export const getVwLevel = (vw: number): RiskLevel => (vw >= 80 ? "High" : vw >= 65 ? "Medium" : "Low")
export const getMcLevel = (mc: number): RiskLevel => (mc >= 700 ? "High" : mc >= 400 ? "Medium" : "Low")

/**
 * The merchant's combined level: the worse of the two models. Derived rather than
 * stored, because with 30 rows a hand-kept `risk` column drifts from the scores
 * beside it within one edit — and "High on one model only" is the whole point of
 * this list, so the two must never disagree.
 */
export const getRiskLevel = (m: { vw: number; mc: number }): RiskLevel => {
  const levels = [getVwLevel(m.vw), getMcLevel(m.mc)]
  return levels.includes("High") ? "High" : levels.includes("Medium") ? "Medium" : "Low"
}

export interface RiskMerchant {
  id: string
  name: string
  /** 16 digits throughout: a list that mixes lengths reads as two systems. `real` marks a live MID. */
  mid: string
  /** True only for the seven MIDs that came out of the client data verbatim. */
  real?: boolean
  mcc: string
  mccDesc: string
  alertTag: number // red triangle count
  listTag: number // yellow list count
  vw: number // VisionWeb score /100
  mc: number // MC/Brighterion score /1000
  status: WorkStatus
}

/**
 * Page one of the Barometer Report's merchant list, ranked by VW score like the
 * Figma. 30 of the assignment's 357 alerted merchants — the queue card above the
 * table says 357, so a list that ends after seven rows reads as a mock.
 *
 * Every row is `mark-work` on purpose. The queue card reports 0 work-in-progress,
 * 0 worked and 0.00% worked, and the whole "unblock the workflow" story depends on
 * that; rows badged WIP or Worked contradicted the card directly above them.
 *
 * Seven MIDs are real (`real: true`) and anchor the scores that came with them.
 * The rest are generated in the same per-client formats — 6588…/9180… 16-digit,
 * 4601… 12-digit — so the list reads as one portfolio without putting 30 live
 * merchant numbers on a public URL.
 *
 * Scores are the point of the list, not decoration: 13 merchants are High, and
 * they split 5 critical on both models, 4 on Mastercard only, 4 on VisionWeb only.
 * Nothing exceeds MC 737.33, the highest score observed in the real data.
 */
export const RISK_MERCHANTS: RiskMerchant[] = [
  { id: "summitridge",  name: "SUMMIT RIDGE OUTFITTERS",       mid: "6588000004182337",              mcc: "5941", mccDesc: "Sporting Goods Stores",         alertTag: 5, listTag: 2, vw: 94, mc: 688.21, status: "mark-work" },
  { id: "northgate",    name: "NORTHGATE APPLIANCE CTR",       mid: "6588000003647120",              mcc: "5722", mccDesc: "Household Appliance Stores",    alertTag: 4, listTag: 3, vw: 91, mc: 731.44, status: "mark-work" },
  { id: "regency",      name: "REGENCY FURNITURE MANCHESTER",  mid: "6588000002563435", real: true,  mcc: "5712", mccDesc: "Furniture, Home Furnishings",   alertTag: 3, listTag: 4, vw: 89, mc: 737.33, status: "mark-work" },
  { id: "meridian",     name: "MERIDIAN DENTAL GROUP",         mid: "6588000002811586", real: true,  mcc: "8021", mccDesc: "Dentists, Orthodontists",       alertTag: 4, listTag: 2, vw: 87, mc: 95.99,  status: "mark-work" },
  { id: "coastalwell",  name: "COASTAL WELLNESS PARTNERS",     mid: "9180675172408815",              mcc: "8099", mccDesc: "Health Services",               alertTag: 3, listTag: 1, vw: 86, mc: 704.88, status: "mark-work" },
  { id: "brighton",     name: "BRIGHTON MEDICAL SUPPLY",       mid: "6588000004417209",              mcc: "5047", mccDesc: "Medical Equipment",             alertTag: 6, listTag: 2, vw: 84, mc: 712.40, status: "mark-work" },
  { id: "velocitywls",  name: "VELOCITY WIRELESS RETAIL",      mid: "4601000000001884",                  mcc: "4812", mccDesc: "Telecom Equipment",             alertTag: 2, listTag: 5, vw: 83, mc: 358.19, status: "mark-work" },
  { id: "harborpoint",  name: "HARBOR POINT MARINE SVCS",      mid: "6588000003925641",              mcc: "5551", mccDesc: "Boat Dealers",                  alertTag: 4, listTag: 2, vw: 81, mc: 726.05, status: "mark-work" },
  { id: "elevatefit",   name: "ELEVATE FITNESS CLUB LLC",      mid: "9180675172661043",              mcc: "7997", mccDesc: "Membership Clubs",              alertTag: 3, listTag: 3, vw: 80, mc: 612.77, status: "mark-work" },
  { id: "premiertitle", name: "PREMIER TITLE LOANS TX",        mid: "6588000004093778",              mcc: "6051", mccDesc: "Non-FI Money Orders",           alertTag: 7, listTag: 1, vw: 79, mc: 698.30, status: "mark-work" },
  { id: "goldleaf",     name: "GOLDLEAF JEWELRY EXCHANGE",     mid: "6588000003318902",              mcc: "5944", mccDesc: "Jewelry Stores",                alertTag: 5, listTag: 4, vw: 78, mc: 733.12, status: "mark-work" },
  { id: "pbbiller",     name: "PBBILLER.COM",                  mid: "6588000002907459", real: true,  mcc: "5967", mccDesc: "Direct Marketing — Inbound",    alertTag: 3, listTag: 2, vw: 76, mc: 83.69,  status: "mark-work" },
  { id: "stonebridge",  name: "STONEBRIDGE HOME SVCS",         mid: "4601000000002935",                  mcc: "1731", mccDesc: "Electrical Contractors",        alertTag: 2, listTag: 2, vw: 75, mc: 421.66, status: "mark-work" },
  { id: "ashley",       name: "ASHLEY HOMESTORE - MECHANICSBU", mid: "9180675172134302", real: true, mcc: "5712", mccDesc: "Furniture, Home Furnishings",   alertTag: 4, listTag: 1, vw: 74, mc: 701.05, status: "mark-work" },
  { id: "atlasnutr",    name: "ATLAS NUTRITION DIRECT",        mid: "6588000004736155",              mcc: "5499", mccDesc: "Misc Food Stores",              alertTag: 3, listTag: 3, vw: 73, mc: 289.54, status: "mark-work" },
  { id: "cedarwood",    name: "CEDARWOOD ANIMAL HOSPITAL",     mid: "4601000000004427",                  mcc: "0742", mccDesc: "Veterinary Services",           alertTag: 1, listTag: 2, vw: 72, mc: 176.28, status: "mark-work" },
  { id: "jbhealth",     name: "JB HEALTH SHOP",                mid: "4601000000000172",                  mcc: "5912", mccDesc: "Drug Stores, Pharmacies",       alertTag: 3, listTag: 4, vw: 71, mc: 339.64, status: "mark-work" },
  { id: "truenorth",    name: "TRUENORTH TRAVEL GROUP",        mid: "9180675172937268",              mcc: "4722", mccDesc: "Travel Agencies",               alertTag: 6, listTag: 1, vw: 70, mc: 655.91, status: "mark-work" },
  { id: "silverline",   name: "SILVERLINE AUTO GLASS",         mid: "6588000003504816",              mcc: "7531", mccDesc: "Automotive Body Repair",        alertTag: 2, listTag: 3, vw: 69, mc: 244.07, status: "mark-work" },
  { id: "jbvitality",   name: "JB VITALITY BEAUTY",            mid: "4601000000003142",                  mcc: "5977", mccDesc: "Cosmetic Stores",               alertTag: 8, listTag: 3, vw: 68, mc: 329.52, status: "mark-work" },
  { id: "lakeshorepet", name: "LAKESHORE PET BOUTIQUE",        mid: "6588000004260934",              mcc: "5995", mccDesc: "Pet Shops",                     alertTag: 1, listTag: 1, vw: 67, mc: 118.63, status: "mark-work" },
  { id: "apexroofing",  name: "APEX ROOFING SOLUTIONS",        mid: "6588000003871527",              mcc: "1761", mccDesc: "Roofing, Siding",               alertTag: 5, listTag: 2, vw: 66, mc: 707.19, status: "mark-work" },
  { id: "oakfield",     name: "OAKFIELD PARK LIQUORS",         mid: "4601000000005619",                  mcc: "5921", mccDesc: "Package Stores",                alertTag: 2, listTag: 4, vw: 65, mc: 302.85, status: "mark-work" },
  { id: "quantumpc",    name: "QUANTUM PC REPAIR LLC",         mid: "9180675172550471",              mcc: "7379", mccDesc: "Computer Maintenance",          alertTag: 1, listTag: 2, vw: 63, mc: 91.42,  status: "mark-work" },
  { id: "cascade",      name: "CASCADE AUTO PARTS WAREHOUSE",  mid: "6588000002940328", real: true,  mcc: "5533", mccDesc: "Automotive Parts, Accessories", alertTag: 2, listTag: 4, vw: 62, mc: 711.08, status: "mark-work" },
  { id: "blueheron",    name: "BLUE HERON LANDSCAPING",        mid: "6588000004605283",              mcc: "0780", mccDesc: "Landscaping Services",          alertTag: 1, listTag: 1, vw: 60, mc: 187.33, status: "mark-work" },
  { id: "fairview",     name: "FAIRVIEW DRY CLEANERS",         mid: "4601000000006073",                  mcc: "7210", mccDesc: "Laundry, Cleaning",             alertTag: 1, listTag: 2, vw: 57, mc: 62.10,  status: "mark-work" },
  { id: "tridentsec",   name: "TRIDENT SECURITY SYSTEMS",      mid: "9180675172284690",              mcc: "1731", mccDesc: "Electrical Contractors",        alertTag: 3, listTag: 1, vw: 54, mc: 448.92, status: "mark-work" },
  { id: "maplewood",    name: "MAPLEWOOD FLORAL DESIGN",       mid: "6588000003146058",              mcc: "5992", mccDesc: "Florists",                      alertTag: 1, listTag: 1, vw: 49, mc: 33.75,  status: "mark-work" },
  { id: "granitecity",  name: "GRANITE CITY HARDWARE",         mid: "4601000000007281",                  mcc: "5251", mccDesc: "Hardware Stores",               alertTag: 2, listTag: 3, vw: 41, mc: 205.60, status: "mark-work" },
]

/** Alerted merchants in the assignment; the list above is page one of them. */
export const RISK_MERCHANTS_TOTAL = 357

export const findMerchant = (id: string) => RISK_MERCHANTS.find((m) => m.id === id)

// Risk Report detail. The MID and MCC live on the merchant row above, so they are
// not repeated here — one source each.
export interface RiskReportDetail {
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
  /**
   * The header card: who the account is and how today compares to what it signed
   * for. `todayNet` against `contractDailyNet` is the pair that matters — a merchant
   * running far over its contracted daily volume is the shape a bust-out makes, so
   * the ratio is derived at render rather than stored, and cannot drift from the two
   * figures it comes from.
   */
  merchant: {
    dba: string
    iso: string
    /** Boarding date, MM/DD/YYYY. */
    approved: string
    businessAge: string
    watchStatus: string
    contractDailyNet: number
    todayNet: number
    accountStatus: "Active" | "Suspended" | "Terminated"
  }
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
    merchant: { dba: "0553 OH TOLEDO - CENTRAL", iso: "North Central Group", approved: "12/14/2024", businessAge: "91+ days", watchStatus: "On Watch — Phase 2 Review", contractDailyNet: 8500, todayNet: 21930, accountStatus: "Active" },
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
    // Terminated in December, so nothing settles today: the ratio reads 0%, which is
    // the other half of the bust-out shape.
    merchant: { dba: "0118 TX MESQUITE - DENTAL", iso: "Lone Star Payments", approved: "08/02/2025", businessAge: "91+ days", watchStatus: "Closed — Bust-out confirmed", contractDailyNet: 3200, todayNet: 0, accountStatus: "Terminated" },
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
    merchant: { dba: "0553 OK BROKEN ARROW - AUTO", iso: "Heartland Merchant Svcs", approved: "06/21/2025", businessAge: "91+ days", watchStatus: "Closed — Bust-out confirmed", contractDailyNet: 12000, todayNet: 0, accountStatus: "Terminated" },
  },
}

/**
 * Fallback detail for the merchants without a hand-written entry above. The MC
 * figures are derived from the merchant's own score rather than fixed, because a
 * flat default put "+120 last 30 days" and "Top 25% of peers" on a merchant
 * scoring 33.75 — a 30-day gain larger than the score itself, and a percentile
 * that contradicts the number printed directly above it.
 */
/** The agents the portfolio boards through, cycled so the card is not all one name. */
const ISO_AGENTS = ["North Central Group", "Lone Star Payments", "Heartland Merchant Svcs", "Gulf Coast Bankcard"]
const BOARDED_DATES = ["12/14/2024", "03/09/2025", "06/21/2025", "08/02/2025", "10/17/2025"]

export const getDefaultRiskDetail = (m: RiskMerchant): RiskReportDetail => {
  const delta30 = Math.round(m.mc * 0.35)
  const level = getMcLevel(m.mc)
  const contract = 2500 + (Number(m.mid.slice(-3)) % 40) * 250
  return {
    violations: 2,
    inQueues: 2,
    vwDelta30: "+12",
    vwParams: 2,
    mcDelta7: `+${Math.round(delta30 * 0.3)}`,
    mcDelta30: `+${delta30}`,
    mcParams: level === "High" ? 5 : level === "Medium" ? 3 : 1,
    mcTxns: "820 Transactions last 30 Days",
    mccPercentile: level === "High" ? "Top 5% of peers" : level === "Medium" ? "Top 30% of peers" : "Bottom 40% of peers",
    lastUpdate: "05/03/2026 06:14 AM",
    profile: { status: "In Review", profile: "No-Profile", multiWatch: "ISO", classification: "—" },
    account: { lastBatch: "05/12/2026", lastStatement: "05/12/2026", phone: "(972) 000-0000", address: "PAPILLION, FL 010853016" },
    // Derived, not fixed: a flat contract and a flat day would put the same ratio on
    // every merchant, and the ratio is the one figure on this card worth reading. The
    // contract scales with the MCC's own size and today's take with the MC score, so
    // a high scorer runs over its contract and a quiet one sits under it.
    merchant: {
      dba: `${m.mid.slice(-4)} ${m.mccDesc.split(",")[0].toUpperCase()}`,
      iso: ISO_AGENTS[Number(m.mid.slice(-1)) % ISO_AGENTS.length],
      approved: BOARDED_DATES[Number(m.mid.slice(-2, -1)) % BOARDED_DATES.length],
      businessAge: "91+ days",
      watchStatus: level === "High" ? "On Watch — Phase 2 Review" : "Not on watch",
      contractDailyNet: contract,
      todayNet: Math.round(contract * (0.4 + m.mc / 500)),
      accountStatus: "Active",
    },
  }
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

const ASSIGNMENT = "Phase 2 Parameters - Auths - Detect Q"
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

// ── Recent Authorizations ────────────────────────────────────────────────────
// The last ten authorizations with their Mastercard score, which is where the
// "Mastercard sees it, VisionWeb does not" argument becomes something you can
// point at: the same $420 sale, approved every time, scoring 960 at 6am and 420
// the night before.
//
// The six scored rows repeat $420 and the four unscored ones do not: that contrast
// is the table's argument. A card-testing run repeats one amount, so the repeats are
// the anomaly and the ordinary tickets around them are what the month normally looks
// like. Making every row $420 would have implied 156 x $420 for the month, three
// times the gross the volume view reports.
//
// ponytail: illustrative. The real data carries scores per merchant, not per
// authorization, so the per-auth scores, amounts and reasons here are invented.
export interface AuthRow {
  /** MM/DD/YYYY HH:MM:SS, the format every other date on this screen uses. */
  at: string
  /** Last four only; the demo never holds a full PAN. */
  card: string
  amount: number
  type: string
  result: string
  /** Mastercard score for this authorization, 0–1000. */
  mcScore: number
  /** Why it scored, or null where nothing fired. */
  mcReason: string | null
}

/** Above this an authorization reads as scored, not merely observed. */
export const AUTH_SCORE_ALERT = 700

/** How many the merchant has in the period, against the ten the table shows. */
export const AUTH_TOTAL = 156

export const RECENT_AUTHS: AuthRow[] = [
  { at: "05/03/2026 06:11:42", card: "4889", amount: 420, type: "Sale", result: "Approved", mcScore: 960, mcReason: "Velocity, novel card" },
  { at: "05/03/2026 05:58:11", card: "5212", amount: 420, type: "Sale", result: "Approved", mcScore: 940, mcReason: "Velocity" },
  { at: "05/03/2026 05:42:09", card: "5212", amount: 420, type: "Sale", result: "Approved", mcScore: 910, mcReason: "Repeat card" },
  { at: "05/03/2026 05:14:55", card: "3782", amount: 420, type: "Sale", result: "Approved", mcScore: 780, mcReason: "High-risk MCC" },
  { at: "05/03/2026 04:47:33", card: "4147", amount: 420, type: "Sale", result: "Approved", mcScore: 660, mcReason: "High-risk MCC" },
  { at: "05/03/2026 03:12:18", card: "5419", amount: 420, type: "Sale", result: "Approved", mcScore: 620, mcReason: "High-risk MCC" },
  { at: "05/02/2026 23:55:01", card: "4147", amount: 86.40,  type: "Sale", result: "Approved", mcScore: 480, mcReason: null },
  { at: "05/02/2026 22:08:47", card: "3782", amount: 214.99, type: "Sale", result: "Approved", mcScore: 420, mcReason: null },
  { at: "05/02/2026 21:33:20", card: "4889", amount: 52.10,  type: "Sale", result: "Approved", mcScore: 390, mcReason: null },
  { at: "05/02/2026 20:02:14", card: "5212", amount: 137.65, type: "Sale", result: "Approved", mcScore: 310, mcReason: null },
]

// ── Transaction Volume Analysis ──────────────────────────────────────────────
// Three periods side by side: this month, this year, last year. Only the four
// measured figures are stored — net volume and the chargeback percentage are
// derived, so the column cannot say $283,060 net beside a gross and a returns
// figure that do not subtract to it.
//
// MTD transactions is AUTH_TOTAL: the authorization view offers "View all 156" and
// this row is where that 156 comes from — the same population, which is why the ten
// on screen cannot all carry the burst amount. $21,981 over 156 is a $140.90 average
// ticket, and the $420 repeats sit above it as the outliers they are meant to be.
export interface VolumePeriod {
  label: string
  grossSales: number
  transactions: number
  returns: number
  chargebacks: number
}

export const VOLUME_PERIODS: VolumePeriod[] = [
  { label: "MTD",           grossSales: 21_981,    transactions: AUTH_TOTAL, returns: 0,     chargebacks: 0 },
  { label: "YTD",           grossSales: 284_310,   transactions: 2_114,      returns: 1_250, chargebacks: 2_840 },
  { label: "Previous Year", grossSales: 1_142_809, transactions: 9_830,      returns: 8_914, chargebacks: 11_720 },
]

export const netVolume = (p: VolumePeriod) => p.grossSales - p.returns
/** Chargebacks as a share of gross sales — the ratio the card networks watch. */
export const chargebackPct = (p: VolumePeriod) => (p.grossSales ? (p.chargebacks / p.grossSales) * 100 : 0)
