import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/ask-nanci/ThemeProvider"
import "./globals.css"

export const metadata: Metadata = {
  // One title for every route in this app, the Ask Nanci modes included: the root
  // layout is the only place metadata is set, and the risk console is what this
  // deployment is shown as.
  title: "Aperia Risk – Powered by Mastercard",
  description: "AI-powered analytics assistant",
}

// viewportFit "cover" is what makes env(safe-area-inset-*) resolve to anything other
// than 0. Without it the phone letterboxes the page inside the safe area and the insets
// read as zero, so every safe-area rule in globals.css would silently do nothing.
//
// themeColor has to be in the server HTML: iOS Safari tints its bars from the tag it
// finds at first paint, and a tag added by script after hydration reached desktop
// Safari but left the phone's bars white. This is the default theme's brand bar
// (the aperia gradient start in globals.css); useAppTheme re-tints it per theme.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#280086",
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
