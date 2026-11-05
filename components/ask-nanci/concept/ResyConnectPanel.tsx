"use client"

import { useEffect, useRef } from "react"
import { useAskNanci, usePanelView } from "@/contexts/AskNanciContext"
import { MARKETPLACE_SERVICES, MARKETPLACE_TITLE } from "@/lib/ask-nanci/data/panels/service-marketplace"
import { CONCEPT_FLOW27_CONNECT, isAwaitingFlow27Connect } from "@/lib/ask-nanci/data/flows.concept"
import { MarketplaceDetailPanel } from "../MarketplaceDetailPanel"

const RESY = MARKETPLACE_SERVICES.find((s) => s.id === "resy")!

// Flow 27's panel: the Marketplace's Resy listing, opened beside the chat and headed
// Marketplace so it reads as that page. Connect here and in the Marketplace change the
// same state.
export function ResyConnectPanel() {
  const { marketplaceEnabled, toggleMarketplaceService: toggle, closeDynamicPanel, handlePrompt, chatState, messages, dismissPanelSheet } = useAskNanci()
  const view = usePanelView("resy-connect", "offer")
  const enabled = marketplaceEnabled.has(RESY.id)
  const enabledRef = useRef(enabled)
  useEffect(() => { enabledRef.current = enabled }, [enabled])

  // The script owns the connection while the flow plays. The opening answer says Resy
  // is not connected, so one left on earlier is switched off. The connect step
  // switches it on, before the answer confirms it.
  useEffect(() => {
    if ((view === "connected") !== enabledRef.current) toggle(RESY.id)
  }, [view, toggle])

  // While the flow waits on its connect step, the button sends that step, the same as
  // its chip. Otherwise it toggles the listing as the Marketplace does.
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
