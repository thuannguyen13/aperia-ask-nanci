import type { Metadata } from "next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/ask-nanci/ThemeProvider"
import { AppShell } from "@/components/ask-nanci/AppShell"
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
          <Suspense fallback={null}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
