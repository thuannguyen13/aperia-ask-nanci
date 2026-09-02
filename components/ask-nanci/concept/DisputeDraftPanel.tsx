"use client"

import { Send } from "lucide-react"
import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { EVIDENCE } from "@/lib/ask-nanci/data/panels/dispute-draft"
import { PanelShell, PanelHeader, PanelBody } from "@/components/shared"

export function DisputeDraftPanel() {
  const { closePanel, submitDisputeDraft } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title="Dispute Response"
        dot="bg-green-400"
        badge={{ label: "DRAFT", className: "rounded bg-green-100 px-1.5 py-px text-[9px] font-bold tracking-wide text-green-700 dark:bg-green-900/40 dark:text-green-400" }}
        subtitle="Case #CS-8821 · 4 evidence items"
        onClose={() => closePanel("dispute-draft")}
      />

      <PanelBody className="space-y-4">
        {/* Letter header */}
        <div className="rounded-lg border bg-card px-3.5 py-3 space-y-1 text-[11px]">
          <div className="flex justify-between text-muted-foreground">
            <span>To: Issuing Bank Disputes Dept</span>
            <span className="font-mono">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <p className="font-medium text-foreground">Re: Chargeback · Case #CS-8821 · $284.50 · May 14, 2026</p>
        </div>

        {/* Body */}
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          We are responding to the above chargeback. The following evidence establishes that the merchant fulfilled the order and the cardholder acknowledged the no-refund policy at the time of sale.
        </p>

        {/* Evidence list */}
        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Evidence Submitted</p>
          <div className="space-y-1.5">
            {EVIDENCE.map(({ num, label, detail }) => (
              <div key={num} className="flex gap-2.5 rounded-md border bg-muted/30 px-3 py-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">{num}</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="border-t pt-3 text-[10px] text-muted-foreground">
          <p>We respectfully request that the chargeback be reversed in favor of the merchant.</p>
          <p className="mt-2 font-mono">Oak Street Coffee · MID 4831••••7291</p>
        </div>
      </PanelBody>

      {/* Submit */}
      <div className="shrink-0 border-t px-4 py-3">
        <Button className="w-full gap-2" onClick={submitDisputeDraft}>
          <Send className="size-3.5" />
          Submit to Processor
        </Button>
      </div>
    </PanelShell>
  )
}
