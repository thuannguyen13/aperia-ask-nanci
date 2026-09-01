// Aperia Risk — Dashboard destination (Figma: "3. Dashboard", 2 stages).
//
// ponytail: mixed provenance. The MC scores, the 3,556 KPI and the scatter's
// quadrant proportions are REAL findings from the PO's client analyses (Sept–Dec
// 2025, see wiki/aperia-risk/demo-data-spec.md); the today-shaped operational
// numbers (alerted today, SLA, parameter heat, re-alert rates) are still
// illustrative. Anything carrying a real figure says so in a `sub` or a comment.
import {
  AlertTriangle, Inbox, BarChart3, Briefcase, Timer, type LucideIcon,
} from "lucide-react"

// Chart ids used by the insight → highlight mapping.
export type DashChartId = "scatter" | "alert-volume" | "high-risk" | "param-heat" | "realert"

// ── Top KPI row ────────────────────────────────────────────────────────────
// Read-only. These are the shape of the day, not a way into it: the screens they
// would drill to are all one click away on the rail, and a card that navigates on
// the same tap that reads its number makes the number feel like a control.
export const DASH_KPIS: { label: string; value: string; delta: string; deltaCls: string; sub: string; icon: LucideIcon }[] = [
  { label: "Alerted Today",     value: "364", delta: "+12%", deltaCls: "text-rose-600 dark:text-rose-400",    sub: "across 23 assignments",     icon: AlertTriangle },
  { label: "Ready to Work",     value: "298", delta: "+8%",  deltaCls: "text-rose-600 dark:text-rose-400",    sub: "66 oldest > 24h",           icon: Inbox },
  // The standing finding, not a today number — hence the explicit period in `sub`.
  { label: "MC >700, No Alert", value: "3,556", delta: "", deltaCls: "text-muted-foreground",                sub: "Sept–Dec 2025 · 317 confirmed fraud", icon: BarChart3 },
  { label: "Case Opened (Week)",value: "42",  delta: "-18m", deltaCls: "text-emerald-600 dark:text-emerald-400", sub: "avg time to case: 3h12m",   icon: Briefcase },
  { label: "% Worked in SLA",   value: "87%", delta: "-3%",  deltaCls: "text-rose-600 dark:text-rose-400",    sub: "target 90%",                icon: Timer },
]

// ── VW vs MC scatter (normalized to /100 on both axes, quadrant lines at 65) ──
// The quadrant counts are in the real proportions from the 774-chargeback-merchant
// population: 326 flagged by both, 312 by Mastercard only, 67 by VisionWeb only,
// 69 by neither — so the top-left (MC-only) quadrant is as crowded as the top-right,
// which is the whole "Mastercard adds coverage VisionWeb does not have" argument.
// MC is divided by 10 to share the /100 axis, so 74 here is a real score of ~740 —
// nothing sits near 90, because nothing in the real data scores that high.
export type ScatterCat = "both" | "mc" | "vw" | "none"
export const SCATTER_POINTS: { vw: number; mc: number; cat: ScatterCat }[] = [
  // Both critical (top-right) — 13 of 32
  { vw: 89, mc: 74 }, { vw: 74, mc: 70 }, { vw: 81, mc: 72 }, { vw: 68, mc: 67 }, { vw: 77, mc: 71 },
  { vw: 92, mc: 69 }, { vw: 70, mc: 73 }, { vw: 84, mc: 66 }, { vw: 66, mc: 70 }, { vw: 79, mc: 68 },
  { vw: 87, mc: 71 }, { vw: 72, mc: 66 }, { vw: 95, mc: 72 },
  // MC-only (top-left) — 13 of 32, deliberately as dense as the quadrant above
  { vw: 20, mc: 71 }, { vw: 12, mc: 68 }, { vw: 35, mc: 73 }, { vw: 48, mc: 70 }, { vw: 55, mc: 67 },
  { vw: 28, mc: 74 }, { vw: 41, mc: 66 }, { vw: 8,  mc: 70 }, { vw: 60, mc: 72 }, { vw: 33, mc: 69 },
  { vw: 52, mc: 66 }, { vw: 17, mc: 73 }, { vw: 45, mc: 68 },
  // VW-only (bottom-right) — 3 of 32
  { vw: 87, mc: 10 }, { vw: 76, mc: 8 }, { vw: 70, mc: 34 },
  // Neither (bottom-left) — 3 of 32
  { vw: 15, mc: 25 }, { vw: 40, mc: 33 }, { vw: 28, mc: 12 },
].map((p) => ({ ...p, cat: (p.vw >= 65 && p.mc >= 65 ? "both" : p.mc >= 65 ? "mc" : p.vw >= 65 ? "vw" : "none") as ScatterCat }))

export const SCATTER_COLORS: Record<ScatterCat, string> = {
  both: "#dc2626", // red
  mc:   "#f59e0b", // amber
  vw:   "#0d9488", // teal
  none: "#94a3b8", // slate
}

// ── Alert Volume by Assignment (horizontal bars) ─────────────────────────────
// Today's new alerts per assignment. Keyed by assignment id, not by a display name:
// the label the bar renders comes from ASSIGNMENTS, so the chart and the queue card
// can no longer call the same assignment two different things.
//
// `prev` is yesterday's count for the same assignment. It is what lets the Alert
// Volume take say "63 more than yesterday" instead of asserting a delta from
// nowhere; the chart itself still plots `count`.
//
// Note this measures *alerts raised today*, which is a different quantity from the
// standing queue depth in DETECTION_QUEUES — a queue can hold 1,022 unworked items
// and still raise none today. Both are real; neither derives from the other.
export const ALERT_VOLUME: { assignmentId: string; count: number; prev: number }[] = [
  { assignmentId: "esqr-phase2-auths", count: 357, prev: 294 },
  { assignmentId: "low-risk-mcc",      count: 303, prev: 311 },
  { assignmentId: "mc-watch",          count: 52,  prev: 47 },
  { assignmentId: "high-risk-mcc",     count: 25,  prev: 28 },
  { assignmentId: "moderate-risk-mcc", count: 19,  prev: 21 },
  { assignmentId: "mc-velocity",       count: 18,  prev: 12 },
  { assignmentId: "unacceptable-risk", count: 10,  prev: 10 },
  { assignmentId: "mc-divergence",     count: 9,   prev: 11 },
  { assignmentId: "esqr-phase2",       count: 7,   prev: 6 },
]

/** Today's alert count for an assignment — 0 for one that did not fire. */
export const alertsToday = (assignmentId: string) =>
  ALERT_VOLUME.find((a) => a.assignmentId === assignmentId)?.count ?? 0

// ── High Risk Merchants (MC score jumpers) ───────────────────────────────────
// The ten biggest 30-day MC movers, all drawn from the Barometer Report's merchant
// list, so a name clicked here and a name read there are the same account. `id` is
// the RISK_MERCHANTS key, which is what makes the row a link into that merchant's
// Risk Report. `to` is each merchant's current MC score on the 0–1000 scale and
// matches its RISK_MERCHANTS row exactly; `from` is that score minus its 30-day delta.
export const HIGH_RISK_MERCHANTS: { id: string; name: string; from: number; to: number; delta: number }[] = [
  { id: "cascade",     name: "CASCADE AUTO PARTS WAREHOUSE",   from: 100.08, to: 711.08, delta: 611 },
  { id: "regency",     name: "REGENCY FURNITURE MANCHESTER",   from: 327.33, to: 737.33, delta: 410 },
  { id: "apexroofing", name: "APEX ROOFING SOLUTIONS",         from: 318.19, to: 707.19, delta: 389 },
  { id: "goldleaf",    name: "GOLDLEAF JEWELRY EXCHANGE",      from: 419.12, to: 733.12, delta: 314 },
  { id: "brighton",    name: "BRIGHTON MEDICAL SUPPLY",        from: 448.40, to: 712.40, delta: 264 },
  { id: "harborpoint", name: "HARBOR POINT MARINE SVCS",       from: 502.05, to: 726.05, delta: 224 },
  { id: "ashley",      name: "ASHLEY HOMESTORE - MECHANICSBU", from: 513.05, to: 701.05, delta: 188 },
  { id: "coastalwell", name: "COASTAL WELLNESS PARTNERS",      from: 546.88, to: 704.88, delta: 158 },
  { id: "northgate",   name: "NORTHGATE APPLIANCE CTR",        from: 604.44, to: 731.44, delta: 127 },
  { id: "meridian",    name: "MERIDIAN DENTAL GROUP",          from: 0,      to: 95.99,  delta: 96 },
]

// ── Top 10 Parameters Heat (bars = Fires count, line = Case Rate %) ───────────
export const PARAM_HEAT: { param: string; fires: number; caseRate: number }[] = [
  { param: "P14",   fires: 210, caseRate: 20 },
  { param: "P-MC1", fires: 70,  caseRate: 42 },
  { param: "P11",   fires: 130, caseRate: 10 },
  { param: "P38",   fires: 110, caseRate: 30 },
  { param: "P-MC5", fires: 30,  caseRate: 15 },
  { param: "P39",   fires: 90,  caseRate: 36 },
  { param: "P26",   fires: 55,  caseRate: 40 },
  { param: "P-MC2", fires: 20,  caseRate: 10 },
  { param: "P41",   fires: 80,  caseRate: 24 },
  { param: "P12",   fires: 65,  caseRate: 12 },
]

// ── Re-alert Rate by Assignment ──────────────────────────────────────────────
// A period metric, not a today metric: `worked` counts everything worked on the
// assignment over the reporting window, and `realerted` how much of it came back.
// Keyed by assignment id like ALERT_VOLUME, so a row here and a bar there resolve to
// the same assignment.
// The two assignments the Detection Queue actually carries, and nothing else: each
// name here opens that queue's Barometer Report, so a row for a queue with no report
// behind it would land on someone else's merchant list.
export const REALERT_ROWS: { assignmentId: string; worked: number; realerted: number; rate: number; action: string }[] = [
  { assignmentId: "esqr-phase2-auths", worked: 2184, realerted: 438, rate: 20.1, action: "Tighten re-alert delta on P11/P12" },
  { assignmentId: "authorizations",    worked: 1540, realerted: 247, rate: 16.0, action: "Review the re-alert window on declines" },
]

// ── Take → the charts its answer points at (keyed by RISK_NANCI_TAKES title) ──
// Clicking a take opens the sibling chat panel; these charts get ringed and the
// rest dim, so the answer and the dashboard behind it stay tied together.
// Each list is exactly the charts named by that take's badges, so what the card
// offers and what lights up behind it cannot drift apart.
export const DASH_HIGHLIGHTS: Record<string, DashChartId[]> = {
  "Alert Volume requires attention": ["alert-volume", "realert"],
  "MC Velocity re-alert rate is 45.6% — highest today": ["realert"],
  "5 merchants are both VW critical and MC critical": ["scatter", "high-risk"],
}

// Chart → the take its sparkle button asks Nanci about. The inverse of
// DASH_HIGHLIGHTS, but hand-written because `realert` appears under two takes and
// belongs to the more specific one (the take that is only about re-alert rate).
// Partial on purpose: no take covers parameter heat today, and pointing its button
// at an unrelated take would dim the very chart the user asked from.
export const CHART_TAKE: Partial<Record<DashChartId, string>> = {
  "alert-volume": "Alert Volume requires attention",
  realert:        "MC Velocity re-alert rate is 45.6% — highest today",
  scatter:        "5 merchants are both VW critical and MC critical",
  "high-risk":    "5 merchants are both VW critical and MC critical",
}

// ── Dashboard filter chips ───────────────────────────────────────────────────
// The scope the dashboard is reporting on, shown as chips under the title.
//
// ponytail: the chips hold and show a choice but do not narrow the numbers. Every
// figure on this dashboard is a single fixed snapshot — there is no per-day or
// per-analyst dimension behind it — so filtering would have to invent data rather
// than select it. Same reasoning as the Refresh, Export and sort affordances on
// these screens, which are also chrome the demo shows without wiring.

/** The day every figure on this dashboard describes. Matches VIOLATION_ROWS' alertOn. */
export const DASH_TODAY = "Today · May 3, 2026"

export const DASH_DATE_RANGES = [DASH_TODAY, "Yesterday", "Last 7 days", "Last 30 days", "This cycle"]

/** Assignment scope reads off the real assignment list, so the two cannot drift. */
export const DASH_SCOPE_ALL = "All"

export const DASH_ANALYST_EVERYONE = "Everyone"
export const DASH_ANALYSTS = [DASH_ANALYST_EVERYONE, "Teresa Walker", "Unassigned"]

/** What "+ Add filter" offers. Named here so the row stays data, not markup. */
export const DASH_MORE_FILTERS = ["Risk level", "MCC", "Card network", "Alert reason"]
