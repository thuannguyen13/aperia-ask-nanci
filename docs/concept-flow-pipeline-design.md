# Concept-Flow Pipeline — Design

Status: **proposed, awaiting approval** · Branch: `embed` · 2026-07-13

## North Star
Every change must make it **easier to add a new concept flow** — senior/principal
quality, well-established patterns, clean predictable structure, consistent naming.
If a change makes future concept flows harder to add, it is the wrong change.

## The payoff (what "add a flow" becomes)
Today a new concept flow that opens a panel and has phases touches **~12 sites in
5 files**. After this pipeline it is **three local edits**:

1. One `FLOW_DEFS` row (already true after T1a).
2. One conversation in `CONCEPT_SCRIPTED_CONVERSATIONS`, using the tiny turn
   vocabulary (`panel` / `view` / `closePanels`).
3. If it needs a new panel: one `PANELS` registry entry + the panel component.

Zero context edits, zero `switch`/union edits, zero triple-resets.

---

## Decisions (from the design interview)
1. **Scope:** concept flows only. The persona `clover`/`iso` path (`playScripted`) is untouched.
2. **Migrate all**, not new-only — one system, no legacy/new split.
3. **Behavior stays identical** (verified byte-identical + smoke). **Layout is intentionally unified** to the new separate-box vertical style for *all* flows — legacy multi-panel flows (Case Mgmt, Risk, Detection) will visibly change from side-by-side resizable grid to stacked boxes; those get a visual re-check.
4. **All panels on one system**, including the 3 currently mounted in `AppShell` (bank form, step-up, batch).
5. **One "panel view" model:** view-switches *and* the old one-off flags all become a panel's `view`. Term = **`view`**.
6. **Turn authoring shape:** `panel` + optional `view`, `closePanels`.
7. **Delivery:** this doc first; build in verified slices after approval.

---

## The three pieces

### 1. Panel Registry (replaces the switch + union + 4 mount systems)
One map is the single source for "what panels exist":
```ts
// lib/ask-nanci/concept/panel-registry.ts
export interface PanelDef {
  component: React.ComponentType
  initialView?: string   // view a panel opens in (default "default")
}
export const PANELS = {
  "menu-performance": { component: MenuPerformancePanel, initialView: "volume" },
  "escalation":       { component: EscalationPanel,       initialView: "detail" },
  // …every panel, incl. bank-form / step-up / batch
} satisfies Record<string, PanelDef>

export type PanelId = keyof typeof PANELS   // union is DERIVED — no hand-edited list
```
Removes: the 23-case `PanelContent` switch, the hand-maintained `PanelId` union,
the 3 `AppShell` mounts, and the legacy `openPanels[]` + `mapPanelsToSlots`.
`ConceptPanelArea` renders `PANELS[id].component` for each id in the open stack.

### 2. Panel View state (replaces ~10 per-flow useStates + the triple-reset)
One map, one setter, one reset:
```ts
// panelViews: Record<PanelId, string>   (in a reducer inside context)
setPanelView(id, view)     // set a panel's current view
resetPanelViews()          // one place, called on flow reset / new chat / replay
usePanelView(id)           // a panel reads its own view; falls back to initialView
```
`menuMarginPhase`, `escalationPhase`, `workQueuePhase`, `merchantVolumePhase`,
`accountChangeStep`, `stepUpPanelStep`, plus the flags `feeVolumeRowHighlighted`,
`depositNotifyRequested`, `declineReportFiltered` **all collapse into this**. E.g.
Fee Summary's highlight = `view: "highlighted"`, Decline's filter = `view:
"filtered"`, Deposit's notify = `view: "notified"`.

### 3. Turn vocabulary (replaces the 13 turn fields)
```ts
interface ConceptScriptedTurn {
  role: "user" | "assistant"
  content: string
  suggestions?: string[]
  widget?: "ai-triage-summary"
  // panel effects — the whole vocabulary:
  panel?: PanelId        // ensure this panel is open (opens at its initialView)
  view?: string          // set `panel`'s view (opens it if needed)
  closePanels?: true     // reset the stack + views
  // …existing content-only fields (widgetDelay, pauseAfter) stay
}
```
Removed fields: `openPanel`, `openDynamicPanel`, `openFormPanel`,
`openStepUpPanel`, `openBatchPanel`, `advanceStepUp`, `advanceWorkQueue`,
`advanceEscalation`, `advanceMenuMargin`, `advanceMerchantVolume`,
`filterDeclineReport`, `highlightFeeVolumeRow`, `depositNotifyRequested`,
`loopToPrompt` (already gone in T0).

The engine's effect application shrinks to:
```ts
if (turn.panel) openDynamic(turn.panel)              // idempotent
if (turn.view)  setPanelView(turn.panel!, turn.view)
if (turn.closePanels) { resetPanelStack(); resetPanelViews() }
```
Panel-internal buttons (Account Change submit/confirm, step-up advance) keep their
dedicated context methods, but those now call `setPanelView` instead of a bespoke
step setter — same one model.

---

## Layout unification
Delete `mapPanelsToSlots` and the legacy `openPanels`; every flow renders through
the dynamic stack's **separate-box vertical** layout. Legacy multi-panel flows
change appearance — **visual re-check list**: Case Management (3 panels), Risk
Investigation (3), Detection Queue (2), plus the 3 folded panels (bank form,
step-up, batch). Everything else already uses this layout.

## File structure (proposed)
Group the concept engine so it's predictable. Data stays in `data/`.
```
lib/ask-nanci/concept/
  panel-registry.ts   # PANELS, PanelDef, PanelId (derived)
  panel-views.ts      # view reducer + usePanelView
  turn.ts             # ConceptScriptedTurn + effect application
  engine.ts           # playConceptFlow (renamed from playConceptScripted)
```
`data/flows.concept.ts` keeps `FLOW_DEFS`, conversations, derived lists.
(File moves are the lowest-priority slice — the wins above don't depend on them.)

## Naming conventions
`PANELS` / `PanelDef` / `PanelId`; `setPanelView` / `usePanelView` /
`resetPanelViews`; turn fields `panel` / `view` / `closePanels`; engine
`playConceptFlow`. One noun (`view`) for a panel's current display state everywhere.

---

## Verification (per slice, nothing commits until green)
- **Data byte-identical:** the existing snapshot diff (slugs / all-prompts / no-reset / conversation-keys) stays empty.
- **Runtime smoke:** existing Playwright harness across every `?flow=` number — each flow plays, expected panel opens, expected text renders, Ask returns, **zero console errors**.
- **Legacy layout:** before/after screenshots of the re-check list (these *will* differ — confirm they read well stacked).
- `tsc --noEmit` clean.

## Build slices (after approval)
1. **Panel Registry** — `PANELS` map, derive `PanelId`, `ConceptPanelArea` renders from it. Keep both layouts temporarily → no visual change. Verify.
2. **Fold + unify layout** — move the 3 AppShell panels into the stack; delete `mapPanelsToSlots` + `openPanels`; all flows on separate-box layout. Verify + visual re-check.
3. **Panel View state** — one reducer; migrate the ~10 phase/flag states to `setPanelView`; delete the per-flow useStates + triple-resets. Verify.
4. **Turn vocabulary** — add `panel`/`view`/`closePanels`, delete the 13 old fields, rewrite conversation turns, shrink the engine. Verify (data-diff + smoke).
5. *(optional)* file reorg + `playConceptFlow` rename.

## Risks / open items
- Slice 2 & 3 are the behavior-visible ones; do them with the smoke + screenshots in hand.
- `step-up` / `bank-form` were modal-ish; confirm they read acceptably as stacked boxes (part of slice 2 re-check).
- Persona `playScripted` deliberately out of scope — a future decision whether it ever adopts the same vocabulary.
