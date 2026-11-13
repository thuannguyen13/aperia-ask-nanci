// Carrier story 35, Unused Lines. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"

export const LINES_PROMPT = "Am I paying for more than I need?"

export const LINES_FLOW: FlowDef = {
  num: 35,
  section: "merchant",
  title: "Unused Lines",
  badge: "Lines",
  key: LINES_PROMPT,
  slug: "35",
  scope: "carrier",
  description: "Two lines with no use in 60 days, and a request to move to a smaller plan.",
}

export const LINES_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [LINES_PROMPT]: [
    { role: "user", content: LINES_PROMPT },
    { role: "assistant", content: "Coming soon." },
  ],
}
