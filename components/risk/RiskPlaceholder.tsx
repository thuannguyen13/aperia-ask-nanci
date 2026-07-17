"use client"

import { Construction } from "lucide-react"

// Interim view for risk destinations awaiting a Figma design (Dashboard,
// Assignment Management). Keeps the nav from being a dead click during a demo.
export function RiskPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
        <Construction className="size-6 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          This view is next up — the design is being finalized. Detection Queue and Ask Nanci are live in the meantime.
        </p>
      </div>
    </div>
  )
}
