// Carrier story 38, Bill Question. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"

export const HANDOFF_PROMPT = "This charge on my bill doesn't look right."

export const HANDOFF_FLOW: FlowDef = {
  num: 38,
  section: "merchant",
  title: "Bill Question",
  badge: "Handoff",
  key: HANDOFF_PROMPT,
  slug: "38",
  scope: "carrier",
  description: "A charge Ask Nanci can see but not explain, handed to a business specialist with the details attached.",
}

export const HANDOFF_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [HANDOFF_PROMPT]: [
    { role: "user", content: HANDOFF_PROMPT },
    { role: "assistant", content: "Coming soon." },
  ],
}
