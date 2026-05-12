"use client"

import { Badge, Button, Progress } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n)
}

export function UsageCard() {
  const { usage, openSettings } = useAskNanci()

  const tokenPct = Math.round((usage.tokens.used / usage.tokens.limit) * 100)
  const chatPct  = Math.round((usage.chats.used  / usage.chats.limit)  * 100)
  const filePct  = Math.round((usage.files.used  / usage.files.limit)  * 100)

  const rows = [
    { label: "Tokens Used",    value: `${fmt(usage.tokens.used)}/${fmt(usage.tokens.limit)}`, pct: tokenPct },
    { label: "Chats Created",  value: `${usage.chats.used}/${usage.chats.limit}`,             pct: chatPct  },
    { label: "Files Uploaded", value: `${usage.files.used}/${usage.files.limit}`,             pct: filePct  },
  ]

  return (
    <div className="rounded-[10px] border p-3 shadow-sm flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">{usage.plan}</Badge>
        </div>
        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => openSettings("usage")}>
          Upgrade
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">Daily tokens · Resets at midnight</p>
      <div className="flex flex-col gap-2">
        {rows.map(({ label, value, pct }) => (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{label}</span>
              <span className="text-[11px] font-medium text-foreground">{value}</span>
            </div>
            <Progress value={pct} className="h-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
