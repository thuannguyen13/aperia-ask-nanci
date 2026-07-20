/**
 * API layer for Ask Nanci.
 *
 * All functions currently delegate to localStorage stubs so the app
 * keeps working without a backend. When the real backend is ready, swap
 * each function's body to call the corresponding endpoint — the context
 * and UI don't change.
 *
 * Real endpoints (to be implemented):
 *   POST   /api/nanci/chat       → SSE stream of ChatStreamChunk
 *   GET    /api/nanci/sessions   → SessionListResponse
 *   PUT    /api/nanci/sessions/:id
 *   DELETE /api/nanci/sessions/:id
 *   GET    /api/nanci/sources    → SourceListResponse
 *   POST   /api/nanci/sources
 *   PATCH  /api/nanci/sources/:id
 *   DELETE /api/nanci/sources/:id
 */

import type { Message, Session, Source, PromptCategory } from "./types"
import type { ChatStreamChunk, SourceAddRequest, SourceUpdateRequest } from "./api-types"
import {
  readSessions,
  saveSession,
  deleteSession,
} from "./sessionStore"
import {
  CLOVER_SOURCE,
  readSources,
  writeSources,
  addFileSource,
  addBankSource,
  toggleSource,
  removeSource,
} from "./sourceStore"
import { findResponse, DEFAULT_RESPONSE, DEFAULT_SUGGESTIONS, PROMPT_CATEGORIES, ALL_QUESTIONS } from "./mock-data"
export type { MockResponse, PromptCategory, CurrentUser } from "./types"
import { VARIANT_CONTENT_OVERRIDES } from "./embed-demo-config"
import type { EmbedVariant } from "./embed-demo-config"
import { generateId } from "./utils"

// ─── Chat ─────────────────────────────────────────────────────────────────────

/**
 * Stream a chat response as an async generator of chunks.
 *
 * Stub: simulates a keyword-matched mock response with per-character tokens.
 * Real: replace with an SSE fetch to POST /api/nanci/chat.
 */
export async function* streamChat(
  messages: Pick<Message, "role" | "content">[],
  activeSources: Source[],
  _sessionId: string,
  embedVariant?: EmbedVariant | null,
): AsyncGenerator<ChatStreamChunk> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")
  const match = findResponse(lastUser?.content ?? "")

  const overrideContent = match ? VARIANT_CONTENT_OVERRIDES[embedVariant ?? ""]?.[match.id] : undefined
  const text = overrideContent ?? match?.content ?? DEFAULT_RESPONSE
  const suggestions = match?.suggestions ?? DEFAULT_SUGGESTIONS
  const chart = match?.chart
  const map = match?.map

  // Cycle through active sources during thinking phase (BE: replace with real thinking chunks)
  const thinkingSources = activeSources.length ? activeSources : [CLOVER_SOURCE]
  for (const source of thinkingSources) {
    yield { type: "thinking", source }
    await new Promise((r) => setTimeout(r, 1200))
  }

  // Emit tokens word by word to simulate streaming
  const words = text.match(/\S+|\s+/g) ?? []
  for (const word of words) {
    yield { type: "token", content: word }
    await new Promise((r) => setTimeout(r, 20))
  }

  if (suggestions.length) yield { type: "suggestions", items: suggestions }

  // Attribute sources relevant to the answer, falling back to random sample
  if (activeSources.length) {
    let attributed: typeof activeSources
    if (match?.sourceInstitutions?.length) {
      attributed = activeSources.filter((s) => match.sourceInstitutions!.includes(s.institution ?? s.name))
      if (!attributed.length) attributed = activeSources.slice(0, 1)
    } else {
      const count = Math.min(activeSources.length, Math.floor(Math.random() * 3) + 1)
      attributed = [...activeSources].sort(() => Math.random() - 0.5).slice(0, count)
    }
    yield { type: "sources", items: attributed }
  }

  if (chart) yield { type: "chart", data: chart }
  if (map) yield { type: "map", data: map }

  yield { type: "done" }
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

// Real: GET /api/nanci/sessions → Session[]
export async function fetchSessions(): Promise<Session[]> {
  return readSessions()
}

// Real: PUT /api/nanci/sessions/:id
export async function persistSession(messages: Message[], id: string, titleOverride?: string): Promise<Session> {
  return saveSession(messages, id, titleOverride)
}

// Real: DELETE /api/nanci/sessions/:id
export async function removeSessionById(id: string): Promise<void> {
  deleteSession(id)
}

export function newSessionId(): string {
  return generateId()
}

// ─── Sources ──────────────────────────────────────────────────────────────────

export async function fetchSources(): Promise<Source[]> {
  return [CLOVER_SOURCE, ...readSources()]
}

export async function persistSources(sources: Source[]): Promise<void> {
  writeSources(sources)
}

export async function addSource(req: SourceAddRequest): Promise<Source> {
  if (req.kind === "file") {
    return addFileSource(req.name, req.mimeType ?? "")
  }
  return addBankSource(req.name, {
    institution: req.institution,
    color: req.color,
    initials: req.initials,
  })
}

// Stub only toggles active state; real endpoint should apply the full updates payload.
export async function updateSource(id: string, updates: SourceUpdateRequest): Promise<void> {
  void updates
  toggleSource(id)
}

export async function deleteSourceById(id: string): Promise<void> {
  removeSource(id)
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

// Real: GET /api/nanci/prompts/categories → PromptCategory[]
export async function fetchPromptCategories(): Promise<PromptCategory[]> {
  return PROMPT_CATEGORIES
}

// Real: GET /api/nanci/prompts → string[]
export async function fetchAllQuestions(): Promise<string[]> {
  return ALL_QUESTIONS
}
