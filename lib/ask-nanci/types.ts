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

export type PanelId =
  | "case" | "transaction-receipt" | "dispute-draft"
  | "decline-report" | "email-draft"
  | "risk-flags" | "volume-settlement" | "change-log"
  | "work-queue"
  | "detection-queue" | "barometer-report" | "coastal-risk"

export interface ConceptScriptedTurn extends ScriptedTurn {
  sheetAction?: SheetActionData
  suggestions?: string[]
  openFormPanel?: true
  openStepUpPanel?: true
  advanceStepUp?: true
  openBatchPanel?: true
  openReportPanel?: true
  openPanel?: PanelId
  filterDeclineReport?: true
  advanceWorkQueue?: "quick-wins" | "outage"
  closeAllPanels?: true
  loopToPrompt?: string
  widget?: "ai-triage-summary"
  widgetDelay?: number
  pauseAfter?: number
}

// ─── API / user types ──────────────────────────────────────────────────────────

export interface CurrentUser {
  name: string
  email: string
  initials: string
}

export interface PlanTier {
  name: UsageData["plan"]
  tokensPerDay: number
  chatsPerDay: number | null
  filesMax: number | null
  price: string
}

export interface ActivityItem {
  date: string
  title: string
  tokens: number
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
  fromValue: string
  toValue: string
  timestamp: string
  status: "completed"
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
  widget?: "ai-triage-summary"
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
