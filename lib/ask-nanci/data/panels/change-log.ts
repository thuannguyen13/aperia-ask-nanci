import { Settings, MapPin, FileText } from "lucide-react"

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
