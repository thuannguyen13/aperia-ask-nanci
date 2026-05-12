"use client"

import { CornerDownRight } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

export function ChatSuggestions({ suggestions }: { suggestions: string[] }) {
  const { sendMessage } = useAskNanci()
  if (!suggestions.length) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => sendMessage(s)}
          className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-muted hover:border-ring"
        >
          <CornerDownRight className="size-3 shrink-0 text-muted-foreground" />
          {s}
        </button>
      ))}
    </div>
  )
}
