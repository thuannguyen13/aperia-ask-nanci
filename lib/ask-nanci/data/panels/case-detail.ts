import { Phone, FileText, AlertTriangle, CreditCard } from "lucide-react"

export const TIMELINE = [
  { icon: Phone,         time: "Today 9:14am",     label: "Merchant call",       detail: "Confirmed no-refund policy at time of sale",       color: "text-blue-500"            },
  { icon: FileText,      time: "Yesterday 4:02pm", label: "Receipt uploaded",    detail: "Signed receipt attached to case file",             color: "text-green-500"           },
  { icon: AlertTriangle, time: "May 19",           label: "Chargeback received", detail: "Issuing bank dispute — reason: item not received",  color: "text-amber-500"           },
  { icon: CreditCard,    time: "May 14",           label: "Original transaction", detail: "$284.50 · Oak Street Coffee · Chip & PIN",         color: "text-muted-foreground"    },
]
