// Carrier story 42, Accumulated Value. Its definition and its script, one file per story,
// so the stories are written side by side without touching each other.
//
// Value builds up the longer the owner stays: this year against last, nearby restaurants
// beside them, a best day they would not otherwise know about. The brief warns this can
// read as lock-in, so the story ends on the owner downloading the whole history. It is
// the value they keep, not the cost of leaving.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER_CITES } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"
import { NOVEMBER_CHANGE_PCT, NEARBY_CHANGE_PCT, BEST_DAY, YEARS_OF_HISTORY } from "../panels/year-history"

export const HISTORY_PROMPT = "How did November compare to last year?"
const HISTORY_EXPORT = "Can I download all of my history?"

export const HISTORY_FLOW: FlowDef = {
  num: 42,
  section: "merchant",
  title: "Year over Year",
  badge: "Accumulated Value",
  key: HISTORY_PROMPT,
  slug: "42",
  scope: "carrier",
  churn: { cause: "Short tenure", metric: "Churn" },
  followups: [HISTORY_EXPORT],
  description: "November against last year and nearby restaurants, a new best day, and the owner's full history to download.",
}

export const HISTORY_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [HISTORY_PROMPT]: [
    { role: "user", content: HISTORY_PROMPT },
    {
      role: "assistant",
      content: `November is up ${NOVEMBER_CHANGE_PCT}% on last year. Restaurants near you are up ${NEARBY_CHANGE_PCT}% for the same month, so you are ahead of the area. ${BEST_DAY.date} was also your best day since you opened, at ${formatWholeCurrency(BEST_DAY.sales)}.`,
      panel: "year-history",
      source: CARRIER_CITES.withSales,
      suggestions: [HISTORY_EXPORT],
    },
  ],
  [HISTORY_EXPORT]: [
    { role: "user", content: HISTORY_EXPORT },
    {
      role: "assistant",
      content: `Yes, it's yours. I've sent a link to your email with ${YEARS_OF_HISTORY} years of sales by day, item and hour, as a spreadsheet. It works for 7 days, and you can ask for a new one any time.`,
      panel: "year-history",
      view: "exported",
    },
  ],
}
