"use client"

import { cn } from "aperia-ds5/utils"

export function PanelShell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      {children}
    </div>
  )
}
