import { CARRIER } from "../carrier"

// Carrier story 35, Unused Lines. Every figure is example data from the carrier account.
// The authored figures are the six lines and the two plan prices. The idle lines, the
// suggested plan's size and the monthly difference are derived from them, so the chat
// and the panel quote the same numbers.

export const UNUSED_LINES_TITLE = "Unused Lines"

// A line counts as idle after this many days with no calls, texts or data.
export const IDLE_DAYS = 60

interface PhoneLine {
  /** The name on the line in the carrier account, which is what the owner recognizes. */
  label: string
  /** How the chat names it mid-sentence, where the label alone would read oddly. */
  spoken?: string
  ending: string
  /** Days since the line last made a call, sent a text or used data. */
  daysSinceUse: number
  /** Use over the last 30 days. An idle line has none, so it leaves this out. */
  usage?: "High" | "Medium" | "Low"
}

const LINES_RAW: PhoneLine[] = [
  { label: "Teresa W.", ending: "2290", daysSinceUse: 0, usage: "High" },
  { label: "Front counter", ending: "4410", daysSinceUse: 0, usage: "High" },
  { label: "Kitchen", ending: "4412", daysSinceUse: 0, usage: "Medium" },
  { label: "Shift manager", ending: "4415", daysSinceUse: 1, usage: "Medium" },
  { label: "Marco R.", ending: "4418", daysSinceUse: 74 },
  { label: "Old order tablet", spoken: "the old order tablet", ending: "4421", daysSinceUse: 112 },
]

export const LINES = LINES_RAW.map((line) => {
  const idle = line.daysSinceUse >= IDLE_DAYS
  return { ...line, idle, usageLabel: idle ? `None in ${IDLE_DAYS} days` : line.usage ?? "Low" }
})
export const IDLE_LINES = LINES.filter((line) => line.idle)
const ACTIVE_LINES = LINES.filter((line) => !line.idle)

export const lastUsed = (days: number) => (days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`)

// Invented prices. No real plan or price is used.
export const CURRENT_PLAN = { name: "Current plan", lines: LINES.length, monthly: 289 }
export const SUGGESTED_PLAN = { name: "Smaller plan", lines: ACTIVE_LINES.length, monthly: 219 }
export const MONTHLY_DIFFERENCE = CURRENT_PLAN.monthly - SUGGESTED_PLAN.monthly
export const YEARLY_DIFFERENCE = MONTHLY_DIFFERENCE * 12

// Small counts read as words in the chat, the way the owner would say them.
const COUNT_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
export const spellCount = (n: number) => COUNT_WORDS[n] ?? String(n)

/** "Marco R. and the old order tablet": the idle lines as the chat names them. */
export const IDLE_LINE_NAMES = IDLE_LINES.map((line) => line.spoken ?? line.label).join(" and ")

// The request the story ends in. Nothing on the account changes until the carrier confirms.
export const LINES_REQUEST = {
  reference: "LN-2093",
  timestamp: "Today, 10:42 AM",
  sentTo: CARRIER.business,
}
