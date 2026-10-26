/**
 * Every localStorage key the demo writes, in one place.
 *
 * They used to be spread across three modules — the onboarding flag lived in the
 * *sources* store, the tour keys in a component — and the e2e specs retyped the
 * literals, so adding the product tour silently broke five specs: they cleared
 * onboarding but not the tour, and its dialog blocked every click.
 *
 * Import from here rather than retyping a string, specs included.
 */
export const ONBOARDING_KEY = "ask_nanci_onboarded"
export const TOUR_DONE_KEY = "ask_nanci_tour_done"
export const TOUR_STEP_KEY = "ask_nanci_tour_step"
// Note the two prefixes: `ask_nanci_*` and `asknanci_*`. The inconsistency is
// load-bearing — these are live in browsers that have already run the demo, so
// renaming one orphans that browser's state.
export const SOURCES_KEY = "asknanci_sources"
export const SESSIONS_KEY = "asknanci_chats"
// Which Marketplace listings are on, and which connected sources are switched off.
export const MARKETPLACE_ENABLED_KEY = "ask_nanci_marketplace_on"
export const MARKETPLACE_MUTED_KEY = "ask_nanci_marketplace_muted"

/** Everything a test or a reset must clear to reach an untouched first-run state. */
export const ALL_STORAGE_KEYS = [
  ONBOARDING_KEY,
  TOUR_DONE_KEY,
  TOUR_STEP_KEY,
  SOURCES_KEY,
  SESSIONS_KEY,
  MARKETPLACE_ENABLED_KEY,
  MARKETPLACE_MUTED_KEY,
] as const
