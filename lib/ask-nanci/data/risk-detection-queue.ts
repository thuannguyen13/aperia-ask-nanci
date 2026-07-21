// Aperia Risk — Detection Queue destination (Figma: "3. Detection Queue", 401:84863).
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
  /** Mastercard-sourced queue — shows the network mark beside the name. */
  mastercard?: boolean
  eligibleMerchants: number
  /** Re-queued KPI. Tracked separately: it is not the "ready to work" status. */
  requeued: { count: number; amount: number }
  /** Denominator of the "% Worked" KPI ("{worked} of {workedOf}"). */
  workedOf: number
  statuses: QueueStatus[]
}

// Both queues from the Figma, in render order. The first is the Mastercard queue;
// the second is the non-Mastercard Authorizations assignment.
export const DETECTION_QUEUES: DetectionQueueData[] = [
  {
    assignment: "MC - Phase 2 Parameters - Auths - Detect Q",
    code: "DQ",
    mastercard: true,
    eligibleMerchants: 4036,
    requeued: { count: 11, amount: 84901.89 },
    workedOf: 11,
    statuses: [
      { key: "alerted", label: "Alerted",          count: 357, amount: 84901.89, color: "orange"  },
      { key: "ready",   label: "Ready to work",    count: 11,  amount: 84901.89, color: "teal"    },
      { key: "wip",     label: "Work in progress", count: 0,   amount: 0,        color: "amber"   },
      { key: "worked",  label: "Worked",           count: 0,   amount: 0,        color: "emerald" },
    ],
  },
  {
    assignment: "Non-MC Authorizations Assignment",
    code: "DQ",
    eligibleMerchants: 1166,
    requeued: { count: 67, amount: 84664.75 },
    workedOf: 1022,
    statuses: [
      { key: "alerted", label: "Alerted",          count: 1022, amount: 380470.47, color: "orange"  },
      { key: "ready",   label: "Ready to work",    count: 1021, amount: 373913.78, color: "teal"    },
      { key: "wip",     label: "Work in progress", count: 0,    amount: 0,         color: "amber"   },
      { key: "worked",  label: "Worked",           count: 1,    amount: 6556.69,   color: "emerald" },
    ],
  },
]

// The Mastercard queue — what the Barometer Report drills into.
export const DETECTION_QUEUE = DETECTION_QUEUES[0]
