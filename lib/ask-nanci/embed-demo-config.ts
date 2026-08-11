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
   * Which brand the mode wears — colors in globals.css under `[data-theme="<id>"]`,
   * logos in data/theme-logos.ts. Declared per mode rather than derived from the embed
   * variant so a non-embed mode (`tib`) can carry a brand too.
   */
  theme: ThemeId
  /**
   * Open onboarding on every load, ignoring the `ask_nanci_onboarded` flag — and do
   * not write that flag when the wizard finishes. Demoing onboarding otherwise means
   * clearing localStorage by hand before each run, and it can only be shown once per
   * browser. A field on the mode rather than a separate `?onboarding` param so it
   * reads the same way as every other surface here.
   */
  forceOnboarding: boolean
}

export function parseMode(mode: string | null): ParsedMode {
  // Every mode is the default shape plus whatever it changes, so adding a field to
  // ParsedMode does not mean editing thirteen rows.
  const base = { isEmbed: false, embedVariant: null, isConceptVersion: false, theme: "aperia" as ThemeId, forceOnboarding: false }
  switch (mode) {
    case "clover":          return { ...base, isEmbed: true,  embedVariant: "clover",         theme: "clover"      }
    case "business-owner":  return { ...base, isEmbed: true,  embedVariant: "business-owner", theme: "access-one"  }
    case "iso":             return { ...base, isEmbed: true,  embedVariant: "iso"                                  }
    case "concept-embed":   return { ...base, isEmbed: true,  embedVariant: "concept-embed",  isConceptVersion: true }
    case "vw":              return { ...base, isEmbed: true,  embedVariant: "vw",             theme: "vision-web"  }
    case "concept":         return { ...base, isConceptVersion: true }
    // Alias of `concept`, kept because the URL is already out with reviewers — the
    // hover rail it used to opt into is now how every Ask Nanci sidebar behaves.
    case "concept-nav":     return { ...base, isConceptVersion: true }
    case "tib":             return { ...base, theme: "tib"         }
    case "woodforest":      return { ...base, theme: "woodforest"  }
    case "placeholder":     return { ...base, theme: "placeholder" }
    // The default app, but onboarding opens every time and never records that it ran.
    case "onboarding":      return { ...base, forceOnboarding: true }
    default:                return base
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
