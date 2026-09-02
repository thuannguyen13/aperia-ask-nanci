import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/ask-nanci/ThemeProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ask Nanci",
  description: "AI-powered analytics assistant",
}

// viewportFit "cover" is what makes env(safe-area-inset-*) resolve to anything other
// than 0. Without it the phone letterboxes the page inside the safe area and the insets
// read as zero, so every safe-area rule in globals.css would silently do nothing.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
