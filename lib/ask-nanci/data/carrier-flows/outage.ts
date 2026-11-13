// Carrier story 34, Outage Impact. Its definition and its script, one file per story, so the
// stories are written side by side without touching each other.
import type { ConceptScriptedTurn } from "../../types"
import type { FlowDef } from "../flows.concept"

export const OUTAGE_PROMPT = "What happened Thursday evening?"

export const OUTAGE_FLOW: FlowDef = {
  num: 34,
  section: "merchant",
  title: "Outage Impact",
  badge: "Outage",
  key: OUTAGE_PROMPT,
  slug: "34",
  scope: "carrier",
  description: "An internet outage matched to the card payments that failed during it, then a request for backup internet.",
}

export const OUTAGE_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  [OUTAGE_PROMPT]: [
    { role: "user", content: OUTAGE_PROMPT },
    { role: "assistant", content: "Coming soon." },
  ],
}
