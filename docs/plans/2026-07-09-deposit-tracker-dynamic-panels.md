# Deposit Tracker Dynamic Panels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Deposit Tracker flow (Flow 13, prompt "When's my money from the weekend hitting?") to the new dynamic panel stack mechanism from `docs/specs/2026-07-09-dynamic-panel-stack-design.md`, splitting its single hand-stacked two-card panel into two real independent panels that open incrementally and share space via the system's standard `ResizableHandle` divider.

**Architecture:** A new `usePanelStack` hook (ordered array, FIFO cap of 3, insertion order = slot order) is wired into `AskNanciContext` alongside the existing legacy `openPanels` array, completely additively — the legacy `mapPanelsToSlots` switch in `ConceptPanelArea` is read first for any of the 11 live scripted flows; the new dynamic path is only reached for the two new panel ids this flow introduces (`pending-deposits`, `flagged-transaction`). No other flow's behavior changes.

**Tech Stack:** Next.js 16 / React 19 / TypeScript, aperia-ds5 (`ResizablePanelGroup`/`ResizableHandle`, `Card`, `Button`), Tailwind CSS 4.

---

## File Structure

- **Create** `lib/ask-nanci/use-panel-stack.ts` — the `usePanelStack` hook.
- **Create** `components/ask-nanci/concept/FlaggedTransactionPanel.tsx` — new panel, split out of the flagged-transaction half of the current `PendingDepositsPanel.tsx`.
- **Modify** `lib/ask-nanci/types.ts` — add `"flagged-transaction"` to `PanelId`, add `DynamicPanelId` subtype, add `openDynamicPanel?: DynamicPanelId` turn field.
- **Modify** `components/ask-nanci/concept/PendingDepositsPanel.tsx` — remove the hand-stacked second `<Card>` (moves to the new component); close button now calls `closeDynamicPanel`.
- **Modify** `contexts/AskNanciContext.tsx` — instantiate `usePanelStack`, expose `dynamicPanels`/`closeDynamicPanel` on the context, handle `turn.openDynamicPanel` in `applyTurnEffects`, reset the dynamic stack wherever `openPanels` is already reset.
- **Modify** `components/ask-nanci/concept/ConceptPanelArea.tsx` — render `FlaggedTransactionPanel`, remove the Deposit Tracker case from the legacy `mapPanelsToSlots` switch, add the dynamic slot-resolution fallback.
- **Modify** `lib/ask-nanci/data/flows.concept.ts` — Flow 13's two panel-opening turns switch from `openPanel` to `openDynamicPanel`.

No test runner exists in this repo (`package.json` has no `test` script) — verification is `npm run typecheck` after every task plus a final manual run through the flow in the dev server.

---

### Task 1: `usePanelStack` hook

**Files:**
- Create: `lib/ask-nanci/use-panel-stack.ts`

- [ ] **Step 1: Write the hook**

```ts
import { useCallback, useState } from "react"
import type { DynamicPanelId } from "./types"

// Ordered list of open "dynamic" panels (new mechanism), separate from the
// legacy `openPanels` array used by the 11 hardcoded scripted flows.
// Insertion order doubles as slot order — see ConceptPanelArea's
// slotsFromDynamicPanels(). Capped at 3 because chat occupies the conceptual
// 4th slot without being a literal entry in this array.
export function usePanelStack() {
  const [stack, setStack] = useState<DynamicPanelId[]>([])

  const openDynamic = useCallback((id: DynamicPanelId) => {
    setStack((prev) => (prev.includes(id) ? prev : [...prev, id].slice(-3)))
  }, [])

  const closeDynamic = useCallback((id: DynamicPanelId) => {
    setStack((prev) => prev.filter((p) => p !== id))
  }, [])

  const resetDynamic = useCallback(() => setStack([]), [])

  return { stack, openDynamic, closeDynamic, resetDynamic }
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: fails with `Cannot find module './types'` export `DynamicPanelId` — this is expected until Task 2. Confirm the *only* error mentions `DynamicPanelId`, nothing else.

- [ ] **Step 3: Commit**

```bash
git add lib/ask-nanci/use-panel-stack.ts
git commit -m "feat: add usePanelStack hook for dynamic panel layout"
```

---

### Task 2: Extend `PanelId` / turn types

**Files:**
- Modify: `lib/ask-nanci/types.ts:27-56`

- [ ] **Step 1: Add `flagged-transaction` to `PanelId` and add `DynamicPanelId`**

Replace:

```ts
export type PanelId =
  | "case" | "transaction-receipt" | "dispute-draft"
  | "decline-report" | "email-draft"
  | "risk-flags" | "volume-settlement" | "change-log"
  | "work-queue"
  | "detection-queue" | "barometer-report" | "coastal-risk"
  | "pending-deposits" | "fee-summary" | "chargeback-status"
  | "sales-snapshot" | "account-change"
```

with:

```ts
export type PanelId =
  | "case" | "transaction-receipt" | "dispute-draft"
  | "decline-report" | "email-draft"
  | "risk-flags" | "volume-settlement" | "change-log"
  | "work-queue"
  | "detection-queue" | "barometer-report" | "coastal-risk"
  | "pending-deposits" | "flagged-transaction" | "fee-summary" | "chargeback-status"
  | "sales-snapshot" | "account-change"

// Panel ids that flow through the dynamic panel stack (usePanelStack) instead
// of the legacy hardcoded mapPanelsToSlots switch in ConceptPanelArea.
export type DynamicPanelId = "pending-deposits" | "flagged-transaction"
```

- [ ] **Step 2: Add the `openDynamicPanel` turn field**

In the `ConceptScriptedTurn` interface, replace:

```ts
  openPanel?: PanelId
```

with:

```ts
  openPanel?: PanelId
  openDynamicPanel?: DynamicPanelId
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: same single error as Task 1's Step 2 disappears; no new errors (component/context files don't reference the new field yet, so nothing else should break).

- [ ] **Step 4: Commit**

```bash
git add lib/ask-nanci/types.ts
git commit -m "feat: add DynamicPanelId and openDynamicPanel turn field"
```

---

### Task 3: Split `PendingDepositsPanel` into two panels

**Files:**
- Modify: `components/ask-nanci/concept/PendingDepositsPanel.tsx`
- Create: `components/ask-nanci/concept/FlaggedTransactionPanel.tsx`

- [ ] **Step 1: Replace `PendingDepositsPanel.tsx` with the Batches-only version**

```tsx
"use client"

import { X } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import {
  Button, Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { BATCHES } from "@/lib/ask-nanci/data/panels/pending-deposits"
import { PanelShell, StatCard, formatCurrency } from "@/components/ask-nanci/shared"

export function PendingDepositsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  const totalDeposit = BATCHES.reduce((sum, b) => sum + b.net, 0)
  const inTransitBatches = BATCHES.filter((b) => !b.isHeld)
  const onHoldBatches = BATCHES.filter((b) => b.isHeld)
  const inTransit = inTransitBatches.reduce((sum, b) => sum + b.net, 0)
  const onHold = onHoldBatches.reduce((sum, b) => sum + b.net, 0)

  return (
    <PanelShell className="overflow-y-auto p-0">
      <Card className="h-full gap-4 py-4">
        <CardHeader className="border-b">
          <CardTitle>Pending Deposits</CardTitle>
          <CardDescription>Account ending ••4432</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon" onClick={() => closeDynamicPanel("pending-deposits")} aria-label="Close">
              <X className="size-4" />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total Deposit" value={formatCurrency(totalDeposit)} sublabel={`${BATCHES.length} batches`} />
            <StatCard label="In Transit" value={formatCurrency(inTransit)} sublabel={`${inTransitBatches.length} batches`} />
            <StatCard
              label="On Hold"
              value={<span className="text-amber-600 dark:text-amber-400">{formatCurrency(onHold)}</span>}
              sublabel={`${onHoldBatches.length} batch${onHoldBatches.length === 1 ? "" : "es"}`}
            />
          </div>

          <div>
            <p className="mb-2 text-base font-semibold text-foreground">Batches</p>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                    <TableHead className="text-right">Fees</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BATCHES.map((b) => (
                    <TableRow key={b.day} className={cn(b.isHeld && "bg-amber-50 dark:bg-amber-950/20")}>
                      <TableCell>
                        <p className="font-medium text-foreground">{b.day}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{b.date}</p>
                      </TableCell>
                      <TableCell>
                        {b.isHeld ? (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            On Hold
                          </span>
                        ) : (
                          <span className="text-muted-foreground">In Transit</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(b.gross)}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(b.fees)}</TableCell>
                      <TableCell className={cn("text-right font-mono font-medium", b.isHeld ? "text-amber-700 dark:text-amber-400" : "text-foreground")}>
                        {formatCurrency(b.net)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </PanelShell>
  )
}
```

- [ ] **Step 2: Create `FlaggedTransactionPanel.tsx`**

```tsx
"use client"

import Image from "next/image"
import { Bell, Check } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { HELD_TXN } from "@/lib/ask-nanci/data/panels/pending-deposits"
import { PanelShell, PanelHeader, Callout, formatCurrency } from "@/components/ask-nanci/shared"

export function FlaggedTransactionPanel() {
  const { closeDynamicPanel, depositNotifyRequested, requestDepositNotify } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Flagged Transaction"
        subtitle="Pending Deposits · Sunday's batch"
        onClose={() => closeDynamicPanel("flagged-transaction")}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <Callout variant="blue">
          <div className="flex items-start gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
            <p>
              A {formatCurrency(HELD_TXN.amount)} transaction in this batch exceeded your typical ticket size, triggering a routine review. No action needed on your end.
            </p>
          </div>
        </Callout>

        <div>
          <p className="mb-2 text-base font-semibold text-foreground">Flagged transaction (1)</p>
          <div className="rounded-lg border px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-base font-semibold text-foreground">{HELD_TXN.counterparty}</p>
              <p className="text-base font-semibold text-foreground">{formatCurrency(HELD_TXN.amount)}</p>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{HELD_TXN.date} · {HELD_TXN.paymentType}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">Expected to clear</p>
          <p className="text-sm text-muted-foreground">{HELD_TXN.expectedClear}</p>
        </div>

        <Button
          variant="secondary"
          disabled={depositNotifyRequested}
          onClick={requestDepositNotify}
          className="w-full gap-1.5"
        >
          {depositNotifyRequested ? <Check className="size-4" /> : <Bell className="size-4" />}
          {depositNotifyRequested ? "You'll be notified when it funds" : "Notify me when it funds"}
        </Button>
      </div>
    </PanelShell>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: errors about `closeDynamicPanel` not existing on the context type — expected until Task 4. Confirm no other errors (e.g. no leftover unused-import errors in `PendingDepositsPanel.tsx`).

- [ ] **Step 4: Commit**

```bash
git add components/ask-nanci/concept/PendingDepositsPanel.tsx components/ask-nanci/concept/FlaggedTransactionPanel.tsx
git commit -m "feat: split PendingDepositsPanel into two independent panels"
```

---

### Task 4: Wire `usePanelStack` into `AskNanciContext`

**Files:**
- Modify: `contexts/AskNanciContext.tsx:4` (import), `:31-100` (context type), `:110-156` (provider state), `:324-339` (applyTurnEffects), `:461-473` (closePanel/closeAllNewPanels), `:505-527` (startNewChat), `:529-551` (replayFlow), `:584-609` (context value)

- [ ] **Step 1: Import the hook and the `DynamicPanelId` type**

Replace line 4:

```ts
import type { Message, Session, Source, UsageData, ConceptScriptedTurn } from "@/lib/ask-nanci/types"
```

with:

```ts
import type { Message, Session, Source, UsageData, ConceptScriptedTurn, DynamicPanelId } from "@/lib/ask-nanci/types"
import { usePanelStack } from "@/lib/ask-nanci/use-panel-stack"
```

- [ ] **Step 2: Add to the context type**

In `AskNanciCtx`, replace:

```ts
  openPanels: string[]
  closingPanels: string[]
  closePanel: (type: string) => void
```

with:

```ts
  openPanels: string[]
  closingPanels: string[]
  closePanel: (type: string) => void
  dynamicPanels: DynamicPanelId[]
  closeDynamicPanel: (id: DynamicPanelId) => void
```

- [ ] **Step 3: Instantiate the hook in the provider**

Replace:

```ts
  const [openPanels, setOpenPanels] = useState<string[]>([])
  const [closingPanels, setClosingPanels] = useState<string[]>([])
```

with:

```ts
  const [openPanels, setOpenPanels] = useState<string[]>([])
  const [closingPanels, setClosingPanels] = useState<string[]>([])
  const { stack: dynamicPanels, openDynamic, closeDynamic: closeDynamicPanel, resetDynamic } = usePanelStack()
```

- [ ] **Step 4: Handle `turn.openDynamicPanel` in `applyTurnEffects`**

Replace:

```ts
    if (turn.openPanel) { setOpenPanels((prev) => prev.includes(turn.openPanel!) ? prev : [...prev, turn.openPanel!]) }
    if (turn.openPanel === "account-change") { setAccountChangeStep(1) }
```

with:

```ts
    if (turn.openPanel) { setOpenPanels((prev) => prev.includes(turn.openPanel!) ? prev : [...prev, turn.openPanel!]) }
    if (turn.openPanel === "account-change") { setAccountChangeStep(1) }
    if (turn.openDynamicPanel) { openDynamic(turn.openDynamicPanel) }
```

- [ ] **Step 5: Reset the dynamic stack wherever `openPanels` is already reset**

In `closeAllNewPanels`, replace:

```ts
  const closeAllNewPanels = useCallback(() => {
    setOpenPanels([])
    setDeclineReportFiltered(false)
```

with:

```ts
  const closeAllNewPanels = useCallback(() => {
    setOpenPanels([])
    resetDynamic()
    setDeclineReportFiltered(false)
```

In `startNewChat`, replace:

```ts
    setBatchPanelOpen(false)
    setOpenPanels([])
    setDeclineReportFiltered(false)
    setWorkQueuePhase("triage")
    setFeeVolumeRowHighlighted(false)
    setSalesDrilldownOpen(false)
    setAccountChangeStep(1)
    setDepositNotifyRequested(false)
  }, [])

  const replayFlow: (() => void) | null = autoPlayFlow ? useCallback(() => {
```

with:

```ts
    setBatchPanelOpen(false)
    setOpenPanels([])
    resetDynamic()
    setDeclineReportFiltered(false)
    setWorkQueuePhase("triage")
    setFeeVolumeRowHighlighted(false)
    setSalesDrilldownOpen(false)
    setAccountChangeStep(1)
    setDepositNotifyRequested(false)
  }, [])

  const replayFlow: (() => void) | null = autoPlayFlow ? useCallback(() => {
```

In `replayFlow`, replace:

```ts
    setOpenPanels([])
    setClosingPanels([])
    setReportPanelOpen(false)
```

with:

```ts
    setOpenPanels([])
    resetDynamic()
    setClosingPanels([])
    setReportPanelOpen(false)
```

- [ ] **Step 6: Expose on the context value**

Replace:

```ts
      openPanels, closingPanels, closePanel, closeAllNewPanels, submitDisputeDraft,
```

with:

```ts
      openPanels, closingPanels, closePanel, closeAllNewPanels, submitDisputeDraft,
      dynamicPanels, closeDynamicPanel,
```

- [ ] **Step 7: Typecheck**

Run: `npm run typecheck`
Expected: no errors mentioning `closeDynamicPanel`, `dynamicPanels`, `openDynamic`, or `resetDynamic`. (`ConceptPanelArea.tsx` will still fail on the still-unresolved `FlaggedTransactionPanel` import path / unused `mapPanelsToSlots` case until Task 5 — confirm remaining errors are scoped to that file only.)

- [ ] **Step 8: Commit**

```bash
git add contexts/AskNanciContext.tsx
git commit -m "feat: wire usePanelStack into AskNanciContext"
```

---

### Task 5: Render the dynamic panels in `ConceptPanelArea`

**Files:**
- Modify: `components/ask-nanci/concept/ConceptPanelArea.tsx`

- [ ] **Step 1: Import `FlaggedTransactionPanel`**

Replace:

```ts
import { AccountChangePanel } from "./AccountChangePanel"
```

with:

```ts
import { AccountChangePanel } from "./AccountChangePanel"
import { FlaggedTransactionPanel } from "./FlaggedTransactionPanel"
```

- [ ] **Step 2: Remove the Deposit Tracker case from the legacy switch**

In `mapPanelsToSlots`, delete this block (it's being replaced by the dynamic path in Step 4 below — everything else in this function, including the other 4 new-flow cases added this session and all 11 legacy flow cases, is untouched):

```ts
  // Deposit Tracker
  if (has("pending-deposits")) {
    return { A: "pending-deposits", B: null, C: null, D: null }
  }

```

- [ ] **Step 3: Add the `case` for `flagged-transaction` in `PanelContent`**

Replace:

```ts
    case "pending-deposits":    return <PendingDepositsPanel />
```

with:

```ts
    case "pending-deposits":    return <PendingDepositsPanel />
    case "flagged-transaction": return <FlaggedTransactionPanel />
```

- [ ] **Step 4: Add the dynamic slot-resolution function**

Directly below the closing `}` of `mapPanelsToSlots`, add:

```ts
// Slot geometry for the dynamic panel stack (new flows only — see
// docs/specs/2026-07-09-dynamic-panel-stack-design.md). Position
// in the stack array is the only input: 1st panel gets a full-height column,
// a 2nd shares it 50/50, a 3rd stacks under the 2nd (55/45).
function slotsFromDynamicPanels(stack: PanelId[]): Slots {
  const [first, second, third] = stack
  return { A: first ?? null, B: second ?? null, C: null, D: third ?? null }
}
```

- [ ] **Step 5: Combine legacy + dynamic in the component**

Replace:

```ts
  const { openPanels, closingPanels } = useAskNanci()
  const isOpen = openPanels.length > 0
  const isClosing = closingPanels.length > 0
  const isSmall = useIsSmallScreen()

  // Freeze the slot layout during close animation — don't update while a staggered close is in progress
  const [renderContent, setRenderContent] = useState(isOpen)
  const [frozenSlots, setFrozenSlots] = useState(() => mapPanelsToSlots(openPanels))
  const [frozenKey, setFrozenKey] = useState(() => [...openPanels].sort().join(","))
  useEffect(() => {
    if (isClosing) return  // freeze layout during staggered close
    if (isOpen) {
      setRenderContent(true)
      setFrozenSlots(mapPanelsToSlots(openPanels))
      setFrozenKey([...openPanels].sort().join(","))
    } else {
      const t = setTimeout(() => setRenderContent(false), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen, isClosing, openPanels])
```

with:

```ts
  const { openPanels, closingPanels, dynamicPanels } = useAskNanci()
  const isOpen = openPanels.length > 0 || dynamicPanels.length > 0
  const isClosing = closingPanels.length > 0
  const isSmall = useIsSmallScreen()

  // Legacy hardcoded flows take priority; the dynamic stack is only consulted
  // when no legacy flow has panels open.
  const resolveSlots = () =>
    openPanels.length > 0 ? mapPanelsToSlots(openPanels) : slotsFromDynamicPanels(dynamicPanels)

  // Freeze the slot layout during close animation — don't update while a staggered close is in progress
  const [renderContent, setRenderContent] = useState(isOpen)
  const [frozenSlots, setFrozenSlots] = useState(() => resolveSlots())
  const [frozenKey, setFrozenKey] = useState(() => [...openPanels, ...dynamicPanels].sort().join(","))
  useEffect(() => {
    if (isClosing) return  // freeze layout during staggered close
    if (isOpen) {
      setRenderContent(true)
      setFrozenSlots(resolveSlots())
      setFrozenKey([...openPanels, ...dynamicPanels].sort().join(","))
    } else {
      const t = setTimeout(() => setRenderContent(false), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen, isClosing, openPanels, dynamicPanels])
```

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: no errors anywhere in `ConceptPanelArea.tsx` or the panel components.

- [ ] **Step 7: Commit**

```bash
git add components/ask-nanci/concept/ConceptPanelArea.tsx
git commit -m "feat: resolve dynamic panel slots in ConceptPanelArea"
```

---

### Task 6: Update Flow 13's scripted turns

**Files:**
- Modify: `lib/ask-nanci/data/flows.concept.ts:363-376`

- [ ] **Step 1: Switch both panel-opening turns to `openDynamicPanel`**

Replace:

```ts
  // ── Flow 13: Deposit Tracker ──────────────────────────────────────────────
  [CONCEPT_FLOW13_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW13_PROMPT },
    { role: "assistant", content: "You have three batches pending. Friday and Saturday are in transit, expected in your account ending ••4432 tomorrow morning. Sunday's batch is on a temporary hold.", openPanel: "pending-deposits" },
    { role: "user", content: "Why's Sunday held?" },
    { role: "assistant", content: "A single $2,190 transaction triggered a routine review — larger than your typical ticket. No action needed on your end. It usually clears within one business day, so expected Wednesday. I can notify you the moment it funds." },
    { role: "user", content: "Yes, do that" },
```

with:

```ts
  // ── Flow 13: Deposit Tracker ──────────────────────────────────────────────
  [CONCEPT_FLOW13_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW13_PROMPT },
    { role: "assistant", content: "You have three batches pending. Friday and Saturday are in transit, expected in your account ending ••4432 tomorrow morning. Sunday's batch is on a temporary hold.", openDynamicPanel: "pending-deposits" },
    { role: "user", content: "Why's Sunday held?" },
    { role: "assistant", content: "A single $2,190 transaction triggered a routine review — larger than your typical ticket. No action needed on your end. It usually clears within one business day, so expected Wednesday. I can notify you the moment it funds.", openDynamicPanel: "flagged-transaction" },
    { role: "user", content: "Yes, do that" },
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/ask-nanci/data/flows.concept.ts
git commit -m "feat: drive Flow 13 through the dynamic panel stack"
```

---

### Task 7: Manual verification

**Files:** none (verification only)

- [ ] **Step 1: Full typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: both pass with no errors.

- [ ] **Step 2: Confirm the 11 legacy flows are untouched**

Run: `git diff main -- components/ask-nanci/concept/ConceptPanelArea.tsx | grep -c "Flow 7\|Flow 8\|Flow 10\|Flow 11\|Flow 12"`
Expected: `0` — none of the legacy flow-labeled blocks in `mapPanelsToSlots` appear in the diff (only the "Deposit Tracker" block should show as removed).

- [ ] **Step 3: Manual smoke test in the dev server**

Run: `npm run dev` (or use the `run` skill if available), open `?mode=concept`, and drive the flow:
1. Send "When's my money from the weekend hitting?" — confirm the Pending Deposits panel opens alone, full width.
2. Send "Why's Sunday held?" — confirm a second panel (Flagged Transaction) opens beside it, 50/50 split, with the standard `ResizableHandle` drag grip visibly separating them (no gap, no borderless "merged" look — the divider should look identical to the one in e.g. Flow 10's Risk Investigation panels).
3. Click "Notify me when it funds" in the Flagged Transaction panel — confirm the button updates to the confirmed state (this reuses the existing `depositNotifyRequested` state, unchanged).
4. Send "Show me merchant volume for this week" (Flow 2, a legacy flow) — confirm it still opens exactly as before, unaffected by any of these changes.

- [ ] **Step 4: Stop here — no commit for this task (verification only)**

---

## Notes

- Phase 2 (migrating the 11 legacy flows to this same dynamic mechanism) is explicitly out of scope, per the spec and per your instruction to touch the newest flow first and leave live flows alone.
- The 3-panel case in `slotsFromDynamicPanels` isn't exercised by Flow 13 (which only ever opens 2 dynamic panels) but is included because the hook's own FIFO cap allows a 3rd — leaving it unhandled would silently drop a future 3rd dynamic panel rather than display it.
