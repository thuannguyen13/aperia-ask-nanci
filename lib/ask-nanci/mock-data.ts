// Mock data barrel for the Clover / business-owner persona.
// All demo content lives in data/. This file keeps its public surface stable
// so existing imports (api.ts, etc.) don't change.

import type { MockResponse } from "./types"
import { MOCK_RESPONSES } from "./data/responses.clover"

export { DEFAULT_RESPONSE, DEFAULT_SUGGESTIONS, ALL_QUESTIONS } from "./data/responses.clover"
export { PROMPT_CATEGORIES } from "./data/prompts.clover"
export { MOCK_USAGE, DEFAULT_CURRENT_USER } from "./data/account"

// Keyword-match lookup used by api.ts streamChat.
// BE dev: delete this function and replace streamChat with a real AI call.
export function findResponse(text: string): MockResponse | null {
  const lower = text.toLowerCase()
  return MOCK_RESPONSES.find((r) => r.keywords.some((kw) => lower.includes(kw.toLowerCase()))) ?? null
}
