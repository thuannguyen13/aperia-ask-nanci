// Carrier story 33, Missed Calls. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"

export const CALLS_PROMPT = "Why were Friday sales down?"

export const CALLS_FLOW: FlowDef = {
  num: 33,
  section: "merchant",
  title: "Missed Calls",
  badge: "Calls",
  key: CALLS_PROMPT,
  slug: "33",
  scope: "carrier",
  description: "Friday lunch sales against the calls the business line missed in the same window, then a request to cover it.",
}

export const CALLS_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [CALLS_PROMPT]: [
    { role: "user", content: CALLS_PROMPT },
    { role: "assistant", content: "Coming soon." },
  ],
}
