"use client"

import Image from "next/image"
import { BarChartBig, Clock5 } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { ExplorePrompts } from "@/components/ask-nanci/ExplorePrompts"
import { RISK_HEADLINE_STATS, RISK_QUICK_ACTIONS, RISK_NANCI_TAKES } from "@/lib/ask-nanci/data/risk-landing"

// Ask Nanci home for the Aperia Risk skin. Reuses ChatInput + ExplorePrompts +
// recent-chats from context; the greeting/stat-line/quick-actions/Nanci's-take
// sections are the risk-specific additions (Figma: "Aperia Risk Home Page").
export function RiskLanding() {
  const { handlePrompt, sessions, resumeSession, currentUser } = useAskNanci()
  const firstName = currentUser?.name.split(" ")[0] ?? "there"
  const recent = sessions.slice(0, 3)

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
          {RISK_QUICK_ACTIONS.map(({ label, icon: Icon, iconCls, prompt }) => (
            <button
              key={label}
              onClick={() => handlePrompt(prompt)}
              className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted"
            >
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${iconCls}`}>
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </button>
          ))}
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
              <button
                key={take.title}
                onClick={() => handlePrompt(take.prompt)}
                className="flex gap-2.5 rounded-2xl border bg-card p-4 text-left transition-colors hover:bg-muted"
              >
                <span className={`mt-1 size-2 shrink-0 rounded-full ${take.dot}`} />
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">{take.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{take.body}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {take.badges.map(({ label, icon: Icon }) => (
                      <span key={label} className="flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        <Icon className="size-2.5" /> {label}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Common questions — reuse the tabbed ExplorePrompts */}
        <ExplorePrompts description="Jumpstart your analysis with curated questions." />

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
