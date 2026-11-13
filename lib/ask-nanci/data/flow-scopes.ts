// A scope narrows a mode to one partner's story. A flow or marketplace listing with a
// scope shows only in the mode that carries it, and that mode shows nothing else.

import type { Source } from "../types"
import { CARRIER_SOURCE, VISION_WEB_SOURCE } from "./sources"
import { CARRIER } from "./carrier"

export type FlowScope = "resy" | "carrier"

// The built-in data source a scoped mode ships with, in place of the default foundation.
export const SCOPE_FOUNDATION: Record<FlowScope, Source> = {
  resy: VISION_WEB_SOURCE,
  carrier: CARRIER_SOURCE,
}

export const SCOPE_CATALOG: Record<FlowScope, { title: string; subtitle: string }> = {
  resy: {
    title: "Ask Nanci",
    subtitle: "Your Resy book and your card sales in one conversation. Connect Resy in the Marketplace, then ask. A concept: no Resy connection exists.",
  },
  carrier: {
    title: "Ask Nanci",
    subtitle: `Your sales and your ${CARRIER.business} account in one conversation. Ask about the business, and send ${CARRIER.name} a request when something needs to change.`,
  },
}

// The one rule every surface filters by: an item belongs to exactly one scope, and
// having none is its own scope (null), so unscoped surfaces never show scoped items.
export const inScope = (scope: FlowScope | null) => (item: { scope?: FlowScope }) => (item.scope ?? null) === scope
