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

import type { Message, Session, Source } from "./types"
import type { ChatStreamChunk, SourceAddRequest, SourceUpdateRequest } from "./api-types"
import {
  readSessions,
  saveSession,
  deleteSession,
} from "./sessionStore"
import {
  readSources,
  writeSources,
  addFileSource,
  addBankSource,
  toggleSource,
  removeSource,
} from "./sourceStore"
import { findResponse, DEFAULT_RESPONSE, DEFAULT_SUGGESTIONS } from "./mock-data"
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
): AsyncGenerator<ChatStreamChunk> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")
  const match = findResponse(lastUser?.content ?? "")

  const text = match?.content ?? DEFAULT_RESPONSE
  const suggestions = match?.suggestions ?? DEFAULT_SUGGESTIONS
  const chart = match?.chart

  // Emit tokens character by character to simulate streaming
  for (const char of text) {
    yield { type: "token", content: char }
    await new Promise((r) => setTimeout(r, 12))
  }

  if (suggestions.length) yield { type: "suggestions", items: suggestions }

  // Attribute a random sample of active sources
  if (activeSources.length) {
    const count = Math.min(activeSources.length, Math.floor(Math.random() * 3) + 1)
    const sampled = [...activeSources].sort(() => Math.random() - 0.5).slice(0, count)
    yield { type: "sources", items: sampled }
  }

  if (chart) yield { type: "chart", data: chart }

  yield { type: "done" }
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function fetchSessions(): Promise<Session[]> {
  return readSessions()
}

export async function persistSession(messages: Message[], id: string): Promise<Session> {
  return saveSession(messages, id)
}

export async function removeSessionById(id: string): Promise<void> {
  deleteSession(id)
}

export function newSessionId(): string {
  return generateId()
}

// ─── Sources ──────────────────────────────────────────────────────────────────

export async function fetchSources(): Promise<Source[]> {
  return readSources()
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

export async function updateSource(id: string, _updates: SourceUpdateRequest): Promise<void> {
  toggleSource(id)
}

export async function deleteSourceById(id: string): Promise<void> {
  removeSource(id)
}
