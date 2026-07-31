// Aperia Risk — Detection Queue destination (Figma: "3. Detection Queue", 401:84863).
// Content only; layout lives in components/risk/DetectionQueue.tsx.
// Clearent's eligible-merchant count (1,586) is the REAL portfolio size
// (chargeback merchants, Sept–Dec 2025 — see wiki/aperia-risk/demo-data-spec.md).
// Esquire's was the real ESQR figure (4,681) until 2026-07-31, when it was set to
// 1,240 so the first queue reads as the smaller of the two on the card. The
// per-status counts and dollar amounts are illustrative throughout.
//
// The invariant that keeps the card honest: ready + wip + worked == alerted, in
// count and in amount, per queue (requirements.md:78 defines exactly these work
// states). Break it and the trail draws segments contradicting its own legend.
// Numbers here are quoted verbatim in risk-conversations.ts — keep the two in step.

export interface QueueStatus {
  key: "alerted" | "ready" | "wip" | "worked"
  label: string
  count: number
  amount: number
  color: "orange" | "amber" | "green" // trail segment / legend swatch color
}

export interface DetectionQueueData {
  assignment: string
  code: string // short pill next to the assignment name
  /** Mastercard-sourced queue — shows the network mark beside the name. */
  mastercard?: boolean
  eligibleMerchants: number
  /**
   * Re-queued KPI. An independent counter, not derived from any status: an item can
   * be re-queued and currently ready without one bounding the other
   * (requirements.md:78 lists it as a peer column of Ready to Work / WIP / Worked).
   */
  requeued: { count: number; amount: number }
  /** Denominator of the "% Worked" KPI ("{worked} of {workedOf}"). */
  workedOf: number
  /**
   * Where each alerted item stands. `ready + wip + worked` must equal `alerted` in
   * BOTH count and amount — the trail draws them as slices of that whole, so a set
   * that does not add up renders segments contradicting the numbers beside them.
   */
  statuses: QueueStatus[]
}

// Both queues from the Figma, in render order. The first is the Mastercard queue;
// the second is the non-Mastercard Authorizations assignment.
export const DETECTION_QUEUES: DetectionQueueData[] = [
  {
    assignment: "Esquire - Phase 2 Parameters - Auths - Detect Q",
    code: "DQ",
    mastercard: true,
    eligibleMerchants: 1240,
    requeued: { count: 11, amount: 5336.85 },
    workedOf: 357,
    statuses: [
      { key: "alerted", label: "Alerted",      count: 357, amount: 84901.89, color: "orange" },
      { key: "ready",   label: "Ready to Work", count: 357, amount: 84901.89, color: "orange" },
      { key: "wip",     label: "In Progress",   count: 0,   amount: 0,        color: "amber"  },
      { key: "worked",  label: "Worked",        count: 0,   amount: 0,        color: "green"  },
    ],
  },
  {
    assignment: "Authorizations Assignment",
    code: "DQ",
    eligibleMerchants: 1586,
    requeued: { count: 67, amount: 84664.75 },
    workedOf: 1022,
    statuses: [
      { key: "alerted", label: "Alerted",       count: 1022, amount: 380470.47, color: "orange" },
      { key: "ready",   label: "Ready to Work", count: 1021, amount: 373913.78, color: "orange" },
      { key: "wip",     label: "In Progress",   count: 0,    amount: 0,         color: "amber"  },
      { key: "worked",  label: "Worked",        count: 1,    amount: 6556.69,   color: "green"  },
    ],
  },
]

// The Mastercard queue — what the Barometer Report drills into.
export const DETECTION_QUEUE = DETECTION_QUEUES[0]

/**
 * Move marked merchants out of "Ready to Work" so the card agrees with the button
 * that was just pressed. Merchant rows carry no dollar figure, so a mark moves the
 * queue's average exposure per alerted item and `ready` takes the remainder — which
 * keeps `ready + wip + worked == alerted` exact in count and amount no matter how
 * many marks land. Marks are capped at the alerted count so ready cannot go negative.
 */
export function applyWorkMarks(queue: DetectionQueueData, marks: { wip: number; worked: number }): DetectionQueueData {
  if (!marks.wip && !marks.worked) return queue

  const at = (key: QueueStatus["key"]) => queue.statuses.find((s) => s.key === key)!
  const round2 = (n: number) => Math.round(n * 100) / 100
  const alerted = at("alerted")
  const perItem = round2(alerted.amount / alerted.count)

  const room = Math.max(0, alerted.count - at("wip").count - at("worked").count)
  const addWip = Math.min(marks.wip, room)
  const addWorked = Math.min(marks.worked, room - addWip)
  const move = (s: QueueStatus, n: number) => ({ ...s, count: s.count + n, amount: round2(s.amount + n * perItem) })

  const wip = move(at("wip"), addWip)
  const worked = move(at("worked"), addWorked)
  const ready = {
    ...at("ready"),
    count: alerted.count - wip.count - worked.count,
    amount: round2(alerted.amount - wip.amount - worked.amount),
  }
  return { ...queue, statuses: [alerted, ready, wip, worked] }
}
