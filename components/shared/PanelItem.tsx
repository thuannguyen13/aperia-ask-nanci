"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "aperia-ds5/utils"

interface PanelItemProps {
  /** Sits in the 32px media box on the left. */
  icon: LucideIcon
  /** "outline" is a row in a list. "muted" is a borderless note, such as a confirm step. */
  variant?: "outline" | "muted"
  iconClassName?: string
  className?: string
  children: React.ReactNode
}

// The Figma "Item": a media box beside the item's content. A list of records renders
// one per row with a gap, rather than as rows divided inside one bordered box.
export function PanelItem({ icon: Icon, variant = "outline", iconClassName, className, children }: PanelItemProps) {
  const muted = variant === "muted"
  return (
    <div className={cn("flex items-start gap-2 rounded-lg", muted ? "bg-muted/50 px-3 py-2.5" : "border px-2.5 py-2", className)}>
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-md border", muted ? "bg-background" : "bg-muted")}>
        <Icon className={cn("size-4", iconClassName)} />
      </span>
      {children}
    </div>
  )
}
