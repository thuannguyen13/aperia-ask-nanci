import { describe, expect, it } from "vitest"
import { HOURLY_SALES, HEATMAP_ROWS, levelFor } from "./busiest-times"
import { DAILY_SALES } from "./sales-snapshot"

describe("hourly sales", () => {
  it("adds up to each day in the Sales Snapshot", () => {
    HOURLY_SALES.forEach((row, i) => {
      expect(DAILY_SALES[i].day.startsWith(row.day)).toBe(true)
      expect(row.sales.reduce((sum, s) => sum + s, 0)).toBe(DAILY_SALES[i].sales)
    })
  })

  it("gives every heatmap cell the level its dollars fall in", () => {
    HEATMAP_ROWS.forEach((row, i) => {
      expect(row.levels).toEqual(HOURLY_SALES[i].sales.map(levelFor))
    })
    expect([99, 100, 399, 400].map(levelFor)).toEqual([0, 1, 3, 4])
  })

  it("peaks at lunch every day, as Busiest Times says", () => {
    HOURLY_SALES.forEach((row) => {
      const peak = row.sales.indexOf(Math.max(...row.sales))
      expect([2, 3]).toContain(peak)
    })
  })
})
