"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MessageCircle, LayoutDashboard, ListChecks, ClipboardList } from "lucide-react"
import Image from "next/image"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { AppFrame } from "@/components/ask-nanci/AppFrame"
import { Sidebar } from "@/components/ask-nanci/Sidebar"
import { ChatView } from "@/components/ask-nanci/ChatView"
import { ChatInput } from "@/components/ask-nanci/ChatInput"
import { ConceptPanelArea } from "@/components/ask-nanci/concept/ConceptPanelArea"
import { PANELS } from "@/components/ask-nanci/concept/panel-registry"
import type { PanelId } from "@/lib/ask-nanci/types"
import { RiskLanding } from "./RiskLanding"
import { RiskNavProvider, type RiskDest } from "./RiskNavContext"
import { RISK_MERCHANTS, type WorkStatus } from "@/lib/ask-nanci/data/risk-merchants"
import { getThemeLogos, type ThemeId } from "@/lib/ask-nanci/data/theme-logos"

const THEME: ThemeId = "aperia-risk"

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

// Destinations double as their own URL slugs, so `/risk?view=detection-queue` opens
// straight into that screen and the address bar stays shareable as you navigate.
// `ask-nanci` is the only dest with no panel, so DEST_PANEL is the runtime list.
const isRiskDest = (value: string | null): value is RiskDest =>
  value === "ask-nanci" || (!!value && value in DEST_PANEL)

// `assistant: false` is the Phase 1 console: no Ask Nanci nav item, no chat home,
// no side panels. Everything else is the same screens.
export function RiskConsole({ assistant = true }: { assistant?: boolean }) {
  const { view, startNewChat } = useAskNanci()
  const params = useSearchParams()
  const home: RiskDest = assistant ? "ask-nanci" : "dashboard"

  // The URL seeds the opening screen; after mount, state is the source of truth and
  // the effect below writes it back. `ask-nanci` falls back to home in Phase 1,
  // where there is no assistant to land on.
  const linked = params.get("view")
  const [dest, setDest] = useState<RiskDest>(
    isRiskDest(linked) && (linked !== "ask-nanci" || assistant) ? linked : home,
  )
  const [merchantId, setMerchantId] = useState<string | null>(params.get("merchant"))
  const [barometerFilter, setBarometerFilter] = useState<"critical" | null>(
    params.get("filter") === "critical" ? "critical" : null,
  )

  // replaceState, not a route change: the destination is client state, so pushing
  // through the router would remount the console on every nav item click.
  useEffect(() => {
    const next = new URLSearchParams(window.location.search)
    if (dest === home) next.delete("view")
    else next.set("view", dest)
    if (dest === "risk-report" && merchantId) next.set("merchant", merchantId)
    else next.delete("merchant")
    if (dest === "barometer-report" && barometerFilter) next.set("filter", barometerFilter)
    else next.delete("filter")
    const query = next.toString()
    window.history.replaceState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname)
  }, [dest, merchantId, barometerFilter, home])

  const openBarometer = (filter: "critical" | null = null) => { setBarometerFilter(filter); setDest("barometer-report") }
  const openMerchant = (id: string) => { setMerchantId(id); setDest("risk-report") }

  // Seeded from the merchant rows, then owned here: the Barometer list, the merchant
  // detail and the queue cards all read and write the same marks.
  const [workStatuses, setWorkStatuses] = useState<Record<string, WorkStatus>>(
    () => Object.fromEntries(RISK_MERCHANTS.map((m) => [m.id, m.status])),
  )
  const markWork = (id: string, status: WorkStatus) => setWorkStatuses((s) => ({ ...s, [id]: status }))

  // The Detection Queue nav item stays highlighted across its child reports.
  const inQueue = dest === "detection-queue" || dest === "barometer-report" || dest === "risk-report"

  const nav = [
    ...(assistant
      ? [{ icon: MessageCircle, label: "Ask Nanci", active: dest === "ask-nanci", onClick: () => { setDest("ask-nanci"); startNewChat() } }]
      : []),
    { icon: LayoutDashboard, label: "Dashboard", active: dest === "dashboard", onClick: () => setDest("dashboard") },
    { icon: ListChecks, label: "Detection Queue", active: inQueue, onClick: () => setDest("detection-queue") },
    { icon: ClipboardList, label: "Assignment Management", active: dest === "assignment", onClick: () => setDest("assignment") },
  ]

  const ActivePanel = dest !== "ask-nanci" ? PANELS[DEST_PANEL[dest]].component : null

  return (
    <AppFrame
      theme={THEME}
      topBar={
        <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
          <Image data-logo="frame" {...getThemeLogos(THEME).frame} className="h-6 w-auto" />
        </div>
      }
      sidebar={<Sidebar menu={nav} logos={getThemeLogos(THEME)} hoverNav={false} />}
    >
      <RiskNavProvider value={{ go: setDest, openBarometer, openMerchant, merchantId, barometerFilter, workStatuses, markWork, assistant, home }}>
        <div className="flex min-w-0 flex-1 py-1 pr-1">
          {/* Primary box: the active destination panel (or the Ask Nanci home) */}
          <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border bg-background md:rounded-2xl">
            {ActivePanel ? (
              // The Risk Report is per-merchant, so keying it on the selection
              // remounts it instead of leaking the previous merchant's notes and
              // disposition into the next one.
              <ActivePanel key={dest === "risk-report" ? `risk-report:${merchantId}` : dest} />
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
          {/* Side panels (e.g. the Dashboard insight) — siblings, not nested */}
          {assistant && <ConceptPanelArea />}
        </div>
      </RiskNavProvider>
    </AppFrame>
  )
}
