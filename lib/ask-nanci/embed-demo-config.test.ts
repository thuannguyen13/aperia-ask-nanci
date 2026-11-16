import { describe, expect, it } from "vitest"
import { parseMode } from "./embed-demo-config"

const OTHER_MODES = [null, "", "clover", "business-owner", "iso", "concept-embed", "vw", "abc", "concept", "concept-nav", "titan", "titan-embed", "talus", "talus-embed", "amex", "tib", "woodforest", "placeholder", "onboarding", "unknown"]

describe("parseMode", () => {
  it("narrows mode=resy to the Resy scope on the concept catalog", () => {
    expect(parseMode("resy")).toMatchObject({ scope: "resy", catalog: true, isConceptVersion: true })
  })

  it("narrows mode=resy-embed to the Resy scope in the compact widget", () => {
    expect(parseMode("resy-embed")).toMatchObject({ scope: "resy", theme: "amex", isEmbed: true, embedVariant: "concept-embed" })
  })

  it("narrows mode=carrier and mode=carrier-embed to the carrier scope", () => {
    expect(parseMode("carrier")).toMatchObject({ scope: "carrier", theme: "carrier", catalog: true, isConceptVersion: true, isEmbed: false })
    expect(parseMode("carrier-embed")).toMatchObject({ scope: "carrier", theme: "carrier", isEmbed: true, embedVariant: "concept-embed" })
  })

  it("plays concept flows in mode=amex with onboarding closed", () => {
    expect(parseMode("amex")).toMatchObject({ theme: "amex", scope: null, isConceptVersion: true, catalog: false, onboarded: true })
  })

  it.each([null, "concept", "titan", "talus", "resy", "carrier", "amex", "tib", "woodforest", "placeholder", "onboarding"])("plays concept flows in full-app mode=%s", (mode) => {
    expect(parseMode(mode).isConceptVersion).toBe(true)
  })

  it.each(OTHER_MODES)("leaves mode=%s unscoped", (mode) => {
    expect(parseMode(mode).scope).toBeNull()
  })
})
