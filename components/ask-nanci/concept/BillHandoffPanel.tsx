"use client"

import { Phone, MessageSquare, Clock } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { BILL_CHARGE, HANDOFF_SUMMARY, HANDOFF_PATHS, HANDOFF_REQUEST } from "@/lib/ask-nanci/data/panels/bill-handoff"
import { PanelShell, PanelHeader, PanelBody, PanelExportButton, PanelTable, Thead, Th, Td, Callout, PanelItem, SectionHeader, formatCurrency } from "@/components/shared"

const PATH_ICONS = { call: Phone, message: MessageSquare } as const

const CHARGE_ROWS: [string, string][] = [
  ["Label", BILL_CHARGE.label],
  ["Added", `On ${BILL_CHARGE.added}`],
  ["Applies to", BILL_CHARGE.appliesTo],
  ["Seen before", BILL_CHARGE.seenBefore],
]

const SUMMARY_ROWS: [string, string][] = [
  ["You asked", HANDOFF_SUMMARY.asked],
  ["I found", HANDOFF_SUMMARY.found],
  ["Still open", HANDOFF_SUMMARY.open],
]

// Carrier story 38, the Escalation panel (flow 17) for a bill charge. Three views, all
// set by the chat: the charge, then the summary a specialist picks up with the ways they
// can follow up, then sent. Nothing here is clicked.
export function BillHandoffPanel() {
  const { closeDynamicPanel } = useAskNanci()
  const view = usePanelView("bill-handoff", "charge")
  const sent = view === "sent"

  return (
    <PanelShell>
      <PanelHeader
        title="Bill Question"
        subtitle="This month's bill"
        size="lg"
        actions={<PanelExportButton />}
        onClose={() => closeDynamicPanel("bill-handoff")}
      />

      <PanelBody className="space-y-4">
        <PanelTable>
          <Thead>
            <Th>Charge</Th>
            <Th>Detail</Th>
          </Thead>
          <tbody>
            {CHARGE_ROWS.map(([label, value]) => (
              <tr key={label}>
                <Td>{label}</Td>
                <Td>{value}</Td>
              </tr>
            ))}
            <tr className="bg-amber-50 dark:bg-amber-950/20">
              <Td className="font-medium">Amount</Td>
              <Td mono className="font-semibold">{formatCurrency(BILL_CHARGE.amount)}</Td>
            </tr>
          </tbody>
        </PanelTable>

        {view === "charge" ? (
          <Callout variant="amber" title="What I can't see">
            <p>{HANDOFF_SUMMARY.open} Only a specialist at {HANDOFF_REQUEST.sentTo} can answer that.</p>
          </Callout>
        ) : (
          <>
            <div>
              <SectionHeader title="Hand-off summary" description="What the specialist sees, so you don't explain it twice." />
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg border px-3 py-2.5 text-xs">
                {SUMMARY_ROWS.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <SectionHeader title="How they follow up" />
              <div className="flex flex-col gap-2">
                {HANDOFF_PATHS.map((path) => (
                  <PanelItem
                    key={path.id}
                    icon={PATH_ICONS[path.id]}
                    iconClassName="text-primary"
                    className={cn(sent && path.id === "call" && "border-primary bg-primary/5")}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{path.label}</p>
                      <p className="text-xs text-muted-foreground">{path.detail}</p>
                    </div>
                  </PanelItem>
                ))}
              </div>
            </div>
          </>
        )}

        {sent && (
          <Callout variant="amber" icon={Clock} title={`Sent to ${HANDOFF_REQUEST.sentTo}`}>
            <p>Reference {HANDOFF_REQUEST.reference}. A specialist calls you {HANDOFF_REQUEST.callWindow}. Nothing on your bill changes until they confirm.</p>
          </Callout>
        )}

      </PanelBody>
    </PanelShell>
  )
}
