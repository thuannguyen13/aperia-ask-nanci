"use client"

import { useState } from "react"
import { MessageCircle, LayoutDashboard, ListChecks, ClipboardList } from "lucide-react"
import Image from "next/image"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { AppFrame } from "@/components/ask-nanci/AppFrame"
import { Sidebar } from "@/components/ask-nanci/Sidebar"
import { ChatView } from "@/components/ask-nanci/ChatView"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { PANELS } from "@/components/ask-nanci/concept/panel-registry"
import type { PanelId } from "@/lib/ask-nanci/types"
import { RiskLanding } from "./RiskLanding"
import { RiskNavProvider, type RiskDest } from "./RiskNavContext"

// Aperia Risk shell. Ask Nanci is the home (chat/landing); every other destination
// is a registered panel rendered full-width through the PANELS registry. Navigation
// and per-panel selection (current merchant, barometer filter) flow through
// RiskNavContext since the panels are prop-less.
const DEST_PANEL: Record<Exclude<RiskDest, "ask-nanci">, PanelId> = {
  dashboard: "risk-dashboard",
  "detection-queue": "risk-detection-queue",
  "barometer-report": "risk-barometer",
  "risk-report": "risk-risk-report",
  assignment: "risk-assignments",
}

export function RiskConsole() {
  const { view, startNewChat } = useAskNanci()
  const [dest, setDest] = useState<RiskDest>("ask-nanci")
  const [merchantId, setMerchantId] = useState<string | null>(null)
  const [barometerFilter, setBarometerFilter] = useState<"critical" | null>(null)

  const openBarometer = (filter: "critical" | null = null) => { setBarometerFilter(filter); setDest("barometer-report") }
  const openMerchant = (id: string) => { setMerchantId(id); setDest("risk-report") }

  // The Detection Queue nav item stays highlighted across its child reports.
  const inQueue = dest === "detection-queue" || dest === "barometer-report" || dest === "risk-report"

  const nav = [
    { icon: MessageCircle, label: "Ask Nanci", active: dest === "ask-nanci", onClick: () => { setDest("ask-nanci"); startNewChat() } },
    { icon: LayoutDashboard, label: "Dashboard", active: dest === "dashboard", onClick: () => setDest("dashboard") },
    { icon: ListChecks, label: "Detection Queue", active: inQueue, onClick: () => setDest("detection-queue") },
    { icon: ClipboardList, label: "Assignment Management", active: dest === "assignment", onClick: () => setDest("assignment") },
  ]

  const ActivePanel = dest !== "ask-nanci" ? PANELS[DEST_PANEL[dest]].component : null

  return (
    <AppFrame
      theme="aperia"
      topBar={
        <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
          <Image src="/logos/aperia-full.svg" alt="Aperia" width={82} height={24} className="h-6 w-auto" />
        </div>
      }
      sidebar={<Sidebar menu={nav} brand={{ label: "Aperia", badge: "RISK" }} />}
    >
      <RiskNavProvider value={{ go: setDest, openBarometer, openMerchant, merchantId, barometerFilter }}>
        <div className="flex min-w-0 flex-1 py-1 pr-1">
          <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border bg-background md:rounded-2xl">
            {ActivePanel ? (
              <ActivePanel />
            ) : view === "chat" ? (
              <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                <ChatView />
                <div className="shrink-0 px-3 pb-3 md:px-4 md:pb-4">
                  <div className="mx-auto w-full max-w-[768px]">
                    <ChatInput />
                  </div>
                </div>
              </div>
            ) : (
              <RiskLanding onOpenView={(_dest, f) => openBarometer(f ?? null)} />
            )}
          </div>
        </div>
      </RiskNavProvider>
    </AppFrame>
  )
}
