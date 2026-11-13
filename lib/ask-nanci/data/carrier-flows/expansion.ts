// Carrier story 36, Second Location. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"

export const EXPANSION_PROMPT = "I'm opening a second location."

export const EXPANSION_FLOW: FlowDef = {
  num: 36,
  section: "merchant",
  title: "Second Location",
  badge: "Expansion",
  key: EXPANSION_PROMPT,
  slug: "36",
  scope: "carrier",
  description: "Coverage at the new address and what the first location uses, then a request for lines and internet there.",
}

export const EXPANSION_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [EXPANSION_PROMPT]: [
    { role: "user", content: EXPANSION_PROMPT },
    { role: "assistant", content: "Coming soon." },
  ],
}
