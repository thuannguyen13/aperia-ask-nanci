import type { Metadata } from "next"
import { AskNanciProvider } from "@/contexts/AskNanciContext"
import { AskNanciSidebar } from "@/components/ask-nanci/AskNanciSidebar"
import { KnowledgeBasePanel } from "@/components/ask-nanci/KnowledgeBasePanel"
import { PinPanel } from "@/components/ask-nanci/PinPanel"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ask Nanci",
  description: "AI-powered analytics assistant",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AskNanciProvider>
          <div className="relative flex h-screen flex-col bg-primary/10 px-2 pb-2">
            <div className="absolute inset-x-0 top-0 h-[100px] bg-primary" />

            <div className="relative z-10 flex h-10 shrink-0 items-center justify-center">
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary-foreground uppercase">TITAN</span>
            </div>

            <div className="relative z-10 flex min-h-0 flex-1 overflow-hidden rounded-2xl bg-sidebar shadow-sm">
              <AskNanciSidebar />

              <div className="flex min-w-0 flex-1 gap-1 p-1">
                <KnowledgeBasePanel />
                <div className="flex min-w-0 flex-1 overflow-hidden rounded-[16px] border bg-background">
                  {children}
                  <PinPanel />
                </div>
              </div>
            </div>
          </div>
        </AskNanciProvider>
      </body>
    </html>
  )
}
