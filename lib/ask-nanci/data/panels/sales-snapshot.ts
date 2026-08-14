export const WEEK_COMPARE = { thisWeek: 18240.0, lastWeek: 15900.0, changePct: 15 }

// Story: Saturday's lift was transaction COUNT, not bigger tickets — ticket held
// steady ~$43 all week, Saturday 96 transactions against a much lower weekday count.
//
// Sales and transaction counts are the authored figures; avg ticket is ALWAYS derived
// from them, never typed in. It used to be a third hand-written column and six of the
// seven days disagreed with sales ÷ transactions (Monday read $43.00 where the division
// gives $38.93). Anyone who checked the arithmetic caught it, and the whole "ticket held
// steady" narrative rests on that column. Counts were re-cut off the same ~$43 ticket so
// the story is unchanged and the row now survives being checked.
interface DailySales {
  day: string
  date: string
  sales: number
  transactions: number
  isBest?: boolean
}

const DAILY_RAW: DailySales[] = [
  { day: "Monday",    date: "05/11/2026", sales: 2180.0, transactions: 51 },
  { day: "Tuesday",   date: "05/12/2026", sales: 1980.0, transactions: 46 },
  { day: "Wednesday", date: "05/13/2026", sales: 2340.0, transactions: 54 },
  { day: "Thursday",  date: "05/14/2026", sales: 2410.0, transactions: 56 },
  { day: "Friday",    date: "05/15/2026", sales: 2540.0, transactions: 59 },
  { day: "Saturday",  date: "05/16/2026", sales: 4110.0, transactions: 96, isBest: true },
  { day: "Sunday",    date: "05/17/2026", sales: 2680.0, transactions: 62 },
]

export const DAILY_SALES = DAILY_RAW.map((d) => ({ ...d, avgTicket: d.sales / d.transactions }))

const WEEKDAYS = DAILY_SALES.slice(0, 5) // Monday–Friday

export const WEEKDAY_AVG_TRANSACTIONS = Math.round(WEEKDAYS.reduce((sum, d) => sum + d.transactions, 0) / WEEKDAYS.length)
// Weighted the same way the table is read: total weekday sales over total weekday
// transactions, not a mean of the seven per-day ratios.
export const WEEKDAY_AVG_TICKET =
  WEEKDAYS.reduce((sum, d) => sum + d.sales, 0) / WEEKDAYS.reduce((sum, d) => sum + d.transactions, 0)

export const SATURDAY_DRILLDOWN = DAILY_SALES.find((d) => d.isBest)!
export const SLOWEST_DAY = DAILY_SALES.reduce((min, d) => (d.sales < min.sales ? d : min))
