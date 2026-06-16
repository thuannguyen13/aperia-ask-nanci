// Prompt category order for the business-owner (AccessOne) embed variant.
// Reuses clover prompt content; only the order differs (Maintenance promoted to 2nd).

import { PROMPT_CATEGORIES } from "./prompts.clover"
import type { PromptCategory } from "../types"

const ORDER = ["overview", "account-maintenance", "top-items", "inventory", "operation", "refunds-voids", "payment"]

export const BUSINESS_OWNER_PROMPT_CATEGORIES: PromptCategory[] = ORDER
  .map((id) => PROMPT_CATEGORIES.find((c) => c.id === id))
  .filter((c): c is PromptCategory => c !== undefined)
