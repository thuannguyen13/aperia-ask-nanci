// Carrier story 37, Plan Value. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"

export const RENEWAL_PROMPT = "My plan renews next month. Is it worth keeping?"

export const RENEWAL_FLOW: FlowDef = {
  num: 37,
  section: "merchant",
  title: "Plan Value",
  badge: "Renewal",
  key: RENEWAL_PROMPT,
  slug: "37",
  scope: "carrier",
  description: "A year of Ask Nanci beside the plan's cost, then renew or review options.",
}

export const RENEWAL_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [RENEWAL_PROMPT]: [
    { role: "user", content: RENEWAL_PROMPT },
    { role: "assistant", content: "Coming soon." },
  ],
}
