// Data for Flow 23 — Busiest Times: sales-by-hour heatmap + top volume windows.
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

export const TOP_WINDOWS = [
  { name: "Saturday 12–1 PM", sub: "busiest single hour", pct: 100 },
  { name: "Friday 6–8 PM", sub: "dinner rush", pct: 88 },
  { name: "Saturday 6–8 PM", sub: "dinner rush", pct: 84 },
  { name: "Weekday 12–1 PM", sub: "daily lunch peak", pct: 72 },
]

export const TOP_WINDOWS_CALLOUT =
  "Four windows carry most of your week. Two are lunch, two are weekend dinner — worth your strongest staff and a prep push just ahead of each."
