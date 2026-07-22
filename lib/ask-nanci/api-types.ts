import type { Session, Source, ChartWidget, MapWidget, PanelAction } from "./types"

// ─── Chat ─────────────────────────────────────────────────────────────────────


export type ChatStreamChunk =
  | { type: "thinking"; source: Pick<Source, "id" | "name" | "kind" | "logo" | "color" | "initials" | "institution"> }
  | { type: "token"; content: string }
  | { type: "suggestions"; items: string[] }
  | { type: "sources"; items: Source[] }
  | { type: "chart"; data: ChartWidget }
  | { type: "map"; data: MapWidget }
  | { type: "action"; action: PanelAction } // a real backend drives panels through this
  | { type: "done" }
  | { type: "error"; message: string }

// ─── Sessions ─────────────────────────────────────────────────────────────────

/** @expected-unused backend seam */
export type SessionListResponse = Session[]


// ─── Sources ──────────────────────────────────────────────────────────────────

/** @expected-unused backend seam */
export type SourceListResponse = Source[]

/** @expected-unused backend seam */
export interface SourceAddRequest {
  name: string
  kind: "file" | "bank"
  mimeType?: string
  institution?: string
  color?: string
  initials?: string
}

/** @expected-unused backend seam */
export interface SourceUpdateRequest {
  active?: boolean
}
