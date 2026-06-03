"use client"

import { User, Bell, Lock, Globe, Box, ArrowDown, ArrowUpRight, X } from "lucide-react"
import { Badge, Button, Dialog, DialogContent, DialogTitle, Progress, Separator } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { useAskNanci } from "@/contexts/AskNanciContext"

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n)
}

const NAV_ITEMS = [
  { id: "account",  label: "Account",           icon: User  },
  { id: "notifications", label: "Notifications", icon: Bell  },
  { id: "privacy",  label: "Privacy",            icon: Lock  },
  { id: "language", label: "Language & Region",  icon: Globe },
  { id: "usage",    label: "Usage",              icon: Box   },
]

function UsagePage() {
  const { usage, planTiers, activity } = useAskNanci()

  const tokenPct = Math.round((usage.tokens.used / usage.tokens.limit) * 100)
  const chatPct  = Math.round((usage.chats.used  / usage.chats.limit)  * 100)
  const filePct  = Math.round((usage.files.used  / usage.files.limit)  * 100)
  const maxActivity = activity.length ? Math.max(...activity.map((a) => a.tokens)) : 1

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
        <p className="text-xs font-semibold">Today's breakdown</p>
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

      {/* Plan comparison */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold">Plan Comparison</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {planTiers.map((tier) => {
            const isCurrent = tier.name === usage.plan
            return (
              <div
                key={tier.name}
                className={cn(
                  "flex flex-1 flex-col gap-3 rounded-xl border bg-background p-4 shadow-xs",
                  isCurrent && "border-foreground ring-3 ring-foreground/20",
                )}
              >
                <Badge
                  variant={isCurrent ? "default" : tier.name === "Bronze" ? "outline" : "secondary"}
                  className="w-fit"
                >
                  {tier.name}
                </Badge>
                <div className="flex items-end gap-0.5">
                  <span className="text-xl font-semibold text-foreground">{tier.price.replace("/mo", "")}</span>
                  <span className="text-xs text-muted-foreground mb-0.5">/mo</span>
                </div>
                <ul className="list-disc pl-4 flex flex-col gap-0.5">
                  <li className="text-xs">{fmt(tier.tokensPerDay)} tokens/day</li>
                  <li className="text-xs">{tier.chatsPerDay === null ? "unlimited chats" : `${tier.chatsPerDay} chats/day`}</li>
                  <li className="text-xs">{tier.filesMax === null ? "unlimited files" : `${tier.filesMax} files`}</li>
                </ul>
                {isCurrent && (
                  <p className="text-xs text-foreground">You are already in {tier.name} Plan.</p>
                )}
                {!isCurrent && tier.name === "Diamond" && (
                  <Button variant="ghost" size="xs" className="w-fit gap-1 px-0 text-xs">
                    Upgrade <ArrowUpRight className="size-3" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold">Activity — Last 7 Days</p>
        <div className="flex flex-col">
          {activity.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-5 min-w-0 flex-1">
                  <span className="w-11 shrink-0 text-xs text-muted-foreground">{item.date}</span>
                  <span className="min-w-0 truncate text-xs text-foreground">{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{fmt(item.tokens)} tok</span>
                  <div className="w-14 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full"
                      style={{ width: `${Math.round((item.tokens / maxActivity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              {i < activity.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function PlaceholderPage({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
      {label} settings coming soon
    </div>
  )
}

export function SettingsDialog() {
  const { settingsOpen, setSettingsOpen, settingsTab, openSettings } = useAskNanci()

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 overflow-hidden max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:h-screen max-sm:w-screen max-sm:max-w-full max-sm:rounded-none"
        style={{ maxWidth: "min(800px, calc(100vw - 2rem))", width: "100%" }}
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <div className="flex flex-col sm:flex-row max-h-screen sm:max-h-[80vh] w-full overflow-hidden h-full sm:h-auto">

          {/* Nav — vertical on desktop, horizontal scroll strip on mobile */}
          <div className="flex shrink-0 flex-row overflow-x-auto border-b bg-sidebar sm:w-64 sm:flex-col sm:border-b-0 sm:border-r sm:overflow-x-visible sm:p-2">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => openSettings(id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted sm:w-full sm:rounded-md sm:px-2 sm:py-2",
                  settingsTab === id && "border-b-2 border-foreground font-medium sm:border-b-0 sm:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="whitespace-nowrap sm:whitespace-normal">{label}</span>
              </button>
            ))}
          </div>

          {/* Right content */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

            {/* Header */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Settings</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium text-foreground capitalize">{settingsTab}</span>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4">
              {settingsTab === "usage"         && <UsagePage />}
              {settingsTab === "account"       && <PlaceholderPage label="Account" />}
              {settingsTab === "notifications" && <PlaceholderPage label="Notifications" />}
              {settingsTab === "privacy"       && <PlaceholderPage label="Privacy" />}
              {settingsTab === "language"      && <PlaceholderPage label="Language & Region" />}
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
