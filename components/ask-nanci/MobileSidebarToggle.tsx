"use client"

import { PanelLeft } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"

export function MobileSidebarToggle() {
  const { setMobileSidebarOpen } = useAskNanci()

  return (
    <button
      onClick={() => setMobileSidebarOpen(true)}
      className="flex size-10 items-center justify-center text-white"
      aria-label="Open sidebar"
    >
      <PanelLeft className="size-5" />
    </button>
  )
}
