"use client"

import { cn } from "aperia-ds5/utils"
import { Bell, Users } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CANCELLED, NOTIFY_LIST, NOTIFY_TAKER, RECOVERED_VALUE, RESY_CHECK_PER_COVER, type NotifyEntry } from "@/lib/ask-nanci/data/panels/resy-service-day"
import { PanelShell, PanelHeader, PanelBody, Callout, formatWholeCurrency } from "@/components/shared"

const STATUS: Record<NotifyEntry["status"], { label: string; cls: string }> = {
  "booked":  { label: "Booked",  cls: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300" },
  "standby": { label: "Standby", cls: "bg-muted text-muted-foreground" },
  "no-fit":  { label: "No fit",  cls: "bg-muted text-muted-foreground" },
}

export function ResyNotifyPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={`Fill ${CANCELLED.time} · Party of ${CANCELLED.party}`}
        size="lg"
        onClose={() => closeDynamicPanel("resy-notify")}
      />

      <PanelBody className="space-y-4">
        <Callout variant="green">
          <span className="font-semibold">Table back on the book.</span> {NOTIFY_TAKER.name} took it within {NOTIFY_TAKER.minutes} minutes of the offer going out. At {formatWholeCurrency(RESY_CHECK_PER_COVER)} per cover, that is {formatWholeCurrency(RECOVERED_VALUE)} that would have sat empty.
        </Callout>

        <div className="rounded-xl border">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Bell className="size-4 text-muted-foreground" />
            <p className="text-base font-bold text-foreground">Notify list</p>
            <p className="ml-auto text-xs text-muted-foreground">Ranked by fit, then visits</p>
          </div>
          <ul className="divide-y">
            {NOTIFY_LIST.map((n, i) => (
              <li key={n.name} className={cn("flex items-center gap-3 px-4 py-3", n.status === "booked" && "bg-green-50/60 dark:bg-green-950/10")}>
                <span className="w-4 shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-sm font-medium", n.status === "no-fit" ? "text-muted-foreground" : "text-foreground")}>{n.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{n.window} · {n.visits === 0 ? "New guest" : `${n.visits} visit${n.visits === 1 ? "" : "s"}`}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
                  <Users className="size-3.5" />{n.party}
                </span>
                <div className="w-28 shrink-0 text-right">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS[n.status].cls)}>{STATUS[n.status].label}</span>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{n.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
