import { describe, expect, it } from "vitest"
import { parseMode } from "./embed-demo-config"

const OTHER_MODES = [null, "", "clover", "business-owner", "iso", "concept-embed", "vw", "abc", "concept", "concept-nav", "titan", "titan-embed", "talus", "talus-embed", "tib", "woodforest", "placeholder", "onboarding", "unknown"]

describe("parseMode", () => {
  it("narrows mode=resy to the Resy scope on the concept catalog", () => {
    expect(parseMode("resy")).toMatchObject({ scope: "resy", catalog: true, isConceptVersion: true })
  })

  it.each(OTHER_MODES)("leaves mode=%s unscoped", (mode) => {
    expect(parseMode(mode).scope).toBeNull()
  })
})
