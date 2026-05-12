"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useAskNanci } from "@/contexts/AskNanciContext"

const STEPS = ["Thinking", "Analyzing data", "Checking sources", "Preparing answer"]

export function ThinkingIndicator() {
  const { sources } = useAskNanci()
  const [step, setStep] = useState(0)

  const activeSources = sources.filter((s) => s.active)
  const allSteps = activeSources.length
    ? [...STEPS.slice(0, 2), ...activeSources.slice(0, 2).map((s) => `Reading ${s.name}`), STEPS[3]]
    : STEPS

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % allSteps.length), 900)
    return () => clearInterval(id)
  }, [allSteps.length])

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
        <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={14} height={14} className="brightness-0 invert" />
      </div>
      <div className="mt-1 flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
        <span className="animate-pulse text-sm text-muted-foreground">{allSteps[step]}</span>
        <span className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block size-1 rounded-full bg-muted-foreground"
              style={{ animationDelay: `${i * 0.2}s`, animation: "bounce 1s infinite" }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
