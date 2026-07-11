// Tabbed prompt categories for the Clover/business-owner welcome screen.
// BE dev: replace each `prompts` array with GET /api/nanci/prompts?category=<id>

import type { PromptCategory } from "../types"

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: "overview",
    label: "Overview",
    prompts: [
      "Give me the full picture on yesterday.",
      "How much did I actually make last week?",
      "Why did my bank balance drop this month even though sales were up?",
      "Was Saturday worth it?",
      "Where's all my money going?",
      "Which location should I be worried about?",
    ],
  },
  {
    id: "account-maintenance",
    label: "Maintenance",
    prompts: [
      "Change my business address",
      "Update my primary email",
      "Update my phone number",
      "Change my statement descriptor",
      "Update customer service phone",
      "Update my business name",
    ],
  },
  {
    id: "top-items",
    label: "Top Items",
    prompts: [
      "What should I charge more for?",
      "What's my best-selling item this week?",
      "Which menu items have the highest margin?",
      "What items are dragging down my average ticket?",
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    prompts: [
      "I feel like we're throwing away too much food. Are we?",
      "How much is Sysco costing me?",
      "Which ingredients am I over-ordering?",
      "How does my food cost percentage compare to last month?",
    ],
  },
  {
    id: "operation",
    label: "Operation",
    prompts: [
      "Is it worth staying open past 9?",
      "Can I afford to give my staff a raise?",
      "Am I going to be able to make payroll on Friday?",
      "Who's my best employee?",
    ],
  },
  {
    id: "refunds-voids",
    label: "Refunds & Voids",
    prompts: [
      "Why do I keep getting chargebacks?",
      "Which server has the most voids this week?",
      "How much did refunds cost me this month?",
      "Are my chargebacks trending up or down?",
    ],
  },
  {
    id: "payment",
    label: "Payment",
    prompts: [
      "Why doesn't my bank match my sales report?",
      "I'm paying way too much in fees. How bad is it?",
      "Which card brand has the highest spend per customer?",
      "Are any transactions still pending from last week?",
    ],
  },
]

// business-owner (AccessOne) embed reuses Clover's categories, only the order
// differs (Maintenance promoted to 2nd).
const BUSINESS_OWNER_ORDER = ["overview", "account-maintenance", "top-items", "inventory", "operation", "refunds-voids", "payment"]

export const BUSINESS_OWNER_PROMPT_CATEGORIES: PromptCategory[] = BUSINESS_OWNER_ORDER
  .map((id) => PROMPT_CATEGORIES.find((c) => c.id === id))
  .filter((c): c is PromptCategory => c !== undefined)
