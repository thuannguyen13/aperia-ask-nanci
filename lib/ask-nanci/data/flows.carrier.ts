// The carrier stories (?mode=att): a business question answered from the register and
// the carrier account together, ending in a request to the carrier. Nothing on the
// carrier account changes directly. Each story is its own file in carrier-flows/.
import type { ConceptScriptedTurn } from "../types"
import type { FlowDef } from "./flows.concept"
import { CALLS_FLOW, CALLS_CONVERSATIONS } from "./carrier-flows/calls"
import { OUTAGE_FLOW, OUTAGE_CONVERSATIONS } from "./carrier-flows/outage"
import { LINES_FLOW, LINES_CONVERSATIONS } from "./carrier-flows/lines"
import { EXPANSION_FLOW, EXPANSION_CONVERSATIONS } from "./carrier-flows/expansion"
import { RENEWAL_FLOW, RENEWAL_CONVERSATIONS } from "./carrier-flows/renewal"
import { HANDOFF_FLOW, HANDOFF_CONVERSATIONS } from "./carrier-flows/handoff"

export const CARRIER_FLOW_DEFS: FlowDef[] = [CALLS_FLOW, OUTAGE_FLOW, LINES_FLOW, EXPANSION_FLOW, RENEWAL_FLOW, HANDOFF_FLOW]

export const CARRIER_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  ...CALLS_CONVERSATIONS,
  ...OUTAGE_CONVERSATIONS,
  ...LINES_CONVERSATIONS,
  ...EXPANSION_CONVERSATIONS,
  ...RENEWAL_CONVERSATIONS,
  ...HANDOFF_CONVERSATIONS,
}
