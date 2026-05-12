"use client"

import { useState } from "react"
import { FileText, Building2, X } from "lucide-react"
import type { Source } from "@/lib/ask-nanci/types"

function SourceIcon({ kind }: { kind: Source["kind"] }) {
  return kind === "file"
    ? <FileText className="size-3.5" />
    : <Building2 className="size-3.5" />
}

export function ChatAttribution({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false)
  if (!sources.length) return null

  return (
    <div className="relative mt-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-muted"
      >
        <div className="flex items-center">
          {sources.slice(0, 3).map((s, i) => (
            <span
              key={s.id}
              className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground"
              style={{ marginLeft: i > 0 ? "-4px" : 0 }}
            >
              <SourceIcon kind={s.kind} />
            </span>
          ))}
        </div>
        {sources.length === 1 ? sources[0].name : `${sources.length} sources`}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border bg-background p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Sources used</p>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {sources.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <SourceIcon kind={s.kind} />
                </span>
                <span className="truncate text-xs text-foreground">{s.name}</span>
                <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                  {s.kind === "file" ? "File" : "Bank"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
