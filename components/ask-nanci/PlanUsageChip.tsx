"use client"

import { useState } from "react"
import { X } from "lucide-react"
import {
  Button, Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger, Progress,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { getPlanUsage, type PlanUsageOverride } from "@/lib/ask-nanci/plan-usage"

/**
 * What the /plan-* slash commands set. `n` counts how many times a command has been
 * run, matching ContextUsageDemo — see that file for why the counter exists.
 */
export interface PlanUsageDemo {
  state: PlanUsageOverride | null
  n: number
}

/** The bar turns red once the budget is gone; below that it stays on primary. */
const fullBar = "[&>[data-slot=progress-indicator]]:bg-destructive"

/**
 * The usage meter in the composer toolbar, left of the send button. Hidden until the
 * plan budget is nearly spent — an always-on quota readout is noise for the 99% of a
 * session where there's plenty left.
 */
export function PlanUsageChip({ demo }: { demo?: PlanUsageDemo }) {
  const { usage } = useAskNanci()
  const [open, setOpen] = useState(false)
  const plan = getPlanUsage(usage, demo?.state)

  if (plan.state === "ok") return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={`Plan usage: ${plan.percent}% used`}
          className="flex h-8 items-center gap-1 rounded-lg px-2 transition-colors hover:bg-muted"
        >
          <Progress
            value={plan.percent}
            className={cn("w-9", plan.state === "full" && fullBar)}
          />
          <span className="min-w-6 text-xs leading-none text-muted-foreground">{plan.percent}%</span>
        </button>
      </PopoverTrigger>

      {/* gap-4 overrides PopoverContent's own 10px gap so the header-to-meter spacing is
          declared in one place rather than being a margin tuned against a hidden default */}
      <PopoverContent side="top" align="end" className="w-[300px] gap-4">
        <PopoverHeader>
          <PopoverTitle className="text-base">Plan Usage</PopoverTitle>
          <PopoverDescription>
            {"Track how much of your AI usage you've consumed."}
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-medium leading-none text-muted-foreground">
            <span>{plan.percent}% used</span>
            <span>resets {usage.resetsIn}</span>
          </div>
          <Progress
            value={plan.percent}
            className={cn(plan.state === "full" && fullBar)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Close"
          className="absolute top-2 right-2"
          onClick={() => setOpen(false)}
        >
          <X />
        </Button>
      </PopoverContent>
    </Popover>
  )
}
