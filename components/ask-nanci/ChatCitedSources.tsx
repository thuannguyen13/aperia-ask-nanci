"use client"

import Image from "next/image"
import { FileText } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "aperia-ds5"
import type { Source } from "@/lib/ask-nanci/types"

function SourceIcon({ source }: { source: Source }) {
  if (source.kind === "file") {
    return <FileText className="size-3.5" />
  }
  if (source.logo) {
    return <Image src={source.logo} alt={source.institution ?? source.name} width={14} height={14} className="object-contain" />
  }
  const initials = (source.initials ?? source.name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()) || "BK"
  return <span className="text-[8px] font-bold leading-none">{initials}</span>
}

export function ChatCitedSources({ sources }: { sources: Source[] }) {
  if (!sources.length) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="mt-2 flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-muted">
          <div className="flex items-center">
            {sources.slice(0, 3).map((s, i) => (
              <span
                key={s.id}
                className={`flex size-4 items-center justify-center rounded-full overflow-hidden ${s.logo ? "border bg-white" : "bg-primary text-primary-foreground"}`}
                style={{ marginLeft: i > 0 ? "-4px" : 0 }}
              >
                <SourceIcon source={s} />
              </span>
            ))}
          </div>
          {sources.length === 1 ? sources[0].name : `${sources.length} sources`}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-64 p-3 gap-0">
        <p className="mb-2 text-xs font-semibold text-foreground">Sources used</p>
        <div className="flex flex-col gap-1.5">
          {sources.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className={`flex size-5 shrink-0 items-center justify-center rounded-full overflow-hidden ${s.logo ? "border bg-white" : "bg-primary text-primary-foreground"}`}>
                <SourceIcon source={s} />
              </span>
              <span className="truncate text-xs text-foreground">{s.name}</span>
              <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                {s.kind === "file" ? "File" : "Bank"}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
