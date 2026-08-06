"use client"

import { useState } from "react"
import { X } from "lucide-react"
import {
  Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Progress,
} from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import {
  formatContextTokens, getContextUsage,
  type ContextUsage, type ContextUsageOverride, type ContextUsageState,
} from "@/lib/ask-nanci/context-usage"

/**
 * What the /context-* slash commands set. `n` counts how many times a command has
 * been run so re-issuing the same one un-dismisses the banner — on stage you want the
 * command to always show something, not silently no-op because it was dismissed once.
 */
export interface ContextUsageDemo {
  state: ContextUsageOverride | null
  n: number
}

// Copy is verbatim from the design (Chat / Inline Banner), em dash included — the
// "Learn more" link is the sentence's last clause, not a separate control.
const BANNER_COPY: Record<Exclude<ContextUsageState, "ok">, string> = {
  approaching: "You're approaching the context limit for this session. — ",
  full: "Context limit reached. Please start a new conversation. — ",
}

function ContextUsageDialog({ usage }: { usage: ContextUsage }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="underline underline-offset-2 hover:no-underline">Learn more</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Context Usage</DialogTitle>
          <DialogDescription>
            {"How much of this conversation's memory Nanci is currently using."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-medium leading-none text-muted-foreground">
            <span>Context window</span>
            <span>
              {formatContextTokens(usage.used)} / {formatContextTokens(usage.limit)} ({usage.percent}%)
            </span>
          </div>
          {/* Full is the one state that turns the bar red; below that it stays on primary. */}
          <Progress
            value={usage.percent}
            className={usage.state === "full" ? "[&>[data-slot=progress-indicator]]:bg-destructive" : undefined}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Slides up from behind the composer once the conversation fills its context window.
 * Renders inside ChatInput's relative wrapper: it sits one z-layer below the input so
 * its lower edge tucks under it, which is what makes it read as sliding out rather
 * than stacking on top.
 */
export function ContextUsageBanner({ demo }: { demo?: ContextUsageDemo }) {
  const { messages } = useAskNanci()
  const usage = getContextUsage(messages, demo?.state)
  // Dismissal is tracked per severity, so silencing the warning doesn't also silence
  // the harder "limit reached" message that comes after it. It's also scoped to the
  // demo generation, so running a /context-* command always brings the banner back.
  const [dismissed, setDismissed] = useState<{ state: ContextUsageState; n: number } | null>(null)
  const isDismissed = dismissed?.state === usage.state && dismissed.n === (demo?.n ?? 0)

  if (usage.state === "ok" || isDismissed) return null

  return (
    // translate-y-5 hides the bottom 20px behind the input and the matching pb-5 shrinks
    // the content box to just the visible band, so items-center centers against what you
    // can actually see. h-14 sizes that band to 36px: 8px, the 20px line, 8px.
    <div className="absolute inset-x-0 bottom-full z-0 flex h-14 translate-y-5 items-center justify-between gap-2 overflow-clip rounded-t-[10px] border border-orange-200 bg-orange-50 px-2 pb-5 dark:border-orange-900/50 dark:bg-orange-950/40">
      <p className="text-sm leading-5 text-orange-800 dark:text-orange-300">
        {BANNER_COPY[usage.state]}
        <ContextUsageDialog usage={usage} />
      </p>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Dismiss"
        className="text-orange-800 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/40"
        onClick={() => setDismissed({ state: usage.state, n: demo?.n ?? 0 })}
      >
        <X />
      </Button>
    </div>
  )
}
