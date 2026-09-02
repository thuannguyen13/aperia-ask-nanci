import { describe, it, expect } from "vitest"
import {
  RISK_MERCHANTS, RISK_REPORT_DETAILS, VIOLATION_ROWS, CROSS_QUEUE_ROWS,
  getDefaultRiskDetail, getMerchantProfile, getTxnVolume, merchantUrl,
} from "./risk-merchants"

const detailFor = (m: (typeof RISK_MERCHANTS)[number]) => RISK_REPORT_DETAILS[m.id] ?? getDefaultRiskDetail(m)
const cases = RISK_MERCHANTS.map((m) => [m.id, m] as const)

// The Risk Report reads every figure below off one merchant row, so the checks that
// matter are the ones a hand-typed value would fail: a total that stopped agreeing
// with the rows above it, and a default that put the same figure on all thirty.
describe("getTxnVolume", () => {
  it.each(cases)("%s totals only the calendar months", (_, m) => {
    const { rows, total } = getTxnVolume(m, detailFor(m).txns30)
    const months = rows.filter((r) => r.period.endsWith("2026"))
    expect(months).toHaveLength(3)
    expect(total.cbCount).toBe(months.reduce((n, r) => n + r.cbCount!, 0))
    expect(total.cbAmount).toBeCloseTo(months.reduce((n, r) => n + r.cbAmount!, 0), 2)
  })

  it.each(cases)("%s reports a figure in every observed period", (_, m) => {
    const { rows, total } = getTxnVolume(m, detailFor(m).txns30)
    // The contract row is the one that legitimately has nothing to report.
    for (const r of [...rows.filter((x) => x.period !== "Contract Expected"), total]) {
      expect(r.cbCount).toBeGreaterThan(0)
      expect(r.cbAmount).toBeGreaterThan(0)
      expect(r.rdrCount).toBeGreaterThan(0)
    }
  })

  it.each(cases)("%s keeps the dollar rate above the count rate", (_, m) => {
    // Chargebacks skew to the larger sales in a period; equal rates would say they
    // land evenly across ticket sizes, which is not what the skew models.
    const { rows } = getTxnVolume(m, detailFor(m).txns30)
    for (const r of rows.filter((x) => x.period !== "Contract Expected")) {
      expect(r.cbPctByAmount!).toBeGreaterThan(r.cbPctByCount!)
    }
  })
})

describe("getDefaultRiskDetail", () => {
  const defaults = RISK_MERCHANTS.filter((m) => !RISK_REPORT_DETAILS[m.id]).map(getDefaultRiskDetail)

  it("spreads the account card across the portfolio", () => {
    // One shared phone number and one shared address is what made this read as a
    // form nobody had filled in.
    expect(new Set(defaults.map((d) => d.account.phone)).size).toBe(defaults.length)
    expect(new Set(defaults.map((d) => d.account.address)).size).toBeGreaterThan(1)
    expect(new Set(defaults.map((d) => d.txns30)).size).toBeGreaterThan(1)
  })

  it.each(cases)("%s keeps both pills inside the tables behind them", (_, m) => {
    const d = detailFor(m)
    expect(d.violations).toBeGreaterThan(0)
    expect(d.violations).toBeLessThanOrEqual(VIOLATION_ROWS.length)
    expect(d.inQueues).toBeGreaterThan(0)
    expect(d.inQueues).toBeLessThanOrEqual(CROSS_QUEUE_ROWS.length)
  })
})

describe("getMerchantProfile", () => {
  it.each(cases)("%s cannot work more parameters than are driving its scores", (_, m) => {
    const d = detailFor(m)
    const p = getMerchantProfile(m, d, "mark-work")
    expect(p.paramsWorked).toBeLessThanOrEqual(d.vwParams + d.mcParams)
  })

  it("moves the worked counts with the mark that was just made", () => {
    const m = RISK_MERCHANTS[0]
    const d = detailFor(m)
    const before = getMerchantProfile(m, d, "mark-work")
    const after = getMerchantProfile(m, d, "worked")
    expect(before.workedIn30).toBe("No")
    expect(after.workedIn30).toBe("Yes")
    expect(after.workedTotal).toBe(before.workedTotal + 1)
  })
})

describe("merchantUrl", () => {
  it("hyphenates a trading name", () => {
    expect(merchantUrl("SUMMIT RIDGE OUTFITTERS")).toBe("www.summit-ridge-outfitters.com")
  })

  it("keeps a name that already carries its own domain", () => {
    expect(merchantUrl("PBBILLER.COM")).toBe("www.pbbiller.com")
  })
})
