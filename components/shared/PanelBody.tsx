"use client"

import { cn } from "aperia-ds5/utils"

/**
 * The scrolling half of a panel: 16px inset, 12px vertical.
 *
 * The default used to be `pb-4 first:pt-4`, which matched no caller — 25 panels
 * hand-rolled `px-4 py-3` instead, so the primitive had 8 adopters out of 33.
 * It now defaults to what panels actually write. Anything else goes through
 * `className`, which tailwind-merge resolves against these, rather than a
 * bespoke prop.
 */
export function PanelBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-4 py-3", className)}>
      {children}
    </div>
  )
}
