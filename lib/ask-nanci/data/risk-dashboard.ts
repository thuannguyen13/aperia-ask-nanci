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

// ── Insight → highlight + panel content (keyed by RISK_NANCI_TAKES title) ─────
export interface DashInsight {
  highlight: DashChartId[]
  panel: { lead: string; heading: string; body: string; focusChart: DashChartId }
  chips: { label: string; action: "detection-queue" | "critical" | "none" }[]
}

export const DASH_INSIGHTS: Record<string, DashInsight> = {
  "Alert Volume requires attention": {
    highlight: ["alert-volume", "realert"],
    panel: {
      lead: "Here's my read on today. 364 merchants alerted, 298 ready to work. Three things I'd look at before anything else:",
      heading: "1. Alert volume is running hot.",
      body: "357 alerts — 63 more than yesterday. A 20.1% re-alert rate tells me some thresholds are too loose and re-firing on merchants you've already seen. Esquire - Phase 2 is carrying most of the load.",
      focusChart: "alert-volume",
    },
    chips: [
      { label: "View Re-Alert Breakdown", action: "none" },
      { label: "Open Detection Queue", action: "detection-queue" },
    ],
  },
  "MC Velocity re-alert rate is 45.6% — highest today": {
    highlight: ["realert", "param-heat"],
    panel: {
      lead: "Here's my read on today. Your noisiest parameter is the one to fix first:",
      heading: "MC Velocity re-alert rate is 45.6%.",
      body: "Only 18 alerts, but nearly half are repeats on merchants already surfaced — that's threshold noise, not new risk. Raising the velocity threshold from 15 → 20 points trims the repeats without touching your High-risk accounts.",
      focusChart: "realert",
    },
    chips: [{ label: "Review MC Velocity", action: "none" }],
  },
  "5 merchants are both VW critical and MC critical": {
    highlight: ["scatter", "high-risk"],
    panel: {
      lead: "Here's my read on today. Both models agree at the top — that's your strongest signal:",
      heading: "5 merchants are both VW and MC critical.",
      body: "They sit in the upper-right of the scatter — critical on both scores. 0553 OH Toledo (+180) and 8040 NY Rochester (+140) lead on score delta and should be worked first.",
      focusChart: "scatter",
    },
    chips: [
      { label: "Open 5 Critical Merchants", action: "critical" },
      { label: "Open Detection Queue", action: "detection-queue" },
    ],
  },
}
