import { describe, expect, it } from "vitest"
import { formatCurrency, formatPercent } from "./format"

describe("formatCurrency", () => {
  it("always shows two fraction digits and a thousands separator", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50")
    expect(formatCurrency(1000000)).toBe("$1,000,000.00")
  })
  it("formats zero and whole numbers", () => {
    expect(formatCurrency(0)).toBe("$0.00")
    expect(formatCurrency(42)).toBe("$42.00")
  })
  it("keeps the sign for negatives", () => {
    expect(formatCurrency(-5)).toBe("-$5.00")
  })
  it("rounds to cents", () => {
    expect(formatCurrency(2.675)).toBe("$2.68")
  })
})

describe("formatPercent", () => {
  it("defaults to one decimal place", () => {
    expect(formatPercent(15)).toBe("15.0%")
    expect(formatPercent(2.666)).toBe("2.7%")
  })
  it("honours a custom precision", () => {
    expect(formatPercent(2.666, 2)).toBe("2.67%")
    expect(formatPercent(50, 0)).toBe("50%")
  })
})
