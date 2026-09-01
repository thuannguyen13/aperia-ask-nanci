"use client"

import { createContext, useContext } from "react"
import { ASSIGNMENTS } from "@/lib/ask-nanci/data/risk-assignments"
import { DASH_TODAY, DASH_SCOPE_ALL, DASH_ANALYST_EVERYONE } from "@/lib/ask-nanci/data/risk-dashboard"

// What the dashboard is currently reporting on. The filter row writes it, the two
// assignment-keyed views read it. A context rather than props because those views sit
// three levels down inside ChartPanel, and threading a filter through a presentational
// card is how the card ends up knowing about filters.

export interface DashboardScope {
  /** The period label from the row; charts resolve it through alertsForRange. */
  range: string
  /**
   * The assignments in play, already narrowed by both scope and analyst. Null means
   * every assignment, which is not the same as the full list: it also covers a view
   * whose rows are not keyed by assignment at all.
   */
  assignmentIds: string[] | null
  /** True when either control is narrowing, so a view can say what it is showing. */
  narrowed: boolean
}

const ScopeContext = createContext<DashboardScope>({
  range: DASH_TODAY,
  assignmentIds: null,
  narrowed: false,
})

export const DashboardScopeProvider = ScopeContext.Provider
export const useDashboardScope = () => useContext(ScopeContext)

/** Resolve the row's three choices into the set of assignments they leave standing. */
export function resolveScope(range: string, scope: string, analyst: string): DashboardScope {
  const byScope = scope === DASH_SCOPE_ALL ? ASSIGNMENTS : ASSIGNMENTS.filter((a) => a.name === scope)
  const byAnalyst = analyst === DASH_ANALYST_EVERYONE ? byScope : byScope.filter((a) => a.owner === analyst)
  const narrowed = scope !== DASH_SCOPE_ALL || analyst !== DASH_ANALYST_EVERYONE
  return { range, narrowed, assignmentIds: narrowed ? byAnalyst.map((a) => a.id) : null }
}
