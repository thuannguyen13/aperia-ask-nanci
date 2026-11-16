"use client"

import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CASH_PLAN_TITLE, CUT_BACKS, CUT_BACK_HEADING, BRIDGE_HEADING, BRIDGE, CARRIER_LEVER_HEADING, CARRIER_LEVER, CARRIER_BILL } from "@/lib/ask-nanci/data/panels/cash-flow"
import { CASH_OFFER, CASH_BILL, isAwaitingCashPlan, isAwaitingCashOffer } from "@/lib/ask-nanci/data/carrier-flows/cash-flow"
import { PanelShell, PanelHeader, PanelBody, PanelItem, SectionHeader, formatWholeCurrency } from "@/components/shared"

const PANEL_ID = "cash-plan"

// Three ways through payroll: the carrier moves its own bill, cutting back this week keeps
// more, or working capital covers all of it. The offer itself is flow 21's panel, and the
// bill date opens as a request to review under this one.
export function CashPlanPanel() {
  const { closeDynamicPanel, handlePrompt, dismissPanelSheet, messages, chatState } = useAskNanci()
  const canAskCarrier = isAwaitingCashPlan(messages, chatState)
  const canOpen = isAwaitingCashOffer(messages, chatState)
  const askCarrier = () => {
    if (!canAskCarrier) return
    dismissPanelSheet()
    handlePrompt(CASH_BILL)
  }
  const openOffer = () => {
    if (!canOpen) return
    // On a phone the sheet goes down so the offer comes up in its place.
    dismissPanelSheet()
    handlePrompt(CASH_OFFER)
  }
  return (
    <PanelShell>
      <PanelHeader title={CASH_PLAN_TITLE} size="lg" onClose={() => closeDynamicPanel(PANEL_ID)} />
      <PanelBody className="flex flex-col gap-6">
        {/* The carrier's own lever comes first: it is the one only the carrier can pull. */}
        <div>
          <SectionHeader title={CARRIER_LEVER_HEADING.title} description={CARRIER_LEVER_HEADING.description} />
          <PanelItem icon={CARRIER_LEVER.icon} iconClassName="text-primary" className="items-start border-primary/30 bg-primary/5">
            <div className="min-w-0 flex-1 space-y-0.5 text-sm">
              <p className="font-medium text-foreground">{CARRIER_LEVER.title}</p>
              <p className="text-muted-foreground">{CARRIER_LEVER.detail}</p>
            </div>
            <span className="shrink-0 self-center text-sm font-medium tabular-nums text-foreground">{formatWholeCurrency(CARRIER_BILL.amount)}</span>
            <Button size="sm" className="shrink-0 self-center" onClick={askCarrier} disabled={!canAskCarrier}>{CARRIER_LEVER.action}</Button>
          </PanelItem>
        </div>
        <div>
          <SectionHeader title={CUT_BACK_HEADING.title} description={CUT_BACK_HEADING.description} />
          <ul className="space-y-2">
            {CUT_BACKS.map((item) => (
              <li key={item.id}>
                <PanelItem icon={item.icon} iconClassName="text-primary" className="items-start">
                  <div className="min-w-0 flex-1 space-y-0.5 text-sm">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="shrink-0 self-center text-sm font-medium tabular-nums text-foreground">{formatWholeCurrency(item.amount)}</span>
                </PanelItem>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeader title={BRIDGE_HEADING.title} description={BRIDGE_HEADING.description} />
          <PanelItem icon={BRIDGE.icon} iconClassName="text-primary" className="items-start">
            <div className="min-w-0 flex-1 space-y-0.5 text-sm">
              <p className="font-medium text-foreground">{BRIDGE.title}</p>
              <p className="text-muted-foreground">{BRIDGE.detail}</p>
            </div>
            <Button size="sm" className="shrink-0 self-center" onClick={openOffer} disabled={!canOpen}>{BRIDGE.action}</Button>
          </PanelItem>
        </div>
      </PanelBody>
    </PanelShell>
  )
}
