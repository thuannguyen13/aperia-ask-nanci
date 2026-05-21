"use client"

import Image from "next/image"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW2_PROMPT } from "@/lib/ask-nanci/concept-config"
import { ChatInput } from "@/components/ask-nanci/ChatInput"

const FLOWS = [
  {
    num: 1,
    title: "Simple Update",
    badge: "Chat only",
    description: "Update a phone number — AI confirms and shows an audit record.",
    prompt: "Update my phone number",
    proactive: false,
  },
  {
    num: 2,
    title: "Data Lookup",
    badge: "Chat + panel",
    description: "Merchant volume table opens in a side panel, sortable by column.",
    prompt: CONCEPT_FLOW2_PROMPT,
    proactive: false,
  },
  {
    num: 3,
    title: "Panel as Form",
    badge: "Chat + form",
    description: "Pre-filled bank account form — submit from the panel, AI confirms.",
    prompt: "Change my deposit bank account",
    proactive: false,
  },
  {
    num: 4,
    title: "Step-up Auth",
    badge: "Multi-step",
    description: "Financial change requires identity verification before the form unlocks.",
    prompt: "I need to change my deposit account to a new bank",
    proactive: false,
  },
  {
    num: 5,
    title: "Error Recovery",
    badge: "Chat only",
    description: "AI can't change a MID — diagnoses intent, offers alternatives via chips.",
    prompt: "Change my MID to a new one",
    proactive: false,
  },
  {
    num: 6,
    title: "Proactive Surfacing",
    badge: "AI-initiated",
    description: "AI speaks first on login — flags a held batch and opens the detail panel.",
    prompt: null,
    proactive: true,
  },
  {
    num: 7,
    title: "Case Management",
    badge: "ISO · Multi-panel",
    description: "Service agent works a chargeback — case, transaction, and dispute draft open side by side.",
    prompt: "Pull up the case for Oak Street Coffee",
    proactive: false,
  },
  {
    num: 8,
    title: "Bulk Action",
    badge: "Bulk · Multi-panel",
    description: "Analyst targets high-decline merchants — filtered table, email draft, and bulk send in chat.",
    prompt: "Show me merchants with decline rates above 15% last week",
    proactive: false,
  },
  {
    num: 10,
    title: "Risk Investigation",
    badge: "Risk · Multi-panel",
    description: "Risk analyst investigates a suspicious merchant — AI flags anomalies, panels open as evidence.",
    prompt: "Show me everything unusual about Bayside Imports in the last 90 days",
    proactive: false,
  },
  {
    num: 11,
    title: "Work Queue",
    badge: "ISO · Queue",
    description: "AI triages 47 cases on login — batch approvals, grouped issue, email template in one flow.",
    prompt: "Show me my work queue",
    proactive: false,
  },
]

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
}

export function ConceptWelcomeView() {
  const { handlePrompt, triggerProactiveFlow } = useAskNanci()

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-8 md:px-8 md:py-12">
      <div className="flex w-full max-w-[800px] flex-col gap-8 mx-auto">

        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={40} height={40} />
          <div>
            <p className="text-2xl font-medium text-foreground">Ask Nanci — Concept Demo</p>
            <p className="mt-1 text-sm text-muted-foreground">Ten interaction patterns. Each flow demonstrates a distinct AI + panel UX.</p>
          </div>
        </div>

        <ChatInput />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FLOWS.map((flow) => (
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
                  onClick={triggerProactiveFlow}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  Simulate login
                </button>
              ) : (
                <button
                  onClick={() => handlePrompt(flow.prompt!)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Try it
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
