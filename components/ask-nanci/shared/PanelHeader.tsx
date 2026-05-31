"use client"

import { X } from "lucide-react"

interface PanelHeaderProps {
  title: string
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  onClose: () => void
}

export function PanelHeader({ title, subtitle, actions, onClose }: PanelHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      <div className="ml-2 flex shrink-0 items-center gap-2">
        {actions}
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
