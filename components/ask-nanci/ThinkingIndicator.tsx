"use client"

import { useEffect, useState } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { SourceIcon } from "./SourceIcon"
import type { Source } from "@/lib/ask-nanci/types"

export function ThinkingIndicator() {
  // thinking.source is set by the stream — BE plugs in here by emitting { type: "thinking", source }
  const { thinking } = useAskNanci()
  const [visible, setVisible] = useState(true)
  const [displayed, setDisplayed] = useState<Source | null>(thinking.source)

  // Slide down → swap source → slide up on each change
  useEffect(() => {
    setVisible(false)
    const swap = setTimeout(() => {
      setDisplayed(thinking.source)
      setVisible(true)
    }, 200)
    return () => clearTimeout(swap)
  }, [thinking.source])

  return (
    <div className="flex items-center gap-2 px-4 py-3 overflow-hidden">
      <DotLottieReact
        src="/ask-nanci/nanci-thinking.lottie"
        autoplay
        loop
        style={{ width: 32, height: 32 }}
      />
      <div
        className="flex items-center gap-2 transition-all duration-200 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-10px)",
        }}
      >
        {displayed && <SourceIcon source={displayed} />}
        <span className="text-sm text-muted-foreground">
          {displayed ? `Checking ${displayed.name}` : thinking.label}
        </span>
      </div>
    </div>
  )
}
