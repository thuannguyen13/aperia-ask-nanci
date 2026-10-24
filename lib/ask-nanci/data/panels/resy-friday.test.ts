import { describe, expect, it } from "vitest"
import { CARD_FEE_RATE, TURN_TIMES } from "./resy-group"
import {
  FRIDAY_DATE, FRIDAY_AS_OF, ONLINE_WINDOW, OPEN_INCREMENT, MOVE, MOVE_TABLE_FREES, PACING_CHECK, SEAT_HOURS, FOUR_TOP_SEAT_HOUR, formatTurn,
  REBOOK, NOTIFY_PARTIES, NOTIFY_GUESTS, NOTIFY_BY_SIZE, NOTIFY_HISTOGRAM, NOTIFY_SIZES, NOTIFY_TOP, PEAK_WINDOW,
  AVAILABILITY, RELEASED_TABLES, HELD_FILL_PCT, HELD_EMPTY_PCT, HELD_SEAT_HOUR, POST_OPEN, STILL_OPEN,
} from "./resy-friday"

// Storyboard section 5: every identity under "Flow 3 (Fri Oct 30)".

describe("venue settings", () => {
  it("charges 2.7% in card fees and turns 2s, 4s and 6+ in 1:30, 1:45 and 2:15", () => {
    expect(CARD_FEE_RATE).toBe(0.027)
    expect(Object.values(TURN_TIMES).map(formatTurn)).toEqual(["1:30", "1:45", "2:15"])
  })
})

describe("the plan", () => {
  it("is for next Friday, seen from today", () => {
    expect(FRIDAY_DATE).toBe("Fri, Oct 30")
    expect(FRIDAY_AS_OF).toContain("Sat, Oct 24")
  })
})

describe("the Marsh move", () => {
  it("frees T30 at 8:00 and lands on T31 once its 5:00 six-plus party turns at 7:15", () => {
    expect(MOVE.from).toEqual({ time: "8:00", table: 30 })
    expect(MOVE.to).toEqual({ time: "7:30", table: 31 })
    expect(MOVE_TABLE_FREES).toBe("7:15")
  })

  it("fills 7:30 to its pacing, 26 + 6 = 32 of 32", () => {
    expect(PACING_CHECK).toEqual({ time: "7:30", before: 26, after: 32, cap: 32 })
  })
})

describe("revenue per seat-hour after card fees", () => {
  it("divides each party size's per cover after fees by its turn", () => {
    expect(SEAT_HOURS.map((r) => [r.tier, r.afterFees, r.perSeatHour.toFixed(2)])).toEqual([
      ["2", 73.95, "49.30"],
      ["4", 77.84, "44.48"],
      ["6+", 85.62, "38.06"],
    ])
    expect(FOUR_TOP_SEAT_HOUR).toBe(44)
  })

  it("values a held four-top at 60% fill at $26.69, or $27", () => {
    expect(HELD_FILL_PCT).toBe(60)
    expect(HELD_EMPTY_PCT).toBe(40)
    expect(HELD_SEAT_HOUR.toFixed(2)).toBe("26.69")
    expect(Math.round(HELD_SEAT_HOUR)).toBe(27)
  })
})

describe("Notify for Friday", () => {
  it("rebooks the freed six-top with a party of 5 at $88 a cover, $440", () => {
    expect(REBOOK).toMatchObject({ party: 5, minutes: 11, table: 30, time: "8:00", perCover: 88, value: 440 })
  })

  it("holds 37 parties and 105 guests after the rebook: 20 twos, 5 threes, 11 fours, 1 six", () => {
    expect(NOTIFY_PARTIES).toBe(37)
    expect(NOTIFY_GUESTS).toBe(105)
    expect(NOTIFY_BY_SIZE).toEqual([{ size: 2, parties: 20 }, { size: 3, parties: 5 }, { size: 4, parties: 11 }, { size: 6, parties: 1 }])
    expect(NOTIFY_HISTOGRAM.every((h) => h.counts.length === NOTIFY_SIZES.length)).toBe(true)
  })

  it("wants 7:30–8:30 most: 12 twos and 9 fours, 21 parties and 60 guests", () => {
    expect(PEAK_WINDOW).toMatchObject({ twos: 12, fours: 9, parties: 21, guests: 60 })
  })

  it("lists the rebooked party first, then the waiting parties ranked by fit", () => {
    expect(NOTIFY_TOP[0]).toMatchObject({ party: 5, status: "booked" })
    expect(NOTIFY_TOP.slice(1).every((r) => r.status === "waiting")).toBe(true)
  })
})

describe("opening two 8:00 four-tops", () => {
  it("takes online four-tops 0 → 2, the 8:00 pacing 16 → 24 and the half hour 32 → 40", () => {
    expect(RELEASED_TABLES).toEqual([21, 22])
    expect(ONLINE_WINDOW).toEqual({ from: "7:45", to: "8:30" })
    expect(OPEN_INCREMENT).toBe("8:00")
    expect(AVAILABILITY).toEqual({ fourTops: { before: 0, after: 2 }, pacing: { before: 16, after: 24 }, halfHour: { before: 32, after: 40 } })
  })

  it("books T21 in 6 minutes, 4 × $80 = $320, and leaves T22 open", () => {
    expect(POST_OPEN).toEqual({ table: 21, time: "8:00", minutes: 6, party: 4, value: 320 })
    expect(STILL_OPEN).toEqual([22])
  })
})
