# Project Rules

## Side Panels

### Generative UI content rules

A panel is a generated answer to one question, not a fixed dashboard template. These govern panel *content*; see "Panel component structure" below for the mechanical layout every panel follows regardless of content.

1. **Scope to the question, not a schema.** Show only the records/fields relevant to what was asked. Never fall back to a generic all-rows table with search/filter/sort/export controls bolted on — that's the portal UI panels exist to replace, not imitate. If two different questions would render the same panel, the panel is too generic.

2. **State needs a reason, not just a badge.** Any flagged, held, or anomalous status ships with a callout explaining *why*, not just a colored pill. `"On Hold"` is a status label; `"On Hold — a $2,190 transaction exceeded your typical ticket"` is an answer.

3. **Lead with human framing, not system internals.** Batch IDs, case numbers, and DB keys are secondary detail, never the primary label. Lead with what the merchant recognizes — the day, the amount, the counterparty — not what the backend calls it.

4. **Match interaction weight to the stakes.**
   - Low-stakes state changes (e.g. subscribing to a notification) — the agent acts directly from the conversation; the panel reflects the resulting state. A button is a shortcut for panel-first use, never a second required confirmation.
   - Irreversible or high-stakes writes (money movement, routing/account changes, accepting liability) — always require an explicit, undelegatable confirm step in the panel. Never auto-apply these.

5. **Chat and panel share one source of truth.** An action confirmed in the conversation ("yes, notify me") updates the panel without also requiring a click, and vice versa. Never make the merchant confirm the same thing twice on two surfaces.

6. **Pick the visual form the data actually has.** Trend data becomes a chart, not a table; a delta gets a driver/reason line, not a bare number; a multi-step task (upload → draft → confirm) gets a task flow, not a static form.

7. **Highlight what's relevant — don't render every row equally.** If one item is the reason the panel opened, it should look different (bordered, expanded, colored) from the rest, not sit as one more uniform row.

### Panel pattern library

Nine shapes already exist in the codebase. When building a new panel, match the shape to the data/intent below instead of defaulting to a plain table or inventing a tenth shape — if none fit, add the new one here so it becomes reusable rather than a one-off.

| Data / intent shape | Pattern | Reference |
|---|---|---|
| Small set of same-shape items, compared field-by-field, one needs explaining | **Scoped Table** | `BatchDetailPanel.tsx` |
| Multiple independent flagged items, scanned by severity | **Score Strip + Severity List** | `RiskFlagsPanel.tsx` |
| One entity: static facts plus a history of events | **Summary Grid + Timeline** | `CaseDetailPanel.tsx` |
| Structured data needs a real-world artifact for trust | **Split Detail + Artifact** | `TransactionReceiptPanel.tsx` |
| AI-generated text the user reviews before committing | **Document Draft** | `DisputeDraftPanel.tsx` |
| Same panel represents different operational modes over time | **Phase-Switching Queue** | `WorkQueuePanel.tsx` |
| Irreversible write needing deliberate confirm | **Guided Form + Confirm** | `BankAccountFormPanel.tsx` |
| Open-ended "show me the top N / rank by X" request | **Ranked Report** | `MerchantVolumePanel.tsx` |
| Change-over-time or magnitude comparison | **Trend Strip** *(not yet built)* | see recipe below |

**Scoped Table** — header + a small `<table>`, no sort/search/filter/export chrome, the row that matters gets a tinted background (`bg-amber-50 dark:bg-amber-950/20` or matching severity color) and an inline callout beneath the table carries the reasoning. Use for "list a few comparable things and explain the odd one out."

**Score Strip + Severity List** — a compact summary strip under the header (counts by severity, separated by a `h-4 w-px bg-border` divider) followed by icon-in-swatch rows colored by severity. Use for "here are N independent problems, ranked by how bad they are."

**Summary Grid + Timeline** — a 2-column label/value fact grid up top, a vertical-rail timeline of dated events below. Use for "here's the current state of one thing, and how it got here."

**Split Detail + Artifact** — main content on the left, a narrow (`~170px`) side column on the right rendering a realistic mock of the underlying document (receipt, signature, form). Use sparingly — only when seeing the actual artifact builds trust that structured fields alone wouldn't.

**Document Draft** — letter/document-formatted body (to/date header, numbered evidence chips, closing line) ending in one commit button. Use when the AI produced text the human reviews before it goes somewhere external.

**Phase-Switching Queue** — the header's dot/badge/subtitle and the body layout both key off one state value, so the same panel component represents different queues/modes without being two panels. Use when a single conversational thread moves through operational phases (e.g. "quick wins" → "outage").

**Guided Form + Confirm** — pre-filled context card, grouped inputs, a single explicit submit button, then a distinct success state (not just closing the panel). This is the only pattern allowed to make the merchant type into fields — reserve it for the write flows content rule 4 requires an explicit confirm for.

**Ranked Report** — a real `<table>` with sort *chips* tied to named dimensions the user could plausibly ask about (e.g. "Volume" / "Txn Count" / "Avg Ticket"), not raw ↕ arrows on every column. Use only when the request itself is open-ended ranking/browsing ("show me the top merchants") — never for a single-answer lookup, which is what makes generic sortable grids feel wrong for something like Pending Deposits.

**Trend Strip** *(gap — build this for Flow 5/Flow 6-style requests)* — a compact inline chart (sparkline or small bar set, `font-variant-numeric: tabular-nums` on any adjacent figures) paired with one interpretation line that names the driver, not just the delta. No axis chrome, no legend unless there are 3+ series. Follow the `dataviz` skill's mark and color rules when building it.

**Boring-table check:** if more than half the panels in a review look like Scoped Table or Ranked Report, that's a sign of defaulting rather than choosing — go back to the data shape and re-check against this table.

### Visual design rules

These keep every panel looking like one system. They're extracted from the existing panels (`RiskFlagsPanel`, `CaseDetailPanel`, `TransactionReceiptPanel`, `WorkQueuePanel`, `DisputeDraftPanel`, `BatchDetailPanel`) — match them exactly rather than inventing a variant.

1. **Color is semantic, never decorative.** Red = critical/high-risk, amber = held/review/in-progress, green = resolved/valid/ready, blue = evidence/informational. Pick the color for what the state *means*, not because it looks nice next to another color already on the panel.

2. **Two type tiers, used consistently.**
   - Micro-labels (section headers, field labels): `text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground`
   - Data values (amounts, IDs, dates, times): `font-mono text-xs font-medium text-foreground`
   Never invent a third label style — every panel above uses exactly these two.

3. **One badge shape for status pills:**
   ```
   rounded bg-{color}-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-{color}-700 dark:bg-{color}-900/40 dark:text-{color}-400
   ```
   Used identically in `PanelHeader`'s `badge` prop and inline status chips. Don't hand-rebuild this — reuse the shape.

4. **Radius is tiered by element size**, not chosen per-component: `rounded-full` for dots/pills, `rounded-lg` for row cards and list items, `rounded-xl` for `Callout`. A callout inside a list should still be `rounded-xl` even if surrounding rows are `rounded-lg`.

5. **The "reason this opened" item gets a tinted background**, not just a border: `bg-amber-50 dark:bg-amber-950/20` (or the matching severity color) on the row itself — see the flagged row in `BatchDetailPanel` and invalid rows in `WorkQueuePanel`. A colored left-border alone is not enough signal.

6. **Icon-in-swatch for severity/evidence markers:** a `size-4`–`size-5` rounded box with `bg-{color}-100`/`10` housing a `size-2.5`–`size-3` icon in the matching `text-{color}-700`/`400`. Sequential/neutral markers (numbered evidence, timeline steps) use `bg-primary/10 text-primary` instead of a severity color — reserve severity colors for actual severity.

7. **Borders and dividers are always the `border` token**, never a hardcoded gray (`border-neutral-300` etc. is reserved for one-off skeuomorphic elements like the receipt mock in `TransactionReceiptPanel`, not general layout dividers).

8. **Reuse `PanelHeader` / `PanelShell` / `Callout` — never rebuild the header or a callout box inline.** If a panel needs something those don't support, extend the shared component, don't fork it locally.

### Two panel types

**Simple panels** — single-purpose, own their own open/close state via a dedicated context boolean (e.g. `reportPanelOpen`, `formPanelOpen`). Used when only one instance of that panel can ever be open. Rendered as direct siblings to the main content area inside `AppShell`.

**Multi panels** — registered in the `openPanels: string[]` array in context. Opened with `openPanel(id)`, closed with `closePanel(id)` or `closeAllNewPanels()`. Rendered and laid out by `ConceptPanelArea`, which maps panel IDs to grid slots (A/B/C/D) and wraps them in `ResizablePanelGroup`.

Use a simple panel for standalone flows (one panel at a time). Use a multi panel when the flow may open 2–3 panels side by side.

### Panel component structure

Every panel — simple or multi — follows the same internal layout:

```tsx
<div className="flex h-full flex-col overflow-hidden">
  {/* Header: title + close button, always visible */}
  <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
    ...
    <button onClick={() => closePanel("id")} ...><X /></button>
  </div>

  {/* Body: scrollable content */}
  <ScrollArea className="flex-1">
    ...
  </ScrollArea>
</div>
```

- Header is `shrink-0`, body is `flex-1` — never let the header scroll away
- Always include a close (`X`) button in the header
- Simple panels close via their own context setter; multi panels call `closePanel(id)`

### Animating open/close

Panels slide in by transitioning `width` and `opacity`. The panel is always mounted — CSS controls visibility:

```tsx
<div className={cn(
  "relative hidden h-full shrink-0 flex-col overflow-hidden rounded-[18px] border bg-background",
  "transition-[width,opacity,margin] duration-200 ease-in-out md:flex",
  isOpen
    ? "w-[55%] opacity-100 ml-1"
    : "w-0 opacity-0 border-transparent pointer-events-none",
)}>
```

- Use `pointer-events-none` when closed to prevent invisible click targets
- Use `border-transparent` when closed to hide the border without layout shift
- Width percentage is typically 55–58% for a single panel, 50/50 split for two columns

### Opening panels from scripted flows

In `CONCEPT_SCRIPTED_CONVERSATIONS`, use turn fields to trigger panel opens:

- `openPanel: "panel-id"` — opens a multi panel via `openPanels`
- `openFormPanel: true` — opens the bank account form panel
- `openStepUpPanel: true` — opens step-up auth panel
- `closeAllPanels: true` — resets all open panels

### Adding a new multi panel

1. Create the panel component in `components/ask-nanci/concept/`
2. Add its ID to the `PanelId` union in `ConceptPanelArea.tsx`
3. Add a `case` for it in the `PanelContent` switch
4. Add it to the relevant flow's slot mapping in `mapPanelsToSlots`
5. Import and add a `case` for `turn.openPanel` in `playConceptScripted` if script-driven

### Adding a new concept scripted flow

1. Add the trigger prompt string to `CONCEPT_ALL_PROMPTS` in `concept-config.ts`
2. Add any follow-up prompts (continuations that shouldn't reset the session) to `CONCEPT_NO_RESET_PROMPTS`
3. Add the full turn sequence to `CONCEPT_SCRIPTED_CONVERSATIONS` keyed by the trigger prompt
4. Wire panel opens in the turn objects:
   - `openPanel: "panel-id"` for multi panels
   - `openFormPanel: true` / `openStepUpPanel: true` / `openBatchPanel: true` for simple panels
   - `closeAllPanels: true` to reset at end of flow
5. If the flow needs a new multi panel, follow "Adding a new multi panel" above first

## Demo content

All demo data lives in `lib/ask-nanci/data/`. Never put mock content in component files.

- `data/responses.clover.ts` / `data/prompts.clover.ts` / `data/flows.clover.ts` — clover persona
- `data/flows.iso.ts` / `data/prompts.iso.ts` — ISO persona
- `data/flows.concept.ts` — concept demo flows and constants
- `data/overrides.business-owner.ts` — business-owner content overrides
- `data/sources.ts` — embed source arrays per variant
- `data/account.ts` — mock usage, plan tiers, activity, current user
- `data/merchants.ts` — merchant volume table data
- `data/panels/` — per-panel data (timeline rows, risk flags, batch lines, etc.); one file per panel

The lib shells (`mock-data.ts`, `embed-demo-config.ts`, `concept-config.ts`) are thin re-export barrels — edit the `data/` files, not the shells.

## Shared panel primitives

`components/ask-nanci/shared/` — import from `@/components/ask-nanci/shared`.

- `PanelShell` — the outer `flex h-full flex-col overflow-hidden` wrapper; replaces the raw div
- `PanelHeader` — shrink-0 header with title and close button built in
- `ScoreBadge` — colored score chip (used in BarometerReportPanel)
- `StatCard` — label/value/sublabel stat block, optional `emphasis` variant (used in SalesSnapshotPanel)
- `Callout` — severity callout box (`border-{color}-200 bg-{color}-50` pattern)
- `NanciInsight` — the blue "Nanci says" insight line (logomark + one paragraph) that leads a generative panel; borderless blue tint
- `PanelTable` / `Th` / `Td` — the one table recipe every panel table uses. `PanelTable` is the rounded-bordered `border-separate` `<table>` (text-xs, auto row dividers); wrap the header row in `<tr className="border-b bg-muted/40">` and use `<Th align>` (sentence-case, foreground, medium) for headers, `<Td align mono>` for cells. Never hand-roll a `<table>` or header `<th>` styling in a panel — the chat markdown table in `ChatMessage.tsx` is the only intentional exception (inline, borderless).
- `formatCurrency` / `formatPercent` — shared number formatters from `format.ts`

Use these instead of re-implementing the header/scroll structure, severity box, or table chrome in each panel.

## Components

### Resizable panels (`ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`)

Imported from `aperia-ds5`.

- `ResizablePanelGroup` requires an `orientation` prop (`"horizontal"` or `"vertical"`)
- `ResizablePanel` takes `defaultSize` and `minSize` as percentages — sibling sizes must sum to 100
- `ResizableHandle` goes between panels; use `withHandle` to show the drag grip
- Add `key={layoutKey}` on the group whenever the panel set can change at runtime — forces a remount to avoid stale size state
- Groups can nest: a `ResizablePanel` can contain another `ResizablePanelGroup` with a different orientation

**Example — 2-column layout with vertical split in the left column:**
```tsx
<ResizablePanelGroup key={layoutKey} orientation="horizontal" className="h-full">
  <ResizablePanel defaultSize={50} minSize={20}>
    <ResizablePanelGroup orientation="vertical" className="h-full">
      <ResizablePanel defaultSize={55} minSize={15}>
        <TopContent />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45} minSize={15}>
        <BottomContent />
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={50} minSize={20}>
    <RightContent />
  </ResizablePanel>
</ResizablePanelGroup>
```

## Knowledge Base

A compiled wiki lives at `./wiki/` (relative to this file). Before answering questions about Ask Nanci's domain, personas, or workflows:

1. Read `./wiki/index.md` to find relevant pages
2. Read those pages directly — they are the compiled source of truth
3. Raw sources are in `./demo-context/` and are never modified

Start with `./wiki/overview.md` for a full orientation.
