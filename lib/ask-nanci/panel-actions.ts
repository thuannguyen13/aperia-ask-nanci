import type { ConceptScriptedTurn, PanelAction } from "./types"

// Normalize a scripted turn's panel fields into discrete PanelActions — the same
// unit a real backend would emit as `action` stream chunks. Pure, so it's testable
// without React. (`closeAllPanels` is a flow-end animated teardown owned by the
// player, not a discrete action, so it's not mapped here.)
export function turnToPanelActions(turn: ConceptScriptedTurn): PanelAction[] {
  const actions: PanelAction[] = []
  if (turn.panel) {
    actions.push(turn.view ? { op: "open", id: turn.panel, view: turn.view } : { op: "open", id: turn.panel })
  }
  if (turn.closePanel) actions.push({ op: "close", id: turn.closePanel })
  if (turn.filterDeclineReport) actions.push({ op: "filterDeclineReport" })
  return actions
}
