// Tabbed prompt categories for the ISO embed variant.
// BE dev: replace each `prompts` array with GET /api/nanci/prompts?category=<id>

import type { PromptCategory } from "../types"

export const ISO_PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: "portfolio",
    label: "Portfolio",
    prompts: [
      "How is my portfolio performing MTD vs last month?",
      "Which merchants have the highest gross sales this week?",
      "Show me my top 10 merchants by volume YTD.",
      "Which merchants haven't processed in the last 7 days?",
      "How many new merchant activations did I have this month?",
      "What's my total portfolio volume for the last 90 days?",
    ],
  },
  {
    id: "boarding",
    label: "Boarding",
    prompts: [
      "How many merchants are pending approval right now?",
      "Which merchants were boarded this month but haven't run their first batch yet?",
      "Show me my boarding pipeline for the last 30 days.",
      "Which merchants I boarded this month have already processed their first batch?",
      "Which new merchants have the highest volume in their first 30 days?",
      "What's the current status of my most recent merchant applications?",
    ],
  },
  {
    id: "processing",
    label: "Processing",
    prompts: [
      "What was my total processing volume yesterday?",
      "Which merchants processed a batch yesterday?",
      "Which merchants have the highest decline rates this month?",
      "What's my overall approval rate this month?",
      "Which merchants have the highest declined rate this month?",
      "Which merchants had their highest volume week this month?",
    ],
  },
  {
    id: "chargebacks",
    label: "Chargebacks",
    prompts: [
      "Which merchants have the highest chargeback ratio this month?",
      "Which merchants have open chargeback disputes right now?",
      "Show me chargeback trends over the last 6 months.",
      "Which merchants are approaching chargeback thresholds?",
      "What are the most common chargeback reason codes this quarter?",
      "How has my portfolio chargeback rate trended over the last 6 months?",
    ],
  },
  {
    id: "cases",
    label: "Cases",
    prompts: [
      "Which open cases have been sitting the longest without resolution?",
      "Which of my merchants have the most open cases right now?",
      "Show me cases opened this week sorted by priority.",
      "How many cases did we open this month compared to last month?",
      "Which merchants have the most open cases right now?",
      "How many cases did we close this month?",
    ],
  },
  {
    id: "risk",
    label: "Risk",
    prompts: [
      "Which merchants have active risk alerts on their account?",
      "Which merchants have had unusual spikes in transaction volume recently?",
      "Which merchants have the most disputed transactions this month?",
      "Which merchants moved to a higher risk tier this month?",
      "Which merchants have a high rate of declined transactions followed by approvals?",
      "How many of my merchants are currently flagged as high risk?",
    ],
  },
  {
    id: "merchants",
    label: "Merchants",
    prompts: [
      "Pull up the profile for merchant ID 4892.",
      "Which merchants changed status in the last 30 days?",
      "Which of my merchants are based in Texas?",
      "Which merchants are in the same chain as MID 7823?",
      "Find merchants with a risk score above 80.",
      "Which merchants have been inactive for more than 60 days?",
    ],
  },
]
