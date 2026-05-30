// Demo account data — usage, plan tiers, activity feed, and current user.
// Replace each export with a real API call when wiring up the backend.

import type { UsageData, PlanTier, ActivityItem, CurrentUser } from "../types"

export const MOCK_USAGE: UsageData = {
  plan: "Gold",
  tokens: { used: 11200, limit: 15000 },
  chats: { used: 4, limit: 10 },
  files: { used: 2, limit: 5 },
}

export const PLAN_TIERS: PlanTier[] = [
  { name: "Bronze",  tokensPerDay: 5000,  chatsPerDay: 5,    filesMax: 2,    price: "$19/mo" },
  { name: "Gold",    tokensPerDay: 15000, chatsPerDay: 10,   filesMax: 5,    price: "$49/mo" },
  { name: "Diamond", tokensPerDay: 50000, chatsPerDay: null, filesMax: null, price: "$99/mo" },
]

export const MOCK_ACTIVITY: ActivityItem[] = [
  { date: "Today",  title: "Why Did Tips Drop This Weekend",                               tokens: 5700  },
  { date: "May 11", title: "Is My Tuesday Rush Hour Getting Worse?",                       tokens: 12100 },
  { date: "May 9",  title: "Card Reader Went Offline — Did I Lose Sales?",                tokens: 6400  },
  { date: "May 8",  title: "% Volume by Card Brand and by BIN Number daily, MTD and YTD", tokens: 9800  },
  { date: "May 7",  title: "Top 15 merchants by BIN Number",                              tokens: 4200  },
]

export const DEFAULT_CURRENT_USER: CurrentUser = {
  name: "Teresa W.",
  email: "teresa.w@example.com",
  initials: "TW",
}
