"use client"

import { Send } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CONCEPT_FLOW8_FINAL } from "@/lib/ask-nanci/concept-config"
import { PREVIEWS } from "@/lib/ask-nanci/data/panels/email-draft"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"

function Var({ children }: { children: string }) {
  return (
    <span className="rounded bg-blue-100 px-1 py-px font-mono text-[10px] text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
      {children}
    </span>
  )
}

export function EmailDraftPanel() {
  const { closePanel, handlePrompt } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Outreach Draft"
        dot="bg-amber-400"
        badge={{ label: "22 RECIPIENTS", className: "rounded bg-amber-100 px-1.5 py-px font-mono text-[9px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" }}
        subtitle="High-decline merchants · Routed to ISO"
        onClose={() => closePanel("email-draft")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        {/* Template */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Template</p>
          <div className="rounded-lg border bg-card">
            <div className="border-b px-3 py-2 space-y-0.5">
              <div className="flex items-baseline gap-2 text-[10px]">
                <span className="text-muted-foreground w-12 shrink-0">Subject</span>
                <span className="text-foreground">Action needed — elevated decline rate for <Var>{"{merchant_name}"}</Var></span>
              </div>
              <div className="flex items-baseline gap-2 text-[10px]">
                <span className="text-muted-foreground w-12 shrink-0">To</span>
                <Var>{"{merchant_email}"}</Var>
              </div>
              <div className="flex items-baseline gap-2 text-[10px]">
                <span className="text-muted-foreground w-12 shrink-0">CC</span>
                <Var>{"{iso_contact}"}</Var>
              </div>
            </div>
            <div className="px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground space-y-2">
              <p>Hi <Var>{"{merchant_name}"}</Var>,</p>
              <p>Your decline rate last week was <Var>{"{decline_rate}"}</Var> — above our 15% threshold. High decline rates can affect your processing and settlement schedule.</p>
              <p>I'd like to schedule a 15-minute review call. Reply here or book at the link below.</p>
              <p>Your account contact: <Var>{"{iso_contact}"}</Var></p>
            </div>
          </div>
        </div>

        {/* Previews */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">First 3 Previews</p>
          <div className="space-y-1.5">
            {PREVIEWS.map((p, i) => (
              <div key={i} className="rounded-md border bg-card px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{p.name}</span>
                  <span className="font-mono text-[10px] font-semibold text-red-600 dark:text-red-400">{p.rate}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                  <span className="font-mono">{p.to}</span>
                  <span>via {p.iso}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">+ 19 more</p>
        </div>
      </div>

      {/* Send */}
      <div className="shrink-0 border-t px-4 py-3">
        <button
          onClick={() => handlePrompt(CONCEPT_FLOW8_FINAL)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Send className="size-3.5" /> Send All 22
        </button>
      </div>
    </PanelShell>
  )
}
