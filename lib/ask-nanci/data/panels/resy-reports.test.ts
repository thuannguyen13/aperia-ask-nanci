import { describe, expect, it } from "vitest"
import { CARD_BRANDS, COMPARED_WEEKS, FLAGSHIP_WEEKS, NO_SHOW_COST, seatedCovers } from "./resy-group"
import { WEEK_REPORT, WEEK_ROWS, SURVEY_SUMMARY, LOW_RATINGS, FRIDAY_LOW_RATINGS, LOCATIONS_WINDOW, VENUES, GROUP, MOST_NO_SHOWS, HIGHEST_RATE, LOCATION_ROWS } from "./resy-reports"

// Storyboard section 5: the week identities under "Flagship month to date" and every
// identity under "Flow 6 · locations".

describe("the flagship's weeks", () => {
  it("sums the weekly Amex amounts to October's Amex sales", () => {
    expect(FLAGSHIP_WEEKS.map((w) => w.amexSales)).toEqual([33863, 28028, 33155])
    expect(FLAGSHIP_WEEKS.reduce((total, w) => total + w.amexSales, 0)).toBe(95046)
    expect(CARD_BRANDS.amex.sales).toBe(95046)
  })

  it("puts Amex at 29.6% and 32.4% of the two compared weeks", () => {
    expect(Math.round(COMPARED_WEEKS.prior.cardSales * 0.296)).toBe(COMPARED_WEEKS.prior.amexSales)
    expect(Math.round(COMPARED_WEEKS.latest.cardSales * 0.324)).toBe(COMPARED_WEEKS.latest.amexSales)
  })

  it("leaves the Oct 1–9 turn, cancellations and repeat parties unauthored", () => {
    expect(FLAGSHIP_WEEKS[0]).not.toHaveProperty("turnMinutes")
    expect(FLAGSHIP_WEEKS[0]).not.toHaveProperty("cancellations")
    expect(FLAGSHIP_WEEKS[0]).not.toHaveProperty("repeatPct")
  })
})

describe("this week against last", () => {
  it("compares Oct 17–23 with Oct 10–16, six service nights each", () => {
    expect([WEEK_REPORT.latest, WEEK_REPORT.prior]).toEqual(["Oct 17–23", "Oct 10–16"])
    expect(COMPARED_WEEKS.prior.nights).toBe(COMPARED_WEEKS.latest.nights)
    expect(WEEK_REPORT.nights).toBe(6)
  })

  it("grows covers and card sales 8%", () => {
    expect(WEEK_REPORT.covers).toEqual({ prior: 1214, latest: 1312, changePct: 8, delta: "+8%" })
    expect(WEEK_REPORT.cardSales).toEqual({ prior: 94690, latest: 102330, changePct: 8, delta: "+8%" })
  })

  it("turns tables 6 minutes faster, 1:47 to 1:41", () => {
    expect(WEEK_REPORT.turn).toEqual({ prior: "1:47", latest: "1:41", minutesFaster: 6, delta: "−6 min" })
  })

  it("raises Amex from 29.6% to 32.4% of card sales", () => {
    expect(WEEK_REPORT.amexShare).toEqual({ prior: "29.6", latest: "32.4", delta: "from 29.6%" })
  })

  it("holds card sales per cover at $78 both weeks", () => {
    expect(WEEK_REPORT.perCover).toEqual({ prior: 78, latest: 78 })
  })

  it("tables booked, no-show, walk-in, cancellation and repeat figures", () => {
    expect(WEEK_ROWS.map((r) => [r.label, r.latest, r.prior])).toEqual([
      ["Booked covers", "1,128", "1,045"],
      ["No-show covers", "36", "41"],
      ["Walk-in covers", "220", "210"],
      ["Cancellations", "58", "71"],
      ["Repeat-guest parties", "38%", "35%"],
    ])
  })
})

describe("guest surveys", () => {
  it("summarises 58 private responses for Oct 17–23 at a 4.6 average", () => {
    expect(SURVEY_SUMMARY).toEqual({ window: "Oct 17–23", responses: 58, average: 4.6, lowAtMost: 2 })
  })

  it("has three low ratings, all at 2★ or below", () => {
    expect(LOW_RATINGS).toHaveLength(3)
    for (const r of LOW_RATINGS) expect(r.stars).toBeLessThanOrEqual(SURVEY_SUMMARY.lowAtMost)
  })

  it("puts two at Friday's 8:00 and 8:15 tables, both waiting 20-plus minutes, by returning guests", () => {
    expect(FRIDAY_LOW_RATINGS.map((r) => [r.time, r.table, r.server, r.visits])).toEqual([["8:00 PM", "T19", "Noor", 9], ["8:15 PM", "T08", "Jordan", 5]])
    for (const r of FRIDAY_LOW_RATINGS) expect(r.waitedPastBooking).toBeGreaterThan(20)
  })

  it("lists each card's attribution, and the third is about back-room noise", () => {
    expect(LOW_RATINGS[0].facts).toEqual(["Party of 4", "T19", "Server Noor", "Waited 24 min past booking", "9 visits"])
    expect(LOW_RATINGS[2].facts).toEqual(["Party of 4", "Back room", "1 visit"])
    expect(LOW_RATINGS[2]).toMatchObject({ date: "Sat Oct 17", comment: "Too loud to talk." })
  })

  it("avoids T22, which flow 29 holds for walk-ins, and Maya and Theo, flow 30's guests", () => {
    for (const r of LOW_RATINGS) {
      expect(r.table).not.toBe("T22")
      expect(["Maya", "Theo"]).not.toContain(r.server)
    }
  })
})

describe("no-shows by location", () => {
  const byName = Object.fromEntries(VENUES.map((v) => [v.name, v]))

  it("covers Oct 1–23 so far", () => {
    expect(LOCATIONS_WINDOW).toBe("Oct 1–23 · so far")
  })

  it("rates no-shows 3.5%, 2.7% and 4.8%, 3.7% for the group", () => {
    expect(VENUES.map((v) => v.ratePct)).toEqual(["3.5", "2.7", "4.8"])
    expect([GROUP.noShows, GROUP.booked, GROUP.ratePct]).toEqual([255, 6895, "3.7"])
  })

  it("costs them 9,204, 2,214 and 5,856, 17,274 for the group", () => {
    expect(VENUES.map((v) => v.cost)).toEqual([9204, 2214, 5856])
    expect(GROUP.cost).toBe(17274)
  })

  it("reuses the flagship's no-show cost and Amex share from resy-group", () => {
    expect(VENUES[0].cost).toBe(NO_SHOW_COST)
    expect(VENUES[0].amexSharePct).toBe(CARD_BRANDS.amexSharePct)
  })

  it("charges fees only at the flagship, $1,050 after flow 31", () => {
    expect(VENUES.map((v) => v.fees)).toEqual([1050, 0, 0])
  })

  it("seats Little Tallis 1,700 at $54 and Market 2,150 at $61", () => {
    expect([seatedCovers(byName["Little Tallis"]), byName["Little Tallis"].cardSales]).toEqual([1700, 91800])
    expect([seatedCovers(byName["Tallis Market"]), byName["Tallis Market"].cardSales]).toEqual([2150, 131150])
  })

  it("puts Amex at 31.0%, 22.4% and 27.1%, 28.6% for the group", () => {
    expect(VENUES.map((v) => v.amexSharePct)).toEqual(["31.0", "22.4", "27.1"])
    expect([GROUP.amexSales, GROUP.cardSales, GROUP.amexSharePct]).toEqual([151151, 529328, "28.6"])
  })

  it("has the most by count at Tallis and the highest rate at Market", () => {
    expect([MOST_NO_SHOWS.name, MOST_NO_SHOWS.noShows]).toEqual(["Tallis", 118])
    expect([HIGHEST_RATE.name, HIGHEST_RATE.perCover]).toEqual(["Tallis Market", 61])
  })

  it("tables the storyboard's seven rows verbatim", () => {
    expect(LOCATION_ROWS.map((r) => [r.label, ...r.values])).toEqual([
      ["Booked covers", "3,395", "1,520", "1,980", "6,895"],
      ["No-show covers", "118", "41", "96", "255"],
      ["No-show rate", "3.5%", "2.7%", "4.8%", "3.7%"],
      ["Card sales per cover", "$78", "$54", "$61", ""],
      ["No-show cost", "$9,204", "$2,214", "$5,856", "$17,274"],
      ["Fees charged", "$1,050", "$0", "$0", "$1,050"],
      ["Amex share of card sales", "31.0%", "22.4%", "27.1%", "28.6%"],
    ])
  })
})
