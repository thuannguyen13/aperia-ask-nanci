"use client"

import Image from "next/image"
import { cn } from "aperia-ds5/utils"
import { Callout } from "./Callout"

// The blue "Nanci says" insight line that leads every generative panel:
// a blue callout with the Ask Nanci logomark and one paragraph of framing.
export function NanciInsight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Callout variant="blue" className={cn("border-transparent dark:border-transparent", className)}>
      <div className="flex items-start gap-2">
        <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={18} height={18} className="mt-0.5 shrink-0" />
        <p>{children}</p>
      </div>
    </Callout>
  )
}
