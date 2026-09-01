// Aperia Risk — Create Assignment flow (Figma "4. Assignment Management", frames 219–225).
// Content only; the form + Nanci review layout live in components/risk/CreateAssignment.tsx.
// ponytail: illustrative demo data, not a live parameter catalog.

// A parameter's alert config is one or two numeric fields per tier. `unit` renders as
// the input suffix ("pts" / "%" / "$"); a parameter with a `threshold` unit gets two.
export interface McParameter {
  id: string
  name: string
  blurb: string
  unit: "pts" | "%"
  threshold?: "$" // present → the tier also takes a dollar threshold
  firstAlert: string
  firstThreshold?: string
  reAlert: string
  reThreshold?: string
}

export const MC_PARAMETERS: McParameter[] = [
  { id: "P-MC1", name: "Score Threshold",      blurb: "MC score crosses a configured floor",   unit: "pts", firstAlert: "700", reAlert: "50" },
  { id: "P-MC2", name: "Score Velocity",       blurb: "Score climbs faster than its baseline", unit: "pts", firstAlert: "40",  reAlert: "15" },
  { id: "P-MC3", name: "High-MC Txn %",        blurb: "% of transactions scored high-risk",    unit: "%",   threshold: "$", firstAlert: "15", firstThreshold: "1,000", reAlert: "5", reThreshold: "500" },
  { id: "P-MC4", name: "Dollar Exposure",      blurb: "Exposure on high-risk authorizations",  unit: "%",   threshold: "$", firstAlert: "10", firstThreshold: "5,000", reAlert: "5", reThreshold: "2,500" },
  { id: "P-MC5", name: "MC vs. VW Divergence", blurb: "The two models disagree on a merchant", unit: "pts", firstAlert: "120", reAlert: "40" },
  { id: "P-MC6", name: "MC vs. VW Concurrence", blurb: "Both models agree a merchant is risky", unit: "pts", firstAlert: "150", reAlert: "50" },
  { id: "P-MC7", name: "Approved-Risky Auth",  blurb: "High-score auths approved anyway",      unit: "%",   threshold: "$", firstAlert: "8",  firstThreshold: "2,000", reAlert: "3", reThreshold: "1,000" },
  { id: "P-MC8", name: "Score Variance",       blurb: "Score swings widely day to day",        unit: "pts", firstAlert: "90",  reAlert: "30" },
  { id: "P-MC9", name: "Peer-Relative Score",  blurb: "Score is high against MCC peers",       unit: "pts", firstAlert: "200", reAlert: "60" },
]

export const MC_PARAM_LABEL = (p: McParameter) => `${p.id} — ${p.name}`

export const ASSIGNED_GROUPS = [
  "MC Risk Team",
  "Card Network Risk — MC",
  "Portfolio Ops",
  "New Merchant Review",
]

export const DATE_WINDOWS = [
  "Merchants active <= 30 days",
  "Merchants active <= 60 days",
  "Merchants active <= 90 days",
]

export const ASSIGNMENT_TYPES = ["Detection Queue (DQ)", "Security Queue (SQ)", "Watch List (WL)"]

// Prefilled example the Figma walks through, used as the Nanci-review trigger name.
export const EXAMPLE_ASSIGNMENT_NAME = "New Merchants - High MC Trans"

// "Review with Nanci" — the analysis panel beside the form (frames 224/225).
export const NANCI_REVIEW = {
  bullets: [
    "P-MC1 ≥ 700 pts is the right floor — in the Sept–Dec 2025 portfolio analysis, 3,556 merchants cleared it while raising no VisionWeb alert at all.",
    "The +50 re-alert step is the problem: the highest Mastercard score observed in that data was 737.33, so a merchant that first alerts at 710 would have to reach 760 to re-alert — above anything the model actually produced. In practice it would alert once and then go silent.",
  ],
  suggestion: "Suggest tightening the re-alert step to 25–30 pts if you want closer tracking of merchants hovering just above 700, or keep it at 50 if you'd rather only hear about sharper jumps.",
  projectionLead: "Below is a projection with your re-alert indicator tightened to 20 pts:",
  before: "~18 alerts/day",
  after: "~40 alerts/day",
  // The value "Modify the Threshold" writes into P-MC1's re-alert indicator.
  tightenedTo: "20",
  confirmation: "The 50 pts re-alert indicator was tightened to 20 pts so slow climbers resurface sooner.",
}

// Projection chart: solid gray = current setup (historical), dashed blue = Nanci's
// recommendation taking over after "Today" (Jun).
export const NANCI_PROJECTION: { month: string; current: number; recommended: number | null }[] = [
  { month: "Jan", current: 16, recommended: null },
  { month: "Feb", current: 17, recommended: null },
  { month: "Mar", current: 17, recommended: null },
  { month: "Apr", current: 18, recommended: null },
  { month: "May", current: 18, recommended: null },
  { month: "Jun", current: 18, recommended: 18 },
  { month: "Jul", current: 19, recommended: 22 },
  { month: "Aug", current: 19, recommended: 26 },
  { month: "Sep", current: 20, recommended: 30 },
  { month: "Oct", current: 20, recommended: 34 },
  { month: "Nov", current: 21, recommended: 38 },
  { month: "Dec", current: 21, recommended: 42 },
]
