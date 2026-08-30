"use client"

import { cn } from "aperia-ds5/utils"

/**
 * The scrolling half of a panel: 16px inset, and the top inset is dynamic —
 * `first:pt-4` applies it only when nothing renders above the body, so a
 * `PanelHeader` sibling's own bottom padding owns the gap instead of the two
 * stacking into a double-height space.
 */
export function PanelBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-4 pb-4 first:pt-4", className)}>
      {children}
    </div>
  )
}
