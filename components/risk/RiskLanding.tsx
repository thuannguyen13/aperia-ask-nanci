"use client"

import Image from "next/image"
import { BarChartBig, Clock5 } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { RISK_HEADLINE_STATS, RISK_QUICK_ACTIONS, RISK_NANCI_TAKES, type RiskChipDest, type RiskChipFilter } from "@/lib/ask-nanci/data/risk-landing"
import { NanciTakeCard } from "./NanciTakeCard"

// Ask Nanci home for the Aperia Risk theme. Reuses ChatInput + ExplorePrompts +
// recent-chats from context; the greeting/stat-line/quick-actions/Nanci's-take
// sections are the risk-specific additions (Figma: "Aperia Risk Home Page").
// A chip with a `dest` jumps straight to a risk destination (via onOpenView);
// otherwise it asks Nanci and the answer streams into the chat.
export function RiskLanding({ onOpenView }: { onOpenView?: (dest: RiskChipDest, filter?: RiskChipFilter) => void }) {
  const { handlePrompt, sessions, resumeSession, currentUser } = useAskNanci()
  const firstName = currentUser?.name.split(" ")[0] ?? "there"
  const recent = sessions.slice(0, 3)

  const runChip = (chip: { prompt: string; dest?: RiskChipDest; filter?: RiskChipFilter }) => {
    if (chip.dest && onOpenView) onOpenView(chip.dest, chip.filter)
    else handlePrompt(chip.prompt)
  }

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto flex w-full max-w-[768px] flex-col gap-8">

        {/* Greeting + stat line */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={40} height={40} />
          <div>
            <p className="text-2xl font-semibold text-foreground">Good morning, {firstName}.</p>
            <p className="mt-1 text-sm font-medium text-primary">
              {RISK_HEADLINE_STATS.join("  ·  ")}
            </p>
          </div>
        </div>

        <ChatInput />

        {/* Quick-action chips */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {RISK_QUICK_ACTIONS.map((chip) => {
            const { label, icon: Icon, iconCls } = chip
            return (
            <button
              key={label}
              onClick={() => runChip(chip)}
              className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted"
            >
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${iconCls}`}>
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </button>
          )})}
        </div>

        {/* Nanci's take on today */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2">
            <BarChartBig className="mt-0.5 size-5 shrink-0 text-foreground" />
            <div>
              <p className="text-base font-medium text-foreground">Nanci&apos;s take on today</p>
              <p className="text-sm text-muted-foreground">What Nanci flagged across the alerted portfolio.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RISK_NANCI_TAKES.map((take) => (
              // A take never navigates — it answers in the chat view, in place.
              <NanciTakeCard key={take.title} take={take} onClick={() => handlePrompt(take.prompt)} />
            ))}
          </div>
        </div>

        {/* Pick up where you left off */}
        {recent.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <Clock5 className="mt-0.5 size-5 shrink-0 text-foreground" />
              <div>
                <p className="text-base font-medium text-foreground">Pick up where you left off</p>
                <p className="text-sm text-muted-foreground">Continue a previous conversation.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[14px] border">
              {recent.map(({ id, title, updatedAt }, i) => (
                <button
                  key={id}
                  onClick={() => resumeSession(id)}
                  className={`flex w-full flex-col gap-1 bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted ${i < recent.length - 1 ? "border-b" : ""}`}
                >
                  <span className="text-sm font-medium text-foreground">{title}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
