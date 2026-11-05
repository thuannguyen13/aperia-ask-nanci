import type { Source } from "./types"
import { MARKETPLACE_SERVICES } from "./data/panels/service-marketplace"

const CARD_DATA = /^card transactions$/i

function findService(part: string) {
  return MARKETPLACE_SERVICES.find((s) => s.logo && part.startsWith(s.title))
}

// A scripted answer names its source as text ("Resy reservations + card transactions").
// The cited-sources pill needs Source objects. A part named after a marketplace service
// carries its logo, and "card transactions" is the mode's built-in data source. A string
// with neither stays one source, so a "+" inside a report name is not split.
export function citeSource(source: string, foundation: Source): Source[] {
  const parts = source.split(" + ").map((p) => p.trim())
  const splits = parts.length > 1 && parts.some((p) => findService(p) || CARD_DATA.test(p))
  return (splits ? parts : [source]).map((part): Source => {
    if (CARD_DATA.test(part)) return foundation
    const service = findService(part)
    return service
      ? { id: `cited-${part}`, name: part, kind: "bank", institution: service.title, logo: service.logo, active: true, addedAt: 0 }
      : { id: `cited-${part}`, name: part, kind: "file", active: true, addedAt: 0 }
  })
}
