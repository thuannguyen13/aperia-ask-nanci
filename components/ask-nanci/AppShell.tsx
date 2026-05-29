"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"
import { AskNanciProvider, useAskNanci } from "@/contexts/AskNanciContext"
import { parseMode, type EmbedVariant } from "@/lib/ask-nanci/embed-demo-config"
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

function ConceptContentArea({ children }: { children: React.ReactNode }) {
  const { openPanels } = useAskNanci()
  const isDQ = openPanels.some((p) => DQ_PANELS.has(p))

  return (
    <div className="flex min-w-0 flex-1 py-1 pr-1">
      <TeachNanciPanel />
      {isDQ ? (
        <>
          <ConceptPanelArea fillWidth />
          <div className="ml-1 flex w-[390px] shrink-0 overflow-hidden rounded-xl md:rounded-2xl border bg-background">
            {children}
          </div>
        </>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl md:rounded-2xl border bg-background">
            {children}
          </div>
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

const EMBED_FRAME: Record<EmbedVariant, { logo: string; alt: string; gradient: string }> = {
  clover: {
    logo: "/logos/clover.svg",
    alt: "Clover",
    gradient: "bg-[linear-gradient(180deg,#218800_0%,#BFCDC5_200px)]",
  },
  "business-owner": {
    logo: "/logos/access-one-logo.svg",
    alt: "AccessOne",
    gradient: "bg-[linear-gradient(180deg,#FC6A25_0%,#fde8d8_200px)]",
  },
  iso: {
    logo: "/logos/titan.svg",
    alt: "Titan",
    gradient: "bg-[linear-gradient(180deg,#002F67_0%,#c5d5ed_200px)]",
  },
  detect: {
    logo: "/logos/aperia-full.svg",
    alt: "Aperia",
    gradient: "bg-[linear-gradient(180deg,#002F67_0%,#c5d5ed_200px)]",
  },
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const { isEmbed, embedVariant, isConceptVersion } = parseMode(searchParams.get("mode"))
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
    const frame = EMBED_FRAME[embedVariant!]
    const isDetect = embedVariant === "detect"
    return (
      <AskNanciProvider isEmbed embedVariant={embedVariant} isConceptVersion={isConceptVersion}>
        <div
          data-embed={embedVariant}
          className={`relative flex h-screen flex-col overscroll-contain ${frame.gradient} md:px-2 md:pb-2`}
        >
          <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
            <Image src={frame.logo} alt={frame.alt} width={isDetect ? 120 : 80} height={24} className="h-6 w-auto" />
          </div>
          <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden md:rounded-2xl bg-sidebar shadow-sm">
            {isDetect ? (
              <ConceptContentArea>{children}</ConceptContentArea>
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
      <div data-embed="concept" className="relative flex h-screen flex-col bg-[linear-gradient(180deg,#002F67_0%,#c5d5ed_200px)] md:px-2 md:pb-2">
        {/* Top bar */}
        <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
          <div className="absolute left-0 flex items-center md:hidden">
            <MobileSidebarToggle />
          </div>
          <Image src="/logos/aperia-full.svg" alt="Aperia" width={120} height={24} className="h-6 w-auto" />
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
