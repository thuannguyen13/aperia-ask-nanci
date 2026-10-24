// A scope narrows a mode to one partner's story. A flow or marketplace listing with a
// scope shows only in the mode that carries it, and that mode shows nothing else.

export type FlowScope = "resy"

export const SCOPE_CATALOG: Record<FlowScope, { title: string; subtitle: string }> = {
  resy: {
    title: "Ask Nanci × Resy",
    subtitle: "Your Resy book and your card sales in one conversation. Connect Resy in the Marketplace, then ask. A concept: no Resy connection exists.",
  },
}

// The one rule every surface filters by: an item belongs to exactly one scope, and
// having none is its own scope (null), so unscoped surfaces never show scoped items.
export const inScope = (scope: FlowScope | null) => (item: { scope?: FlowScope }) => (item.scope ?? null) === scope
