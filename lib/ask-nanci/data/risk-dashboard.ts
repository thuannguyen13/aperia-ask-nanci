// Aperia Risk — Dashboard destination (Figma: "3. Dashboard", 2 stages).
// ponytail: illustrative demo data, not a live feed.
import {
  AlertTriangle, Inbox, BarChart3, Briefcase, Timer, type LucideIcon,
} from "lucide-react"

// Chart ids used by the insight → highlight mapping.
export type DashChartId = "scatter" | "alert-volume" | "high-risk" | "param-heat" | "realert"

// ── Top KPI row ────────────────────────────────────────────────────────────
export const DASH_KPIS: { label: string; value: string; delta: string; deltaCls: string; sub: string; icon: LucideIcon }[] = [
  { label: "Alerted Today",     value: "364", delta: "+12%", deltaCls: "text-rose-600 dark:text-rose-400",    sub: "across 23 assignments",     icon: AlertTriangle },
  { label: "Ready to Work",     value: "298", delta: "+8%",  deltaCls: "text-rose-600 dark:text-rose-400",    sub: "66 oldest > 24h",           icon: Inbox },
  { label: "MC High Risk",      value: "79",  delta: "",     deltaCls: "text-muted-foreground",               sub: "of which 24 also VW Critical", icon: BarChart3 },
  { label: "Case Opened (Week)",value: "42",  delta: "-18m", deltaCls: "text-emerald-600 dark:text-emerald-400", sub: "avg time to case: 3h12m",   icon: Briefcase },
  { label: "% Worked in SLA",   value: "87%", delta: "-3%",  deltaCls: "text-rose-600 dark:text-rose-400",    sub: "target 90%",                icon: Timer },
]

// ── VW vs MC scatter (normalized to /100 on both axes, quadrant lines at 65) ──
export type ScatterCat = "both" | "mc" | "vw" | "none"
export const SCATTER_POINTS: { vw: number; mc: number; cat: ScatterCat }[] = [
  // Both critical (top-right)
  { vw: 78, mc: 92, cat: "both" }, { vw: 85, mc: 90, cat: "both" }, { vw: 90, mc: 94, cat: "both" },
  { vw: 72, mc: 82, cat: "both" }, { vw: 88, mc: 80, cat: "both" }, { vw: 95, mc: 88, cat: "both" }, { vw: 82, mc: 85, cat: "both" },
  // MC-only (top-left)
  { vw: 20, mc: 80 }, { vw: 12, mc: 78 }, { vw: 35, mc: 82 }, { vw: 48, mc: 76 }, { vw: 55, mc: 70 },
  // VW-only (bottom-right)
  { vw: 70, mc: 30 }, { vw: 78, mc: 22 }, { vw: 85, mc: 18 }, { vw: 72, mc: 12 }, { vw: 90, mc: 25 }, { vw: 68, mc: 8 },
  // Neither (bottom-left)
  { vw: 15, mc: 25 }, { vw: 28, mc: 18 }, { vw: 22, mc: 30 }, { vw: 40, mc: 22 }, { vw: 35, mc: 12 }, { vw: 10, mc: 15 },
].map((p) => ({ ...p, cat: (p.cat ?? (p.vw >= 65 && p.mc >= 65 ? "both" : p.mc >= 65 ? "mc" : p.vw >= 65 ? "vw" : "none")) })) as { vw: number; mc: number; cat: ScatterCat }[]

export const SCATTER_COLORS: Record<ScatterCat, string> = {
  both: "#dc2626", // red
  mc:   "#f59e0b", // amber
  vw:   "#0d9488", // teal
  none: "#94a3b8", // slate
}

// ── Alert Volume by Assignment (horizontal bars) ─────────────────────────────
export const ALERT_VOLUME: { name: string; count: number }[] = [
  { name: "Esquire - Phase 2 Parameters - Au…", count: 357 },
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
export const HIGH_RISK_MERCHANTS: { name: string; from: number; to: number; delta: number }[] = [
  { name: "0553 OH TOLEDO - CENTRAL",    from: 760, to: 940, delta: 180 },
  { name: "8040 NY ROCHESTER - HUDSON",  from: 710, to: 850, delta: 140 },
  { name: "0535 TX HOUSTON - NORTH FWY", from: 700, to: 820, delta: 120 },
  { name: "0759 TX GUN BARREL",          from: 790, to: 880, delta: 90 },
  { name: "0768 TX TYLER",               from: 630, to: 680, delta: 50 },
  { name: "0473 OH ALLIANCE",            from: 720, to: 760, delta: 40 },
  { name: "0245 MD ARBUTUS",             from: 400, to: 420, delta: 20 },
  { name: "0476 NE ALLIANCE",            from: 720, to: 736, delta: 16 },
  { name: "0249 TX ARBUTUS",             from: 400, to: 412, delta: 12 },
  { name: "0493 NY ALLIANCE",            from: 720, to: 730, delta: 10 },
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
  "Alert Volume requires attention": ["alert-volume", "realert"],
  "MC Velocity re-alert rate is 45.6% — highest today": ["realert", "param-heat"],
  "5 merchants are both VW critical and MC critical": ["scatter", "high-risk"],
}
