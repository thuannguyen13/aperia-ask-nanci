// Flow 39: Place Order — the merchant asks Ask Nanci to order what is running low.
// ponytail: illustrative suppliers, pack sizes, prices and order numbers for the Flow 18
// sandwich shop; not live data.
//
// Built on Running Low's stock rather than a second copy of it: which items get ordered,
// how many, and how long they last afterwards are all derived from STOCK_ITEMS, so this
// panel and the Running Low panel can never tell the merchant two different stories.
// The chat replies are built here too, from the same figures, for the same reason.
//
// Copy follows Aperia's UI Style Guide V4.3: no contractions, the app never says "I",
// MM/DD dates, 02:00 PM CST times, cents on every amount. Payment wording stays neutral
// ("secure agent payment") until the card-network partnership approves its product name.

import { STOCK_ITEMS, REORDER_DAYS, daysOfCover, isCritical, type StockItem } from "./inventory"

/** How many days of stock an order tops each item up to. */
const TARGET_DAYS = 7

/** Orders above this wait for the merchant even once automatic ordering is on. */
const APPROVAL_LIMIT = 500

// Running Low says the weekday an item runs dry; the panel shows it as a date.
// Today is Monday 05/18/2026, the day Running Low's mozzarella has 1.6 days left.
const WEEKDAY_DATES: Record<string, string> = { Wed: "05/20", Thu: "05/21", Fri: "05/22", Sat: "05/23", Sun: "05/24" }

interface Supplier {
  name: string
  /** When the order has to be in. */
  cutoff: string
  /** When it arrives once placed. */
  delivers: string
  /** The same arrival, as a sentence says it. */
  deliversSpoken: string
  /** Shown once the order is placed. Secondary to the supplier name. */
  orderRef: string
}

const SUPPLIERS = {
  sysco: { name: "Sysco", cutoff: "Order by 02:00 PM CST today", delivers: "Delivers 05/20 by 10:00 AM CST", deliversSpoken: "Wednesday by 10:00 AM CST", orderRef: "Order PO-20418" },
  bakery: { name: "Bianchi Bakery", cutoff: "Order by 06:00 PM CST today", delivers: "Delivers 05/19 by 07:00 AM CST", deliversSpoken: "tomorrow by 07:00 AM CST", orderRef: "Order PO-20419" },
} satisfies Record<string, Supplier>

type SupplierId = keyof typeof SUPPLIERS

// How each item is bought, keyed by its Running Low name. `short` is the name a
// sentence or a supplier line uses ("Mozzarella, prosciutto").
const CATALOG: Record<string, { short: string; supplier?: SupplierId; packSize?: number; packPrice?: number; unit?: string }> = {
  "Fresh mozzarella": { short: "mozzarella", supplier: "sysco", packSize: 5, packPrice: 32.5, unit: "lb" },
  "Prosciutto": { short: "prosciutto", supplier: "sysco", packSize: 5, packPrice: 70, unit: "lb" },
  "Ciabatta rolls": { short: "ciabatta rolls", supplier: "bakery", packSize: 12, packPrice: 9, unit: "" },
  "Basil": { short: "basil" },
  "Roma tomatoes": { short: "tomatoes" },
  "Provolone": { short: "provolone" },
}

const withUnit = (n: number, unit = "") => (unit ? `${n} ${unit}` : `${n}`)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const formatMoney = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const formatDays = (n: number) => `${n.toFixed(1)} days`
// Counts under ten read as words in a sentence ("three items", "six packs").
const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
const spell = (n: number) => NUMBER_WORDS[n] ?? String(n)
/** "a, b, and c" — the guide's serial comma. */
const joinList = (xs: string[]) => (xs.length < 3 ? xs.join(" and ") : `${xs.slice(0, -1).join(", ")}, and ${xs[xs.length - 1]}`)

export interface OrderLine {
  name: string
  daysLeft: string
  critical: boolean
  quantity: string
  cost: string
  /** Days of cover once the order lands. */
  daysAfter: string
}

const toLine = (item: StockItem) => {
  const c = CATALOG[item.name]
  const needed = Math.max(0, TARGET_DAYS * item.perDay - item.quantity)
  const packs = Math.ceil(needed / c.packSize!)
  const quantity = packs * c.packSize!
  const cost = packs * c.packPrice!
  return {
    item, needed, packs, quantity, costValue: cost,
    line: {
      name: item.name,
      daysLeft: formatDays(daysOfCover(item)),
      critical: isCritical(item),
      quantity: withUnit(quantity, c.unit),
      cost: formatMoney(cost),
      daysAfter: formatDays((item.quantity + quantity) / item.perDay),
    } satisfies OrderLine,
  }
}

// The same threshold Running Low calls "Reorder now". Everything else can wait.
const ordered = STOCK_ITEMS.filter((i) => daysOfCover(i) <= REORDER_DAYS).map(toLine)
const canWait = STOCK_ITEMS.filter((i) => daysOfCover(i) > REORDER_DAYS)
const total = ordered.reduce((s, l) => s + l.costValue, 0)

export const ORDER_LINES: OrderLine[] = ordered.map((l) => l.line)

export const CAN_WAIT = canWait.map((i) => ({ name: i.name, daysLeft: formatDays(daysOfCover(i)), runsOut: WEEKDAY_DATES[i.runsOut] }))

export const SUPPLIER_ORDERS = (Object.keys(SUPPLIERS) as SupplierId[])
  .map((id) => {
    const lines = ordered.filter((l) => CATALOG[l.item.name].supplier === id)
    const items = capitalize(lines.map((l) => CATALOG[l.item.name].short).join(", "))
    return { ...SUPPLIERS[id], summary: `${items} · ${formatMoney(lines.reduce((s, l) => s + l.costValue, 0))}`, count: lines.length }
  })
  .filter((s) => s.count > 0)

export const ORDER_TOTAL = formatMoney(total)

export const PAYMENT = {
  card: "Business card ••4821",
  detail: "Secure agent payment. Suppliers never see the card number.",
  limit: `Limit ${formatMoney(APPROVAL_LIMIT)} per order`,
}

/** The panel's Approve button sends this, and it is also the flow's pending user turn. */
export const ORDER_APPROVE = `Approve and Pay ${ORDER_TOTAL}`

const canWaitShort = joinList(canWait.map((i) => CATALOG[i.name].short))

export const ORDER_COPY = {
  draftTitle: "Place Order",
  placedTitle: "Order Placed",
  insight: `This order covers only the ${spell(ordered.length)} items that will not last until the next delivery. ${capitalize(canWaitShort)} last past the Friday delivery.`,
  canWaitNote: "These items are running low but last past the Friday delivery.",
  placedTitleLine: `${SUPPLIER_ORDERS.length} Orders Placed`,
  placedDetail: `${ORDER_TOTAL} charged to ${PAYMENT.card.charAt(0).toLowerCase()}${PAYMENT.card.slice(1)} through secure agent payment.`,
  autoTitle: "Automatic Ordering Is On",
  autoRules: [
    `Orders any item with under ${REORDER_DAYS} days left`,
    `Tops each item up to about ${TARGET_DAYS} days`,
    `Asks for approval on any order over ${formatMoney(APPROVAL_LIMIT)}`,
    "Sends a message for every order placed",
  ],
}

// ── Chat replies, quoting the same figures as the panel ─────────────────────
const tightest = ordered[0]
const sysco = SUPPLIERS.sysco
const bakery = SUPPLIERS.bakery
const runOutDay = (name: string) => ({ Wed: "Wednesday", Thu: "Thursday" })[STOCK_ITEMS.find((i) => i.name === name)!.runsOut as "Wed" | "Thu"]

export const ORDER_REPLIES = {
  answer:
    `A ${ORDER_TOTAL} order is ready to review for the ${spell(ordered.length)} items that will not last until the next delivery. ` +
    `Fresh mozzarella and prosciutto run out ${runOutDay("Fresh mozzarella")}, and ciabatta rolls run out ${runOutDay("Ciabatta rolls")}.\n\n` +
    `The order is split between ${sysco.name} and ${bakery.name}. Place it by 02:00 PM CST to make the Wednesday ${sysco.name} delivery.`,
  explain:
    `${capitalize(canWaitShort)} last past the Friday delivery, with ${joinList(canWait.map((i) => daysOfCover(i).toFixed(1)))} days left.\n\n` +
    `Each ordered item is topped up to about ${TARGET_DAYS} days at the current sales pace and rounded up to the supplier pack size. ` +
    `For example, ${withUnit(tightest.needed, "lb")} of mozzarella rounds up to ${spell(tightest.packs)} ${withUnit(CATALOG[tightest.item.name].packSize!, "lb")} packs. ` +
    `To place the order, select ${ORDER_APPROVE} in ${ORDER_COPY.draftTitle}.`,
  placed:
    `Orders placed. ${sysco.name} delivers ${sysco.deliversSpoken}, and ${bakery.name} delivers ${bakery.deliversSpoken}. ` +
    `Fresh mozzarella goes from ${tightest.line.daysLeft.replace(" days", "")} to ${tightest.line.daysAfter} left.\n\n` +
    `Do you want to turn on automatic ordering? Items with under ${REORDER_DAYS} days left are ordered automatically, and any order over ${formatMoney(APPROVAL_LIMIT)} still needs your approval.`,
  auto:
    // No item count: "6 tracked items" read as a mismatch with the card's 4 rules.
    `Automatic ordering is on. A message is sent for every order placed, and any order over ${formatMoney(APPROVAL_LIMIT)} waits for your approval.`,
}
