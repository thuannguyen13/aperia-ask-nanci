import { describe, expect, it } from "vitest"
import { CARD_BRANDS, MONTH_TO_DATE } from "./resy-group"
import { GUEST, GUEST_UPDATE, SEGMENT, TOP_FIVE, TOP_FIVE_TOTAL, THANK_YOU_EMAIL } from "./resy-guests"

// Storyboard section 5: every identity under "Flow 4", plus the Amex lines of
// "Flagship month to date".

describe("October card sales by brand", () => {
  it("averages $186 an Amex payment over 511 transactions, $95,046", () => {
    expect(CARD_BRANDS.amex).toEqual({ transactions: 511, sales: 95046, averagePayment: 186 })
    expect(CARD_BRANDS.amex.transactions * CARD_BRANDS.amex.averagePayment).toBe(CARD_BRANDS.amex.sales)
  })

  it("leaves $211,332 on other cards, exactly $132 over 1,601 transactions", () => {
    expect(CARD_BRANDS.other).toEqual({ transactions: 1601, sales: 211332, averagePayment: 132 })
    expect(CARD_BRANDS.other.sales / CARD_BRANDS.other.transactions).toBe(132)
  })

  it("adds up to $306,378 over 2,112 transactions, 31.0% on Amex", () => {
    expect(CARD_BRANDS.amex.sales + CARD_BRANDS.other.sales).toBe(MONTH_TO_DATE.cardSales)
    expect(CARD_BRANDS.amex.transactions + CARD_BRANDS.other.transactions).toBe(2112)
    expect(CARD_BRANDS.amexSharePct).toBe("31.0")
  })
})

describe("Rafael Ortiz", () => {
  it("is the party of 2 in booth 14 at 8:15", () => {
    expect(GUEST).toMatchObject({ name: "Rafael Ortiz", party: 2, booth: 14, time: "8:15", tags: ["Wine"], note: "Prefers a booth.", lastVisit: "Oct 3", firstVisit: "March" })
  })

  it("has spent 6 × $236 = $1,416 at Tallis and 2 × $188 = $376 at Little Tallis, $1,792 across the group", () => {
    expect(GUEST.flagship).toEqual({ venue: "Tallis", visits: 6, averageSpend: 236, lifetime: 1416 })
    expect(GUEST.sister).toEqual({ venue: "Little Tallis", visits: 2, averageSpend: 188, lifetime: 376 })
    expect(GUEST.lifetime).toBe(1792)
  })

  it("paid with an Amex on 5 of his 6 matched flagship checks", () => {
    expect([GUEST.amexChecks, GUEST.matchedChecks]).toEqual([5, 6])
    expect(GUEST.matchedChecks).toBeLessThanOrEqual(GUEST.flagship.visits)
  })

  it("gains the Regular tag and the allergy note, credited to Ask Nanci", () => {
    expect(GUEST_UPDATE).toEqual({ tag: "Regular", note: "Wife: shellfish allergy", byline: "Added via Ask Nanci" })
    expect(GUEST.tags).not.toContain(GUEST_UPDATE.tag)
  })
})

describe("September's anniversary guests", () => {
  it("are 26 parties, 26 − 5 = 21 emailable", () => {
    expect(SEGMENT).toMatchObject({ parties: 26, excluded: 5, emailable: 21 })
    expect(SEGMENT.parties - SEGMENT.excluded).toBe(SEGMENT.emailable)
  })

  it("matched 19 of the 21 to a card payment, and 16 of those 19 paid with an Amex", () => {
    expect([SEGMENT.matched, SEGMENT.amex]).toEqual([19, 16])
    expect(SEGMENT.matched).toBeLessThanOrEqual(SEGMENT.emailable)
    expect(SEGMENT.amex).toBeLessThanOrEqual(SEGMENT.matched)
  })

  it("top five by lifetime spend total $14,820, in descending order, every one emailable", () => {
    expect(TOP_FIVE.map((p) => p.lifetime)).toEqual([4210, 3180, 2760, 2450, 2220])
    expect(TOP_FIVE_TOTAL).toBe(14820)
    for (const p of TOP_FIVE) expect(p.consent).toBe(true)
  })

  it("thanks them with no discount or offer", () => {
    expect(THANK_YOU_EMAIL.subject).toBe("Thank you for celebrating with us")
    expect(`${THANK_YOU_EMAIL.subject} ${THANK_YOU_EMAIL.body}`).not.toMatch(/% off|\bfree\b|discount|offer/i)
  })
})
