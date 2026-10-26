"use client"

import { cn } from "aperia-ds5/utils"

// A section's title inside a panel body, with an optional line that says how to read it.
export function SectionHeader({ title, description, className }: { title: React.ReactNode; description?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-3", className)}>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description && <p className="text-base text-muted-foreground">{description}</p>}
    </div>
  )
}
