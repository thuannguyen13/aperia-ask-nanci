/**
 * Embed mode routing config.
 *
 * parseMode maps the ?mode= URL param to the right persona settings.
 * All demo content is imported from data/ — this file only contains logic.
 */

import type { ThemeId } from "./data/theme-logos"

export const EMBED_VARIANTS = ["clover", "business-owner", "iso", "concept-embed", "vw", "abc"] as const
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
  /**
   * Show the 22-card flow catalog as the welcome screen instead of the standard one.
   * Split from isConceptVersion because the default app now runs the concept engine
   * too (so a demo prompt on `/` plays with its panels) but keeps its own welcome.
   */
  catalog: boolean
}

export function parseMode(mode: string | null): ParsedMode {
  // Every mode is the default shape plus whatever it changes, so adding a field to
  // ParsedMode does not mean editing thirteen rows.
  const base = { isEmbed: false, embedVariant: null, isConceptVersion: false, theme: "aperia" as ThemeId, forceOnboarding: false, catalog: false }
  switch (mode) {
    case "clover":          return { ...base, isEmbed: true,  embedVariant: "clover",         theme: "clover"      }
    case "business-owner":  return { ...base, isEmbed: true,  embedVariant: "business-owner", theme: "access-one"  }
    case "iso":             return { ...base, isEmbed: true,  embedVariant: "iso"                                  }
    case "concept-embed":   return { ...base, isEmbed: true,  embedVariant: "concept-embed",  isConceptVersion: true, catalog: true }
    case "vw":              return { ...base, isEmbed: true,  embedVariant: "vw",             theme: "vision-web"  }
    // Same shape as vw — chat-only embed, Clover content underneath — but keeps the
    // default aperia (ABC Bank) theme instead of switching brand.
    case "abc":             return { ...base, isEmbed: true,  embedVariant: "abc"                                  }
    case "concept":         return { ...base, isConceptVersion: true, catalog: true }
    // Alias of `concept`, kept because the URL is already out with reviewers — the
    // hover rail it used to opt into is now how every Ask Nanci sidebar behaves.
    case "concept-nav":     return { ...base, isConceptVersion: true, catalog: true }
    // Duplicate of concept — same welcome card catalog, panel demo, everything —
    // wearing the Titan brand instead of the default aperia (ABC Bank) theme.
    case "titan":           return { ...base, isConceptVersion: true, catalog: true, theme: "titan" }
    // Embeddable counterpart to `titan`, same as concept-embed is to concept — same
    // embedVariant so &flow=<slug>&autoplay behaves identically, compact widget layout
    // included. Only the theme differs.
    case "titan-embed":     return { ...base, isEmbed: true,  embedVariant: "concept-embed",  isConceptVersion: true, catalog: true, theme: "titan" }
    case "tib":             return { ...base, theme: "tib"         }
    case "woodforest":      return { ...base, theme: "woodforest"  }
    case "placeholder":     return { ...base, theme: "placeholder" }
    // The default app, but onboarding opens every time and never records that it ran.
    case "onboarding":      return { ...base, forceOnboarding: true }
    // The default app plays scripted flows with their panels, so the Demos tab on the
    // welcome screen works in place. Not the catalog: the welcome stays the standard one.
    default:                return { ...base, isConceptVersion: true }
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
