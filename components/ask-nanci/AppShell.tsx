"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"
import { AskNanciProvider } from "@/contexts/AskNanciContext"
import { Sidebar } from "./Sidebar"
import { KnowledgeBasePanel } from "./KnowledgeBasePanel"
import { TokenLimitDialog } from "./TokenLimitDialog"
import { OnboardingDialog } from "./OnboardingDialog"
import { DarkModeToggle } from "./DarkModeToggle"
import { MobileSidebarToggle } from "./MobileSidebarToggle"

export function AppShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const embedVariant = searchParams.get("embed") as "clover" | "bo" | null
  const isEmbed = embedVariant === "clover" || embedVariant === "bo"
  const { setTheme } = useTheme()

  useEffect(() => {
    if (!isEmbed) return
    setTheme("light")
    document.documentElement.style.overscrollBehavior = "none"
    document.body.style.overscrollBehavior = "none"
  }, [isEmbed, setTheme])

  if (isEmbed) {
    return (
      <AskNanciProvider isEmbed embedVariant={embedVariant}>
        <div data-embed={embedVariant} className="flex h-screen flex-col overflow-hidden bg-background overscroll-contain">
          {children}
        </div>
        <TokenLimitDialog />
      </AskNanciProvider>
    )
  }

  return (
    <AskNanciProvider>
      <div className="relative flex h-screen flex-col bg-[linear-gradient(180deg,#0d5c00_0%,#BFCDC5_200px)] md:px-2 md:pb-2">
        {/* Top bar */}
        <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
          <div className="absolute left-0 flex items-center md:hidden">
            <MobileSidebarToggle />
          </div>
          <Image src="/clover-logo.svg" alt="Clover" width={80} height={24} className="h-6 w-auto" />
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden md:rounded-2xl bg-sidebar shadow-sm">
          <Sidebar />
          <div className="flex min-w-0 flex-1 py-1 pr-1">
            <KnowledgeBasePanel />
            <div className="flex min-w-0 flex-1 overflow-hidden rounded-[12px] md:rounded-[16px] border bg-background">
              {children}
            </div>
          </div>
        </div>
      </div>

      <TokenLimitDialog />
      <OnboardingDialog />
      <DarkModeToggle />
    </AskNanciProvider>
  )
}
