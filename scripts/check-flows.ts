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
} from "../lib/ask-nanci/concept-config"

const errors: string[] = []
const convKeys = new Set(Object.keys(CONCEPT_SCRIPTED_CONVERSATIONS))
const mustResolve = (key: string, where: string) => {
  if (!convKeys.has(key)) errors.push(`${where}: "${key}" has no matching conversation`)
}

// Every key the registry can route to must have a conversation.
for (const f of FLOW_DEFS) {
  mustResolve(f.key, `flow ${f.num} "${f.title}"`)
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

if (errors.length) {
  console.error("✗ flow registry check failed:")
  errors.forEach((e) => console.error("  - " + e))
  process.exit(1)
}
console.log(
  `✓ flow registry OK — ${FLOW_DEFS.length} flows, ${convKeys.size} conversations, ` +
    `${slugs.length} embed entries; every routed key resolves.`,
)
