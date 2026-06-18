import { Settings, MapPin, FileText } from "lucide-react"

export const CHANGE_SEVERITY_CLS = {
  high: {
    dotContainer: "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/40",
    dotIcon:      "text-red-500",
  },
  internal: {
    dotContainer: "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40",
    dotIcon:      "text-amber-600",
  },
  low: {
    dotContainer: "border-border bg-background",
    dotIcon:      "text-muted-foreground",
  },
} as const

export const CHANGES = [
  {
    date: "Apr 27",
    code: "CHG-003",
    action: "Settlement account updated",
    user: "M. Torres",
    role: "Pacific ISO",
    highlight: false,
    icon: Settings,
    severity: "high" as const,
  },
  {
    date: "Apr 15",
    code: "CHG-002",
    action: "Business address updated",
    user: "R. Vega",
    role: "Pacific ISO",
    highlight: false,
    icon: MapPin,
    severity: "low" as const,
  },
  {
    date: "Apr 4",
    code: "CHG-001",
    action: "DBA name updated",
    user: "S. Park",
    role: "Aperia Analyst",
    highlight: true,
    icon: FileText,
    severity: "internal" as const,
  },
]
