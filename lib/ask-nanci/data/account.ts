// Demo account data — usage summary and current user.
// Replace with a real API call when wiring up the backend.

import type { UsageData, CurrentUser } from "../types"

export const MOCK_USAGE: UsageData = {
  plan: "Gold",
  tokens: { used: 11200, limit: 15000 },
  chats: { used: 4, limit: 10 },
  files: { used: 2, limit: 5 },
  resetsIn: "2h",
  resetsAt: "6:00PM today",
}

export const DEFAULT_CURRENT_USER: CurrentUser = {
  name: "Teresa W.",
  email: "teresa.w@example.com",
  initials: "TW",
}
