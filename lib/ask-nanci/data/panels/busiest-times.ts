// Data for Flow 23 — Busiest Times: sales-by-hour heatmap + slowest windows follow-up.
// Saturday's $4,110 matches the sales-snapshot figure (data/panels/sales-snapshot.ts,
// SATURDAY_DRILLDOWN) — same mock business, same week, so the two flows never disagree.

export const HEATMAP_HOURS = ["10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p"]

// Average sales per hour over the last four weeks, from the register. Each row adds up to
// that day in the Sales Snapshot (sales-snapshot.ts), and the heatmap's levels are read
// from these figures, so a colour and the dollars under it always agree.
export const HOURLY_SALES = [
  { day: "Mon", sales: [120, 160, 360, 380, 150, 110, 130, 210, 290, 180, 90] },
  { day: "Tue", sales: [120, 190, 290, 370, 120, 80, 90, 190, 290, 160, 80] },
  { day: "Wed", sales: [190, 190, 380, 390, 160, 80, 90, 290, 290, 190, 90] },
  { day: "Thu", sales: [120, 170, 360, 380, 150, 125, 130, 240, 375, 250, 110] },
  { day: "Fri", sales: [110, 220, 420, 360, 210, 120, 150, 260, 330, 250, 110] },
  { day: "Sat", sales: [160, 290, 390, 590, 390, 260, 380, 480, 520, 390, 260] },
  { day: "Sun", sales: [130, 230, 330, 370, 240, 150, 220, 310, 330, 240, 130] },
]

// Where each level starts: under $100 is quiet, $400 and over is peak.
const LEVEL_FLOORS = [0, 100, 200, 300, 400]
export const levelFor = (sales: number) => LEVEL_FLOORS.findLastIndex((floor) => sales >= floor)

export const HEATMAP_ROWS = HOURLY_SALES.map((row) => ({ day: row.day, levels: row.sales.map(levelFor) }))

/** The average sales for one day and hour, such as ("Fri", "12p"). */
export const salesAt = (day: string, hour: string) => HOURLY_SALES.find((r) => r.day === day)!.sales[HEATMAP_HOURS.indexOf(hour)]

export const HEATMAP_APPROX = ["quiet", "light", "steady", "busy", "peak"]

export const BUSIEST_TIMES_TILES = [
  { label: "Busiest day", value: "Saturday", sublabel: "$4,110 in sales", emphasis: true },
  { label: "Peak hour", value: "12–1 PM", sublabel: "every day, lunch rush" },
  { label: "Quietest window", value: "Tue–Wed 2–4", sublabel: "~⅓ of lunch peak" },
]

export const SLOWEST_WINDOWS = [
  { name: "Tuesday 2–4 PM", sub: "quietest all week", sales: 185, orders: 8, pct: 28 },
  { name: "Wednesday 2–4 PM", sub: "second quietest", sales: 210, orders: 9, pct: 32 },
  { name: "Monday 2–4 PM", sub: "weekday lull", sales: 240, orders: 10, pct: 37 },
  { name: "Thursday 2–4 PM", sub: "afternoon lull", sales: 265, orders: 11, pct: 41 },
]

// The callout's "under $210 across 8-9 orders" quotes the two quietest rows above —
// read from them rather than retyped, so the copy can't drift from the table.
export const SLOWEST_WINDOWS_HIGH = SLOWEST_WINDOWS[1]
