// Flow 18: Running Low — what the kitchen is about to run out of.
// ponytail: illustrative stock and sales figures for a sandwich shop; not live data.
//
// The point of the flow is that raw count is the wrong sort. 40 ciabatta rolls look
// safer than 8 lb of mozzarella until you divide by how fast each one moves — so
// `daysOfCover` is derived here rather than typed, and the table sorts on it. A
// hand-kept days column would drift from the two numbers printed beside it, which is
// exactly the comparison the merchant is being asked to trust.

export interface StockItem {
  name: string;
  /** On-hand quantity, with its unit — "8 lb", "40". Display only. */
  onHand: string;
  /** Numeric on-hand, in the same unit as `perDay`, used for days of cover. */
  quantity: number;
  /** Average daily consumption, same unit as `quantity`. */
  perDay: number;
  /** How the pace reads on screen — "~5 lb/day", "~14/day". */
  pace: string;
  /** Weekday it runs dry, as the merchant would say it. */
  runsOut: string;
}

// Ordered by days of cover, tightest first — the sort *is* the argument.
export const STOCK_ITEMS: StockItem[] = [
  { name: "Fresh mozzarella", onHand: "8 lb",  quantity: 8,  perDay: 5,   pace: "~5 lb/day",   runsOut: "Wed" },
  { name: "Prosciutto",       onHand: "6 lb",  quantity: 6,  perDay: 3,   pace: "~3 lb/day",   runsOut: "Wed" },
  { name: "Ciabatta rolls",   onHand: "40",    quantity: 40, perDay: 14,  pace: "~14/day",     runsOut: "Thu" },
  { name: "Basil",            onHand: "2 lb",  quantity: 2,  perDay: 0.5, pace: "~0.5 lb/day", runsOut: "Sat" },
  { name: "Roma tomatoes",    onHand: "30 lb", quantity: 30, perDay: 6,   pace: "~6 lb/day",   runsOut: "Sat" },
  { name: "Provolone",        onHand: "22 lb", quantity: 22, perDay: 4,   pace: "~4 lb/day",   runsOut: "Sun" },
];

/** Days until the item runs dry. One decimal, because 2.9 vs 1.6 is the whole point. */
export const daysOfCover = (item: StockItem) => item.quantity / item.perDay;
export const formatDaysOfCover = (item: StockItem) => `${daysOfCover(item).toFixed(1)} days`;

// Thresholds the tiles and the row tint both read, so "critical" means one thing.
export const REORDER_DAYS = 3;
export const CRITICAL_DAYS = 2;

export const isCritical = (item: StockItem) => daysOfCover(item) <= CRITICAL_DAYS;

/**
 * Summary tiles, counted from the rows rather than typed. The three figures and the
 * six rows below them can never disagree.
 */
export const STOCK_SUMMARY = [
  { label: "Items running low", count: STOCK_ITEMS.length, sub: "across the kitchen", warn: false },
  { label: "Reorder now", count: STOCK_ITEMS.filter((i) => daysOfCover(i) <= REORDER_DAYS).length, sub: `${REORDER_DAYS} days or less`, warn: false },
  { label: "Critical", count: STOCK_ITEMS.filter(isCritical).length, sub: `${CRITICAL_DAYS} days or less`, warn: true },
];

export const STOCK_TABLE_LABEL = "By days of cover";

// Where the two halves of the answer come from. Named because the join is the thing
// Nanci can do that neither system does alone.
export const STOCK_SOURCE_NOTE = {
  lead: "On hand comes from your ",
  boldA: "inventory",
  mid: ", daily pace from your ",
  boldB: "sales",
  tail: ". Sorted by how soon you run out, not how much is left — which is why 8 lb of mozzarella ranks ahead of 40 ciabatta rolls.",
};

// ── "Runs Out First" — the tightest item on its own ─────────────────────────
export const TIGHTEST_ITEM = STOCK_ITEMS[0];

export const RUNS_OUT_FIRST = {
  title: "Runs Out First",
  detailLabel: "Tightest item (1)",
  runOutLabel: "Expected to run out",
  /** Spelled out for the prose callout; the table uses the item's short `runsOut`. */
  runOutDay: "Wednesday",
  runOutDate: "Wed 05/20/2026",
  reminder: "You'll be reminded two days before it runs out",
};
