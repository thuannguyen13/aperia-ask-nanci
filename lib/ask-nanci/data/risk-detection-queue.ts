// Aperia Risk — Detection Queue destination (Figma: "3. Detection Queue").
// Content only; layout lives in components/risk/DetectionQueue.tsx.
// ponytail: illustrative queue data for the demo skin, not a live feed.

export interface QueueStatus {
  key: "alerted" | "ready" | "wip" | "worked"
  label: string
  count: number
  amount: number
  color: "orange" | "teal" | "amber" | "emerald" // semantic left-border / bar color
}

export interface DetectionQueueData {
  assignment: string
  code: string // short pill next to the assignment name
  eligibleMerchants: number
  statuses: QueueStatus[]
}

// The queue shown in the Figma. `% Worked` and the KPI totals derive from `statuses`.
export const DETECTION_QUEUE: DetectionQueueData = {
  assignment: "Esquire - Phase 2 Parameters - Auths - Detect Q",
  code: "DQ",
  eligibleMerchants: 4036,
  statuses: [
    { key: "alerted", label: "Alerted",          count: 357, amount: 84901.89, color: "orange"  },
    { key: "ready",   label: "Ready to work",    count: 11,  amount: 84901.89, color: "teal"    },
    { key: "wip",     label: "Work in progress", count: 0,   amount: 0,        color: "amber"   },
    { key: "worked",  label: "Worked",           count: 0,   amount: 0,        color: "emerald" },
  ],
}
