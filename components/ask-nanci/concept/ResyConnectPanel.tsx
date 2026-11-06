"use client"

import { useAskNanci } from "@/contexts/AskNanciContext"
import { MARKETPLACE_SERVICES, MARKETPLACE_TITLE } from "@/lib/ask-nanci/data/panels/service-marketplace"
import { CONCEPT_FLOW27_CONNECT, isAwaitingFlow27Connect } from "@/lib/ask-nanci/data/flows.concept"
import { MarketplaceDetailPanel } from "../MarketplaceDetailPanel"

const RESY = MARKETPLACE_SERVICES.find((s) => s.id === "resy")!

// Flow 27's panel: the Marketplace's Resy listing, opened beside the chat and headed
// Marketplace so it reads as that page. Connect here and in the Marketplace change the
// same state.
export function ResyConnectPanel() {
  const { marketplaceEnabled, toggleMarketplaceService: toggle, closeDynamicPanel, handlePrompt, chatState, messages, dismissPanelSheet } = useAskNanci()
  const enabled = marketplaceEnabled.has(RESY.id)

  // While the flow waits on its connect step, the button sends that step, the same as
  // its chip. The step's turn connects Resy. Otherwise the button toggles the listing
  // as the Marketplace does.
  const onToggle = () => {
    if (!enabled && isAwaitingFlow27Connect(messages, chatState)) {
      dismissPanelSheet()
      handlePrompt(CONCEPT_FLOW27_CONNECT)
      return
    }
    toggle(RESY.id)
  }

  return (
    <MarketplaceDetailPanel
      service={RESY}
      enabled={enabled}
      onToggle={onToggle}
      onClose={() => closeDynamicPanel("resy-connect")}
      heading={MARKETPLACE_TITLE}
    />
  )
}
