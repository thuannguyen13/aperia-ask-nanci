"use client"

import { FileText } from "lucide-react"
import Image from "next/image"
import { Popover, PopoverTrigger, PopoverContent } from "aperia-ds5"
import type { Source } from "@/lib/ask-nanci/types"

interface Props {
  sources: Source[]
}

export function ChatActiveSources({ sources }: Props) {
  if (!sources.length) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 rounded-full hover:bg-muted px-1 py-0.5 transition-colors">
          {sources.slice(0, 3).map((s, i) => {
            const initials = (s.initials ?? s.name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()) || "??"
            return (
              <div
                key={s.id}
                className={`flex size-5 items-center justify-center overflow-hidden rounded-full ring-2 ring-background ${s.logo ? "border bg-white" : s.kind === "bank" && s.color ? `${s.color} text-white` : "bg-primary text-primary-foreground"}`}
                style={{ marginLeft: i > 0 ? "-6px" : 0 }}
              >
                {s.logo
                  ? <Image src={s.logo} alt={s.institution ?? s.name} width={16} height={16} className="object-contain p-0.5" />
                  : <span className="text-[9px] font-semibold">{initials}</span>
                }
              </div>
            )
          })}
          {sources.length > 3 && (
            <span className="ml-1 text-xs text-muted-foreground">+{sources.length - 3}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-64 p-0 gap-0 overflow-hidden">
        <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Active Sources
        </p>
        <div className="flex flex-col pb-1">
          {sources.map((s) => {
            const initials = (s.initials ?? s.name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()) || "??"
            return (
              <div key={s.id} className="flex items-center gap-2.5 px-3 py-1.5">
                {s.kind === "bank" ? (
                  s.logo ? (
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white p-0.5">
                      <Image src={s.logo} alt={s.institution ?? s.name} width={18} height={18} className="object-contain" />
                    </div>
                  ) : (
                    <div className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold text-white ${s.color ?? "bg-muted"}`}>
                      {initials}
                    </div>
                  )
                ) : (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-3.5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{s.name}</p>
                  {s.institution && (
                    <p className="truncate text-[10px] text-muted-foreground">{s.institution}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
