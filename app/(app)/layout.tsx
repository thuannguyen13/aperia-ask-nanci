import { Suspense } from "react"
import { AppShell } from "@/components/ask-nanci/AppShell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AppShell>{children}</AppShell>
    </Suspense>
  )
}
