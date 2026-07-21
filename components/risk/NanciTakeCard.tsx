"use client"

import { Badge } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import type { RiskTake } from "@/lib/ask-nanci/data/risk-landing"

// One "Nanci's take on today" card. Rendered identically on the Ask Nanci landing
// and on the Dashboard — only the click behaviour differs (landing answers in the
// chat view, Dashboard answers in a sibling panel).
export function NanciTakeCard({ take, active, onClick }: { take: RiskTake; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-full gap-2.5 rounded-xl border bg-card p-3.5 text-left transition-colors hover:bg-muted",
        active && "border-primary ring-1 ring-primary",
      )}
    >
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${take.dot}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">{take.title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{take.body}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {take.badges.map(({ label, icon: Icon }) => (
            // Blue tint = informational, per the panel colour rules; the shape,
            // sizing and icon handling come from the DS Badge.
            <Badge key={label} variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              <Icon /> {label}
            </Badge>
          ))}
        </div>
      </div>
    </button>
  )
}
