"use client"

import { Clock } from "lucide-react"
import Image from "next/image"
import { Button } from "aperia-ds5"
import { cn } from "aperia-ds5/utils"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { ChatView } from "@/components/ask-nanci/ChatView"
import { ExplorePrompts } from "@/components/ask-nanci/ExplorePrompts"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { ConceptWelcomeView } from "@/components/ask-nanci/concept/ConceptWelcomeView"
import { useComposerInset } from "@/components/ask-nanci/use-composer-inset"

function WelcomeView() {
  const { sessions, resumeSession, setKbOpen, sources, isEmbed } = useAskNanci()
  const recentSessions = sessions.slice(0, 3)

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-8 md:px-8 md:py-12">
      <div className="flex w-full max-w-[800px] flex-col gap-8 mx-auto">

        {/* Welcome header */}
        <div className="flex flex-col items-center gap-4">
          <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={40} height={40} />
          <div className="text-center">
            <p className="text-2xl font-medium text-foreground">Welcome to Ask Nanci</p>
            <p className="text-2xl font-medium text-foreground">Ready when you are.</p>
          </div>
        </div>

        {/* KB banner */}
        {!isEmbed && sources.length < 3 && <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-950/20">
          <Image src="/ask-nanci/img_kb-illustration.png" alt="" width={72} height={72} className="size-18 shrink-0 object-contain" />
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Teach Nanci</p>
              <span className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                sources.length > 1
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              )}>
                {sources.length} {sources.length === 1 ? "Account Added" : "Accounts Added"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your payment data is already connected. Add your financial and bookkeeping accounts to give Nanci a complete picture of your business.
            </p>
          </div>
          <Button size="sm" className="shrink-0" onClick={() => setKbOpen(true)}>
            Link Accounts
          </Button>
        </div>}

        {/* Chat input */}
        <ChatInput />

        {/* Prompt suggestions */}
        <ExplorePrompts />

        <div className="flex flex-col gap-4">
        {/* Recent chats */}
          {!isEmbed && recentSessions.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 size-5 shrink-0 text-foreground" />
                  <div>
                    <p className="text-base font-medium text-foreground">Pick up where you left off</p>
                    <p className="text-sm text-muted-foreground">Continue a previous conversation.</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">View All</Button>
              </div>

              <div className="overflow-hidden rounded-[14px] border">
                {recentSessions.map(({ id, title, updatedAt }, i) => (
                  <button
                    key={id}
                    onClick={() => resumeSession(id)}
                    className={cn(
                      "flex w-full cursor-pointer flex-col gap-1 bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted",
                      i < recentSessions.length - 1 && "border-b",
                    )}
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
    </div>
  )
}

export default function AskNanciPage() {
  const { view, startNewChat, isEmbed, isConceptVersion, embedVariant } = useAskNanci()
  const composerRef = useComposerInset()

  if (view === "chat") {
    return (
      <div className="relative flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
        {isEmbed && embedVariant !== "concept-embed" && (
          <button
            onClick={startNewChat}
            className="absolute top-4 left-4 z-10 flex items-center gap-2"
            aria-label="Back to home"
          >
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="Ask Nanci" width={24} height={24} />
            <span className="text-[15px] font-semibold tracking-tight text-foreground whitespace-nowrap">Ask Nanci</span>
          </button>
        )}
        <ChatView />
        {/* The composer owns the bottom of the screen: mobile panel sheets end above
            it rather than sliding behind it, so it is never covered and never overlaps
            a drawer's edge. It measures itself into --composer-inset for them to sit on
            (see PanelSheet), and z-30 lifts it over the scrim. Its fill rides
            --sheet-progress (globals.css, data-composer): solid with no sheet so a
            resting sheet's body stays hidden behind it, fading out as one opens so the
            dim reaches the bottom of the screen. CSS rather than a React flag, so
            mid-drag and the settle the card reads as tucking under a fill that is
            still there, instead of being sliced at an invisible line the frame clips
            at while the fill has already snapped solid. */}
        <div
          ref={composerRef}
          data-composer
          className="relative z-30 shrink-0 px-3 pb-3 md:px-4 md:pb-4"
        >
          <div className="mx-auto w-full max-w-[800px]">
            <ChatInput />
          </div>
        </div>
      </div>
    )
  }

  if (isConceptVersion) return <ConceptWelcomeView />
  return <WelcomeView />
}
