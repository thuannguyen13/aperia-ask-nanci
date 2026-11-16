"use client"

import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { CASH_PLAN_TITLE, CUT_BACKS, CUT_BACK_HEADING, BRIDGE_HEADING, BRIDGE } from "@/lib/ask-nanci/data/panels/cash-flow"
import { CASH_OFFER, isAwaitingCashPlan } from "@/lib/ask-nanci/data/carrier-flows/cash-flow"
import { PanelShell, PanelHeader, PanelBody, PanelItem, SectionHeader, formatWholeCurrency } from "@/components/shared"

const PANEL_ID = "cash-plan"

// Two ways to get through payroll, side by side in one list: what cutting back this week
// keeps, or working capital for all of it. The offer itself is flow 21's panel.
export function CashPlanPanel() {
  const { closeDynamicPanel, handlePrompt, dismissPanelSheet, messages, chatState } = useAskNanci()
  const canOpen = isAwaitingCashPlan(messages, chatState)
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
          <PanelItem icon={BRIDGE.icon} iconClassName="text-primary" className="items-start border-primary/30 bg-primary/5">
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
