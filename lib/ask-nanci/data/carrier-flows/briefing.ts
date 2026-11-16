// Carrier story 33, Daily Briefing. Its definition and its script, one file per story, so
// the stories are written side by side without touching each other.
//
// The owner usually hears from the carrier only at bill time. Here Nanci sends a short
// text each morning, and the chat opens on the full briefing: yesterday's sales, the
// deposit, the top items and the one thing worth a look. The owner then shares it with
// the shift manager, so more of the business relies on it.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"
import { CARRIER, nanciLink } from "../carrier"
import { CARRIER_CITES } from "../sources"
import { formatWholeCurrency } from "../../../../components/shared/format"
import {
  YESTERDAY, YESTERDAY_CHANGE_PCT, DEPOSITED, TOP_ITEMS, WORTH_A_LOOK, SHIFT_MANAGER, BRIEFING_TIME, lowerFirst,
} from "../panels/daily-briefing"

// Nanci opens the flow, so its key is an id rather than a prompt.
const BRIEFING_KEY = "__daily-briefing__"
// The owner reads the text, then opens the app. The extra beat lets that read.
const OPEN_PAUSE_MS = 2500
const BRIEFING_SHARE = "Send this to my shift manager too"
// The owner opens the app on the text and asks for the rest.
const BRIEFING_ASK = "How did yesterday go?"

export const BRIEFING_FLOW: FlowDef = {
  num: 33,
  section: "merchant",
  title: "Daily Briefing",
  badge: "Engagement",
  key: BRIEFING_KEY,
  proactive: true,
  slug: "33",
  scope: "carrier",
  churn: { cause: "Low engagement", metric: "Churn" },
  followups: [BRIEFING_SHARE],
  description: "A morning text with yesterday's sales, the deposit, the top items and one thing worth a look, then shared with the shift manager.",
}

export const BRIEFING_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [BRIEFING_KEY]: [
    {
      role: "assistant",
      content: `Good morning. ${YESTERDAY.day}: ${formatWholeCurrency(YESTERDAY.sales)} in sales, ${YESTERDAY_CHANGE_PCT}% above a usual ${YESTERDAY.day}. ${WORTH_A_LOOK.title}.`,
      textFrom: CARRIER.business,
      textLink: nanciLink("b7Kq2"),
    },
    { role: "user", content: BRIEFING_ASK, pauseBefore: OPEN_PAUSE_MS },
    {
      role: "assistant",
      content: `${YESTERDAY.day} came in at ${formatWholeCurrency(YESTERDAY.sales)} across ${YESTERDAY.orders} orders, ${YESTERDAY_CHANGE_PCT}% above a usual ${YESTERDAY.day}. The ${TOP_ITEMS[0].name} led again with ${TOP_ITEMS[0].sold} sold. ${formatWholeCurrency(DEPOSITED)} from Thursday's card sales landed in your bank overnight.\n\nOne thing for this week: ${lowerFirst(WORTH_A_LOOK.title)}. ${WORTH_A_LOOK.body}`,
      panel: "daily-briefing",
      source: CARRIER_CITES.cashFlow,
      suggestions: [BRIEFING_SHARE],
    },
  ],
  [BRIEFING_SHARE]: [
    { role: "user", content: BRIEFING_SHARE },
    {
      role: "assistant",
      content: `Done. From tomorrow, your shift manager's line, ending ${SHIFT_MANAGER.ending}, gets the same briefing at ${BRIEFING_TIME}. Their copy shows sales and stock only. Your bank account and your ${CARRIER.business} bill stay with you.`,
      panel: "daily-briefing",
      view: "shared",
    },
  ],
}
