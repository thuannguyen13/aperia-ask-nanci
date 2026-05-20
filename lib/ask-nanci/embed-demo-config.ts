/**
 * Static configuration for the embed demo variants (?embed=clover, ?embed=business-owner).
 *
 * This file has no real backend counterpart — it exists only to drive the
 * interactive sales demo. It is the ONE place outside api.ts that may reference
 * demo-specific data. Context and embed components import from here, not from
 * mock-data directly.
 */

export const EMBED_VARIANTS = ["clover", "business-owner", "iso"] as const
export type EmbedVariant = (typeof EMBED_VARIANTS)[number]

export function isEmbedVariant(v: string | null): v is EmbedVariant {
  return EMBED_VARIANTS.includes(v as EmbedVariant)
}

import type { Source } from "./types"
import { CLOVER_SOURCE, CLOVER_SOURCE_ID } from "./sourceStore"

export { SCRIPTED_CONVERSATIONS } from "./mock-data"
export type { ScriptedTurn } from "./mock-data"

const ACCESS_ONE_SOURCE: Source = {
  id: CLOVER_SOURCE_ID,
  name: "AccessOne",
  kind: "bank",
  institution: "AccessOne Data",
  logo: "/accessOne-logo.svg",
  active: true,
  addedAt: 0,
}

const APERIA_SOURCE: Source = {
  id: CLOVER_SOURCE_ID,
  name: "Aperia",
  kind: "bank",
  institution: "Aperia Data",
  logo: "/logo-aperia.svg",
  active: true,
  addedAt: 0,
}

export const EMBED_DEMO_SOURCES: Source[] = [
  CLOVER_SOURCE,
  { id: "demo-qb",    name: "Walker's Business Books",        kind: "bank", institution: "QuickBooks",       color: "bg-green-600",  initials: "QB", logo: "/fi/quickbook.svg",  active: true, addedAt: 0 },
  { id: "demo-chase", name: "Chase Business Checking ••4892", kind: "bank", institution: "Chase",            color: "bg-blue-700",   initials: "CH", logo: "/fi/chase.png",      active: true, addedAt: 0 },
  { id: "demo-bofa",  name: "BofA Savings ••2341",            kind: "bank", institution: "Bank of America",  color: "bg-red-600",    initials: "BA", logo: "/fi/bofa.png",       active: true, addedAt: 0 },
  { id: "demo-wf",    name: "Wells Fargo Business ••7823",    kind: "bank", institution: "Wells Fargo",      color: "bg-yellow-600", initials: "WF", logo: "/fi/wellsfargo.png", active: true, addedAt: 0 },
  { id: "demo-amex",  name: "Amex Business Gold ••5561",      kind: "bank", institution: "American Express", color: "bg-sky-600",    initials: "AX", logo: "/fi/amex.svg",       active: true, addedAt: 0 },
]

export const EMBED_ISO_DEMO_SOURCES: Source[] = EMBED_DEMO_SOURCES.map((s) =>
  s.id === CLOVER_SOURCE_ID ? APERIA_SOURCE : s
)

export const EMBED_BUSINESS_OWNER_DEMO_SOURCES: Source[] = EMBED_DEMO_SOURCES.map((s) =>
  s.id === CLOVER_SOURCE_ID ? ACCESS_ONE_SOURCE : s
)
