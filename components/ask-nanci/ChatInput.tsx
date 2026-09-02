"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, Square, Bell, MessageCircleQuestion, Clock5 } from "lucide-react"
import { Button, Textarea, Popover, PopoverTrigger, PopoverContent, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "aperia-ds5"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CONCEPT_SCRIPTED_CONVERSATIONS, CONCEPT_FLOW6_KEY } from "@/lib/ask-nanci/data/flows.concept"
import { SlashCommandPopover, type SlashAction } from "./SlashCommandPopover"
import { ChatActiveSources } from "./ChatActiveSources"
import { ExplorePrompts } from "./ExplorePrompts"
import { RecentChatsDialog } from "./RecentChatsDialog"
import { ContextUsageBanner, type ContextUsageDemo } from "./ContextUsageBanner"
import { PlanUsageChip, type PlanUsageDemo } from "./PlanUsageChip"
import { getPlanUsage } from "@/lib/ask-nanci/plan-usage"

const PROACTIVE_CONTENT = CONCEPT_SCRIPTED_CONVERSATIONS[CONCEPT_FLOW6_KEY][0].content

export function ChatInput() {
  const { handlePrompt, startNewChat, chatState, stopAnimation, sources, draft, setDraft, usage, setTokenLimitReached, setOnboardingOpen, isEmbed, embedVariant, isConceptVersion, triggerProactiveFlow, proactiveNotificationActive, replayFlow, requestTour } = useAskNanci()
  const isDetect = embedVariant === "concept-embed"
  const activeSources = sources.filter((s) => s.active)

  const [value, setValue] = useState("")
  const [commonQOpen, setCommonQOpen] = useState(false)
  const [recentOpen, setRecentOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifRead, setNotifRead] = useState(false)
  // Pinned by the /context-* commands; null follows the real conversation length.
  const [contextDemo, setContextDemo] = useState<ContextUsageDemo>({ state: null, n: 0 })
  // Pinned by the /plan-* commands; null follows the real account data.
  const [planDemo, setPlanDemo] = useState<PlanUsageDemo>({ state: null, n: 0 })
  const planSpent = getPlanUsage(usage, planDemo.state).state === "full"

  function handleNotifOpen(open: boolean) {
    setNotifOpen(open)
    if (open) setNotifRead(true)
  }

  function handleOpenNanci() {
    setNotifOpen(false)
    triggerProactiveFlow()
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (draft) { setValue(draft); setDraft(""); textareaRef.current?.focus({ preventScroll: true }) }
  }, [draft, setDraft])

  const isIdle = chatState === "idle"
  const isBusy = chatState === "thinking" || chatState === "streaming"
  const showSlash = value.startsWith("/")
  const slashQuery = showSlash ? value.slice(1) : ""

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit() }
  }

  function submit() {
    if (!value.trim() || !isIdle) return
    handlePrompt(value.trim())
    setValue("")
  }

  function handleSlashAction(action: SlashAction) {
    if (action.type === "select") {
      setValue(action.text)
    } else if (action.type === "command") {
      if (action.id === "usage") setTokenLimitReached(true)
      if (action.id === "onboarding") setOnboardingOpen(true)
      if (action.id === "tour") requestTour()
      if (action.id === "context-warning") setContextDemo((d) => ({ state: "approaching", n: d.n + 1 }))
      if (action.id === "context-full") setContextDemo((d) => ({ state: "full", n: d.n + 1 }))
      if (action.id === "context-clear") setContextDemo((d) => ({ state: null, n: d.n + 1 }))
      if (action.id === "plan-warning") setPlanDemo((d) => ({ state: "approaching", n: d.n + 1 }))
      if (action.id === "plan-full") setPlanDemo((d) => ({ state: "full", n: d.n + 1 }))
      if (action.id === "plan-clear") setPlanDemo((d) => ({ state: null, n: d.n + 1 }))
      setValue("")
    } else {
      setValue("")
    }
    textareaRef.current?.focus()
  }

  return (
    <div className="relative">
      {showSlash && (
        <SlashCommandPopover query={slashQuery} onAction={handleSlashAction} />
      )}

      <RecentChatsDialog open={recentOpen} onOpenChange={setRecentOpen} />

      <ContextUsageBanner demo={contextDemo} />

      {/* relative z-10 keeps the input painted over the banner tucked behind its top edge */}
      <div data-tour="chat-input" className="relative z-10 flex flex-col rounded-xl border bg-background dark:bg-input/30 shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <Textarea
          ref={textareaRef}
          placeholder="Ask anything"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          // Per the design note, the spent-budget warning fires when they go to type,
          // not on arrival — it lands at the moment it actually blocks them.
          onFocus={() => { if (planSpent) setTokenLimitReached(true) }}
          className="min-h-[72px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 bg-transparent dark:bg-transparent"
        />

        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-2">
            <div data-tour="active-sources"><ChatActiveSources sources={activeSources} /></div>

            {/* Both of these leave the pinned demo — Common Questions replays another
                persona's scripted conversation over it, Recent Chats resumes a stored
                session. A `?flow=` embed exists to show one flow, so neither is
                offered there. Same reasoning as the top-bar Ask button under
                ?autoplay: an affordance with nothing useful behind it. */}
            {!replayFlow && (
            <TooltipProvider delayDuration={400}>
              <div className="flex overflow-hidden rounded-lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button data-tour="common-questions" onClick={() => setCommonQOpen(true)} className="flex h-7 w-7 items-center justify-center bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground">
                      <MessageCircleQuestion className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Common Questions</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button data-tour="recent-chats" onClick={() => setRecentOpen(true)} className="flex h-7 w-7 items-center justify-center bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground">
                      <Clock5 className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Recent Chats</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            )}

            {isConceptVersion && proactiveNotificationActive && (
              <Popover open={notifOpen} onOpenChange={handleNotifOpen}>
                <PopoverTrigger asChild>
                  <button className="relative flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Bell className="size-4" />
                    {!notifRead && (
                      <span className="absolute top-1 right-1 size-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-72 p-0">
                  <div className="flex flex-col gap-2.5 p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notifications</p>
                    <div className="flex flex-col gap-1.5 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Nanci spotted some issues</p>
                      <p className="whitespace-pre-line text-xs text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
                        {PROACTIVE_CONTENT}
                      </p>
                      <button
                        onClick={handleOpenNanci}
                        className="mt-1 self-start rounded-md bg-amber-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-800 transition-colors dark:bg-amber-600 dark:hover:bg-amber-700"
                      >
                        Open Nanci
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Grouped so the toolbar's justify-between still has exactly two sides */}
          <div className="flex items-center gap-1">
            <PlanUsageChip demo={planDemo} />
            {/* `icon` (32px), not `icon-sm` (28px): the design sizes the send button a
                tier above the rest of the toolbar, and stop has to match it or the
                control resizes the moment a flow starts streaming. */}
            {isBusy ? (
              <Button size="icon" variant="secondary" onClick={stopAnimation}>
                <Square className="size-3.5 fill-current" />
              </Button>
            ) : (
              <Button size="icon" variant="default" onClick={submit} disabled={(isEmbed && !isDetect) || !value.trim()}>
                <ArrowUp />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={commonQOpen} onOpenChange={setCommonQOpen}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle className="sr-only">Common Questions</DialogTitle>
          </DialogHeader>
          <ExplorePrompts onPromptClick={(prompt) => {
            setCommonQOpen(false)
            if (!isDetect) startNewChat()
            handlePrompt(prompt)
          }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
