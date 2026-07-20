"use client"

import { X } from "lucide-react"
import { cn } from "aperia-ds5/utils"

interface PanelHeaderProps {
  title: string
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  /** Omit to render a header with no close button (e.g. the chat column title). */
  onClose?: () => void
  /** When provided, switches to the compact dotted variant. Pass full Tailwind color/ring classes, e.g. "bg-amber-400" or "bg-red-500 ring-2 ring-red-200 dark:ring-red-800". */
  dot?: string
  /** Colored pill badge rendered next to the title in the dotted variant. */
  badge?: { label: React.ReactNode; className: string }
  /** "lg" renders a bigger, bolder title — used by the new-flow panels (Pending Deposits, Fee Summary, etc). */
  size?: "default" | "lg"
}

export function PanelHeader({ title, subtitle, actions, onClose, dot, badge, size = "default" }: PanelHeaderProps) {
  if (dot) {
    return (
      <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn("size-2 rounded-full shrink-0", dot)} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground truncate">{title}</span>
              {badge && <span className={badge.className}>{badge.label}</span>}
            </div>
            {subtitle && <div className="text-[10px] text-muted-foreground">{subtitle}</div>}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex shrink-0 items-center justify-between px-4 py-3", size !== "lg" && "border-b")}>
      <div className="min-w-0">
        <p className={cn("truncate text-foreground", size === "lg" ? "text-base font-semibold" : "text-sm font-semibold")}>{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      {(actions || onClose) && (
        <div className="ml-2 flex shrink-0 items-center gap-2">
          {actions}
          {onClose && (
            <button
              onClick={onClose}
              className={cn("rounded text-muted-foreground hover:bg-muted", size === "lg" ? "p-1.5" : "p-1")}
              aria-label="Close"
            >
              <X className={size === "lg" ? "size-4" : "size-3.5"} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
