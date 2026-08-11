import { describe, it, expect } from "vitest"
import { ASSIGNMENTS, findAssignment } from "./risk-assignments"
import { ALERT_VOLUME, REALERT_ROWS } from "./risk-dashboard"
import { DETECTION_QUEUES } from "./risk-detection-queue"
import { PARAMETERS, findParameter } from "./risk-parameters"
import { PARAM_HEAT } from "./risk-dashboard"

// These assignments were named four different ways across four files before the
// registry landed, which is why nothing could link to anything. What follows pins the
// join: every table that names an assignment has to name one that exists.

describe("assignment registry", () => {
  it("has unique ids", () => {
    const ids = ASSIGNMENTS.map((a) => a.id)
    expect(ids).toEqual([...new Set(ids)])
  })

  it("has unique display names", () => {
    const names = ASSIGNMENTS.map((a) => a.name)
    expect(names).toEqual([...new Set(names)])
  })

  it.each([
    ["ALERT_VOLUME", ALERT_VOLUME.map((r) => r.assignmentId)],
    ["REALERT_ROWS", REALERT_ROWS.map((r) => r.assignmentId)],
    ["DETECTION_QUEUES", DETECTION_QUEUES.map((q) => q.assignmentId)],
  ])("%s only references assignments that exist", (_, ids) => {
    expect(ids.filter((id) => !findAssignment(id))).toEqual([])
  })

  it("never lists the same assignment twice in one metric table", () => {
    for (const ids of [ALERT_VOLUME.map((r) => r.assignmentId), REALERT_ROWS.map((r) => r.assignmentId)]) {
      expect(ids).toEqual([...new Set(ids)])
    }
  })

  // An expired assignment that raised alerts today is the contradiction the registry
  // was built to remove — it read as a live queue on one screen and a dead one on another.
  it("does not show today's alerts against an expired assignment", () => {
    const expired = new Set(ASSIGNMENTS.filter((a) => a.status === "Expired").map((a) => a.id))
    expect(ALERT_VOLUME.filter((r) => expired.has(r.assignmentId) && r.count > 0)).toEqual([])
  })
})

describe("parameter catalog", () => {
  it("has unique ids", () => {
    const ids = PARAMETERS.map((p) => p.id)
    expect(ids).toEqual([...new Set(ids)])
  })

  it("resolves every parameter the dashboard's heat chart plots", () => {
    expect(PARAM_HEAT.map((p) => p.param).filter((id) => !findParameter(id))).toEqual([])
  })
})
