import { describe, expect, it } from "vitest"
import {
  FLAGSHIP_WEEKS, MONTH_TO_DATE, seatedCovers, NO_SHOW_RATE_PCT, CONFIRMATION_SPLIT, UNCONFIRMED_NO_SHOW_PCT, CONFIRMED_NO_SHOW_PCT,
  CARD_PER_COVER, FEE_POLICY, FEES_CHARGED, NO_SHOW_COST, NO_SHOW_NET,
} from "./resy-group"
import {
  TONIGHT_DATE, BOOK_AS_OF, REPLIES_AS_OF, WAITLIST_AS_OF, PACING_PER_15_MIN, PARTY_MIX, LARGE_PARTIES, TO_KNOW, LARGEST_UNCONFIRMED, WAITLIST, waitPartiesWith,
  BOOK_SLOTS, BOOK_COVERS, BOOK_PEAK, BOOK_PARTIES, PARTY_MIX_COVERS, PACING_PER_HALF_HOUR, CELEBRATIONS,
  UNCONFIRMED, UNCONFIRMED_COVERS, coversWithReply, partiesWithReply, BOOK_AFTER,
  WAITING, WAITING_GUESTS, WAIT_SUMMARY, LEFT_QUOTES, WALKOUT_COVERS, WALKOUT_VALUE, quoteFor,
} from "./resy-tonight"

// Storyboard section 5: every identity under "Flagship month to date" and "Tonight".

describe("flagship month to date", () => {
  it("sums the weeks to the month", () => {
    expect(MONTH_TO_DATE).toEqual({ booked: 3395, noShows: 118, walkIns: 651, seated: 3928, cardSales: 306378 })
    expect(FLAGSHIP_WEEKS.map(seatedCovers)).toEqual([1402, 1214, 1312])
  })

  it("rates no-shows overall and by confirmation", () => {
    expect(NO_SHOW_RATE_PCT).toBe(3.5)
    expect(CONFIRMATION_SPLIT.unconfirmed.covers + CONFIRMATION_SPLIT.confirmed.covers).toBe(MONTH_TO_DATE.booked)
    expect(CONFIRMATION_SPLIT.unconfirmed.noShows + CONFIRMATION_SPLIT.confirmed.noShows).toBe(MONTH_TO_DATE.noShows)
    expect(CONFIRMATION_SPLIT.unconfirmed.covers).toBe(509)
    expect(CONFIRMATION_SPLIT.confirmed.covers).toBe(2886)
    expect(UNCONFIRMED_NO_SHOW_PCT).toBe(12)
    expect(CONFIRMED_NO_SHOW_PCT).toBe(2)
  })

  it("prices a cover from card sales and costs the no-shows", () => {
    expect(CARD_PER_COVER).toBe(78)
    expect(NO_SHOW_COST).toBe(9204)
    expect(FEE_POLICY.perGuest).toBe(25)
    expect(FEES_CHARGED).toBe(950)
    expect(NO_SHOW_NET).toBe(8254)
  })
})

describe("tonight's book", () => {
  it("is Saturday's, with the book at 3:00pm, the replies at 3:03pm and the door at 7:40pm", () => {
    expect([TONIGHT_DATE, BOOK_AS_OF, REPLIES_AS_OF, WAITLIST_AS_OF]).toEqual(["Sat, Oct 24", "3:00pm", "3:03pm", "7:40pm"])
  })

  it("holds 42 twos, 11 threes, 15 fours, 2 fives and four large parties", () => {
    expect(PARTY_MIX.map((p) => p.count)).toEqual([42, 11, 15, 2])
    expect(LARGE_PARTIES).toEqual([8, 7, 6, 6])
    expect(TO_KNOW).toEqual({ vips: 6, allergies: 9, birthdays: 7, anniversaries: 4, repeatGuests: 31 })
  })

  it("adds slots, parties and the party mix to the same book", () => {
    expect(BOOK_COVERS).toBe(214)
    expect(BOOK_SLOTS).toHaveLength(10)
    expect(BOOK_PARTIES).toBe(74)
    expect(PARTY_MIX_COVERS).toBe(214)
    expect(CELEBRATIONS).toBe(11)
  })

  it("peaks at 7:00 right at the half-hour pacing", () => {
    expect(BOOK_PEAK).toEqual({ time: "7:00", covers: 32 })
    expect(PACING_PER_15_MIN).toBe(16)
    expect(PACING_PER_HALF_HOUR).toBe(32)
  })
})

describe("unconfirmed parties", () => {
  it("are nine parties of 31 covers, split 17 + 2 + 12 by reply", () => {
    expect(UNCONFIRMED).toHaveLength(9)
    expect(UNCONFIRMED_COVERS).toBe(31)
    expect(LARGEST_UNCONFIRMED).toMatchObject({ time: "7:00", name: "Okafor", party: 7 })
    expect(coversWithReply("confirmed")).toBe(17)
    expect(coversWithReply("cancelled")).toBe(2)
    expect(coversWithReply("none")).toBe(12)
    expect(partiesWithReply("confirmed").map((p) => p.name)).toEqual(["Okafor", "Ferreira", "Huang", "Delacroix", "Novak"])
    expect(partiesWithReply("none").map((p) => p.name)).toEqual(["Brandt", "Lindqvist", "Abernathy"])
  })

  it("leave a book of 212 covers and 73 parties after the cancellation", () => {
    expect(BOOK_AFTER).toEqual({ covers: 212, parties: 73 })
  })
})

describe("walk-in waitlist", () => {
  it("holds 9 waiting parties of 24 guests out of 18 joined", () => {
    expect(WAITLIST).toHaveLength(18)
    expect(WAITING).toEqual(waitPartiesWith("waiting"))
    expect(WAITING).toHaveLength(9)
    expect(WAITING_GUESTS).toBe(24)
    expect(WAIT_SUMMARY).toEqual({ joined: 18, seated: 7, left: 2, waiting: 9, avgWaited: 31, avgQuoted: 40 })
    expect(WAIT_SUMMARY.seated + WAIT_SUMMARY.left + WAIT_SUMMARY.waiting).toBe(WAIT_SUMMARY.joined)
  })

  it("quotes 35 for twos and 55 for fours", () => {
    expect(quoteFor(2)).toBe(35)
    expect(quoteFor(4)).toBe(55)
    for (const p of WAITING) expect(p.quoted).toBe(quoteFor(p.party))
  })

  it("lost 6 covers quoted 50 and 60, worth $468", () => {
    expect(LEFT_QUOTES).toEqual([50, 60])
    expect(WALKOUT_COVERS).toBe(6)
    expect(WALKOUT_VALUE).toBe(468)
  })
})
