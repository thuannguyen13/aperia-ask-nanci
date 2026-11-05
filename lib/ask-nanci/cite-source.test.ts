import { describe, expect, it } from "vitest"
import { citeSource } from "./cite-source"
import { VISION_WEB_SOURCE } from "./data/sources"

describe("citeSource", () => {
  it("gives a Resy source the Resy logo", () => {
    expect(citeSource("Resy reservations", VISION_WEB_SOURCE)).toMatchObject([{ name: "Resy reservations", institution: "Resy", logo: "/logos/resy-logo.png" }])
  })

  it("splits a Resy source from the card data", () => {
    expect(citeSource("Resy reservations + card transactions", VISION_WEB_SOURCE)).toEqual([expect.objectContaining({ name: "Resy reservations", institution: "Resy" }), VISION_WEB_SOURCE])
  })

  it("keeps a report name with a plus in it as one source", () => {
    expect(citeSource("Combined MC + VW analysis · 774 chargeback merchants", VISION_WEB_SOURCE)).toMatchObject([{ name: "Combined MC + VW analysis · 774 chargeback merchants", kind: "file" }])
  })
})
