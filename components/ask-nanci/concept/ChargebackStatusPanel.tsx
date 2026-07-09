"use client"

import { CheckCircle2 } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CHARGEBACK } from "@/lib/ask-nanci/data/panels/chargeback-status"
import { PanelShell, PanelHeader, PanelExportButton, Callout, formatCurrency } from "@/components/ask-nanci/shared"

export function ChargebackStatusPanel() {
  const { closePanel } = useAskNanci()

  return (
    <PanelShell>
      <PanelHeader
        title={`${formatCurrency(CHARGEBACK.amount)} Chargeback Fee`}
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closePanel("chargeback-status")}
      />

      <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
        <Callout variant="green">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 shrink-0" />
            {CHARGEBACK.resolution} — {CHARGEBACK.creditNote}
          </div>
        </Callout>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {[
            ["Case", CHARGEBACK.caseId],
            ["Amount", formatCurrency(CHARGEBACK.amount)],
            ["Dispute Date", CHARGEBACK.disputeDate],
            ["Status", "Closed — merchant favor"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[9px] text-muted-foreground">{label}</p>
              <p className="font-mono text-xs font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </PanelShell>
  )
}
