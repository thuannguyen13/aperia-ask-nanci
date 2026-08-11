"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCcw } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "aperia-ds5"
import { AskNanciProvider, useAskNanci } from "@/contexts/AskNanciContext"
import { ChatStreamProvider } from "@/contexts/ChatStreamContext"
import { parseMode, CONCEPT_FLOW_SLUGS, CONCEPT_EMBED_FLOW_LAYOUTS } from "@/lib/ask-nanci/embed-demo-config"
import { AppFrame, useAppTheme } from "./AppFrame"
import { getThemeLogos } from "@/lib/ask-nanci/data/theme-logos"
import { Sidebar } from "./Sidebar"
import { TeachNanciPanel } from "./TeachNanciPanel"
import { ServiceMarketplacePanel } from "./ServiceMarketplacePanel"
import { ConceptPanelArea } from "./concept/ConceptPanelArea"
import { TokenLimitDialog } from "./TokenLimitDialog"
import { OnboardingDialog } from "./OnboardingDialog"
import { SettingsDialog } from "./SettingsDialog"
import { DarkModeToggle } from "./DarkModeToggle"
import { MobileSidebarToggle } from "./MobileSidebarToggle"

const DQ_PANELS = new Set(["detection-queue", "barometer-report", "coastal-risk"])

function ReplayButton() {
  const { replayFlow, chatState } = useAskNanci()
  // Show before the flow starts and again once it finishes (both are "idle");
  // stays hidden while the script is thinking/streaming.
  if (!replayFlow || chatState !== "idle") return null
  return (
    <Button variant="secondary" size="xs" onClick={replayFlow} className="absolute right-3 gap-1.5">
      <RotateCcw className="size-3" />
      Ask
    </Button>
  )
}

// Chat column. The marketplace is a full content-area view, so the chat hides (stays
// mounted — never remounted) while it's open.
function ChatArea({ children }: { children: React.ReactNode }) {
  const { marketplaceOpen } = useAskNanci()
  return (
    <>
      <ServiceMarketplacePanel />
      <div className={`min-w-0 flex-1 overflow-hidden rounded-xl md:rounded-2xl border bg-background ${marketplaceOpen ? "hidden" : "flex"}`}>
        {children}
      </div>
    </>
  )
}

function ConceptContentArea({ children, noSidebar }: { children: React.ReactNode; noSidebar?: boolean }) {
  const { dynamicPanels, marketplaceOpen } = useAskNanci()
  const isDQ = dynamicPanels.some((p) => DQ_PANELS.has(p))
  const [showDQ, setShowDQ] = useState(false)
  const [dqVisible, setDqVisible] = useState(false)
  // Tracks whether the non-DQ chat just appeared so we can fade it in
  const [chatFadingIn, setChatFadingIn] = useState(false)
  const chatFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isDQ) {
      setShowDQ(true)
      setChatFadingIn(false)
      if (chatFadeRef.current) clearTimeout(chatFadeRef.current)
      const id = requestAnimationFrame(() => setDqVisible(true))
      return () => cancelAnimationFrame(id)
    } else {
      setDqVisible(false)
      const t = setTimeout(() => {
        setShowDQ(false)
        setChatFadingIn(true)
        chatFadeRef.current = setTimeout(() => setChatFadingIn(false), 200)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isDQ])

  return (
    <div className={`flex min-w-0 flex-1 py-1 pr-1${noSidebar ? " pl-1" : ""}`}>
      <TeachNanciPanel />
      {/* Marketplace panel only where a sidebar can open it (not the compact widget). */}
      {!noSidebar && <ServiceMarketplacePanel />}
      {/* Chat is always mounted at this position so React never remounts it.
          It stays on the left in every mode (matching the latest flows); in DQ mode it
          just shrinks to a fixed width while the panel area fills the space to its right. */}
      <div className={
        marketplaceOpen
          ? "hidden"
          : showDQ
          ? "mr-1 flex w-[320px] shrink-0 overflow-hidden rounded-xl border bg-background md:w-97.5 md:rounded-2xl"
          : `flex min-w-0 flex-1 overflow-hidden rounded-xl md:rounded-2xl border bg-background transition-opacity duration-200 ease-out ${chatFadingIn ? "opacity-0" : "opacity-100"}`
      }>
        {children}
      </div>
      {showDQ ? (
        <ConceptPanelArea fillWidth visible={dqVisible} />
      ) : (
        <ConceptPanelArea />
      )}
    </div>
  )
}

// Which theme each surface wears is declared per mode in parseMode — colors live in
// globals.css under [data-theme], logos in data/theme-logos.ts.

export function AppShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const { isEmbed, embedVariant, isConceptVersion, theme, forceOnboarding } = parseMode(searchParams.get("mode"))
  const rawFlow = searchParams.get("flow")
  const autoPlayFlow = (rawFlow && CONCEPT_FLOW_SLUGS[rawFlow]) ?? null
  // `?autoplay` plays ?flow= on load rather than waiting for the Ask button. Opt-in and
  // mode-agnostic, so no existing URL changes and a variant like this never needs its
  // own mode again. Bare `?autoplay` counts; `=0` / `=false` turn it off.
  const rawAutoPlay = searchParams.get("autoplay")
  const autoPlay = rawAutoPlay !== null && rawAutoPlay !== "0" && rawAutoPlay !== "false"
  // Per-flow embed layout: some flows (e.g. 22, Service Marketplace) render the full
  // app shell (sidebar + standard welcome) instead of the compact concept-embed widget.
  const embedLayout = (rawFlow && CONCEPT_EMBED_FLOW_LAYOUTS[rawFlow]) || null
  const { setTheme } = useTheme()

  // The theme goes on <html> so portaled surfaces inherit it (see useAppTheme).
  useAppTheme(theme)

  useEffect(() => {
    if (!isEmbed) return
    setTheme("light")
    document.documentElement.style.overscrollBehavior = "none"
    document.body.style.overscrollBehavior = "none"
    return () => {
      document.documentElement.style.overscrollBehavior = ""
      document.body.style.overscrollBehavior = ""
    }
  }, [isEmbed, setTheme])

  if (isEmbed) {
    const logos = getThemeLogos(theme)
    const isConceptEmbed = embedVariant === "concept-embed"
    // Full-app embed flows (e.g. Service Marketplace) render the sidebar + standard
    // WelcomeView, so they behave like the default app (not the concept demo catalog).
    const fullApp = !!embedLayout?.fullApp
    return (
      <ChatStreamProvider>
      <AskNanciProvider
        isEmbed
        embedVariant={embedVariant}
        isConceptVersion={fullApp ? false : isConceptVersion}
        autoPlayFlow={autoPlayFlow}
        autoPlay={autoPlay}
        initialView={fullApp ? "welcome" : undefined}
        initialMarketplaceOpen={embedLayout?.openMarketplace}
      >
        <div
          data-embed={embedVariant}
          className="app-frame relative flex h-screen flex-col overscroll-contain md:px-2 md:pb-2"
        >
          <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
            <Image data-logo="frame" src={logos.frame.src} alt={logos.frame.alt} width={logos.frame.width} height={logos.frame.height} className="h-6 w-auto" />
            {/* Hidden under ?autoplay — the flow starts itself, so the button has
                nothing to offer on arrival and only reads as a stray control. */}
            {isConceptEmbed && !fullApp && !autoPlay && <ReplayButton />}
          </div>
          <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden md:rounded-2xl bg-sidebar shadow-sm">
            {fullApp ? (
              <>
                <Sidebar />
                <div className="flex min-w-0 flex-1 py-1 pr-1 pl-1">
                  <TeachNanciPanel />
                  <ChatArea>{children}</ChatArea>
                </div>
              </>
            ) : isConceptEmbed ? (
              <ConceptContentArea noSidebar>{children}</ConceptContentArea>
            ) : (
              <div className="flex min-w-0 flex-1 py-1 px-1">
                <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl md:rounded-2xl border bg-background">
                  {children}
                </div>
              </div>
            )}
          </div>
        </div>
        <TokenLimitDialog />
      </AskNanciProvider>
      </ChatStreamProvider>
    )
  }

  return (
    <ChatStreamProvider>
    {/* autoPlayFlow reaches the non-embed modes too, so ?autoplay composes with
        concept / tib / woodforest, not just the embed */}
    <AskNanciProvider isConceptVersion={isConceptVersion} autoPlayFlow={autoPlayFlow} autoPlay={autoPlay} forceOnboarding={forceOnboarding}>
      <AppFrame
        theme={theme}
        topBar={
          <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
            <div className="absolute left-0 flex items-center md:hidden">
              <MobileSidebarToggle />
            </div>
            <Image data-logo="frame" {...getThemeLogos(theme).frame} className="h-6 w-auto" />
          </div>
        }
        sidebar={<Sidebar />}
      >
        {isConceptVersion ? (
          <ConceptContentArea>{children}</ConceptContentArea>
        ) : (
          <div className="flex min-w-0 flex-1 py-1 pr-1">
            <TeachNanciPanel />
            <ChatArea>{children}</ChatArea>
          </div>
        )}
      </AppFrame>

      <TokenLimitDialog />
      <OnboardingDialog />
      <SettingsDialog />
      <DarkModeToggle />
    </AskNanciProvider>
    </ChatStreamProvider>
  )
}
