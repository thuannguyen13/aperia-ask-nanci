# Project Rules

## Side Panels

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
