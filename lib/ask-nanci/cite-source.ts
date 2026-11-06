import type { Source } from "./types"
import { MARKETPLACE_SERVICES, toMarketplaceSource } from "./data/panels/service-marketplace"

const CARD_DATA = /^card transactions$/i

function findService(part: string) {
  return MARKETPLACE_SERVICES.find((s) => s.logo && part.startsWith(s.title))
}

// An answer that cites a marketplace source has read from it. These are the ids to
// switch on, so the composer's Sources used list shows what the answer cites.
export function listCitedServiceIds(source: string): string[] {
  return source.split(" + ").map((p) => findService(p.trim())).filter((s) => s?.isSource).map((s) => s!.id)
}

// A scripted answer names its source as text ("Resy reservations + card transactions").
// The cited-sources pill needs Source objects. A part named after a marketplace service
// becomes that service, named as the composer lists it, and "card transactions" is the
// mode's built-in data source. A string with neither stays one source, so a "+" inside a
// report name is not split. The card data leads, as the foundation leads the composer's
// sources, so both stacks read in the same order. A service is listed once, whichever
// parts of it the answer read.
export function citeSource(source: string, foundation: Source): Source[] {
  const parts = source.split(" + ").map((p) => p.trim())
  const splits = parts.length > 1 && parts.some((p) => findService(p) || CARD_DATA.test(p))
  const ordered = splits ? [...parts.filter((p) => CARD_DATA.test(p)), ...parts.filter((p) => !CARD_DATA.test(p))] : [source]
  const cited = ordered.map((part): Source => {
    if (CARD_DATA.test(part)) return foundation
    const service = findService(part)
    return service
      ? toMarketplaceSource(service)
      : { id: `cited-${part}`, name: part, kind: "file", active: true, addedAt: 0 }
  })
  return cited.filter((s, i) => cited.findIndex((t) => t.id === s.id) === i)
}
