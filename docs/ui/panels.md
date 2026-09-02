# Panel architecture

**Read when:** registering or opening a panel, panel layout, the mobile sheet

How a panel is registered, held open and laid out. The recipe for adding one is Read-when **adding a panel**; what goes inside one is Read-when **deciding what goes inside a panel**.

## Foundational principles: `/panels`

**`public/panels/index.html`** is the single source for panel interaction principles, and carries the *why*: what a panel is, the Four Parts layout (Navigation / Primary / Secondary / Tertiary), the three triggers (navigate, summon, drill), the four rules of getting around, ship tests and open questions, with a playable prototype. Derived from the production vision (`docs/source/product-vision.mhtml`). Read it first if you're deciding *whether* a panel is the right answer at all.

The Next app serves it at **`/panels`**, alongside the live console. Its "See it running" link points at **`/risk`** (the console *with* the assistant, not the assistant-free `/risk-phase1`); the link is one-way, the console's top bar has no link back. Keep it self-contained with no local asset dependencies (inline SVG, Google-hosted fonts) so it stays portable to the `../webflow` marketing repo. `/panels` needs the rewrite in `next.config.mjs` because Next's static handler serves exact paths only; `/panels/index.html` works without it.

## One unified panel stack

Every concept panel goes through one path.

- **Registry.** Every panel is an entry in the `PANELS` map in `components/ask-nanci/concept/panel-registry.ts`. `PanelId` is derived from its keys (`export type PanelId = keyof typeof PANELS`), so adding a key is all it takes to make a panel referenceable everywhere — there is no separate union to keep in sync.
- **Open stack.** The open panels are an ordered `PanelId[]` managed by `usePanelStack` (`lib/ask-nanci/use-panel-stack.ts`) and exposed from `AskNanciContext` as `dynamicPanels`. Insertion order is render order; the stack is capped at 3 (chat is the conceptual 4th slot). Helpers: `openDynamic(id)` pushes a panel (idempotent — no-op if already open), `closeDynamicPanel(id)` / `closePanel(id)` removes one, `closeAllNewPanels()` / `resetDynamic()` clears the stack (and also resets per-panel views + the decline-report filter).
- **Layout.** `ConceptPanelArea` (`components/ask-nanci/concept/ConceptPanelArea.tsx`) renders `dynamicPanels`: each panel is one equal-height `PanelBox`, looked up by ID in `PANELS` and stacked vertically with a gap, in open order. There are no A/B/C/D grid slots and no `ResizablePanelGroup` in this layout.
- **Per-panel view state.** A separate `panelViews` record (`PanelId → view string`) is set by `setPanelView(id, view)` and cleared by `clearPanelView(id)`. This is what a turn's `view` field drives — the same panel component can render different views over the flow without being reopened.

## Panels on a phone

Below `md` the chat and the panel column cannot sit side by side, so one presentation has to carry the panel. It arrives as a draggable sheet over the conversation.

- **The candidates are data, not branches.** `lib/ask-nanci/data/panel-ui.ts` holds one `PanelUiOption` per presentation (`axis`, and `lip`, the px left on screen at rest). Adding a candidate is a row there, not an edit across nine components, and it shows up on `/responsive` with a launch link automatically.
- **`?panelui=` selects one.** The option with an empty `param` is what ships, so every existing demo URL keeps its behaviour. Read it through `parsePanelUiOption`, never off `searchParams` directly.
- **The sheet is four hooks in `components/ask-nanci/concept/sheet/`**, one concern each: `use-panel-ui` (which presentation), `use-sheet-gesture` (drag), `use-sheet-dismissal` (when it closes), `use-sheet-focus` (focus trapping). `MobilePanelSwitcher.tsx` composes them.
- **A panel the script opens arrives resting**, so nothing on screen marks it: the grabber lights up twice on arrival and then stays still. It swells to 1.2, fills flat white, and throws a tight pink/violet/cyan halo; the pill itself is never tinted, only ringed. Deliberately not `var(--primary)`: the brand colour means "press this", and the cue is announcing a panel, not asking for a tap. It rides `data-pulse` on the grabber (written by `MobilePanelSwitcher`; keyframes and the four registered `--pulse-*` colours in `app/globals.css`), is the same on all four presentations because nothing in it has a direction, and `prefers-reduced-motion: reduce` keeps the light and drops the swell. The cue keys off which panel the card carries, so minimising one by hand never replays it.
- Covered by `e2e/mobile-panel-sheet.spec.ts`. Run it after touching any of those hooks.

## Panel drift

Two known drifts from the design rules: the two-type-tier rule is largely unenforced, and `Callout` / `PanelHeader` / `Td` are rebuilt inline in several panels each. Treat the inline rebuilds as safe pure-deletion sweeps. **Do not** bulk-fix the type-tier drift unless asked: large diff, no user-facing gain. The counts came from a 2026-07-22 audit of 26 panels and the registry is now 37, so re-audit before acting.

## Resizable panels (`ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`)

Imported from `aperia-ds5`. Not used by `ConceptPanelArea`, which stacks panels directly.

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
