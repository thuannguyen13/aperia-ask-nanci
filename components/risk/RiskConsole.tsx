"use client"

import { useState } from "react"
import { MessageCircle, LayoutDashboard, ListChecks, ClipboardList } from "lucide-react"
import Image from "next/image"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { AppFrame } from "@/components/ask-nanci/AppFrame"
import { Sidebar } from "@/components/ask-nanci/Sidebar"
import { ChatView } from "@/components/ask-nanci/ChatView"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { RiskLanding } from "./RiskLanding"
import { DetectionQueue } from "./DetectionQueue"
import { BarometerReport } from "./BarometerReport"
import { RiskReport } from "./RiskReport"
import { RiskPlaceholder } from "./RiskPlaceholder"

// Aperia Risk shell — reuses the app chrome (Sidebar) and chat surface. Ask Nanci is
// the home; Detection Queue → Barometer Report → Risk Report is the built narrative;
// Dashboard / Assignment Management are not built yet. `dest` selects the destination
// that overrides the chat/landing; the three queue views share a breadcrumb trail.
type Dest = "ask-nanci" | "detection-queue" | "barometer-report" | "risk-report" | "dashboard" | "assignment"

export function RiskConsole() {
  const { view, startNewChat } = useAskNanci()
  const [dest, setDest] = useState<Dest>("ask-nanci")
  const [merchantId, setMerchantId] = useState<string | null>(null)

  // The Detection Queue nav item stays highlighted across its child reports.
  const inQueue = dest === "detection-queue" || dest === "barometer-report" || dest === "risk-report"

  const nav = [
    { icon: MessageCircle, label: "Ask Nanci", active: dest === "ask-nanci", onClick: () => { setDest("ask-nanci"); startNewChat() } },
    { icon: LayoutDashboard, label: "Dashboard", active: dest === "dashboard", onClick: () => setDest("dashboard") },
    { icon: ListChecks, label: "Detection Queue", active: inQueue, onClick: () => setDest("detection-queue") },
    { icon: ClipboardList, label: "Assignment Management", active: dest === "assignment", onClick: () => setDest("assignment") },
  ]

  const openMerchant = (id: string) => { setMerchantId(id); setDest("risk-report") }

  return (
    <AppFrame
      theme="aperia"
      topBar={
        // Default theme top bar — the Aperia logo (same structure as AppShell's top bar).
        <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
          <Image src="/logos/aperia-full.svg" alt="Aperia" width={82} height={24} className="h-6 w-auto" />
        </div>
      }
      sidebar={<Sidebar menu={nav} brand={{ label: "Aperia", badge: "RISK" }} />}
    >
      <div className="flex min-w-0 flex-1 py-1 pr-1">
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border bg-background md:rounded-2xl">
          {dest === "detection-queue" ? (
            <DetectionQueue onBarometer={() => setDest("barometer-report")} />
          ) : dest === "barometer-report" ? (
            <BarometerReport onBack={() => setDest("detection-queue")} onOpenMerchant={openMerchant} />
          ) : dest === "risk-report" && merchantId ? (
            <RiskReport merchantId={merchantId} onBreadcrumb={setDest} />
          ) : dest === "dashboard" ? (
            <RiskPlaceholder title="Dashboard" />
          ) : dest === "assignment" ? (
            <RiskPlaceholder title="Assignment Management" />
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
            <RiskLanding />
          )}
        </div>
      </div>
    </AppFrame>
  )
}
