// PanelId is derived from the panel registry — add a panel there, not here.
import type { PanelId } from "@/components/ask-nanci/concept/panel-registry"
import type { DashChartId } from "./data/risk-dashboard"
export type { PanelId }

export type MessageRole = "user" | "assistant"

// ─── Demo data types ───────────────────────────────────────────────────────────

export interface MockResponse {
  id: string
  keywords: string[]
  content: string
  suggestions: string[]
  chart?: ChartWidget
  map?: MapWidget
  sourceInstitutions?: string[]
}

export interface PromptCategory {
  id: string
  label: string
  prompts: string[]
}

export interface ScriptedTurn {
  role: MessageRole
  content: string
  map?: MapWidget
}

// A discrete panel effect — the normalized unit that both scripted turns and a
// real backend stream (see ChatStreamChunk's `action` variant) drive through the
// single applyPanelAction handler. `closeAllPanels` stays a player-level animated
// teardown, so it is intentionally not a discrete action here.
export type PanelAction =
  | { op: "open"; id: PanelId; view?: string }
  | { op: "close"; id: PanelId }
  | { op: "filterDeclineReport" }

export interface ConceptScriptedTurn extends ScriptedTurn {
  sheetAction?: SheetActionData
  source?: string
  suggestions?: string[]
  // Unified panel vocabulary (concept-flow pipeline): `panel` ensures a panel is
  // open; add `view` to set its view; `closePanel` closes one panel (e.g. replace).
  panel?: PanelId
  view?: string
  closePanel?: PanelId
  filterDeclineReport?: true
  closeAllPanels?: true
  widget?: "ai-triage-summary"
  dashChart?: DashChartId
  widgetDelay?: number
  pauseAfter?: number
}

// ─── API / user types ──────────────────────────────────────────────────────────

export interface CurrentUser {
  name: string
  email: string
  initials: string
}

export interface Source {
  id: string
  name: string
  kind: "file" | "bank"
  mimeType?: string
  active: boolean
  addedAt: number
  // bank sources only
  institution?: string
  color?: string
  initials?: string
  logo?: string
}

export interface MapWidget {
  address: string
  lat: number
  lng: number
}

export interface ChartWidget {
  kind: "bar" | "line"
  title: string
  labels: string[]
  datasets: { label: string; data: number[]; color?: string }[]
}

export interface SheetActionData {
  field: string
  fromValue?: string // omitted for the offer-request variant (no from→to change)
  toValue?: string
  timestamp: string
  // "completed" = AI applied it directly; "submitted" = sent to a team for review.
  status: "completed" | "submitted"
  reference?: string // request reference shown in the submitted-variant hero
  sentTo?: string // submitted-variant only: the team/queue the request was routed to
  iconKind?: "address" | "bank" | "name" // icon used in the submitted-variant value cards
  // Offer-request variant (credit-card/loan flows): when set, the drawer drops the
  // from→to value cards and relabels "Field" → "File"; `product` is the offer shown
  // in the chat card subtitle. See credit-card-offer / business-loan-offer flows.
  requestLabel?: string
  product?: string
  submittedTitle?: string // offer-request hero/title override (default "Request Submitted")
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  suggestions?: string[]
  attributedSources?: Source[]
  chart?: ChartWidget
  map?: MapWidget
  sheetAction?: SheetActionData
  source?: string // muted "Source: …" attribution line under a scripted answer
  widget?: "ai-triage-summary"
  dashChart?: DashChartId // embeds a live Risk dashboard chart card in the answer
  /** True when the stream ended (user stopped or natural completion). Prevents re-appending a partial response on session resume. */
  stopped?: boolean
}

export interface Session {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

export interface UsageData {
  plan: "Bronze" | "Gold" | "Diamond"
  tokens: { used: number; limit: number }
  chats: { used: number; limit: number }
  files: { used: number; limit: number }
}
