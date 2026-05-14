import type { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import { AskNanciProvider } from "@/contexts/AskNanciContext"
import { ThemeProvider } from "@/components/ask-nanci/ThemeProvider"
import { Sidebar } from "@/components/ask-nanci/Sidebar"
import { KnowledgeBasePanel } from "@/components/ask-nanci/KnowledgeBasePanel"
import { TokenLimitDialog } from "@/components/ask-nanci/TokenLimitDialog"
import { DarkModeToggle } from "@/components/ask-nanci/DarkModeToggle"
import { MobileSidebarToggle } from "@/components/ask-nanci/MobileSidebarToggle"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ask Nanci",
  description: "AI-powered analytics assistant",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AskNanciProvider>
            <div className="relative flex h-screen flex-col bg-[linear-gradient(180deg,#0d5c00_0%,#BFCDC5_200px)] md:px-2 md:pb-2">
              {/* Top bar */}
              <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
                {/* Mobile sidebar toggle — persistent, left-aligned */}
                <div className="absolute left-0 flex items-center md:hidden">
                  <MobileSidebarToggle />
                </div>
                <Image src="/clover-logo.svg" alt="Clover" width={80} height={24} className="h-6 w-auto" />
              </div>

              <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden md:rounded-2xl bg-sidebar shadow-sm">
                <Suspense fallback={null}><Sidebar /></Suspense>

                <div className="flex min-w-0 flex-1 gap-1 p-1">
                  <KnowledgeBasePanel />
                  <div className="flex min-w-0 flex-1 overflow-hidden rounded-[12px] md:rounded-[16px] border bg-background">
                    {children}
                  </div>
                </div>
              </div>
            </div>

            <TokenLimitDialog />
            <DarkModeToggle />
          </AskNanciProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
