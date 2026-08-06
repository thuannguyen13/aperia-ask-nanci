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

/**
 * How full this conversation's context window is. Derived from the messages rather
 * than stored, so it can never drift from what's onscreen and resets with a new chat.
 */
export function getContextUsage(messages: Message[]): ContextUsage {
  const { limit, base, perUserMessage, perAssistantMessage, approachingAt } = CONTEXT_WINDOW
  const spent = messages.reduce(
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
