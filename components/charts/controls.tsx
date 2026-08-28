"use client"

import { Label, ScrollArea, ScrollBar, Tabs, TabsList, TabsTrigger } from "aperia-ds5"

// Shared control-bar primitives for the theming reference pages (/charts, /generator).

export function Control({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col gap-1.5">
      <Label className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {/* Out of the flex flow: in it, the one control carrying a note was taller than the
          rest and knocked its own label off the row's baseline. The row reserves the space. */}
      {note && (
        <span className="absolute left-0 top-full mt-1.5 whitespace-nowrap text-[10px] leading-none text-muted-foreground/80">
          {note}
        </span>
      )}
    </div>
  )
}

// The DS's segmented control: the default TabsList variant is the muted track with a
// raised bg-background active pill (there is no separate SegmentedControl export in
// aperia-ds5). Tabs never deselects on re-click, so no empty-value guard is needed.
// Only the focus ring is overridden — foreground/20 instead of --ring, keeping the
// control bars' chrome brand-independent.
export function SegmentedGroup<T extends string>({
  options, value, onChange, scrollable = false,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  /**
   * Wraps the list in ScrollArea + a horizontal ScrollBar instead of letting it overflow —
   * the same composition shadcn's own "scrollable tabs" example uses (TabsList has no scroll
   * behavior of its own). Opt-in: every existing control bar already fits its row, so the
   * default stays a plain TabsList.
   */
  scrollable?: boolean
}) {
  const list = (
    <TabsList>
      {options.map((o) => (
        <TabsTrigger
          key={o.value}
          value={o.value}
          className="px-3 focus-visible:outline-none focus-visible:ring-foreground/20"
        >
          {o.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as T)}>
      {scrollable ? (
        <ScrollArea className="max-w-full whitespace-nowrap">
          {list}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        list
      )}
    </Tabs>
  )
}
