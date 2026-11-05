import { describe, expect, it } from "vitest"
import { citeSource } from "./cite-source"
import { AMEX_SOURCE } from "./data/sources"

describe("citeSource", () => {
  it("gives a Resy source the Resy logo", () => {
    expect(citeSource("Resy reservations", AMEX_SOURCE)).toMatchObject([{ name: "Resy reservations", institution: "Resy", logo: "/logos/resy-logo.png" }])
  })

  it("splits a Resy source from the card data", () => {
    expect(citeSource("Resy reservations + card transactions", AMEX_SOURCE)).toEqual([expect.objectContaining({ name: "Resy reservations", institution: "Resy" }), AMEX_SOURCE])
  })

  it("keeps a report name with a plus in it as one source", () => {
    expect(citeSource("Combined MC + VW analysis · 774 chargeback merchants", AMEX_SOURCE)).toMatchObject([{ name: "Combined MC + VW analysis · 774 chargeback merchants", kind: "file" }])
  })
})
