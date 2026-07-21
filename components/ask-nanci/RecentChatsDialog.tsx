"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  InputGroup, InputGroupAddon, InputGroupInput,
} from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"

// Today / Yesterday / MM/DD/YYYY — matches the Figma "Recent Chats" dialog.
function stamp(updatedAt: number) {
  const days = Math.floor(
    (new Date().setHours(0, 0, 0, 0) - new Date(updatedAt).setHours(0, 0, 0, 0)) / 86_400_000,
  )
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  return new Date(updatedAt).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
}

export function RecentChatsDialog({ open, onOpenChange, onResume }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onResume?: () => void // host navigates back to the chat surface (e.g. Risk console)
}) {
  const { sessions, activeSessionId, resumeSession } = useAskNanci()
  const [query, setQuery] = useState("")

  const results = sessions.filter((s) => s.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="sm:max-w-[624px]">
        <DialogHeader>
          <DialogTitle>Recent Chats</DialogTitle>
          <DialogDescription>Continue a previous conversation.</DialogDescription>
        </DialogHeader>

        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4 shrink-0 opacity-50" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
        </InputGroup>

        {/* p-1 so the focus ring isn't clipped by the scroll container's overflow */}
        <div className="flex max-h-[320px] flex-col overflow-y-auto p-1">
          {results.map((session) => (
            <button
              key={session.id}
              onClick={() => { resumeSession(session.id); onResume?.(); onOpenChange(false) }}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left hover:bg-accent transition-colors",
                session.id === activeSessionId && "bg-accent",
              )}
            >
              <span className="min-w-0 truncate text-sm font-medium text-foreground">{session.title}</span>
              <span className="shrink-0 text-sm text-muted-foreground">{stamp(session.updatedAt)}</span>
            </button>
          ))}
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No chats found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
