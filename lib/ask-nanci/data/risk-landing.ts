// Ask Nanci — Aperia Risk landing content (Figma: "Aperia Risk Home Page").
// Content only; the layout lives in components/risk/RiskLanding.tsx.
import {
  Store, Target, RefreshCw, Flame, BarChartBig, Repeat2, LineChart, TriangleAlert,
  type LucideIcon,
} from "lucide-react"

// Blue stat line under the greeting.
export const RISK_HEADLINE_STATS = [
  "364 merchants alerted today",
  "298 ready to work",
  "3 things need your attention",
]

// A landing chip either asks Nanci (`prompt` → chat answer) or jumps straight to a
// risk destination (`dest`, optionally with a merchant `filter`). See RiskLanding.
// The same union types the navigating suggestion pills (RISK_SUGGESTION_DESTS).
export type RiskChipDest = "barometer-report" | "detection-queue"
export type RiskChipFilter = "critical"

// Four quick-action chips below the chat input.
export const RISK_QUICK_ACTIONS: { label: string; icon: LucideIcon; iconCls: string; prompt: string; dest?: RiskChipDest; filter?: RiskChipFilter }[] = [
  { label: "High Risk Merchants",     icon: Store,     iconCls: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",       prompt: "Show me today's high risk merchants", dest: "barometer-report" },
  { label: "VW Scores vs. MC Scores", icon: Target,    iconCls: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", prompt: "Compare VW scores vs MC scores for the alerted portfolio" },
  { label: "Re-Alert Rates",          icon: RefreshCw, iconCls: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500",    prompt: "What are the re-alert rates by assignment?" },
  { label: "Parameter Heat",          icon: Flame,     iconCls: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",            prompt: "Show me the top 10 parameters by heat" },
]

// "Nanci's take on today" — severity-dot insight cards. dot: semantic color.
// A take always answers as a conversation (never jumps to a destination): on the
// landing that's the chat view, on the Dashboard it's the sibling chat panel.
export interface RiskTake {
  dot: string
  title: string
  body: string
  badges: { label: string; icon: LucideIcon }[]
  prompt: string
}

// Today-shaped takes: each one is read off the dashboard charts its badges name,
// so a number here can be checked against the chart it points at. The badges and
// DASH_HIGHLIGHTS are kept in step — the charts a take names are the charts that
// ring when you open it.
export const RISK_NANCI_TAKES: RiskTake[] = [
  {
    dot: "bg-red-500",
    title: "Alert Volume requires attention",
    // 357 and 294 are ALERT_VOLUME's Esquire row; 20.1% is REALERT_ROWS' rate for
    // the same assignment.
    body: "357 alerts today — 63 more than yesterday, and a 20.1% re-alert rate on the same queue suggests thresholds may be too loose.",
    badges: [{ label: "Alert Volume", icon: BarChartBig }, { label: "Re-Alert Rate", icon: Repeat2 }],
    prompt: "Why is alert volume running hot today?",
  },
  {
    dot: "bg-amber-500",
    // 45.6%, the suggested action and the 18 alerts are all REALERT_ROWS /
    // ALERT_VOLUME rows for MC Velocity (system).
    title: "MC Velocity re-alert rate is 45.6% — highest today",
    body: "Suggested action: raise velocity threshold 15 → 20 pts. Only 18 alerts but very noisy.",
    badges: [{ label: "Re-Alert Rate", icon: Repeat2 }],
    prompt: "Review MC Velocity re-alert rate",
  },
  {
    dot: "bg-violet-500",
    // Five of the 30 merchant rows are High on both models; the two named are the
    // biggest 30-day MC movers among those five (HIGH_RISK_MERCHANTS).
    title: "5 merchants are both VW critical and MC critical",
    body: "Regency Furniture Manchester and Brighton Medical Supply are highest priority, at +410 and +264 on the 30-day MC delta.",
    badges: [{ label: "VW vs. MC Scatter", icon: LineChart }, { label: "High Risk Merchants", icon: TriangleAlert }],
    prompt: "Which merchants are critical on both models?",
  },
]
