// Data for carrier story 40, Daily Briefing: Friday on the register and on the business
// line, sent each morning. The line is what makes it a carrier's briefing: its call
// records, matched to the register's phone orders, show which callers were regulars.
// The menu and the stock are the same mock business as Menu Margin and Inventory. Every
// figure is invented, and the customers are first names only.
import { STOCK_ITEMS } from "./inventory"
import { LINES } from "./unused-lines"
import { CHASE_ACCOUNT } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"

export const BRIEFING_TITLE = "Yesterday's Briefing"

// Yesterday, against the average of the last four Fridays.
export const YESTERDAY = { day: "Friday", sales: 2740, orders: 64, usualSales: 2540 }
export const YESTERDAY_CHANGE_PCT = Math.round((YESTERDAY.sales / YESTERDAY.usualSales - 1) * 100)

// Card sales from Thursday, settled into the bank account overnight.
export const DEPOSITED = 2310

export const TOP_ITEMS = [
  { name: "Italian Combo", sold: 34 },
  { name: "Turkey Club", sold: 22 },
  { name: "Meatball Sub", sold: 19 },
]

// Yesterday on the business line, from the carrier's call records. The missed calls all
// came in the lunch hour, and the callers who did not call back are matched by number to
// past phone orders on the register.
export const LINE_YESTERDAY = { calls: 46, missed: 5, noCallback: 3, missedHour: "between 12 and 1 PM" }
export const MISSED_REGULARS = [
  { name: "Dana P.", habit: "Orders by phone most Fridays", usual: 48 },
  { name: "Luis M.", habit: "Orders for his office every other Friday", usual: 38 },
]
export const REGULARS_USUAL = MISSED_REGULARS.reduce((total, r) => total + r.usual, 0)
const REGULAR_NAMES = MISSED_REGULARS.map((r) => r.name).join(" and ")
export const REGULARS_FLAG = `${MISSED_REGULARS.length} regulars could not get through at lunch`

export const LINE_TITLE = "Your Business Line"
export const LINE_ROWS = [
  { label: "Calls", value: String(LINE_YESTERDAY.calls) },
  { label: "Missed", value: `${LINE_YESTERDAY.missed}, all ${LINE_YESTERDAY.missedHour}` },
  { label: "Did Not Call Back", value: `${LINE_YESTERDAY.noCallback}, ${MISSED_REGULARS.length} of them regulars` },
  { label: "Internet", value: "No interruptions" },
]

// The stock that runs out first, from Inventory.
const TIGHTEST = STOCK_ITEMS[0]
export const REGULARS_LOOK = {
  title: `${REGULAR_NAMES} could not get through`,
  body: `Both called at lunch and neither called back. ${MISSED_REGULARS.map((r) => `${r.name.split(" ")[0]}: ${r.habit.charAt(0).toLowerCase() + r.habit.slice(1)}, about ${formatWholeCurrency(r.usual)}.`).join(" ")}`,
}
export const WORTH_A_LOOK = {
  title: `${TIGHTEST.name} runs out ${TIGHTEST.runsOut === "Wed" ? "Wednesday" : TIGHTEST.runsOut}`,
  body: `${TIGHTEST.onHand} on hand at about ${TIGHTEST.pace.replace("~", "").replace("/day", " a day")}. Your next delivery is Thursday.`,
}

// The line the briefing is shared to: the shift manager's, from story 43's account.
export const SHIFT_MANAGER = LINES.find((line) => line.label === "Shift manager")!
export const BRIEFING_TIME = "7 AM"

/** "Fresh mozzarella runs out Wednesday" mid-sentence, with the weekday kept capitalized. */
export const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

export const BRIEFING_INSIGHT = `${YESTERDAY.day} came in ${YESTERDAY_CHANGE_PCT}% above a usual ${YESTERDAY.day}, but your line missed ${LINE_YESTERDAY.missed} lunch calls, and ${MISSED_REGULARS.length} regulars who order by phone did not call back.`

export const BRIEFING_TILES = [
  { label: "Sales", value: formatWholeCurrency(YESTERDAY.sales), sublabel: `${YESTERDAY_CHANGE_PCT}% above a usual ${YESTERDAY.day}` },
  { label: "Calls", value: String(LINE_YESTERDAY.calls), sublabel: `${LINE_YESTERDAY.missed} missed, ${LINE_YESTERDAY.noCallback} did not call back`, tone: "amber" as const, toneScope: "value" as const },
  { label: "Deposited", value: formatWholeCurrency(DEPOSITED), sublabel: "Thursday's card sales" },
]

export const TOP_ITEMS_TITLE = "Top Items"
export const WORTH_A_LOOK_TITLE = "Worth a Look"

export const BRIEFING_NOTE = `Sales, items and phone orders are from your register. Calls are from your business line's call records, matched to past orders by number. Deposits are from ${CHASE_ACCOUNT.name}. A usual ${YESTERDAY.day} is the average of the last four.`

export const SHARED_NOTE = {
  title: "Shared with Your Shift Manager",
  body: `From tomorrow, the line ending ${SHIFT_MANAGER.ending} gets this briefing at ${BRIEFING_TIME}. It shows sales, calls and stock only, not your bank account or your bill.`,
}
