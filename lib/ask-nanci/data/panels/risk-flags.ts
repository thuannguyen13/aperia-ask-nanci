import { TrendingUp, CreditCard, Globe, AlertOctagon, Building2, MapPin } from "lucide-react"

export const FLAGS = [
  { icon: TrendingUp,   label: "Volume spike",          detail: "+340% in 30 days vs prior period",       severity: "critical" as const },
  { icon: CreditCard,   label: "Avg ticket doubled",    detail: "$42 → $84 average ticket size",           severity: "critical" as const },
  { icon: Globe,        label: "23% CNP — new BINs",    detail: "Card-not-present from unrecognized BINs", severity: "critical" as const },
  { icon: AlertOctagon, label: "3 chargebacks / week",  detail: "Prior 90 days: zero chargebacks",         severity: "critical" as const },
  { icon: Building2,    label: "Settlement acct changed", detail: "18 days ago · new routing ••••3341",   severity: "medium"   as const },
  { icon: MapPin,       label: "Address updated",        detail: "12 days ago · 831 Harbor Blvd",          severity: "medium"   as const },
]

export const criticalCount = FLAGS.filter(f => f.severity === "critical").length
export const mediumCount   = FLAGS.filter(f => f.severity === "medium").length
