"use client"

import { ArrowDown, X } from "lucide-react"
import { Badge, Dialog, DialogContent, DialogTitle, Progress } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n)
}

function UsagePage() {
  const { usage } = useAskNanci()

  const tokenPct = Math.round((usage.tokens.used / usage.tokens.limit) * 100)
  const chatPct  = Math.round((usage.chats.used  / usage.chats.limit)  * 100)
  const filePct  = Math.round((usage.files.used  / usage.files.limit)  * 100)

  return (
    <div className="flex flex-col gap-6">

      {/* Stat cards */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 flex-col gap-2 rounded-xl border bg-background p-4 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Tokens Used</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-xl font-semibold text-foreground">{fmt(usage.tokens.used)}</p>
            <p className="text-xs text-muted-foreground">of {fmt(usage.tokens.limit)} daily limit</p>
          </div>
          <Badge variant="destructive" className="w-fit">Almost Full</Badge>
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-xl border bg-background p-4 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Chats Created</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-xl font-semibold text-foreground">{usage.chats.used}</p>
            <p className="text-xs text-muted-foreground">of {usage.chats.limit} daily limit</p>
          </div>
          <Badge variant="secondary" className="w-fit">Healthy</Badge>
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-xl border bg-background p-4 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground">Avg. Tokens/Chat</p>
          <div className="flex flex-col gap-0.5">
            <p className="text-xl font-semibold text-foreground">1.4K</p>
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <ArrowDown className="size-3" />
              <span>8% vs. yesterday</span>
            </div>
          </div>
          <Badge variant="secondary" className="w-fit">Efficient</Badge>
        </div>
      </div>

      {/* Today's breakdown */}
      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold">Today&apos;s breakdown</p>
        <div className="rounded-xl border bg-background p-4 shadow-xs flex flex-col gap-4">
          {[
            { label: "Tokens Used",    value: `${fmt(usage.tokens.used)}/${fmt(usage.tokens.limit)}`, pct: tokenPct },
            { label: "Chats Created",  value: `${usage.chats.used}/${usage.chats.limit}`,             pct: chatPct  },
            { label: "Files Uploaded", value: `${usage.files.used}/${usage.files.limit}`,             pct: filePct  },
          ].map(({ label, value, pct }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-foreground">{label}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
              <Progress value={pct} className="h-1" />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export function SettingsDialog() {
  const { settingsOpen, setSettingsOpen } = useAskNanci()

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 overflow-hidden max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:h-[100dvh] max-sm:w-screen max-sm:max-w-full max-sm:rounded-none"
        style={{ maxWidth: "min(640px, calc(100vw - 2rem))", width: "100%" }}
      >
        <DialogTitle className="sr-only">Usage</DialogTitle>
        <div className="flex min-h-0 flex-col overflow-hidden max-h-[100dvh] sm:max-h-[80vh]">

          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
            <span className="text-sm font-medium text-foreground">Usage</span>
            <button
              onClick={() => setSettingsOpen(false)}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <UsagePage />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
