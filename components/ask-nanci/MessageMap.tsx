"use client"

import type { MapWidget } from "@/lib/ask-nanci/types"
import { MapPin } from "lucide-react"

export function MessageMap({ map }: { map: MapWidget }) {
  const { address, lat, lng } = map
  const delta = 0.004
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="mt-3 overflow-hidden rounded-xl border bg-muted/30">
      <iframe
        src={src}
        title="Map"
        className="h-48 w-full border-0"
        loading="lazy"
      />
      <div className="flex items-center gap-1.5 px-3 py-2">
        <MapPin className="size-3.5 shrink-0 text-primary" />
        <span className="text-xs text-muted-foreground">{address}</span>
      </div>
    </div>
  )
}
