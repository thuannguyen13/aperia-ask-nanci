import { TrendingUp, CreditCard, Globe, AlertOctagon, Building2, MapPin } from "lucide-react"

export const FLAGS = [
  { icon: TrendingUp,   label: "Volume spike",          detail: "+340% in 30 days vs prior period",       severity: "critical" as const },
  { icon: CreditCard,   label: "Avg ticket doubled",    detail: "$42 → $84 average ticket size",           severity: "critical" as const },
  { icon: Globe,        label: "23% CNP — new BINs",    detail: "Card-not-present from unrecognized BINs", severity: "critical" as const },
  { icon: AlertOctagon, label: "3 chargebacks / week",  detail: "Prior 90 days: zero chargebacks",         severity: "critical" as const },
  { icon: Building2,    label: "Settlement acct changed", detail: "18 days ago · new routing ••••3341",   severity: "medium"   as const },
  { icon: MapPin,       label: "Address updated",        detail: "12 days ago · 831 Harbor Blvd",          severity: "medium"   as const },
]

export const flagCount     = FLAGS.length
export const criticalCount = FLAGS.filter(f => f.severity === "critical").length
export const mediumCount   = FLAGS.filter(f => f.severity === "medium").length

export const FLAG_SEVERITY_CLS = {
  critical: {
    row:      "border-red-200 bg-red-50 dark:border-red-800/60 dark:bg-red-950/20",
    iconBg:   "bg-red-100 dark:bg-red-900/40",
    iconText: "text-red-600 dark:text-red-400",
    label:    "text-red-800 dark:text-red-300",
    detail:   "text-red-600 dark:text-red-400",
    dot:      "bg-red-500",
  },
  medium: {
    row:      "border-amber-200 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/20",
    iconBg:   "bg-amber-100 dark:bg-amber-900/40",
    iconText: "text-amber-600 dark:text-amber-400",
    label:    "text-amber-800 dark:text-amber-300",
    detail:   "text-amber-600 dark:text-amber-400",
    dot:      "bg-amber-500",
  },
} as const
