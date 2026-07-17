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
export type RiskChipDest = "barometer-report"
export type RiskChipFilter = "critical"

// Four quick-action chips below the chat input.
export const RISK_QUICK_ACTIONS: { label: string; icon: LucideIcon; iconCls: string; prompt: string; dest?: RiskChipDest; filter?: RiskChipFilter }[] = [
  { label: "High Risk Merchants",     icon: Store,     iconCls: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",       prompt: "Show me today's high risk merchants", dest: "barometer-report" },
  { label: "VW Scores vs. MC Scores", icon: Target,    iconCls: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", prompt: "Compare VW scores vs MC scores for the alerted portfolio" },
  { label: "Re-Alert Rates",          icon: RefreshCw, iconCls: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500",    prompt: "What are the re-alert rates by assignment?" },
  { label: "Parameter Heat",          icon: Flame,     iconCls: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",            prompt: "Show me the top 10 parameters by heat" },
]

// "Nanci's take on today" — severity-dot insight cards. dot: semantic color.
export const RISK_NANCI_TAKES: {
  dot: string
  title: string
  body: string
  badges: { label: string; icon: LucideIcon }[]
  prompt: string
  dest?: RiskChipDest
  filter?: RiskChipFilter
}[] = [
  {
    dot: "bg-red-500",
    title: "Alert Volume requires attention",
    body: "357 alerts today — 63 more than yesterday. 20.1% re-alert rate suggests thresholds may be too loose.",
    badges: [{ label: "Alert Volume", icon: BarChartBig }, { label: "Re-Alert Rate", icon: Repeat2 }],
    prompt: "Why is alert volume running hot today?",
  },
  {
    dot: "bg-amber-500",
    title: "MC Velocity re-alert rate is 45.6% — highest today",
    body: "Suggested action: raise velocity threshold 15 → 20 pts. Only 18 alerts but very noisy.",
    badges: [{ label: "Re-Alert Rate", icon: Repeat2 }],
    prompt: "Review MC Velocity re-alert rate",
  },
  {
    dot: "bg-violet-500",
    title: "5 merchants are both VW critical and MC critical",
    body: "TX and OH merchants — 0553 OH Toledo and 8040 NY Rochester are highest priority with +180 and +140 score deltas.",
    badges: [{ label: "VW vs. MC Scatter", icon: LineChart }, { label: "High Risk Merchants", icon: TriangleAlert }],
    prompt: "Show the 5 merchants that are both VW and MC critical",
    dest: "barometer-report",
    filter: "critical",
  },
]
