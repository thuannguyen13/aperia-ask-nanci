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
  /** 16-digit = Clearent/ESQR, 12-digit = Woodforest. `real` marks a live MID. */
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
  { id: "velocitywls",  name: "VELOCITY WIRELESS RETAIL",      mid: "460100001884",                  mcc: "4812", mccDesc: "Telecom Equipment",             alertTag: 2, listTag: 5, vw: 83, mc: 358.19, status: "mark-work" },
  { id: "harborpoint",  name: "HARBOR POINT MARINE SVCS",      mid: "6588000003925641",              mcc: "5551", mccDesc: "Boat Dealers",                  alertTag: 4, listTag: 2, vw: 81, mc: 726.05, status: "mark-work" },
  { id: "elevatefit",   name: "ELEVATE FITNESS CLUB LLC",      mid: "9180675172661043",              mcc: "7997", mccDesc: "Membership Clubs",              alertTag: 3, listTag: 3, vw: 80, mc: 612.77, status: "mark-work" },
  { id: "premiertitle", name: "PREMIER TITLE LOANS TX",        mid: "6588000004093778",              mcc: "6051", mccDesc: "Non-FI Money Orders",           alertTag: 7, listTag: 1, vw: 79, mc: 698.30, status: "mark-work" },
  { id: "goldleaf",     name: "GOLDLEAF JEWELRY EXCHANGE",     mid: "6588000003318902",              mcc: "5944", mccDesc: "Jewelry Stores",                alertTag: 5, listTag: 4, vw: 78, mc: 733.12, status: "mark-work" },
  { id: "pbbiller",     name: "PBBILLER.COM",                  mid: "6588000002907459", real: true,  mcc: "5967", mccDesc: "Direct Marketing — Inbound",    alertTag: 3, listTag: 2, vw: 76, mc: 83.69,  status: "mark-work" },
  { id: "stonebridge",  name: "STONEBRIDGE HOME SVCS",         mid: "460100002935",                  mcc: "1731", mccDesc: "Electrical Contractors",        alertTag: 2, listTag: 2, vw: 75, mc: 421.66, status: "mark-work" },
  { id: "ashley",       name: "ASHLEY HOMESTORE - MECHANICSBU", mid: "9180675172134302", real: true, mcc: "5712", mccDesc: "Furniture, Home Furnishings",   alertTag: 4, listTag: 1, vw: 74, mc: 701.05, status: "mark-work" },
  { id: "atlasnutr",    name: "ATLAS NUTRITION DIRECT",        mid: "6588000004736155",              mcc: "5499", mccDesc: "Misc Food Stores",              alertTag: 3, listTag: 3, vw: 73, mc: 289.54, status: "mark-work" },
  { id: "cedarwood",    name: "CEDARWOOD ANIMAL HOSPITAL",     mid: "460100004427",                  mcc: "0742", mccDesc: "Veterinary Services",           alertTag: 1, listTag: 2, vw: 72, mc: 176.28, status: "mark-work" },
  { id: "jbhealth",     name: "JB HEALTH SHOP",                mid: "460100000172",     real: true,  mcc: "5912", mccDesc: "Drug Stores, Pharmacies",       alertTag: 3, listTag: 4, vw: 71, mc: 339.64, status: "mark-work" },
  { id: "truenorth",    name: "TRUENORTH TRAVEL GROUP",        mid: "9180675172937268",              mcc: "4722", mccDesc: "Travel Agencies",               alertTag: 6, listTag: 1, vw: 70, mc: 655.91, status: "mark-work" },
  { id: "silverline",   name: "SILVERLINE AUTO GLASS",         mid: "6588000003504816",              mcc: "7531", mccDesc: "Automotive Body Repair",        alertTag: 2, listTag: 3, vw: 69, mc: 244.07, status: "mark-work" },
  { id: "jbvitality",   name: "JB VITALITY BEAUTY",            mid: "460100003142",     real: true,  mcc: "5977", mccDesc: "Cosmetic Stores",               alertTag: 8, listTag: 3, vw: 68, mc: 329.52, status: "mark-work" },
  { id: "lakeshorepet", name: "LAKESHORE PET BOUTIQUE",        mid: "6588000004260934",              mcc: "5995", mccDesc: "Pet Shops",                     alertTag: 1, listTag: 1, vw: 67, mc: 118.63, status: "mark-work" },
  { id: "apexroofing",  name: "APEX ROOFING SOLUTIONS",        mid: "6588000003871527",              mcc: "1761", mccDesc: "Roofing, Siding",               alertTag: 5, listTag: 2, vw: 66, mc: 707.19, status: "mark-work" },
  { id: "oakfield",     name: "OAKFIELD PARK LIQUORS",         mid: "460100005619",                  mcc: "5921", mccDesc: "Package Stores",                alertTag: 2, listTag: 4, vw: 65, mc: 302.85, status: "mark-work" },
  { id: "quantumpc",    name: "QUANTUM PC REPAIR LLC",         mid: "9180675172550471",              mcc: "7379", mccDesc: "Computer Maintenance",          alertTag: 1, listTag: 2, vw: 63, mc: 91.42,  status: "mark-work" },
  { id: "cascade",      name: "CASCADE AUTO PARTS WAREHOUSE",  mid: "6588000002940328", real: true,  mcc: "5533", mccDesc: "Automotive Parts, Accessories", alertTag: 2, listTag: 4, vw: 62, mc: 711.08, status: "mark-work" },
  { id: "blueheron",    name: "BLUE HERON LANDSCAPING",        mid: "6588000004605283",              mcc: "0780", mccDesc: "Landscaping Services",          alertTag: 1, listTag: 1, vw: 60, mc: 187.33, status: "mark-work" },
  { id: "fairview",     name: "FAIRVIEW DRY CLEANERS",         mid: "460100006073",                  mcc: "7210", mccDesc: "Laundry, Cleaning",             alertTag: 1, listTag: 2, vw: 57, mc: 62.10,  status: "mark-work" },
  { id: "tridentsec",   name: "TRIDENT SECURITY SYSTEMS",      mid: "9180675172284690",              mcc: "1731", mccDesc: "Electrical Contractors",        alertTag: 3, listTag: 1, vw: 54, mc: 448.92, status: "mark-work" },
  { id: "maplewood",    name: "MAPLEWOOD FLORAL DESIGN",       mid: "6588000003146058",              mcc: "5992", mccDesc: "Florists",                      alertTag: 1, listTag: 1, vw: 49, mc: 33.75,  status: "mark-work" },
  { id: "granitecity",  name: "GRANITE CITY HARDWARE",         mid: "460100007281",                  mcc: "5251", mccDesc: "Hardware Stores",               alertTag: 2, listTag: 3, vw: 41, mc: 205.60, status: "mark-work" },
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
  /**
   * Transactions in the merchant's last 30 days. A count rather than the sentence it
   * used to be, because the same figure is quoted twice on one screen — the MC card's
   * Confidence line and the 30-Day row of Transaction Volume Analysis — and two typed
   * copies of a number drift apart the first time either is edited.
   */
  txns30: number
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
    txns30: 1247,
    mccPercentile: "Top 2% of peers",
    lastUpdate: "05/03/2026 06:14 AM",
    profile: { status: "In Review", profile: "No-Profile", multiWatch: "ISO", classification: "Elevated Monitoring" },
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
    txns30: 318,
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
    txns30: 902,
    mccPercentile: "Top 8% of peers",
    lastUpdate: "05/03/2026 06:14 AM",
    profile: { status: "Terminated", profile: "No-Profile", multiWatch: "ISO", classification: "Bust-out" },
    account: { lastBatch: "11/07/2025", lastStatement: "11/07/2025", phone: "(918) 244-6035", address: "BROKEN ARROW, OK 740121884" },
  },
}

/**
 * ponytail: invented. Typical monthly card activity by MCC — average ticket, and the
 * transactions a merchant of that kind runs in a month.
 *
 * Both are modeled, not one. A marine service yard and a dry cleaner can carry the
 * same monthly dollars while differing sixty-fold in transaction count, and the Risk
 * Report puts "CB #" and "CB $" in adjacent columns: model only the dollars and the
 * counts read absurd, model only the counts and a florist reports $4,800 chargebacks.
 */
const MCC_ACTIVITY: Record<string, { ticket: number; txns: number }> = {
  "0742": { ticket: 158, txns: 690 },   // Veterinary Services
  "0780": { ticket: 285, txns: 420 },   // Landscaping Services
  "1731": { ticket: 890, txns: 330 },   // Electrical Contractors
  "1761": { ticket: 1650, txns: 300 },  // Roofing, Siding
  "4722": { ticket: 1140, txns: 420 },  // Travel Agencies
  "4812": { ticket: 145, txns: 1240 },  // Telecom Equipment
  "5047": { ticket: 430, txns: 410 },   // Medical Equipment
  "5251": { ticket: 55, txns: 1900 },   // Hardware Stores
  "5499": { ticket: 42, txns: 2600 },   // Misc Food Stores
  "5533": { ticket: 88, txns: 1460 },   // Automotive Parts, Accessories
  "5551": { ticket: 2400, txns: 320 },  // Boat Dealers
  "5712": { ticket: 980, txns: 340 },   // Furniture, Home Furnishings
  "5722": { ticket: 520, txns: 380 },   // Household Appliance Stores
  "5912": { ticket: 48, txns: 3400 },   // Drug Stores, Pharmacies
  "5921": { ticket: 39, txns: 3200 },   // Package Stores
  "5941": { ticket: 96, txns: 1180 },   // Sporting Goods Stores
  "5944": { ticket: 740, txns: 360 },   // Jewelry Stores
  "5967": { ticket: 68, txns: 3100 },   // Direct Marketing — Inbound
  "5977": { ticket: 54, txns: 1880 },   // Cosmetic Stores
  "5992": { ticket: 72, txns: 880 },    // Florists
  "5995": { ticket: 68, txns: 1050 },   // Pet Shops
  "6051": { ticket: 380, txns: 940 },   // Non-FI Money Orders
  "7210": { ticket: 31, txns: 2400 },   // Laundry, Cleaning
  "7379": { ticket: 215, txns: 480 },   // Computer Maintenance
  "7531": { ticket: 820, txns: 310 },   // Automotive Body Repair
  "7997": { ticket: 62, txns: 2100 },   // Membership Clubs
  "8021": { ticket: 265, txns: 520 },   // Dentists, Orthodontists
  "8099": { ticket: 175, txns: 760 },   // Health Services
}

/** A mid-ticket retail shape, so a merchant added on an unlisted MCC still reports something plausible. */
const DEFAULT_ACTIVITY = { ticket: 120, txns: 820 }

const activityFor = (mcc: string) => MCC_ACTIVITY[mcc] ?? DEFAULT_ACTIVITY

/**
 * Per-merchant spread, from the last five digits of the MID. A seed rather than a
 * random draw so a merchant shows the same figures on every render and in every
 * screenshot, and rather than thirty stored columns so nothing can drift out of step
 * with the scores beside it.
 */
const seedOf = (m: RiskMerchant) => Number(m.mid.slice(-5))

const round2 = (n: number) => Math.round(n * 100) / 100
const pad = (n: number) => String(n).padStart(2, "0")

/** Transactions in the merchant's own last 30 days: its MCC's monthly shape, ±28% off the seed. */
const txns30For = (m: RiskMerchant) => Math.round(activityFor(m.mcc).txns * (0.72 + (seedOf(m) % 57) / 100))

/**
 * Chargeback rate by count, in percent. Driven by the VisionWeb score, because
 * chargebacks are most of what VisionWeb measures: a merchant at 94 has to read
 * worse here than one at 41, or the table argues with the score card above it. The
 * band straddles the 1.00% cap the Contract Expected row prints.
 */
const cbRateFor = (m: RiskMerchant) => 0.18 + (m.vw - 40) * 0.028 + (seedOf(m) % 13) / 100

/**
 * How much heavier the average disputed sale is than the merchant's own ticket.
 * Chargebacks skew to the larger sales in a period, which is why "CB % by $" prints
 * above "CB % by #" on every row — a merchant whose two rates matched would mean
 * disputes landing evenly across ticket sizes, which is not what a risk queue sees.
 */
const cbSkewFor = (m: RiskMerchant) => 1.05 + (seedOf(m) % 24) / 100

/** One row of Transaction Volume Analysis. `null` is "no figure for this column", rendered N/A. */
export interface TxnVolumeRow {
  period: string
  /**
   * Not a column. The denominator behind both percentages, carried so the Total row
   * can recompute its rates from the sales underneath rather than averaging the
   * percentages above it, which would weight a slow month like a busy one.
   */
  txns: number | null
  cbCount: number | null
  cbPctByCount: number | null
  cbAmount: number | null
  cbPctByAmount: number | null
  rdrCount: number | null
  rdrAmount: number | null
  /** Contract Expected and Total take the muted background. */
  muted?: boolean
}

const volumeRow = (m: RiskMerchant, period: string, txns: number): TxnVolumeRow => {
  const { ticket } = activityFor(m.mcc)
  // Floor of one: every merchant on this list alerted in today's cycle, and a
  // chargeback is what put it there — a period reporting none contradicts the queue
  // the report was opened from.
  const cbCount = Math.max(1, Math.round((txns * cbRateFor(m)) / 100))
  const cbAmount = cbCount * ticket * cbSkewFor(m)
  // Rapid Dispute Resolution deflects roughly six in ten before they settle as
  // chargebacks, and it refunds the sale, so it clears at ticket rather than above it.
  const rdrCount = Math.round(cbCount * 0.6)
  return {
    period,
    txns,
    cbCount,
    cbPctByCount: (cbCount / txns) * 100,
    cbAmount: round2(cbAmount),
    cbPctByAmount: (cbAmount / (txns * ticket)) * 100,
    rdrCount,
    rdrAmount: round2(rdrCount * ticket),
  }
}

/**
 * The chargeback ceiling in the merchant agreement, not observed volume — so the two
 * ratio columns carry the cap and the four count and dollar columns have nothing to
 * report. 1.00% is the standard cap across this portfolio: a term every merchant
 * signed identically is genuinely identical on every row, unlike the figures around it.
 */
const contractRow = (): TxnVolumeRow => ({
  period: "Contract Expected",
  txns: null,
  cbCount: null,
  cbPctByCount: 1,
  cbAmount: null,
  cbPctByAmount: 1,
  rdrCount: null,
  rdrAmount: null,
  muted: true,
})

/**
 * Total sums the three calendar months and nothing else. The rows above them are
 * windows over the same sales, so adding all eight would count June twice and print
 * a total that disagrees with every figure it sits under.
 */
const totalRow = (months: TxnVolumeRow[], ticket: number): TxnVolumeRow => {
  const sum = (pick: (r: TxnVolumeRow) => number | null) => months.reduce((n, r) => n + (pick(r) ?? 0), 0)
  const txns = sum((r) => r.txns)
  const cbCount = sum((r) => r.cbCount)
  const cbAmount = round2(sum((r) => r.cbAmount))
  return {
    period: "Total",
    txns,
    cbCount,
    cbPctByCount: (cbCount / txns) * 100,
    cbAmount,
    cbPctByAmount: (cbAmount / (txns * ticket)) * 100,
    rdrCount: sum((r) => r.rdrCount),
    rdrAmount: round2(sum((r) => r.rdrAmount)),
    muted: true,
  }
}

/**
 * Transaction Volume Analysis, derived from the merchant's own 30-day count. Every
 * row is a window on the same trading pattern, so nothing here is stored: change
 * `txns30` and the whole table, its ratios and its total move together.
 */
export const getTxnVolume = (m: RiskMerchant, txns30: number): { rows: TxnVolumeRow[]; total: TxnVolumeRow } => {
  const { ticket } = activityFor(m.mcc)
  const row = (period: string, txns: number) => volumeRow(m, period, txns)
  // The 30-day window runs above the merchant's own monthly average, and that gap is
  // the velocity that alerted it — the two rows printing the same number would say
  // nothing changed.
  const monthlyAvg = Math.round(txns30 / 1.14)
  const rows = [
    row("Today", Math.max(1, Math.round(txns30 / 30))),
    row("7-Day", Math.round((txns30 / 30) * 7 * 1.09)),
    row("30-Day", txns30),
    row("Monthly Average", monthlyAvg),
    contractRow(),
    // June is the open month and the one that climbed; April and May have settled.
    row("June 2026", Math.round(monthlyAvg * 1.15)),
    row("May 2026", Math.round(monthlyAvg * 0.97)),
    row("April 2026", Math.round(monthlyAvg * 0.88)),
  ]
  return { rows, total: totalRow(rows.slice(-3), ticket) }
}

/** The MC card's Confidence line. Reads off `txns30`, so it cannot disagree with the 30-Day row below it. */
export const formatTxnConfidence = (txns30: number) => `${txns30.toLocaleString()} Transactions last 30 Days`

/**
 * ponytail: invented. Signer names for the account card, picked by MID seed so a
 * merchant keeps the same owner across renders. Nobody real: the source analyses
 * carried MIDs and scores only, never a person.
 */
const OWNER_NAMES = [
  "Dana Whitfield", "Marcus Ellery", "Priya Raghunathan", "Colin Mabry",
  "Sofia Estrada", "Wendell Groves", "Tessa Lindqvist", "Omar Bediako",
  "Renata Fialho", "Grant Okonkwo", "Iris Vandermeer", "Hollis Trent",
]

/**
 * ponytail: invented. Cities the demo portfolio is spread across, with the area code
 * that belongs to each — paired by index so a merchant in Boise is not reached on a
 * Connecticut number. ZIPs are the +4 form the existing records already use.
 */
const MERCHANT_CITIES = [
  "GREENSBORO, NC 274090318", "TEMPE, AZ 852813047", "LAKELAND, FL 338011206",
  "BOISE, ID 837042215", "CANTON, OH 447080921", "SPRINGDALE, AR 727644130",
  "OWENSBORO, KY 423012258", "ROCKFORD, IL 611072840", "WACO, TX 767103319",
  "SALEM, OR 973021764", "MERIDEN, CT 064502207", "OGDEN, UT 844011590",
]
const AREA_CODES = ["336", "480", "863", "208", "330", "479", "270", "815", "254", "503", "203", "801"]

/**
 * Merchant website, derived from the trading name rather than stored: thirty typed
 * domains drift from the names beside them the first time one is edited. Words stay
 * hyphenated so a name that reads like a chain resolves to this demo's own merchant
 * and not to a live business, and a name that already carries its own domain keeps it.
 */
export const merchantUrl = (name: string) => {
  if (name.includes(".COM")) return `www.${name.toLowerCase()}`
  const words = name.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean)
  return `www.${words.join("-")}.com`
}

/**
 * Everything the two Merchant Information cards show that is not already on the
 * merchant row or its detail record. Derived per merchant rather than defaulted:
 * one flat set of values is what made these read as a screen that had failed to
 * load, and thirty identical owners would read no better than thirty dashes.
 */
export interface MerchantProfileFigures {
  watch: string
  workedTotal: number
  paramsWorked: number
  workedIn30: string
  multiplier: string
  firstBatchAmount: number
  firstBatchDate: string
  owner: string
  url: string
  /** null renders "None" — a different claim from 0.00%, and the true one. */
  advanceDepositPct: number | null
  reserveIndicator: string
  /** null where no reserve is held. */
  reserveTarget: number | null
}

export const getMerchantProfile = (m: RiskMerchant, d: RiskReportDetail, work: WorkStatus): MerchantProfileFigures => {
  const seed = seedOf(m)
  const level = getRiskLevel(m)
  const { ticket } = activityFor(m.mcc)
  // Alerts closed on this merchant in EARLIER risk cycles, scaled off its own tag
  // counts so the number agrees with the badges the Barometer list shows on the same
  // row. It has to exclude the current cycle: all 357 alerted merchants are unworked
  // there, which is the headline on the card the user arrived from — so the only way
  // this screen reports work in the last 30 days is the mark just made on it.
  const workedTotal = (m.alertTag + m.listTag) * 2 + (seed % 5) + (work === "worked" ? 1 : 0)
  const sales30 = d.txns30 * ticket
  return {
    // On watch means the ISO is monitoring it: the High band, the same thirteen the
    // Barometer's "critical" chip filters down to.
    watch: level === "High" ? "Yes" : "No",
    workedTotal,
    // Distinct parameters closed out, bounded by the parameters actually driving the
    // two scores — it can never claim more worked than the score cards say are in play.
    paramsWorked: Math.min(workedTotal, d.vwParams + d.mcParams),
    workedIn30: work === "worked" ? "Yes" : "No",
    // What VisionWeb scales the raw parameter hits by before publishing the score
    // above. It follows the band, not the merchant, so three values across thirty
    // rows is correct here rather than flat.
    multiplier: level === "High" ? "2.00x" : level === "Medium" ? "1.50x" : "1.00x",
    // A first batch is a test day, not a trading day, so it reads small against every
    // other figure on the card: a handful of sales at the merchant's own ticket.
    firstBatchAmount: round2(ticket * (2 + (seed % 7))),
    // Boarded 2019–2024, old enough that the 30-day figures above are a change in
    // behaviour rather than a new account's opening months.
    firstBatchDate: `${pad(1 + ((seed >> 3) % 12))}/${pad(1 + ((seed >> 5) % 28))}/${2019 + (seed % 6)}`,
    // Shifted before the modulo: the city list is the same length, and indexing both
    // off `seed % 12` would give every merchant in Salem the same signer.
    owner: OWNER_NAMES[(seed >> 4) % OWNER_NAMES.length],
    url: merchantUrl(m.name),
    // Only the two upper bands hold anything back. The High band's percentage moves
    // with the seed because it is negotiated per merchant, not set by policy.
    advanceDepositPct: level === "High" ? 10 + (seed % 6) * 2.5 : level === "Medium" ? 5 : null,
    reserveIndicator: level === "Low" ? "No" : "Yes",
    // A tenth of a month's card volume on the High band, a twentieth on Medium —
    // derived from the same volume the transaction table below reports, so the target
    // cannot end up larger than the sales it is held against.
    reserveTarget: level === "High" ? round2(sales30 * 0.1) : level === "Medium" ? round2(sales30 * 0.05) : null,
  }
}

/**
 * Fallback detail for the merchants without a hand-written entry above. Every figure
 * is derived from the merchant's own row rather than fixed, because a flat default
 * put "+120 last 30 days" and "Top 25% of peers" on a merchant scoring 33.75 — a
 * 30-day gain larger than the score itself, and a percentile that contradicts the
 * number printed directly above it. The same trap holds for the account card: one
 * shared phone number and one shared address across twenty-seven merchants read as
 * an unpopulated form, not as a portfolio.
 */
export const getDefaultRiskDetail = (m: RiskMerchant): RiskReportDetail => {
  const delta30 = Math.round(m.mc * 0.35)
  const level = getMcLevel(m.mc)
  const seed = seedOf(m)
  const city = seed % MERCHANT_CITIES.length
  return {
    // Both pills slice the tables behind them, so neither can exceed what those
    // tables hold. Tying them to the merchant's own tags keeps each pill agreeing
    // with the red and amber badges the Barometer list shows on the same row.
    violations: Math.min(VIOLATION_ROWS.length, Math.max(1, Math.round(m.alertTag / 2))),
    inQueues: Math.min(CROSS_QUEUE_ROWS.length, Math.max(1, m.listTag)),
    // VW climbs with the score: a merchant at the top of this list is there because
    // it moved, not because it has always sat there.
    vwDelta30: `+${Math.max(2, Math.round((m.vw - 40) * 0.4))}`,
    vwParams: getVwLevel(m.vw) === "High" ? 4 : getVwLevel(m.vw) === "Medium" ? 2 : 1,
    mcDelta7: `+${Math.round(delta30 * 0.3)}`,
    mcDelta30: `+${delta30}`,
    mcParams: level === "High" ? 5 : level === "Medium" ? 3 : 1,
    txns30: txns30For(m),
    mccPercentile: level === "High" ? "Top 5% of peers" : level === "Medium" ? "Top 30% of peers" : "Bottom 40% of peers",
    // The sync stamp is portfolio-wide and matches the cross-queue alert times: this
    // is the one figure on the card that SHOULD read the same on every merchant.
    lastUpdate: "05/03/2026 06:14 AM",
    profile: {
      status: "In Review",
      profile: "No-Profile",
      multiWatch: "ISO",
      classification: getRiskLevel(m) === "High" ? "Elevated Monitoring" : getRiskLevel(m) === "Medium" ? "Standard Monitoring" : "Standard",
    },
    account: {
      lastBatch: `06/${pad(8 + (seed % 14))}/2026`,
      // Statements cut on a cycle, so this one date is right for the whole portfolio.
      lastStatement: "05/31/2026",
      // 555-01xx is the reserved fictional exchange — no number invented here can
      // ring a real line, however the demo is shared.
      phone: `(${AREA_CODES[city]}) 555-0${100 + (seed % 100)}`,
      address: MERCHANT_CITIES[city],
    },
  }
}

// Parameter Violation Details — opened from the "N Violations" pill on the Risk Report.
export interface ViolationRow {
  pNum: string; wk: string; alertOn: string; assignment: string; parameter: string
  reAlert: string; paramIndicator: string; actualIndicator: string
  paramThreshold: string; actualThreshold: string; disposition: string
  workedOn: string; userName: string; fileType: string
}

export const RISK_VIOLATION_CYCLE = "06/25/2026"

const ASSIGNMENT = "Esquire - Phase 2 Parameters - Auths - Detect Q"

/**
 * The alert records the "N Violations" pill slices, in P# order. Four rows because
 * four is the highest violation count any merchant on the list carries — the pill
 * takes the first N, so a shorter list quietly shows fewer rows than it counted.
 *
 * The dollar columns read N/A on P-MC1 and P-MC2 because those two parameters are
 * scored in points and define no dollar threshold; P-MC3 and P-MC4 do, so theirs
 * carry the figure that was in force when the alert fired. That is why they are
 * written here rather than read off the live parameter config in Create Assignment:
 * this is the audit trail of what tripped, not what the assignment is set to now.
 *
 * Disposition, Worked On and User Name stay empty on purpose. Nothing in this cycle
 * has been worked — that is the queue card's headline, and a name in this column
 * would contradict the 0.00% printed two screens back.
 */
export const VIOLATION_ROWS: ViolationRow[] = [
  { pNum: "P-MC1", wk: "Ready to Work", alertOn: "05/03/2026 10:10:00 AM", assignment: ASSIGNMENT, parameter: "Score Threshold",      reAlert: "No", paramIndicator: "700", actualIndicator: "737", paramThreshold: "N/A",    actualThreshold: "N/A",    disposition: "-", workedOn: "-", userName: "-", fileType: "Transaction" },
  { pNum: "P-MC2", wk: "Ready to Work", alertOn: "05/03/2026 06:25:30 AM", assignment: ASSIGNMENT, parameter: "Score Velocity",       reAlert: "No", paramIndicator: "40",  actualIndicator: "68",  paramThreshold: "N/A",    actualThreshold: "N/A",    disposition: "-", workedOn: "-", userName: "-", fileType: "Transaction" },
  { pNum: "P-MC3", wk: "Ready to Work", alertOn: "05/03/2026 07:14:30 AM", assignment: ASSIGNMENT, parameter: "High-MC Txn %",        reAlert: "No", paramIndicator: "15",  actualIndicator: "23",  paramThreshold: "$1,000", actualThreshold: "$2,418", disposition: "-", workedOn: "-", userName: "-", fileType: "Transaction" },
  { pNum: "P-MC4", wk: "Ready to Work", alertOn: "05/03/2026 05:52:10 AM", assignment: ASSIGNMENT, parameter: "Dollar Exposure",      reAlert: "No", paramIndicator: "10",  actualIndicator: "14",  paramThreshold: "$5,000", actualThreshold: "$7,640", disposition: "-", workedOn: "-", userName: "-", fileType: "Transaction" },
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
