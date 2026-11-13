import { describe, expect, it } from "vitest"
import { citeSource, listCitedServiceIds } from "./cite-source"
import { CARRIER_CITES, CARRIER_SOURCE, CITABLE_SOURCES, REGISTER_SOURCE, VISION_WEB_SOURCE } from "./data/sources"

describe("citeSource", () => {
  it("names any Resy part as the one Resy source, as the composer lists it", () => {
    expect(citeSource("Resy reservations", VISION_WEB_SOURCE)).toMatchObject([{ name: "Resy", institution: "Resy Data", logo: "/logos/resy-logo.png" }])
    expect(citeSource("Resy multi-location", VISION_WEB_SOURCE)).toMatchObject([{ name: "Resy", institution: "Resy Data" }])
  })

  it("splits a Resy source from the card data, card data first as in the composer", () => {
    expect(citeSource("Resy reservations + card transactions", VISION_WEB_SOURCE)).toEqual([VISION_WEB_SOURCE, expect.objectContaining({ name: "Resy", institution: "Resy Data" })])
  })

  it("cites the built-in source, logo and all, when the answer names it", () => {
    expect(citeSource(CARRIER_SOURCE.name, CARRIER_SOURCE)).toEqual([CARRIER_SOURCE])
  })

  it("cites the carrier account and the register as two sources, the built-in first", () => {
    expect(citeSource(CARRIER_CITES.withSales, CARRIER_SOURCE, CITABLE_SOURCES)).toEqual([CARRIER_SOURCE, REGISTER_SOURCE])
  })

  it("keeps a report name with a plus in it as one source", () => {
    expect(citeSource("Combined MC + VW analysis · 774 chargeback merchants", VISION_WEB_SOURCE)).toMatchObject([{ name: "Combined MC + VW analysis · 774 chargeback merchants", kind: "file" }])
  })
})

describe("listCitedServiceIds", () => {
  it("names the marketplace sources an answer cites", () => {
    expect(listCitedServiceIds("Resy reservations + card transactions")).toEqual(["resy"])
    expect(listCitedServiceIds("Detection Queue · Phase 2")).toEqual([])
  })
})
