"use client"

import { useState } from "react"
import Image from "next/image"
import { TriangleAlert } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { FLOW_DEFS, type FlowDef, CONCEPT_SCRIPTED_CONVERSATIONS, CONCEPT_FLOW6_KEY } from "@/lib/ask-nanci/concept-config"
import { ChatInput } from "@/components/ask-nanci/ChatInput"

const PROACTIVE_CONTENT = CONCEPT_SCRIPTED_CONVERSATIONS[CONCEPT_FLOW6_KEY][0].content

// Welcome-view cards derive from the single flow registry (data/flows.concept.ts).
const FLOWS = FLOW_DEFS.filter((f) => f.section === "pattern")
const MONEY_FLOWS = FLOW_DEFS.filter((f) => f.section === "merchant")

const BADGE_COLORS: Record<string, string> = {
  "Chat only":       "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  "Chat + panel":    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
  "Chat + form":     "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300",
  "Multi-step":      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  "AI-initiated":    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "ISO · Multi-panel": "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  "Bulk · Multi-panel": "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500",
  "Risk · Multi-panel": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  "ISO · Queue":     "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  "Risk · Looping":  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
}

export function ConceptWelcomeView() {
  const { handlePrompt, triggerProactiveFlow, activateProactiveNotification, embedVariant } = useAskNanci()
  const [proactiveAlertVisible, setProactiveAlertVisible] = useState(false)
  const [detailsExpanded, setDetailsExpanded] = useState(false)

  function handleSimulateLogin() {
    setProactiveAlertVisible(true)
    setDetailsExpanded(false)
    activateProactiveNotification()
  }

  function handleStartConversation() {
    setProactiveAlertVisible(false)
    setDetailsExpanded(false)
    triggerProactiveFlow()
  }

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-8 md:px-8 md:py-12">
      <div className="flex w-full max-w-[800px] flex-col gap-8 mx-auto">

        {embedVariant !== "concept-embed" && (
          <div className="flex flex-col items-center gap-3 text-center">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={40} height={40} />
            <div>
              <p className="text-2xl font-medium text-foreground">Ask Nanci — Concept Demo</p>
              <p className="mt-1 text-sm text-muted-foreground">{FLOWS.length + MONEY_FLOWS.length} interaction patterns. Each flow demonstrates a distinct AI + panel UX.</p>
            </div>
          </div>
        )}

        <ChatInput />

        {proactiveAlertVisible && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
            {detailsExpanded ? (
              <div className="flex flex-col gap-2.5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Nanci spotted some issues</p>
                </div>
                <p className="whitespace-pre-line text-sm text-amber-800/80 dark:text-amber-200/80 leading-relaxed pl-6">
                  {PROACTIVE_CONTENT}
                </p>
                <div className="flex items-center gap-2 pl-6">
                  <button
                    onClick={handleStartConversation}
                    className="rounded-lg bg-amber-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-800 transition-colors dark:bg-amber-600 dark:hover:bg-amber-700"
                  >
                    Open Nanci
                  </button>
                  <button
                    onClick={() => { setProactiveAlertVisible(false); setDetailsExpanded(false) }}
                    className="text-sm text-amber-700/70 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <div className="flex items-center gap-2">
                  <TriangleAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Nanci spotted some issues</p>
                </div>
                <button
                  onClick={() => setDetailsExpanded(true)}
                  className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 underline underline-offset-2 transition-colors"
                >
                  View details
                </button>
              </div>
            )}
          </div>
        )}

        <FlowGrid flows={FLOWS} onTryIt={handlePrompt} onSimulateLogin={handleSimulateLogin} />

        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground">Merchant Money Questions</p>
          <FlowGrid flows={MONEY_FLOWS} onTryIt={handlePrompt} onSimulateLogin={handleSimulateLogin} />
        </div>

      </div>
    </div>
  )
}

function FlowGrid({ flows, onTryIt, onSimulateLogin }: { flows: FlowDef[]; onTryIt: (prompt: string) => void; onSimulateLogin: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {flows.map((flow) => (
        <div key={flow.num} className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {flow.num}
              </span>
              <h3 className="text-sm font-semibold text-foreground">{flow.title}</h3>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${BADGE_COLORS[flow.badge] ?? ""}`}>
              {flow.badge}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{flow.description}</p>
          {flow.proactive ? (
            <button
              onClick={onSimulateLogin}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
            >
              Simulate login
            </button>
          ) : (
            <button
              onClick={() => onTryIt(flow.key)}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Try it
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
