import { CONTEXT_WINDOW } from "./data/context-usage"
import type { Message } from "./types"

export type ContextUsageState = "ok" | "approaching" | "full"

export interface ContextUsage {
  used: number
  limit: number
  /** Whole percent, 0–100 — what the dialog prints and the Progress bar reads. */
  percent: number
  state: ContextUsageState
}

/** What the /context-* slash commands pin the meter to, for demoing either state. */
export type ContextUsageOverride = Exclude<ContextUsageState, "ok">

/**
 * How full this conversation's context window is. Derived from the messages rather
 * than stored, so it can never drift from what's onscreen and resets with a new chat.
 *
 * `override` pins it to a state on demand — the demo can't always spare the five
 * exchanges it takes to fill the window naturally.
 */
export function getContextUsage(messages: Message[], override?: ContextUsageOverride | null): ContextUsage {
  const { limit, base, perUserMessage, perAssistantMessage, approachingAt } = CONTEXT_WINDOW
  const spent = override
    ? (override === "full" ? limit : limit * approachingAt)
    : messages.reduce(
        (sum, m) => sum + (m.role === "user" ? perUserMessage : perAssistantMessage),
        base,
      )
  const used = Math.min(spent, limit)
  const ratio = used / limit
  return {
    used,
    limit,
    percent: Math.round(ratio * 100),
    state: ratio >= 1 ? "full" : ratio >= approachingAt ? "approaching" : "ok",
  }
}

/** "180.0k" — the figure format the Context Usage dialog shows. */
export function formatContextTokens(tokens: number): string {
  return `${(tokens / 1000).toFixed(1)}k`
}
