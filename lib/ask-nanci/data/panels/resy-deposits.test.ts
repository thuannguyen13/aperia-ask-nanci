import { describe, expect, it } from "vitest"
import { FEE_POLICY, FEES_CHARGED } from "./resy-group"
import { NO_SHOW_BOOKING, NO_SHOW_FEE, FEES_AFTER_CHARGE, EVIDENCE_TIMELINE, EVENTS, EVENT_TOTALS, WINE_DINNER, NIGHT_SPEND_PER_GUEST, NIGHT_ESTIMATE, STRIPE_PAYOUT_DAYS } from "./resy-deposits"

// Storyboard section 5: every identity under "Flow 5", plus the "After Flow 5" fee line.

describe("last night's no-show fee", () => {
  it("is the Kessler party of 4 on Table 12, Fri Oct 23 at 7:30 PM, a fee night", () => {
    expect(NO_SHOW_BOOKING).toMatchObject({ guest: "Kessler", date: "Fri Oct 23", time: "7:30 PM", party: 4, table: 12 })
    expect(FEE_POLICY.nights).toContain(NO_SHOW_BOOKING.date.slice(0, 3))
  })

  it("is 4 × $25 = $100, taking October's fees from $950 to $1,050", () => {
    expect(NO_SHOW_FEE).toBe(NO_SHOW_BOOKING.party * FEE_POLICY.perGuest)
    expect(NO_SHOW_FEE).toBe(100)
    expect(FEES_CHARGED).toBe(950)
    expect(FEES_AFTER_CHARGE).toBe(1050)
  })
})

describe("the evidence timeline", () => {
  const ats = EVIDENCE_TIMELINE.map((s) => s.at)

  it("reads the six storyboard rows", () => {
    expect(EVIDENCE_TIMELINE.map((s) => `${s.label}: ${s.text}`)).toEqual([
      "Oct 12, 2:41 PM: Booked in the Resy app, policy shown, card saved",
      "Oct 22, 4:00 PM: Confirmation text sent",
      "Oct 22, 6:12 PM: Guest replied CONFIRM",
      "Oct 23: No cancellation logged",
      "Oct 23, 8:15 PM: Marked No-Show",
      "Oct 24, 3:20 PM: $100 charged",
    ])
  })

  it("runs in order, from the Oct 12 booking to the charge after the night", () => {
    expect(ats).toEqual([...ats].sort())
    expect(ats[0].startsWith("2026-10-12")).toBe(true)
    expect(NO_SHOW_BOOKING.bookedOn).toBe(EVIDENCE_TIMELINE[0].label.split(",")[0])
    expect(ats.at(-1)! > "2026-10-23 20:15").toBe(true)
  })

  it("sends the confirmation text the day before the booking", () => {
    const [, month, day] = NO_SHOW_BOOKING.date.split(" ")
    const dayBefore = `${month} ${Number(day) - 1}`
    expect(EVIDENCE_TIMELINE[1]).toMatchObject({ label: `${dayBefore}, 4:00 PM`, text: "Confirmation text sent" })
    expect(EVIDENCE_TIMELINE[2].label.startsWith(`${dayBefore},`)).toBe(true)
  })
})

describe("ticketed events", () => {
  const [harvest, thanksgiving, nye] = EVENTS

  it("sells the wine dinner for 41 × $165 + 18 × $65 = $7,935, with 7 × $165 = $1,155 open", () => {
    expect(WINE_DINNER).toBe(harvest)
    expect(harvest).toMatchObject({ seats: 48, sold: 41, open: 7, soldValue: 7935, openValue: 1155 })
    expect(41 * 165 + 18 * 65).toBe(harvest.soldValue)
  })

  it("runs Thanksgiving as two seatings of 70, inside the 96-seat room, $9,120 sold and $4,180 open", () => {
    expect(thanksgiving).toMatchObject({ seatings: 2, perSeating: 70, seats: 140, sold: 96, open: 44, soldValue: 9120, openValue: 4180 })
    expect(thanksgiving.perSeating).toBeLessThanOrEqual(96)
    expect(thanksgiving.seats).toBeLessThanOrEqual(2 * 96)
  })

  it("sells New Year's Eve for 52 × $185 = $9,620, with 44 × $185 = $8,140 open", () => {
    expect(nye).toMatchObject({ seats: 96, sold: 52, open: 44, soldValue: 9620, openValue: 8140 })
  })

  it("totals 284 seats, 189 sold, 95 open, $26,675 sold and $13,475 open", () => {
    expect(EVENT_TOTALS).toEqual({ seats: 284, sold: 189, open: 95, soldValue: 26675, openValue: 13475 })
    expect(EVENT_TOTALS.sold + EVENT_TOTALS.open).toBe(EVENT_TOTALS.seats)
  })

  it("estimates the wine dinner's night at 48 × $41 = $1,968 if it sells out", () => {
    expect(NIGHT_SPEND_PER_GUEST).toBe(41)
    expect(NIGHT_ESTIMATE).toBe(1968)
  })

  it("pays tickets out through Stripe about 2 business days after each sale", () => {
    expect(STRIPE_PAYOUT_DAYS).toBe(2)
  })
})
