import type { UsageData } from "./types"

export type PlanUsageState = "ok" | "approaching" | "full"

/** What the /plan-* slash commands pin the meter to, for demoing either state. */
export type PlanUsageOverride = Exclude<PlanUsageState, "ok">

export interface PlanUsage {
  /** Whole percent, 0–100 — what the chip and the popover print. */
  percent: number
  state: PlanUsageState
}

/** Below this the chip stays hidden: the plan budget is only worth surfacing near its end. */
const APPROACHING_AT = 0.9

/**
 * How much of the daily plan budget is spent. Unlike the context window this is an
 * account-level quota, so it reads straight from the account data rather than from the
 * conversation — one long chat doesn't spend a day's allowance.
 *
 * `override` pins it for a demo, since the mock sits below the threshold by design.
 */
export function getPlanUsage(usage: UsageData, override?: PlanUsageOverride | null): PlanUsage {
  const ratio = override
    ? (override === "full" ? 1 : APPROACHING_AT)
    : usage.tokens.used / usage.tokens.limit
  const capped = Math.min(ratio, 1)
  return {
    percent: Math.round(capped * 100),
    state: capped >= 1 ? "full" : capped >= APPROACHING_AT ? "approaching" : "ok",
  }
}
