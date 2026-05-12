export type MessageRole = "user" | "assistant"

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

export interface ChartWidget {
  kind: "bar" | "line"
  title: string
  labels: string[]
  datasets: { label: string; data: number[]; color?: string }[]
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  suggestions?: string[]
  attributedSources?: Source[]
  chart?: ChartWidget
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
