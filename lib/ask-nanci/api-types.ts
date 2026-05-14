import type { Message, Session, Source, ChartWidget } from "./types"

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatRequest {
  sessionId: string
  messages: Pick<Message, "role" | "content">[]
  sourceIds: string[]
}

export type ChatStreamChunk =
  | { type: "thinking"; source: Pick<Source, "id" | "name" | "kind" | "logo" | "color" | "initials" | "institution"> }
  | { type: "token"; content: string }
  | { type: "suggestions"; items: string[] }
  | { type: "sources"; items: Source[] }
  | { type: "chart"; data: ChartWidget }
  | { type: "done" }
  | { type: "error"; message: string }

// ─── Sessions ─────────────────────────────────────────────────────────────────

export type SessionListResponse = Session[]

export interface SessionSaveRequest {
  id: string
  messages: Message[]
}

// ─── Sources ──────────────────────────────────────────────────────────────────

export type SourceListResponse = Source[]

export interface SourceAddRequest {
  name: string
  kind: "file" | "bank"
  mimeType?: string
  institution?: string
  color?: string
  initials?: string
}

export interface SourceUpdateRequest {
  active?: boolean
}
