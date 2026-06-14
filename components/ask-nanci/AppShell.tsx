"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCcw } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Button } from "aperia-ds5"
import { AskNanciProvider, useAskNanci } from "@/contexts/AskNanciContext"
import { parseMode, CONCEPT_FLOW_SLUGS, type EmbedVariant } from "@/lib/ask-nanci/embed-demo-config"
import { Sidebar } from "./Sidebar"
import { TeachNanciPanel } from "./TeachNanciPanel"
import { MerchantVolumePanel } from "./concept/MerchantVolumePanel"
import { BankAccountFormPanel } from "./concept/BankAccountFormPanel"
import { StepUpAuthPanel } from "./concept/StepUpAuthPanel"
import { BatchDetailPanel } from "./concept/BatchDetailPanel"
import { ConceptPanelArea } from "./concept/ConceptPanelArea"
import { TokenLimitDialog } from "./TokenLimitDialog"
import { OnboardingDialog } from "./OnboardingDialog"
import { SettingsDialog } from "./SettingsDialog"
import { DarkModeToggle } from "./DarkModeToggle"
import { MobileSidebarToggle } from "./MobileSidebarToggle"

const DQ_PANELS = new Set(["detection-queue", "barometer-report", "coastal-risk"])

function ReplayButton() {
  const { replayFlow, chatState } = useAskNanci()
  if (!replayFlow || chatState !== "idle") return null
  return (
    <Button variant="secondary" size="xs" onClick={replayFlow} className="absolute right-3 gap-1.5">
      <RotateCcw className="size-3" />
      Ask
    </Button>
  )
}

function ConceptContentArea({ children, noSidebar }: { children: React.ReactNode; noSidebar?: boolean }) {
  const { openPanels } = useAskNanci()
  const isDQ = openPanels.some((p) => DQ_PANELS.has(p))
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
      {/* Chat is always mounted at this position so React never remounts it.
          In DQ mode it moves to the right via order-last; the panel area renders after it in DOM
          but appears first visually because it uses the default flex order. */}
      <div className={
        showDQ
          ? "order-last ml-1 flex w-[320px] shrink-0 overflow-hidden rounded-xl border bg-background md:w-97.5 md:rounded-2xl"
          : `flex min-w-0 flex-1 overflow-hidden rounded-xl md:rounded-2xl border bg-background transition-opacity duration-200 ease-out ${chatFadingIn ? "opacity-0" : "opacity-100"}`
      }>
        {children}
      </div>
      {showDQ ? (
        <ConceptPanelArea fillWidth visible={dqVisible} />
      ) : (
        <>
          <MerchantVolumePanel />
          <BankAccountFormPanel />
          <StepUpAuthPanel />
          <BatchDetailPanel />
          <ConceptPanelArea />
        </>
      )}
    </div>
  )
}

const CONCEPT_CONFIG = { theme: "aperia", logo: "/logos/titan.svg", alt: "Aperia" }

const EMBED_CONFIG: Record<EmbedVariant, { theme: string; logo: string; alt: string }> = {
  clover:           { theme: "clover",      logo: "/logos/clover.svg",          alt: "Clover"     },
  "business-owner": { theme: "access-one",  logo: "/logos/access-one-logo.svg", alt: "AccessOne"  },
  iso:              { theme: "aperia",      logo: "/logos/titan.svg",           alt: "Titan"      },
  "concept-embed":  { theme: "aperia",      logo: "/logos/titan.svg",           alt: "Aperia"     },
  vw:               { theme: "vision-web",  logo: "/logos/vision-web-logo.svg", alt: "VisionWeb"  },
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const { isEmbed, embedVariant, isConceptVersion } = parseMode(searchParams.get("mode"))
  const rawFlow = searchParams.get("flow")
  const autoPlayFlow = (rawFlow && CONCEPT_FLOW_SLUGS[rawFlow]) ?? null
  const { setTheme } = useTheme()

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
    const config = EMBED_CONFIG[embedVariant!]
    const isConceptEmbed = embedVariant === "concept-embed"
    return (
      <AskNanciProvider isEmbed embedVariant={embedVariant} isConceptVersion={isConceptVersion} autoPlayFlow={autoPlayFlow}>
        <div
          data-embed={embedVariant}
          data-theme={config.theme}
          className="relative flex h-screen flex-col overscroll-contain md:px-2 md:pb-2"
        >
          <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
            <Image src={config.logo} alt={config.alt} width={isConceptEmbed ? 120 : 80} height={24} className="h-6 w-auto" />
            {isConceptEmbed && <ReplayButton />}
          </div>
          <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden md:rounded-2xl bg-sidebar shadow-sm">
            {isConceptEmbed ? (
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
    )
  }

  return (
    <AskNanciProvider isConceptVersion={isConceptVersion}>
      <div data-embed="concept" data-theme={CONCEPT_CONFIG.theme} className="relative flex h-screen flex-col md:px-2 md:pb-2">
        {/* Top bar */}
        <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
          <div className="absolute left-0 flex items-center md:hidden">
            <MobileSidebarToggle />
          </div>
          <Image src={CONCEPT_CONFIG.logo} alt={CONCEPT_CONFIG.alt} width={120} height={24} className="h-6 w-auto" />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden md:rounded-2xl bg-sidebar shadow-sm">
          <Sidebar />
          {isConceptVersion ? (
            <ConceptContentArea>{children}</ConceptContentArea>
          ) : (
            <div className="flex min-w-0 flex-1 py-1 pr-1">
              <TeachNanciPanel />
              <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl md:rounded-2xl border bg-background">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>

      <TokenLimitDialog />
      <OnboardingDialog />
      <SettingsDialog />
      <DarkModeToggle />
    </AskNanciProvider>
  )
}
