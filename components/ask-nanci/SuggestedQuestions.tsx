"use client"

import { CornerDownRight } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

export function SuggestedQuestions({ suggestions }: { suggestions: string[] }) {
  const { handlePrompt, leavesCurrentFlow } = useAskNanci()
  // A `?flow=` embed is pinned to one demo, so a chip that would start a different
  // conversation is dropped rather than rendered — the flows it points at have no
  // entry point on that page, and clicking one strands the viewer in a demo they did
  // not ask for. Chips that advance the current flow are untouched, and outside a
  // pinned flow nothing is filtered at all.
  const shown = suggestions.filter((s) => !leavesCurrentFlow(s))
  if (!shown.length) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {shown.map((s) => (
        <button
          key={s}
          onClick={() => handlePrompt(s)}
          className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-muted hover:border-ring"
        >
          <CornerDownRight className="size-3 shrink-0 text-muted-foreground" />
          {s}
        </button>
      ))}
    </div>
  )
}
