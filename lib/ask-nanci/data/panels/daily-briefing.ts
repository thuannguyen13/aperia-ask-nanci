// Data for carrier story 33, Daily Briefing: Friday's sales, deposits, top items and the
// one thing worth a look, sent each morning. The menu and the stock are the same mock
// business as Menu Margin and Inventory. Every figure is invented.
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

// The stock that runs out first, from Inventory.
const TIGHTEST = STOCK_ITEMS[0]
export const WORTH_A_LOOK = {
  title: `${TIGHTEST.name} runs out ${TIGHTEST.runsOut === "Wed" ? "Wednesday" : TIGHTEST.runsOut}`,
  body: `${TIGHTEST.onHand} on hand at about ${TIGHTEST.pace.replace("~", "").replace("/day", " a day")}. Your next delivery is Thursday.`,
}

// The line the briefing is shared to: the shift manager's, from story 36's account.
export const SHIFT_MANAGER = LINES.find((line) => line.label === "Shift manager")!
export const BRIEFING_TIME = "7 AM"

/** "Fresh mozzarella runs out Wednesday" mid-sentence, with the weekday kept capitalized. */
export const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

export const BRIEFING_INSIGHT = `${YESTERDAY.day} came in ${YESTERDAY_CHANGE_PCT}% above a usual ${YESTERDAY.day}, led by the ${TOP_ITEMS[0].name}. One thing needs you this week: ${lowerFirst(WORTH_A_LOOK.title)}.`

export const BRIEFING_TILES = [
  { label: "Sales", value: formatWholeCurrency(YESTERDAY.sales), sublabel: `${YESTERDAY_CHANGE_PCT}% above a usual ${YESTERDAY.day}` },
  { label: "Orders", value: String(YESTERDAY.orders), sublabel: `About ${formatWholeCurrency(YESTERDAY.sales / YESTERDAY.orders)} each` },
  { label: "Deposited", value: formatWholeCurrency(DEPOSITED), sublabel: "Thursday's card sales" },
]

export const TOP_ITEMS_TITLE = "Top Items"
export const WORTH_A_LOOK_TITLE = "Worth a Look"

export const BRIEFING_NOTE = `Sales and items are from your register. Deposits are from ${CHASE_ACCOUNT.name}. A usual ${YESTERDAY.day} is the average of the last four.`

export const SHARED_NOTE = {
  title: "Shared with Your Shift Manager",
  body: `From tomorrow, the line ending ${SHIFT_MANAGER.ending} gets this briefing at ${BRIEFING_TIME}. It shows sales and stock only, not your bank account or your bill.`,
}
