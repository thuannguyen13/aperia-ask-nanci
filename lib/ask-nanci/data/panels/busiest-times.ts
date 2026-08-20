// Data for Flow 23 — Busiest Times: sales-by-hour heatmap + slowest windows follow-up.
// Saturday's $4,110 matches the sales-snapshot figure (data/panels/sales-snapshot.ts,
// SATURDAY_DRILLDOWN) — same mock business, same week, so the two flows never disagree.

export const HEATMAP_HOURS = ["10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p"]

export const HEATMAP_ROWS = [
  { day: "Mon", levels: [1, 1, 3, 3, 1, 1, 1, 2, 2, 1, 0] },
  { day: "Tue", levels: [1, 1, 2, 3, 1, 0, 0, 1, 2, 1, 0] },
  { day: "Wed", levels: [1, 1, 2, 3, 1, 0, 0, 1, 2, 1, 0] },
  { day: "Thu", levels: [1, 1, 3, 3, 1, 1, 1, 2, 3, 2, 1] },
  { day: "Fri", levels: [1, 2, 4, 4, 2, 1, 2, 3, 4, 3, 1] },
  { day: "Sat", levels: [1, 2, 3, 4, 3, 2, 3, 4, 4, 3, 2] },
  { day: "Sun", levels: [1, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1] },
]

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
