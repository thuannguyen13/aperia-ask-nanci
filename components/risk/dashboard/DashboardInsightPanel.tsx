"use client"

import Image from "next/image"
import { X, Download } from "lucide-react"
import { Button } from "aperia-ds5"
import { DashChart } from "./charts"
import type { DashInsight } from "@/lib/ask-nanci/data/risk-dashboard"

// The Ask Nanci panel that docks on the right when a "take" is opened: explains the
// insight, embeds the focused chart, and offers suggested-action chips.
export function DashboardInsightPanel({
  title, insight, onClose, onAction,
}: {
  title: string
  insight: DashInsight
  onClose: () => void
  onAction: (action: "detection-queue" | "critical" | "none") => void
}) {
  const { lead, heading, body, focusChart } = insight.panel
  return (
    <div className="flex w-[360px] shrink-0 flex-col border-l bg-background">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={22} height={22} />
          <span className="text-sm font-semibold text-foreground">Ask Nanci</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm">
        <p className="text-muted-foreground">{lead}</p>
        <div>
          <p className="font-semibold text-foreground">{heading}</p>
          <p className="mt-1 text-muted-foreground">{body}</p>
        </div>

        {/* Embedded focus chart */}
        <div className="rounded-xl border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">{title}</span>
            <Button variant="secondary" size="xs"><Download className="size-3" /> Export</Button>
          </div>
          <DashChart id={focusChart} />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Where do you want to start?</p>
          <div className="flex flex-col gap-2">
            {insight.chips.map((c) => (
              <button
                key={c.label}
                onClick={() => onAction(c.action)}
                className="flex items-center gap-1.5 self-start rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span className="text-muted-foreground">↳</span> {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
