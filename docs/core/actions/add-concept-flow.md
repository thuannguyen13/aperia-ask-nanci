# Add a concept flow

**Read when:** adding or editing a concept flow

The recurring work in this repo, and the task every architectural decision is scored against.
The turn-effect fields used in step 3 are tabled at the bottom of this file.

1. Add a flow definition to `FLOW_DEFS` in `lib/ask-nanci/data/flows.concept.ts`. The prompt lists
   are all *derived* from it, so do not hand-edit them: `CONCEPT_ALL_PROMPTS` (from each flow's
   `key`), `CONCEPT_NO_RESET_PROMPTS` (from `keepSession` + `followups`), and
   `CONCEPT_MANUAL_PROMPTS` (from `manual`/`section` + `followups`).
2. Add the full turn sequence to `CONCEPT_SCRIPTED_CONVERSATIONS`, keyed by the flow's `key`.
3. Wire panel effects in the turn objects: `panel`, `view`, `closePanel`, `filterDeclineReport`,
   `closeAllPanels`. See "Turn effects" below.
4. If the flow needs a new panel, do Read-when **adding a panel** first.
5. Run `npm run check:flows`.
6. If the flow should be reachable as an embed, add its slug and rerun `npm run demo:urls`
   (see Read-when **running checks**).

## Reaching non-embeddable flows locally

To reach non-embeddable flows (Case, Bulk, Risk, form, step-up) in `?mode=concept`, pre-set
`localStorage.ask_nanci_onboarded = "1"` — `OnboardingDialog` otherwise blocks the welcome cards —
then click the flow card's "Try it".

## Turn effects

The contract between a scripted flow and the panel stack. These are the real fields on
`ConceptScriptedTurn` in `lib/ask-nanci/types.ts`, consumed by `applyTurnEffects` in
`contexts/AskNanciContext.tsx`. Set them on turns in `CONCEPT_SCRIPTED_CONVERSATIONS`.

| Field | Effect |
|---|---|
| `panel: "panel-id"` | Ensures that panel is open. Idempotent push onto the `dynamicPanels` stack. |
| `view: "view-name"` | Sets that panel's view. If omitted when `panel` is set, the panel resets to its own default view on open. Use together with `panel`. |
| `closePanel: "panel-id"` | Closes one panel, e.g. to replace it with another. |
| `filterDeclineReport: true` | Switches the decline-report panel into its filtered view. |
| `closeAllPanels: true` | Resets all open panels (staggered close animation), plus panel views and the decline-report filter. |

Adding a declarative field here is nearly always better than adding an imperative branch in
`playConceptScripted`: the whole point is that a flow is data, not code.
