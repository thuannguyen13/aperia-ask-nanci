# Dynamic Panel Stack — Design

## Problem

Ask Nanci's concept-mode panel container (`ConceptPanelArea.tsx`) lays out open panels via `mapPanelsToSlots()` — a hardcoded switch statement, one hand-authored case per scripted flow, mapping specific panel ids to specific grid slots (A/B/C/D). This works for the 11 existing scripted demo flows, each of which was tuned to a specific layout (e.g. Flow 7 wants `case` in A, `transaction-receipt` in B, `dispute-draft` in C).

It doesn't generalize. New flows (Pending Deposits, Fee Summary, Chargeback Status, Sales Snapshot, Account Change) need panels that open incrementally — ask about pending deposits, get one panel; ask a follow-up, get a second panel that shares the space with the first — without a developer hand-authoring a slot mapping for every possible combination.

A concrete symptom: `PendingDepositsPanel.tsx` currently fakes this by hand-stacking two `<Card>` elements inside one component, separated by a raw `gap-2`. That gap renders as a plain white sliver — it isn't the system's actual divider (`ResizableHandle` with drag grip), it's an unstyled accident of two boxes with space between them.

## Goals

- A generic mechanism for opening panels that don't have a pre-authored layout: each new panel takes the next available slot and shares space with whatever's already open.
- A hard cap of 4 panels visible at once (chat + up to 3 dynamic info panels), matching the existing 4-slot (A/B/C/D) grid geometry.
- Chat participates in the "4 panels" mental model but in practice is exempt from being auto-closed — it must stay visible so the user can keep driving the conversation.
- One consistent visual rule for every panel boundary: a visible divider (border + drag handle), same as today, with **no exceptions** — no "these two are related so merge them" special case. ("Panel is panel, keep them all separated.")
- Zero regression risk to the 11 existing live scripted flows, which are used in front of clients.

## Non-goals (this spec)

- Migrating any of the 11 existing hardcoded flows to the new mechanism. That is explicitly deferred to a later, separate effort, done one flow at a time against the live demo.
- Making chat a literal entry in the same array as info panels, or moving its DOM position. It stays where it is today; only its *conceptual* participation in the "one of 4" budget matters, and that's achieved implicitly by it never being evicted.
- Any seamless/borderless/merged visual treatment between panels. Rejected — every boundary looks the same.

## Design

### New primitive: `usePanelStack`

A new hook, additive to `AskNanciContext`, tracking only the *dynamic* (new-mechanism) panels. It does not read or modify the existing `openPanels: string[]` field that the 11 legacy flows use.

```ts
// lib/ask-nanci/use-panel-stack.ts
import { useState, useCallback } from "react"
import type { DynamicPanelId } from "@/lib/ask-nanci/types"

export function usePanelStack() {
  const [stack, setStack] = useState<DynamicPanelId[]>([])

  const openDynamic = useCallback((id: DynamicPanelId) => {
    setStack((s) => (s.includes(id) ? s : [...s, id].slice(-3)))
  }, [])

  const closeDynamic = useCallback((id: DynamicPanelId) => {
    setStack((s) => s.filter((x) => x !== id))
  }, [])

  return { stack, openDynamic, closeDynamic }
}
```

- **FIFO cap:** `[...s, id].slice(-3)` is the entire eviction rule. Appending a 4th dynamic panel silently drops the oldest from the front. No separate eviction branch.
- **Reflow on close:** `stack` order is both insertion order and render/slot order. Removing an id from the middle and re-deriving slots from the shortened array is the reflow — no separate repositioning logic needed.
- **Cap is 3, not 4**, because chat occupies the conceptual 4th slot without being a literal array entry.

`stack` and its two actions are exposed from `AskNanciContext` alongside the existing `openPanel`/`closePanel`, instantiated once in the provider. New-flow scripted turns call `openDynamic(id)` / `closeDynamic(id)` from `applyTurnEffects`, the same place legacy turns call `openPanel`/`closePanel` today.

### Type extension

`DynamicPanelId` is a subtype of the existing `PanelId` union in `lib/ask-nanci/types.ts`. Extend `PanelId` as each new flow's panel component is added — same pattern as today, no new type machinery.

```ts
export type DynamicPanelId =
  | "pending-deposits"
  | "flagged-transaction"
  | "fee-summary"
  | "chargeback-status"
  | "sales-snapshot"
  | "account-change"
```

### Slot geometry (reused, not reinvented)

`ConceptPanelArea`'s existing nested `ResizablePanelGroup` structure already draws the exact shapes needed for 1, 2, or 3 panels (it does this today for legacy flows via A/B/C/D). The dynamic path reuses the same geometry, driven by `stack.length` / `stack` order instead of by which flow is active:

| `stack.length` | Layout |
|---|---|
| 1 | Single `ResizablePanel`, full area |
| 2 | Horizontal split, 50/50, one `ResizableHandle withHandle` between them |
| 3 | First panel: full-height column (50% width). Second + third: stacked vertically in the remaining column (55/45), each pair separated by `ResizableHandle withHandle` — identical nesting pattern to today's A+C column |

Every boundary, in every case, uses the standard `ResizableHandle` with drag grip. There is no seamless/borderless layout anywhere in this design.

### `ConceptPanelArea` integration

Panel-id resolution order in `ConceptPanelArea`:

1. If the id is one of the 11 legacy flow ids → existing hardcoded `mapPanelsToSlots` switch, completely unchanged.
2. Else → the id is a `DynamicPanelId`; slot comes from `usePanelStack`'s `stack` via the geometry table above.

This means the legacy switch statement is not touched, refactored, or partially replaced in this phase — the dynamic path is purely additive, reached only for ids that don't exist yet in the legacy switch.

### Chat and the 4-panel budget

Chat is not a member of `stack` and does not go through `usePanelStack` at all. It keeps its current fixed position and rendering (a sibling to `ConceptPanelArea`, not one of its grid slots). This gives "chat exempt from FIFO eviction" for free — there's no special-case code to write or maintain, because chat was never eligible for eviction in the first place. The "4 panels" framing (chat + 3 dynamic) is a mental model for the cap math (`slice(-3)`), not a literal shared data structure.

### Fixing the original symptom

`PendingDepositsPanel.tsx`'s current two hand-stacked `<Card>`s (separated by a raw `gap-2`, producing the plain white sliver) are split into two real components — e.g. `PendingDepositsPanel.tsx` and `FlaggedTransactionPanel.tsx` — each registered as its own `DynamicPanelId`. The scripted turn that opens Pending Deposits calls `openDynamic("pending-deposits")`; the follow-up turn that surfaces the flagged transaction detail calls `openDynamic("flagged-transaction")`. Once both are open they render as two entries in `stack`, laid out via the 2-panel geometry above — which gives them the system's real `ResizableHandle` divider instead of the ad hoc gap. This isn't a special case; it's the direct, incidental fix that falls out of using the new mechanism for what was always meant to be two separate panels.

## Rollout order & safety

- **Phase 1 (this spec):** wire the 5 new flows (Pending Deposits, Fee Summary, Chargeback Status, Sales Snapshot, Account Change) through `usePanelStack`. Nothing in `mapPanelsToSlots`, `openPanels`, or any of the 11 existing flow definitions changes. Zero regression surface on live flows — the dynamic path is only reachable via ids that don't exist in the legacy switch today.
- **Phase 2 (explicitly out of scope here):** migrate the 11 legacy flows to the dynamic mechanism one at a time, each verified against the live demo before moving to the next. Not scheduled or planned in this spec — recorded here only so the intent isn't lost.

## Open items for implementation planning

- Whether `PendingDepositsPanel`'s "Batches" card and the flagged-transaction detail need any content changes beyond the component split (out of scope for this design; content itself doesn't change, only its container boundaries).
- Exact prop/wiring shape for exposing `stack`/`openDynamic`/`closeDynamic` off `AskNanciContext` (naming, whether it's flattened onto the context value or nested under a sub-object) — an implementation detail, not a design decision.
