// A scope narrows a mode to one partner's story. A flow or marketplace listing with a
// scope shows only in the mode that carries it, and that mode shows nothing else.

export type FlowScope = "resy"

export const SCOPE_CATALOG: Record<FlowScope, { title: string; subtitle: string }> = {
  resy: {
    title: "Ask Nanci × Resy",
    subtitle: "Your Resy book and your card sales in one conversation. Connect Resy in the Marketplace, then ask. A concept: no Resy connection exists.",
  },
}
