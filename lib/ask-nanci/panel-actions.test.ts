import { describe, expect, it } from "vitest"
import { turnToPanelActions } from "./panel-actions"
import type { ConceptScriptedTurn, PanelId } from "./types"

// Cast helper — the mapper passes ids through without registry validation, so the
// exact keys don't matter to these tests, only the mapping shape.
const p = (s: string) => s as PanelId
const turn = (t: Partial<ConceptScriptedTurn>): ConceptScriptedTurn => ({ role: "assistant", content: "", ...t })

describe("turnToPanelActions", () => {
  it("maps panel + view to an open action carrying the view", () => {
    expect(turnToPanelActions(turn({ panel: p("batch-detail"), view: "filtered" }))).toEqual([
      { op: "open", id: "batch-detail", view: "filtered" },
    ])
  })

  it("maps panel without view to a viewless open (resets to default)", () => {
    expect(turnToPanelActions(turn({ panel: p("risk-flags") }))).toEqual([{ op: "open", id: "risk-flags" }])
  })

  it("maps closePanel to a close action", () => {
    expect(turnToPanelActions(turn({ closePanel: p("risk-flags") }))).toEqual([{ op: "close", id: "risk-flags" }])
  })

  it("maps filterDeclineReport", () => {
    expect(turnToPanelActions(turn({ filterDeclineReport: true }))).toEqual([{ op: "filterDeclineReport" }])
  })

  it("emits nothing for a turn with no panel fields", () => {
    expect(turnToPanelActions(turn({ content: "just talking" }))).toEqual([])
  })

  it("preserves order: open, then close, then filter", () => {
    const actions = turnToPanelActions(
      turn({ panel: p("a"), view: "v", closePanel: p("b"), filterDeclineReport: true }),
    )
    expect(actions.map((a) => a.op)).toEqual(["open", "close", "filterDeclineReport"])
  })

  it("does not map closeAllPanels (a player-level teardown, not a discrete action)", () => {
    expect(turnToPanelActions(turn({ closeAllPanels: true }))).toEqual([])
  })
})
