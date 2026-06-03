// Concept demo config barrel.
// All content lives in data/flows.concept.ts.
// This file re-exports everything so existing imports don't change.

export type { ConceptScriptedTurn } from "./types"

export {
  CONCEPT_FLOW2_PROMPT,
  CONCEPT_FLOW2_FOLLOWUP,
  CONCEPT_FLOW6_KEY,
  CONCEPT_WELCOME_KEY,
  CONCEPT_DETECT_WELCOME_KEY,
  CONCEPT_DETECT_DQ_KEY,
  CONCEPT_FLOW8_FOLLOWUP,
  CONCEPT_FLOW8_FINAL,
  CONCEPT_FLOW10_FOLLOWUP,
  CONCEPT_FLOW10_FOLLOWUP2,
  CONCEPT_FLOW11_QUICKWINS,
  CONCEPT_FLOW11_APPROVE,
  CONCEPT_FLOW12_PROMPT,
  CONCEPT_FLOW12_CONTINUE_KEY,
  CONCEPT_ALL_PROMPTS,
  CONCEPT_NO_RESET_PROMPTS,
  CONCEPT_SCRIPTED_CONVERSATIONS,
  CONCEPT_FLOW_SLUGS,
} from "./data/flows.concept"

export { MERCHANT_VOLUME_DATA } from "./data/merchants"
export type { MerchantVolumeRow } from "./data/merchants"
