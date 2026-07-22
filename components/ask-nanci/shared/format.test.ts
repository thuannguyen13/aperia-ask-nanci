import { describe, expect, it } from "vitest"
import { formatCurrency, formatPercent, formatWholeCurrency } from "./format"

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

describe("formatWholeCurrency", () => {
  it("drops the cents and keeps the thousands separator", () => {
    expect(formatWholeCurrency(18420)).toBe("$18,420")
    expect(formatWholeCurrency(3241880)).toBe("$3,241,880")
  })
  it("truncates rather than rounds", () => {
    // Intl with maximumFractionDigits: 0 would say "$4,621" for the first case —
    // the demo's firstYearValue. Truncation is the behaviour that shipped.
    expect(formatWholeCurrency(4620.8)).toBe("$4,620")
    expect(formatWholeCurrency(368.99)).toBe("$368")
  })
  it("handles zero and negatives", () => {
    expect(formatWholeCurrency(0)).toBe("$0")
    expect(formatWholeCurrency(-1234.5)).toBe("-$1,234")
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
