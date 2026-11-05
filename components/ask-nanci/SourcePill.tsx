"use client"

import Image from "next/image"
import { MARKETPLACE_SERVICES } from "@/lib/ask-nanci/data/panels/service-marketplace"

// A scripted answer's source, drawn as the same pill as the cited-sources button. A
// source named after a marketplace service ("Resy reservations") carries its logo.
export function SourcePill({ source, className = "" }: { source: string; className?: string }) {
  const service = MARKETPLACE_SERVICES.find((s) => s.logo && source.startsWith(s.title))

  return (
    <span
      title={`Source: ${source}`}
      className={`mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground ${className}`}
    >
      {service?.logo && (
        <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
          <Image src={service.logo} alt="" width={16} height={16} className="object-contain p-0.5" />
        </span>
      )}
      <span className="truncate">{source}</span>
    </span>
  )
}
