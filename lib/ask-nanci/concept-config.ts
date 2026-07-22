// Concept demo config barrel.
// All content lives in data/flows.concept.ts.
// This file re-exports everything so existing imports don't change.

export type { FlowDef } from "./data/flows.concept"

export {
  FLOW_DEFS,
  CONCEPT_FLOW6_KEY,
  CONCEPT_FLOW8_FINAL,
  CONCEPT_FLOW12_CONTINUE_KEY,
  CONCEPT_FLOW15_FOLLOWUP,
  CONCEPT_FLOW16_FOLLOWUPS,
  CONCEPT_FAKE_FOLLOWUPS,
  CONCEPT_ALL_PROMPTS,
  CONCEPT_NO_RESET_PROMPTS,
  CONCEPT_MANUAL_PROMPTS,
  CONCEPT_SCRIPTED_CONVERSATIONS,
  CONCEPT_FLOW_SLUGS,
  CONCEPT_CHAT_TITLES,
  CONCEPT_DECLINE_REPLIES,
  CONCEPT_OFFER_NO,
} from "./data/flows.concept"

export { MERCHANT_VOLUME_DATA } from "./data/merchants"
