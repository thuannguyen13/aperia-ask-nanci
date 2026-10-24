import { describe, expect, it } from "vitest"
import { inScope } from "./flow-scopes"
import { MARKETPLACE_SERVICES } from "./panels/service-marketplace"

describe("inScope", () => {
  it("keeps scoped items out of the unscoped demo", () => {
    expect(inScope(null)({ scope: "resy" })).toBe(false)
    expect(inScope(null)({})).toBe(true)
  })

  it("keeps unscoped items out of a scoped mode", () => {
    expect(inScope("resy")({})).toBe(false)
    expect(inScope("resy")({ scope: "resy" })).toBe(true)
  })
})

describe("marketplace listings by scope", () => {
  it("lists only Resy in resy mode", () => {
    expect(MARKETPLACE_SERVICES.filter(inScope("resy")).map((s) => s.id)).toEqual(["resy"])
  })

  it("leaves Resy out of every other mode", () => {
    const unscoped = MARKETPLACE_SERVICES.filter(inScope(null))
    expect(unscoped.length).toBeGreaterThan(0)
    expect(unscoped.map((s) => s.id)).not.toContain("resy")
  })
})
