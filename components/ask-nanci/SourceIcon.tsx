"use client"

import Image from "next/image"
import { FileText } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import type { Source } from "@/lib/ask-nanci/types"

type SourceIconSource = Pick<Source, "kind" | "logo" | "color" | "initials" | "name" | "institution">

const SIZES = {
  sm: { container: "size-5", img: 14, text: "text-[9px]",  rounding: "rounded-full" },
  md: { container: "size-6", img: 18, text: "text-[9px]",  rounding: "rounded-lg"   },
  lg: { container: "size-9", img: 28, text: "text-[11px]", rounding: "rounded-xl"   },
}

export function getSourceInitials(source: Pick<Source, "initials" | "name">): string {
  return (source.initials ?? source.name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase()) || "??"
}

export function SourceIcon({ source, size = "md", className }: {
  source: SourceIconSource
  size?: keyof typeof SIZES
  className?: string
}) {
  const s = SIZES[size]

  if (source.logo) {
    return (
      <div className={cn("flex shrink-0 items-center justify-center border bg-white p-0.5", s.container, s.rounding, className)}>
        <Image src={source.logo} alt={source.institution ?? source.name} width={s.img} height={s.img} className="object-contain" />
      </div>
    )
  }

  if (source.kind === "file") {
    return (
      <div className={cn("flex shrink-0 items-center justify-center bg-muted", s.container, s.rounding, className)}>
        <FileText className="size-3.5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={cn("flex shrink-0 items-center justify-center font-bold text-white", s.container, s.rounding, s.text, source.color ?? "bg-primary", className)}>
      {getSourceInitials(source)}
    </div>
  )
}
