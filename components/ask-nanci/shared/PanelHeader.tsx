"use client"

import { X } from "lucide-react"
import { cn } from "aperia-ds5/utils"

interface PanelHeaderProps {
  /** Node, not just string, so a panel can lead its title with a logomark. */
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  /** Omit to render a header with no close button (e.g. the chat column title). */
  onClose?: () => void
  /** When provided, switches to the compact dotted variant. Pass full Tailwind color/ring classes, e.g. "bg-amber-400" or "bg-red-500 ring-2 ring-red-200 dark:ring-red-800". */
  dot?: string
  /** Colored pill badge rendered next to the title in the dotted variant. */
  badge?: { label: React.ReactNode; className: string }
  /**
   * "lg" renders a bigger, bolder title — used by the new-flow panels (Pending Deposits, Fee Summary, etc).
   * "page" is the Risk screens' page header (Figma "Header", node 399:78173): 16px inset, breadcrumb above a
   * 20px title and 20px muted subtitle, actions on the right. Every Risk destination uses it.
   */
  size?: "default" | "lg" | "page"
  /** Trail rendered above the title, inside the header so it never scrolls away — the Risk screens' Breadcrumb. */
  breadcrumb?: React.ReactNode
  /** Escape hatch for the outer row, e.g. an "lg" header that still wants a `border-b`. */
  className?: string
}

export function PanelHeader({ title, subtitle, actions, onClose, dot, badge, size = "default", breadcrumb, className }: PanelHeaderProps) {
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

  const isPage = size === "page"

  return (
    <div className={cn("shrink-0", isPage && "flex flex-col gap-3 px-4 py-3", size === "default" && "border-b", className)}>
      {breadcrumb && <div className={cn(!isPage && "px-4 pt-3")}>{breadcrumb}</div>}
      <div
        className={cn(
          "flex items-center justify-between",
          isPage ? "w-full" : "px-4 py-3",
          !isPage && breadcrumb && "pt-2",
        )}
      >
        <div className={cn("min-w-0", isPage && "flex flex-1 flex-col gap-2")}>
          <p
            className={cn(
              "truncate text-foreground",
              isPage ? "text-xl font-semibold leading-none" : size === "lg" ? "text-base font-semibold" : "text-sm font-semibold",
            )}
          >
            {title}
          </p>
          {subtitle && (
            <p className={cn("truncate text-muted-foreground", isPage ? "text-xl leading-none" : "text-xs")}>{subtitle}</p>
          )}
        </div>
        {(actions || onClose) && (
          <div className={cn("flex shrink-0 items-center gap-2", isPage ? "pl-4" : "ml-2")}>
            {actions}
            {onClose && (
              <button
                onClick={onClose}
                className={cn("rounded text-muted-foreground hover:bg-muted", size === "default" ? "p-1" : "p-1.5")}
                aria-label="Close"
              >
                <X className={size === "default" ? "size-3.5" : "size-4"} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
