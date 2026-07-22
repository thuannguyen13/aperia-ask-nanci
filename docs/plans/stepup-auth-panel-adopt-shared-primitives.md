# StepUpAuthPanel adopts the shared Callout and PanelHeader primitives

Written against: 9a194df

## Evidence chain

- Surface: `components/ask-nanci/concept/StepUpAuthPanel.tsx` — the step-up auth panel (`Change Deposit Account`), a concept side panel opened via `openStepUpPanel` / the `step-up-auth` dynamic panel id.
- Problem: The panel hand-rebuilds two shared primitives inline instead of importing them, and both rebuilds have already drifted from the primitive they copy:
  - **Three notice boxes** replicate `Callout`. Lines 59 and 97 replicate `Callout variant="blue"`; line 136 replicates `Callout variant="amber"`. The blue boxes use `dark:border-blue-800` where the `Callout` blue variant uses `dark:border-blue-800/60` — a visible dark-mode border drift.
  - **The header** (lines 155–164) replicates `PanelHeader size="lg"`, but its close button uses `rounded-full` where `PanelHeader` uses `rounded`, and it renders a raw `<h2>` + hand-built close button instead of the shared component.
- Design evidence: `CLAUDE.md` → "Shared panel primitives" and Visual design rule 8: "Reuse `PanelHeader` / `PanelShell` / `Callout` — never rebuild the header or a callout box inline. If a panel needs something those don't support, extend the shared component, don't fork it locally." `StepUpAuthPanel` imports neither `Callout` nor `PanelHeader` (confirmed: only `PanelShell, PanelTable, Th, Td` are imported on line 6).
- Owner: `components/ask-nanci/shared/Callout.tsx` (the notice-box shape + the four `red|amber|green|blue` variant strings) and `components/ask-nanci/shared/PanelHeader.tsx` (the `size="lg"` header shape). Both re-exported from `components/ask-nanci/shared/index.ts`.
- Scope and affected surfaces: `components/ask-nanci/concept/StepUpAuthPanel.tsx` only. No other consumer imports from it and no data file changes.
- Uncertainty: None. The primitives already exist, are already used by sibling panels, and the correct variants are unambiguous from the box colors.

## Design decision

Replace the three inline notice boxes and the inline header in `StepUpAuthPanel` with the shared `Callout` and `PanelHeader` primitives it is supposed to reuse. This is pure reuse — no new tokens, values, or components — and it removes the accumulated drift (dark border opacity on the blue callouts; `rounded-full` vs `rounded` on the header close button) that rule 8 exists to prevent. After the change, every concept side panel routes its notice boxes and header through the shared primitives, so a future change to either shape propagates here automatically.

## Reuse

- `Callout` (`variant="blue"` / `variant="amber"`) — from `@/components/ask-nanci/shared`. Renders `rounded-xl border px-4 py-3 text-sm` plus the variant color string; this exactly matches the current inline boxes' intent.
- `PanelHeader` (`size="lg"`, with `title` and `onClose`) — from `@/components/ask-nanci/shared`.
- Exemplar: `components/ask-nanci/concept/AccountChangePanel.tsx` — imports `PanelShell, PanelHeader, Callout` from the shared barrel (line 7), uses `<Callout variant="green">` (line 74) and `<PanelHeader title=... size="lg" onClose={() => closeDynamicPanel("account-change")} />` (lines 121–124). `EscalationPanel.tsx` lines 27–32 is a second `PanelHeader size="lg"` exemplar.

No new primitive is required — the existing system already expresses this decision.

## Changes

1. `components/ask-nanci/concept/StepUpAuthPanel.tsx`
   - Change: Add `PanelHeader` and `Callout` to the existing shared import on line 6:
     `import { PanelShell, PanelHeader, Callout, PanelTable, Th, Td } from "@/components/ask-nanci/shared"`
   - Change: Replace the blue notice `<div>` on **line 59** (`Step1`) and the identical one on **line 97** (`Step2`) with `<Callout variant="blue">…</Callout>`, keeping the inner text unchanged (`Tell the AI "Done" once you've entered your code.` / `Tell the AI "Submitted" when you've entered your account details.`).
   - Change: Replace the amber notice `<div>` on **line 136** (`Step3`) with `<Callout variant="amber">…</Callout>`, keeping the inner micro-deposit text unchanged.
   - Change: Replace the inline header block (lines 155–164 — the `<div className="flex shrink-0 items-center justify-between px-4 py-3">` containing the `<h2>` and the hand-built close `<button>`) with:
     `<PanelHeader title="Change Deposit Account" size="lg" onClose={() => closeDynamicPanel("step-up-auth")} />`
     Leave the `<StepIndicator current={step} />` line and everything below it unchanged.
   - Preserve: The `PanelShell` wrapper, the `StepIndicator` (which owns its own `border-b`), all three step components' inputs/table/submit button, the `usePanelView`/`closeDynamicPanel`/`submitStepUpPanel` wiring, and every user-facing string. `PanelHeader size="lg"` renders no bottom border (matching the current inline header), so the layout under the header is unchanged.
   - Verify: The header title still reads "Change Deposit Account"; the close button still closes the `step-up-auth` panel; the two blue and one amber notices render identically in light mode and now use the primitive's `dark:border-blue-800/60` in dark mode; no remaining inline `rounded-xl border border-blue-200` / `border-amber-200` boxes exist in the file.

## Scope

- Inherit: `StepUpAuthPanel` only.
- Verify: Visual parity of the step-up flow across steps 1→2→3 in both light and dark themes.
- Exclude: The other inline notice boxes flagged during the audit (`EscalationPanel`, `ConceptWelcomeView`, `CoastalRiskPanel`, `VolumeSettlementPanel`, `ChangeLogPanel` tinted rows) — those are distinct shapes (success state, container, row cards, tinted "reason this opened" rows), not `Callout` rebuilds, and are out of scope for this plan. Do not touch the badge-shape drift in `EmailDraftPanel` / `DeclineReportPanel` (separate finding).

## Validation

- Product: Open the Change Deposit Account step-up flow (the `step-up-auth` panel). Walk steps 1→2→3 and confirm each step's guidance box and the header render and behave as before, and the close (X) button dismisses the panel.
- Interface: Steps 1, 2, 3; light and dark theme (the dark-border drift fix is only observable in dark mode); the header close button.
- System: Confirm `StepUpAuthPanel` now imports `Callout` and `PanelHeader` from `@/components/ask-nanci/shared` and no longer contains a hand-built header or inline `border-blue-200 bg-blue-50` / `border-amber-200 bg-amber-50` notice `<div>`s — i.e. no parallel copy of either primitive remains.
- Repository: `grep -nE "border-(blue|amber)-200 bg-(blue|amber)-50|<h2 " components/ask-nanci/concept/StepUpAuthPanel.tsx` → no matches. `grep -n "Callout\|PanelHeader" components/ask-nanci/concept/StepUpAuthPanel.tsx` → shows the import and the new usages.

## Stop conditions

- Stop if `PanelHeader`'s `size="lg"` variant no longer renders borderless (would introduce a double border above `StepIndicator`) — if so, reconcile by adjusting `StepIndicator`'s `border-b`, not by forking the header.
- Stop if the panel intentionally needs a notice shape `Callout` cannot express (e.g. an icon slot). In that case extend `Callout`, do not keep the inline copy.

## Design documentation

- After acceptance and validation: None. This plan enforces an existing `CLAUDE.md` rule; no new decision to record.
