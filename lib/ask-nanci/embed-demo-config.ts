/**
 * Embed mode routing config.
 *
 * parseMode maps the ?mode= URL param to the right persona settings.
 * All demo content is imported from data/ — this file only contains logic.
 */

export const EMBED_VARIANTS = ["clover", "business-owner", "iso", "concept-embed", "vw"] as const
export type EmbedVariant = (typeof EMBED_VARIANTS)[number]

interface ParsedMode {
  isEmbed: boolean
  embedVariant: EmbedVariant | null
  isConceptVersion: boolean
}

export function parseMode(mode: string | null): ParsedMode {
  switch (mode) {
    case "clover":          return { isEmbed: true,  embedVariant: "clover",         isConceptVersion: false }
    case "business-owner":  return { isEmbed: true,  embedVariant: "business-owner", isConceptVersion: false }
    case "iso":             return { isEmbed: true,  embedVariant: "iso",            isConceptVersion: false }
    case "concept-embed":   return { isEmbed: true,  embedVariant: "concept-embed",  isConceptVersion: true  }
    case "vw":              return { isEmbed: true,  embedVariant: "vw",             isConceptVersion: false }
    case "concept":         return { isEmbed: false, embedVariant: null,             isConceptVersion: true  }
    default:                return { isEmbed: false, embedVariant: null,             isConceptVersion: false }
  }
}

import { CLOVER_CONVERSATIONS } from "./data/flows.clover"
import { ISO_SCRIPTED_CONVERSATIONS } from "./data/flows.iso"

// Merged conversation map used by the embed context (clover + ISO prompts in one Record).
export const SCRIPTED_CONVERSATIONS = { ...CLOVER_CONVERSATIONS, ...ISO_SCRIPTED_CONVERSATIONS }

export { ISO_PROMPT_CATEGORIES } from "./data/prompts.iso"
export { BUSINESS_OWNER_PROMPT_CATEGORIES } from "./data/prompts.clover"
export { VARIANT_CONTENT_OVERRIDES } from "./data/overrides"
export { EMBED_DEMO_SOURCES, EMBED_ISO_DEMO_SOURCES, EMBED_BUSINESS_OWNER_DEMO_SOURCES, EMBED_VW_DEMO_SOURCES } from "./data/sources"
export { CONCEPT_FLOW_SLUGS, CONCEPT_EMBED_FLOW_LAYOUTS } from "./data/flows.concept"
