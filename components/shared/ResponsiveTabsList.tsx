"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  TabsList, TabsTrigger,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"

/**
 * A tab strip that becomes a dropdown when the strip no longer fits.
 *
 * A row of tabs is the one control that loses things quietly: past the edge of the
 * screen the last items are simply not there, and nobody reports a tab they cannot see.
 * Scrolling the strip keeps them reachable but still hides them; a dropdown always fits
 * and names every option.
 *
 * The swap is measured, not a breakpoint. How many tabs fit depends on how long their
 * labels are and how wide the container happens to be, and a fixed width cannot know
 * either. `scrollWidth` reports the strip's natural width even while it is overflowing,
 * so it is recorded while the strip is mounted and compared against the container on
 * every resize. That means the control can swap back once there is room again.
 */
export function ResponsiveTabsList({
  items,
  value,
  onValueChange,
  className,
  ...rest
}: {
  items: { id: string; label: string }[]
  /** Required: the dropdown has to show the current selection, which tabs alone imply. */
  value: string
  onValueChange: (value: string) => void
  className?: string
} & React.ComponentProps<"div">) {
  const hostRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  // Survives the strip unmounting: once it is a dropdown there is nothing left to
  // measure, and this is what decides whether it can ever go back.
  const naturalWidth = useRef(0)
  const [collapsed, setCollapsed] = useState(false)

  const measure = useCallback(() => {
    const host = hostRef.current
    if (!host) return
    const list = listRef.current
    // Only meaningful while the strip is rendered. Held across the swap otherwise.
    if (list && list.scrollWidth > 0) naturalWidth.current = list.scrollWidth
    if (!naturalWidth.current) return
    // A pixel of slack: sub-pixel layout rounding otherwise collapses a strip that fits.
    setCollapsed(naturalWidth.current > host.clientWidth + 1)
  }, [])

  // No direct measure() here: ResizeObserver fires once on observe() with the initial
  // size, so the first measurement arrives through the observer like every later one.
  useEffect(() => {
    const host = hostRef.current
    if (!host || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [measure, items])

  const current = items.find((i) => i.id === value)

  return (
    <div ref={hostRef} className={cn("w-full min-w-0", className)} {...rest}>
      {collapsed ? (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={current?.label} />
          </SelectTrigger>
          <SelectContent>
            {items.map(({ id, label }) => (
              <SelectItem key={id} value={id}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <TabsList ref={listRef} className="h-auto w-full justify-start gap-1 flex-nowrap">
          {items.map(({ id, label }) => (
            <TabsTrigger key={id} value={id} className="shrink-0">{label}</TabsTrigger>
          ))}
        </TabsList>
      )}
    </div>
  )
}
