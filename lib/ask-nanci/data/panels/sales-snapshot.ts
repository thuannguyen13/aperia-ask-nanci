export const WEEK_COMPARE = { thisWeek: 18240.0, lastWeek: 15900.0, changePct: 15 }

// Story: Saturday's lift was transaction COUNT, not bigger tickets — ticket held
// steady ~$43 all week, weekday average ~60 transactions, Saturday 96.
// ponytail: per-day sales are illustrative talking-point figures, not strictly
// transactions × avgTicket — the weekly total ($18,240) and the cited counts/tickets
// are the numbers the demo reads aloud and points at.
export const DAILY_SALES = [
  { day: "Monday",    date: "05/11/2026", sales: 2180.0, transactions: 56, avgTicket: 43.00 },
  { day: "Tuesday",   date: "05/12/2026", sales: 1980.0, transactions: 52, avgTicket: 42.60 },
  { day: "Wednesday", date: "05/13/2026", sales: 2340.0, transactions: 60, avgTicket: 43.20 },
  { day: "Thursday",  date: "05/14/2026", sales: 2410.0, transactions: 64, avgTicket: 43.00 },
  { day: "Friday",    date: "05/15/2026", sales: 2540.0, transactions: 68, avgTicket: 42.80 },
  { day: "Saturday",  date: "05/16/2026", sales: 4110.0, transactions: 96, avgTicket: 42.81, isBest: true },
  { day: "Sunday",    date: "05/17/2026", sales: 2680.0, transactions: 64, avgTicket: 43.10 },
]

const WEEKDAYS = DAILY_SALES.slice(0, 5) // Monday–Friday

export const WEEKDAY_AVG_TRANSACTIONS = Math.round(WEEKDAYS.reduce((sum, d) => sum + d.transactions, 0) / WEEKDAYS.length)
export const WEEKDAY_AVG_TICKET = WEEKDAYS.reduce((sum, d) => sum + d.avgTicket, 0) / WEEKDAYS.length

export const SATURDAY_DRILLDOWN = DAILY_SALES.find((d) => d.isBest)!
export const SLOWEST_DAY = DAILY_SALES.reduce((min, d) => (d.sales < min.sales ? d : min))
