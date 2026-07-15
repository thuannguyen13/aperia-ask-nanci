import { describe, expect, it } from "vitest"
import {
  FLOW_DEFS,
  CONCEPT_SCRIPTED_CONVERSATIONS,
  CONCEPT_FAKE_FOLLOWUPS,
  CONCEPT_FLOW_SLUGS,
  CONCEPT_ALL_PROMPTS,
  CONCEPT_MANUAL_PROMPTS,
} from "../concept-config"
import type { ConceptScriptedTurn } from "../types"

const CONVERSATIONS = CONCEPT_SCRIPTED_CONVERSATIONS as Record<string, ConceptScriptedTurn[]>
const convKeys = new Set(Object.keys(CONVERSATIONS))

/**
 * How a suggestion pill routes when clicked (mirrors handlePrompt in
 * AskNanciContext): it must be a real scripted conversation, a decorative
 * fake follow-up (no-op by design), or the pending user turn of its own flow
 * (advances the active manual flow) — anything else is a dead pill.
 */
function classify(sugg: string, flowKey: string): "scripted" | "fake" | "continuation" | "dead" {
  if (convKeys.has(sugg)) return "scripted"
  if (CONCEPT_FAKE_FOLLOWUPS.has(sugg)) return "fake"
  const userTurns = new Set(CONVERSATIONS[flowKey].filter((t) => t.role === "user").map((t) => t.content))
  if (userTurns.has(sugg)) return "continuation"
  return "dead"
}

type Sugg = { flowKey: string; sugg: string; isFinalTurn: boolean }
function allSuggestions(): Sugg[] {
  const out: Sugg[] = []
  for (const [flowKey, script] of Object.entries(CONVERSATIONS)) {
    script.forEach((turn, i) => {
      if (turn.role !== "assistant" || !turn.suggestions) return
      const isFinalTurn = i === script.length - 1
      for (const sugg of turn.suggestions) out.push({ flowKey, sugg, isFinalTurn })
    })
  }
  return out
}

// ── FLOW_DEFS structural invariants (beyond check-flows: num/slug uniqueness) ─

describe("FLOW_DEFS", () => {
  it("has no duplicate conversation keys (two cards routing the same flow)", () => {
    const keys = FLOW_DEFS.map((f) => f.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it("maps every embed slug to its own flow's conversation key", () => {
    for (const f of FLOW_DEFS) {
      if (!f.slug) continue
      expect(CONCEPT_FLOW_SLUGS[f.slug]).toBe(f.key)
    }
  })

  it("excludes proactive (and internal __-keyed) flows from the trigger-prompt list", () => {
    for (const key of CONCEPT_ALL_PROMPTS) {
      expect(convKeys.has(key)).toBe(true)
      expect(key.startsWith("__")).toBe(false)
    }
    const proactiveKeys = FLOW_DEFS.filter((f) => f.proactive).map((f) => f.key)
    for (const k of proactiveKeys) expect(CONCEPT_ALL_PROMPTS).not.toContain(k)
  })
})

// ── Routing table integrity ──────────────────────────────────────────────────

describe("concept routing tables", () => {
  it("keeps fake follow-ups disjoint from real conversation keys", () => {
    // handlePrompt checks CONCEPT_FAKE_FOLLOWUPS first, so a string that was both
    // would render its real conversation permanently unreachable.
    const overlap = [...CONCEPT_FAKE_FOLLOWUPS].filter((f) => convKeys.has(f))
    expect(overlap).toEqual([])
  })

  it("leaves no orphan conversation (every scripted flow is reachable)", () => {
    const routed = new Set<string>()
    for (const f of FLOW_DEFS) {
      routed.add(f.key)
      f.followups?.forEach((k) => routed.add(k))
      f.altEntries?.forEach((e) => routed.add(e.key))
    }
    for (const script of Object.values(CONVERSATIONS)) {
      for (const turn of script) turn.suggestions?.forEach((s) => routed.add(s))
    }
    const orphans = [...convKeys].filter((k) => !routed.has(k))
    expect(orphans).toEqual([])
  })

  it("routes every manual-flow suggestion (parked pills are always clickable)", () => {
    for (const { flowKey, sugg } of allSuggestions()) {
      if (!CONCEPT_MANUAL_PROMPTS.has(flowKey)) continue
      expect(classify(sugg, flowKey), `${flowKey} → "${sugg}"`).not.toBe("dead")
    }
  })

  it("routes every end-of-flow (final-turn) suggestion pill", () => {
    for (const { flowKey, sugg, isFinalTurn } of allSuggestions()) {
      if (!isFinalTurn) continue
      expect(classify(sugg, flowKey), `${flowKey} → "${sugg}"`).not.toBe("dead")
    }
  })

  it("has no dead pills — every suggestion routes, is a known fake follow-up, or continues the flow", () => {
    // The two proactive-flow "road not taken" pills are now registered fake follow-ups,
    // so nothing should fall through to sendMessage. Any new dead pill fails here.
    const dead = allSuggestions().filter((s) => classify(s.sugg, s.flowKey) === "dead")
    expect(dead.map((d) => `${d.flowKey} → "${d.sugg}"`)).toEqual([])
  })
})
