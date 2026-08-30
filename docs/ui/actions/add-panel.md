# Add a panel

**Read when:** adding a panel

Mechanics only. What the panel should *contain* and *look like* is Read-when **deciding what goes inside a panel**; whether a panel is the right answer at all is `/panels` (`public/panels/index.html`).

1. Create the panel component in `components/ask-nanci/concept/`. Build it from the shared primitives listed below — never re-implement the header, scroll structure, severity box or table chrome.
2. Import it and add a key + `{ component }` entry to the `PANELS` map in `components/ask-nanci/concept/panel-registry.ts`. `PanelId` updates automatically: there is no `PanelId` union to edit, no `PanelContent` switch, and no slot mapping.
3. To open it from a script, set `panel: "<its-key>"` on a turn. No per-panel `case` in `playConceptScripted` is needed — `applyTurnEffects` opens any registered panel generically. The full field list is under "Turn effects" in Read-when **adding or editing a concept flow**.

That is the whole checklist. If you find yourself editing a third file to make a panel appear, something has regressed against the north star; fix that instead of working around it.

## Shared primitives

`components/shared/` — import from `@/components/shared`. Rebuilding one of these inline is the single most common form of panel drift.

- `PanelShell` — the outer `flex h-full flex-col overflow-hidden` wrapper; replaces the raw div
- `PanelHeader` — shrink-0 header with title and close button built in
- `PanelBody` — the scrollable `flex-1` body that pairs with `PanelHeader` inside `PanelShell`
- `PanelExportButton` — the header-slot export affordance; use it rather than a bare icon button
- `ScoreBadge` — colored score chip (used in BarometerReportPanel)
- `StatCard` — label/value/sublabel stat block, optional `emphasis` variant (used in SalesSnapshotPanel)
- `Callout` — severity callout box (`border-{color}-200 bg-{color}-50` pattern)
- `NanciInsight` — the blue "Nanci says" insight line (logomark + one paragraph) that leads a generative panel; borderless blue tint
- `VerificationCode` — the code-entry block used by the step-up auth flow
- `PanelTable` / `Th` / `Td` — the one table recipe every panel table uses. `PanelTable` is the rounded-bordered `border-separate` `<table>` (text-xs, auto row dividers); wrap the header row in `<tr className="border-b bg-muted/40">` and use `<Th align>` (sentence-case, foreground, medium) for headers, `<Td align mono>` for cells. Never hand-roll a `<table>` or header `<th>` styling in a panel — the chat markdown table in `ChatMessage.tsx` is the only intentional exception (inline, borderless).
- `formatCurrency` / `formatPercent` / `formatWholeCurrency` / `maskDigits` — shared formatters from `format.ts`. `formatWholeCurrency` drops the cents; `maskDigits` keeps the last N. Covered by `format.test.ts`.

`PanelTable.tsx` also exports `PanelFigureTable` and `Thead` alongside `PanelTable`/`Th`/`Td`. The barrel (`shared/index.ts`) is the full list; check it before adding a primitive.

Before adding a new primitive, grep for hand-rolled versions of what it does. An unused primitive plus duplicated inline logic is adoption drift, not a missing primitive.
