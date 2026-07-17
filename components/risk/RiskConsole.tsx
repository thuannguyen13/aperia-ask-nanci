"use client"

import { MessageCircle, LayoutDashboard, ListChecks, ClipboardList } from "lucide-react"
import Image from "next/image"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { AppFrame } from "@/components/ask-nanci/AppFrame"
import { Sidebar } from "@/components/ask-nanci/Sidebar"
import { ChatView } from "@/components/ask-nanci/ChatView"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { RiskLanding } from "./RiskLanding"

// Aperia Risk shell — reuses the app chrome (Sidebar) and chat surface. Ask Nanci is
// the home; Dashboard / Detection Queue / Assignment Management are not built yet.
export function RiskConsole() {
  const { view, startNewChat } = useAskNanci()
  const onHome = view !== "chat"

  const nav = [
    { icon: MessageCircle, label: "Ask Nanci", active: onHome, onClick: startNewChat },
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: ListChecks, label: "Detection Queue" },
    { icon: ClipboardList, label: "Assignment Management" },
  ]

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
          {view === "chat" ? (
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
