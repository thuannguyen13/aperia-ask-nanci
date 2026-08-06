/**
 * Embed mode routing config.
 *
 * parseMode maps the ?mode= URL param to the right persona settings.
 * All demo content is imported from data/ — this file only contains logic.
 */

import type { ThemeId } from "./data/theme-logos"

export const EMBED_VARIANTS = ["clover", "business-owner", "iso", "concept-embed", "vw"] as const
export type EmbedVariant = (typeof EMBED_VARIANTS)[number]

interface ParsedMode {
  isEmbed: boolean
  embedVariant: EmbedVariant | null
  isConceptVersion: boolean
  /**
   * Sidebar behaves as a hover rail once the user asks a question, with a pin to keep
   * it open (see Sidebar). `concept-nav` is `concept` plus this one behavior change, so
   * the two URLs can be demoed side by side.
   */
  hoverNav: boolean
  /**
   * Which brand the mode wears — colors in globals.css under `[data-theme="<id>"]`,
   * logos in data/theme-logos.ts. Declared per mode rather than derived from the embed
   * variant so a non-embed mode (`tib`) can carry a brand too.
   */
  theme: ThemeId
}

export function parseMode(mode: string | null): ParsedMode {
  switch (mode) {
    case "clover":          return { isEmbed: true,  embedVariant: "clover",         isConceptVersion: false, hoverNav: false, theme: "clover"      }
    case "business-owner":  return { isEmbed: true,  embedVariant: "business-owner", isConceptVersion: false, hoverNav: false, theme: "access-one"  }
    case "iso":             return { isEmbed: true,  embedVariant: "iso",            isConceptVersion: false, hoverNav: false, theme: "aperia"      }
    case "concept-embed":   return { isEmbed: true,  embedVariant: "concept-embed",  isConceptVersion: true,  hoverNav: false, theme: "aperia"      }
    case "vw":              return { isEmbed: true,  embedVariant: "vw",             isConceptVersion: false, hoverNav: false, theme: "vision-web"  }
    case "concept":         return { isEmbed: false, embedVariant: null,             isConceptVersion: true,  hoverNav: false, theme: "aperia"      }
    case "concept-nav":     return { isEmbed: false, embedVariant: null,             isConceptVersion: true,  hoverNav: true,  theme: "aperia"      }
    case "tib":             return { isEmbed: false, embedVariant: null,             isConceptVersion: false, hoverNav: false, theme: "tib"         }
    case "woodforest":      return { isEmbed: false, embedVariant: null,             isConceptVersion: false, hoverNav: false, theme: "woodforest"  }
    default:                return { isEmbed: false, embedVariant: null,             isConceptVersion: false, hoverNav: false, theme: "aperia"      }
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
