"use client"

import { cn } from "aperia-ds5/utils"
import { Users } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { GUESTS_TO_KNOW, type GuestToKnow } from "@/lib/ask-nanci/data/panels/resy-service-day"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, formatWholeCurrency } from "@/components/shared"

const TAG_CLS: Record<GuestToKnow["tags"][number]["tone"], string> = {
  occasion: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  alert:    "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  vip:      "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  new:      "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
}

const initials = (name: string) => name.split(" ").map((w) => w[0]).join("")

export function ResyGuestsPanel() {
  const { closeDynamicPanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Guests to Know Tonight"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("resy-guests")}
      />

      <PanelBody className="space-y-3">
        <p className="text-sm text-muted-foreground">Profiles from Resy, spend from your card transactions</p>
        {GUESTS_TO_KNOW.map((g) => (
          <div key={g.name} className="rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">{initials(g.name)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-foreground">{g.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                  {g.time} · <Users className="size-3.5" />{g.party} · Table {g.table}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {g.tags.map((t) => (
                <span key={t.label} className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", TAG_CLS[t.tone])}>{t.label}</span>
              ))}
            </div>

            <p className="mt-3 border-l-2 border-amber-400 pl-2.5 text-sm text-foreground">{g.note}</p>

            <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-xs">
              <div>
                <p className="text-muted-foreground">Visits</p>
                <p className="font-semibold tabular-nums text-foreground">{g.visits}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg spend</p>
                <p className="font-semibold tabular-nums text-foreground">{g.avgSpend === null ? "—" : formatWholeCurrency(g.avgSpend)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last visit</p>
                <p className="font-semibold tabular-nums text-foreground">{g.lastVisit ?? "—"}</p>
              </div>
            </div>
          </div>
        ))}
      </PanelBody>
    </PanelShell>
  )
}
