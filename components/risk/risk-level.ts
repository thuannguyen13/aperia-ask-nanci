import type { RiskLevel } from "@/lib/ask-nanci/data/risk-merchants"

// One risk-level → colour map for the whole Risk console. It stopped being
// decoration the moment the two models were allowed to disagree: a merchant can
// be VW High and MC Low on the same Risk Report, so the badge and the score have
// to be coloured off the level rather than pinned to the Figma's red.

export const RISK_PILL: Record<RiskLevel, string> = {
  High:   "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Low:    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
}

// The Risk Report's MC card sits on a near-black panel, where the design system's
// 10%-opacity fills go muddy — hence the opaque variants.
const PILL_ON_DARK: Record<RiskLevel, string> = {
  High:   "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-700",
  Low:    "bg-slate-200 text-slate-700",
}

const SCORE: Record<RiskLevel, string> = {
  High:   "text-rose-600 dark:text-rose-400",
  Medium: "text-amber-600 dark:text-amber-500",
  Low:    "text-foreground",
}

const SCORE_ON_DARK: Record<RiskLevel, string> = {
  High:   "text-rose-500",
  Medium: "text-amber-400",
  Low:    "text-slate-300",
}

/** Badge and score-number classes for one score card, light panel or dark. */
export const getRiskLevelStyles = (level: RiskLevel, onDark = false) => ({
  badge: onDark ? PILL_ON_DARK[level] : RISK_PILL[level],
  score: onDark ? SCORE_ON_DARK[level] : SCORE[level],
})
