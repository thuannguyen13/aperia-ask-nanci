import { describe, it, expect } from "vitest"
import { applyWorkMarks, DETECTION_QUEUES, DETECTION_QUEUE, type DetectionQueueData } from "./risk-detection-queue"

// The card renders the statuses as slices of `alerted`, so the one thing worth
// pinning is that they keep summing to it — before and after marks land.
const sums = (q: DetectionQueueData) => {
  const at = (key: string) => q.statuses.find((s) => s.key === key)!
  const parts = ["ready", "wip", "worked"].map(at)
  return {
    alerted: at("alerted"),
    count: parts.reduce((n, s) => n + s.count, 0),
    amount: Math.round(parts.reduce((n, s) => n + s.amount, 0) * 100) / 100,
  }
}

describe("DETECTION_QUEUES", () => {
  it.each(DETECTION_QUEUES.map((q) => [q.assignment, q] as const))("%s decomposes alerted", (_, q) => {
    const s = sums(q)
    expect(s.count).toBe(s.alerted.count)
    expect(s.amount).toBe(s.alerted.amount)
  })

  it("keeps re-queued inside the queue it belongs to", () => {
    for (const q of DETECTION_QUEUES) {
      const alerted = q.statuses.find((s) => s.key === "alerted")!
      expect(q.requeued.count).toBeLessThanOrEqual(alerted.count)
      expect(q.requeued.amount).toBeLessThanOrEqual(alerted.amount)
    }
  })
})

describe("applyWorkMarks", () => {
  it("returns the queue untouched when nothing is marked", () => {
    expect(applyWorkMarks(DETECTION_QUEUE, { wip: 0, worked: 0 })).toBe(DETECTION_QUEUE)
  })

  it("moves marked items out of ready and holds the sum", () => {
    const q = applyWorkMarks(DETECTION_QUEUE, { wip: 2, worked: 3 })
    const at = (key: string) => q.statuses.find((s) => s.key === key)!
    expect(at("wip").count).toBe(2)
    expect(at("worked").count).toBe(3)
    expect(at("ready").count).toBe(352) // 357 − 5
    const s = sums(q)
    expect(s.count).toBe(s.alerted.count)
    expect(s.amount).toBe(s.alerted.amount)
  })

  it("moves money with the items", () => {
    const q = applyWorkMarks(DETECTION_QUEUE, { wip: 0, worked: 1 })
    const at = (key: string) => q.statuses.find((s) => s.key === key)!
    expect(at("worked").amount).toBeCloseTo(237.82, 2) // $84,901.89 / 357
    expect(at("ready").amount).toBeCloseTo(84664.07, 2)
  })

  it("never drives ready negative, however many marks arrive", () => {
    const q = applyWorkMarks(DETECTION_QUEUE, { wip: 500, worked: 500 })
    const at = (key: string) => q.statuses.find((s) => s.key === key)!
    expect(at("ready").count).toBe(0)
    expect(at("ready").amount).toBeGreaterThanOrEqual(0)
    expect(sums(q).count).toBe(357)
  })

  it("leaves the source queue alone", () => {
    applyWorkMarks(DETECTION_QUEUE, { wip: 1, worked: 1 })
    expect(DETECTION_QUEUE.statuses.find((s) => s.key === "worked")!.count).toBe(0)
  })
})
