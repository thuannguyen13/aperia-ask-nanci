"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { FileText } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import type { Source } from "@/lib/ask-nanci/types"

function SourceIcon({ source }: { source: Pick<Source, "kind" | "logo" | "color" | "initials" | "name" | "institution"> }) {
  if (source.logo) {
    return (
      <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white p-0.5">
        <Image src={source.logo} alt={source.institution ?? source.name} width={18} height={18} className="object-contain" />
      </div>
    )
  }
  if (source.kind === "file") {
    return (
      <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted">
        <FileText className="size-3.5 text-muted-foreground" />
      </div>
    )
  }
  const initials = (source.initials ?? source.name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()) || "??"
  return (
    <div className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold text-white ${source.color ?? "bg-primary"}`}>
      {initials}
    </div>
  )
}

export function ThinkingIndicator() {
  // thinkingSource is set by the stream — BE plugs in here by emitting { type: "thinking", source }
  const { thinkingSource, thinkingLabel } = useAskNanci()
  const [visible, setVisible] = useState(true)
  const [displayed, setDisplayed] = useState(thinkingSource)

  // Slide down → swap source → slide up on each change
  useEffect(() => {
    setVisible(false)
    const swap = setTimeout(() => {
      setDisplayed(thinkingSource)
      setVisible(true)
    }, 200)
    return () => clearTimeout(swap)
  }, [thinkingSource])

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
          {displayed ? `Checking ${displayed.name}` : thinkingLabel}
        </span>
      </div>
    </div>
  )
}
