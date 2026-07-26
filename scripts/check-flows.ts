/**
 * Concept-flow registry invariant check.
 *
 * Run: `npm run check:flows`. Fails (exit 1) if the flow registry is internally
 * inconsistent — the cheap guard that catches a half-wired flow before it ships.
 * Validates data only (no React), so it runs in plain node via tsx.
 */
import {
  FLOW_DEFS,
  CONCEPT_SCRIPTED_CONVERSATIONS,
  CONCEPT_FLOW_SLUGS,
  CONCEPT_ALL_PROMPTS,
  CONCEPT_NO_RESET_PROMPTS,
} from "../lib/ask-nanci/data/flows.concept"
import { CONCEPT_EMBED_FLOW_LAYOUTS } from "../lib/ask-nanci/embed-demo-config"

const errors: string[] = []
const convKeys = new Set(Object.keys(CONCEPT_SCRIPTED_CONVERSATIONS))
const mustResolve = (key: string, where: string) => {
  if (!convKeys.has(key)) errors.push(`${where}: "${key}" has no matching conversation`)
}

// Every key the registry can route to must have a conversation. A destination flow is
// the exception: it opens a surface instead of playing a script, so its `key` is an
// internal id (see FlowDef.destination) with no conversation behind it.
for (const f of FLOW_DEFS) {
  if (!f.destination) mustResolve(f.key, `flow ${f.num} "${f.title}"`)
  f.altEntries?.forEach((e) => mustResolve(e.key, `flow ${f.num} altEntry (slug ${e.slug})`))
  f.followups?.forEach((k) => mustResolve(k, `flow ${f.num} followup`))
}
Object.entries(CONCEPT_FLOW_SLUGS).forEach(([slug, key]) => mustResolve(key, `slug "${slug}"`))
CONCEPT_ALL_PROMPTS.forEach((k) => mustResolve(k, "CONCEPT_ALL_PROMPTS"))
CONCEPT_NO_RESET_PROMPTS.forEach((k) => mustResolve(k, "CONCEPT_NO_RESET_PROMPTS"))

// Uniqueness: display numbers and embed slugs must not collide.
const nums = FLOW_DEFS.map((f) => f.num)
if (new Set(nums).size !== nums.length) errors.push("duplicate FLOW_DEFS `num`")
const slugs = FLOW_DEFS.flatMap((f) => [...(f.slug ? [f.slug] : []), ...(f.altEntries?.map((e) => e.slug) ?? [])])
if (new Set(slugs).size !== slugs.length) errors.push("duplicate embed slug")

// A flow's own slug must equal its card number, so `?flow=N` always opens card N.
// Escalation shipped as slug "9" on card 17 and silently opened the wrong card until
// 662c9bc. `altEntries` are exempt by design — they are deliberate alternate entries
// into another flow (e.g. slug "11" enters card 12's Detection Queue).
for (const f of FLOW_DEFS) {
  if (f.slug && f.slug !== String(f.num)) {
    errors.push(`flow ${f.num} "${f.title}": slug "${f.slug}" does not match its num`)
  }
}

// Every embed layout override must be reachable. The lookup keys off the raw ?flow=
// param, so a key is valid if it is a real slug OR a destination flow's num (which has
// no slug because it opens a surface instead of playing a script). A key that is
// neither is dead config that looks live.
const slugSet = new Set(slugs)
const destinationNums = new Set(FLOW_DEFS.filter((f) => f.destination).map((f) => String(f.num)))
for (const key of Object.keys(CONCEPT_EMBED_FLOW_LAYOUTS)) {
  if (!slugSet.has(key) && !destinationNums.has(key)) {
    errors.push(`CONCEPT_EMBED_FLOW_LAYOUTS["${key}"]: no slug or destination flow — ?flow=${key} is unreachable`)
  }
}

if (errors.length) {
  console.error("✗ flow registry check failed:")
  errors.forEach((e) => console.error("  - " + e))
  process.exit(1)
}
console.log(
  `✓ flow registry OK — ${FLOW_DEFS.length} flows, ${convKeys.size} conversations, ` +
    `${slugs.length} embed entries; every routed key resolves.`,
)
