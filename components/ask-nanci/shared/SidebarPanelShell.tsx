"use client"

import { cn } from "aperia-ds5/utils"

interface SidebarPanelShellProps {
  isOpen: boolean
  /** CSS width value when open, e.g. "420px" or "55%" */
  width: string
  /** Which side the margin applies to — "left" adds ml-1, "right" adds mr-1 */
  side?: "left" | "right"
  children: React.ReactNode
}

export function SidebarPanelShell({ isOpen, width, side = "left", children }: SidebarPanelShellProps) {
  return (
    <div
      className={cn(
        "relative hidden h-full shrink-0 flex-col overflow-hidden rounded-[18px] border bg-background",
        "transition-[width,opacity,margin] duration-500 ease-in-out md:flex",
        isOpen
          ? cn(side === "left" ? "ml-1" : "mr-1", "opacity-100")
          : "w-0 opacity-0 border-0 pointer-events-none",
      )}
      style={isOpen ? { width } : undefined}
    >
      {children}
    </div>
  )
}
