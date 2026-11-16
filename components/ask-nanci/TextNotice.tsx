"use client"

import { MessageSquare } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

// A text message from Nanci as the owner's phone shows it, over the whole app and
// outside the chat. The chat opens once it goes, so the demo shows Nanci reaching the
// owner before the owner opens anything.
export function TextNotice() {
  const { textNotice } = useAskNanci()
  if (!textNotice) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-foreground/10 px-4 pt-6 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div
        role="status"
        className="h-fit w-full max-w-[400px] rounded-3xl border bg-background/95 p-4 shadow-xl animate-in slide-in-from-top-6 duration-300"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex size-5 items-center justify-center rounded-md bg-green-500 text-white">
            <MessageSquare className="size-3" />
          </span>
          <span className="font-medium uppercase tracking-wide">Messages</span>
          <span className="ml-auto">now</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-foreground">{textNotice.from}</p>
        <p className="mt-0.5 text-sm text-foreground">{textNotice.body}</p>
      </div>
    </div>
  )
}
