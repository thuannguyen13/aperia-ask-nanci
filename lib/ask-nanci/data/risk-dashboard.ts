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
export const ALERT_VOLUME: { name: string; count: number }[] = [
  { name: "Esquire - Phase 2 Parameters - Auths…", count: 357 },
  { name: "Low Risk DQ - By MCC", count: 303 },
  { name: "MC Watchlist (system)", count: 52 },
  { name: "High Risk DQ - By MCC", count: 25 },
  { name: "Moderate Risk DQ - By MCC", count: 19 },
  { name: "MC Velocity (system)", count: 18 },
  { name: "Unacceptable Risk DQ", count: 10 },
  { name: "MC Divergence (system)", count: 9 },
  { name: "Phase 2 - Auths Detect Q", count: 7 },
]

// ── High Risk Merchants (MC score jumpers) ───────────────────────────────────
// The same seven merchants the Barometer Report lists, so a name clicked here and
// a name read there are the same account. `to` is each merchant's current MC score
// on the 0–1000 scale; `from` is that score minus its 30-day delta.
export const HIGH_RISK_MERCHANTS: { name: string; from: number; to: number; delta: number }[] = [
  { name: "CASCADE AUTO PARTS WAREHOUSE",   from: 100.08, to: 711.08, delta: 611 },
  { name: "REGENCY FURNITURE MANCHESTER",   from: 327.33, to: 737.33, delta: 410 },
  { name: "ASHLEY HOMESTORE - MECHANICSBU", from: 513.05, to: 701.05, delta: 188 },
  { name: "MERIDIAN DENTAL GROUP",          from: 0,      to: 95.99,  delta: 96 },
  { name: "JB HEALTH SHOP",                 from: 245.64, to: 339.64, delta: 94 },
  { name: "JB VITALITY BEAUTY",             from: 268.52, to: 329.52, delta: 61 },
  { name: "PBBILLER.COM",                   from: 71.69,  to: 83.69,  delta: 12 },
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
export const REALERT_ROWS: { assignment: string; worked: number; realerted: number; rate: number; action: string }[] = [
  { assignment: "Phase 2 Parameters - Detect Q", worked: 2184, realerted: 438, rate: 20.1, action: "+180" },
  { assignment: "Low Risk DQ - By MCC",          worked: 1724, realerted: 512, rate: 29.7, action: "Tighten re-alert delta on P11/P12" },
  { assignment: "High Risk DQ - By MCC",         worked: 182,  realerted: 22,  rate: 12.1, action: "+120" },
  { assignment: "MC Watchlist (system)",         worked: 312,  realerted: 28,  rate: 9.0,  action: "+90" },
  { assignment: "MC Velocity (system)",          worked: 68,   realerted: 31,  rate: 45.6, action: "Raise velocity threshold from 15 → 20 pts" },
]

// ── Take → the charts its answer points at (keyed by RISK_NANCI_TAKES title) ──
// Clicking a take opens the sibling chat panel; these charts get ringed and the
// rest dim, so the answer and the dashboard behind it stay tied together.
export const DASH_HIGHLIGHTS: Record<string, DashChartId[]> = {
  "3,556 merchants scored above 700 with no alert": ["high-risk", "alert-volume"],
  "Together the two models cover 91% of chargeback merchants": ["scatter", "high-risk"],
  "MC Velocity re-alert rate is 45.6% — highest today": ["realert", "param-heat"],
}

// Chart → the take its sparkle button asks Nanci about. The inverse of
// DASH_HIGHLIGHTS, but hand-written because `high-risk` appears under two takes and
// belongs to the more specific one (the take that is literally about high MC scores).
export const CHART_TAKE: Record<DashChartId, string> = {
  "alert-volume": "3,556 merchants scored above 700 with no alert",
  "high-risk":    "3,556 merchants scored above 700 with no alert",
  scatter:        "Together the two models cover 91% of chargeback merchants",
  realert:        "MC Velocity re-alert rate is 45.6% — highest today",
  "param-heat":   "MC Velocity re-alert rate is 45.6% — highest today",
}
