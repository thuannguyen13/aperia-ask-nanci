import { describe, expect, it } from "vitest"
import {
  FLOW_DEFS,
  CONCEPT_SCRIPTED_CONVERSATIONS,
  CONCEPT_FAKE_FOLLOWUPS,
  CONCEPT_FLOW_SLUGS,
  CONCEPT_ALL_PROMPTS,
  CONCEPT_MANUAL_PROMPTS,
  promptsInScope,
} from "./flows.concept"
import { NO_SHOW_TOTALS, NO_SHOW_CHART, CHECK_PER_COVER } from "./panels/resy-no-shows"
import { REPORT_COVERS, REPORT_SALES, REPORT_PER_COVER, RESY_PER_COVER } from "./panels/resy-service-day"
import { formatCurrency, formatWholeCurrency } from "../../../components/shared/format"
import { RISK_QUICK_ACTIONS, RISK_NANCI_TAKES } from "./risk-landing"
import { RISK_SUGGESTION_DESTS, DETECTION_QUEUE_PROMPT } from "./risk-conversations"
import type { ConceptScriptedTurn } from "../types"

const CONVERSATIONS = CONCEPT_SCRIPTED_CONVERSATIONS as Record<string, ConceptScriptedTurn[]>
const convKeys = new Set(Object.keys(CONVERSATIONS))

/**
 * How a suggestion pill routes when clicked (mirrors handlePrompt in
 * AskNanciContext): it must be a real scripted conversation, a registered
 * navigating pill (goes to a destination instead of answering), a decorative
 * fake follow-up (no-op by design), or the pending user turn of its own flow
 * (advances the active manual flow) — anything else is a dead pill.
 */
function classify(sugg: string, flowKey: string): "scripted" | "navigate" | "fake" | "continuation" | "dead" {
  if (convKeys.has(sugg)) return "scripted"
  if (sugg in RISK_SUGGESTION_DESTS) return "navigate"
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
    // Risk conversations are spread into CONCEPT_SCRIPTED_CONVERSATIONS but reached
    // from the risk landing's own surfaces, not from FLOW_DEFS or suggestion pills.
    RISK_QUICK_ACTIONS.forEach((a) => routed.add(a.prompt))
    RISK_NANCI_TAKES.forEach((t) => routed.add(t.prompt))
    // Summoned from the Detection Queue header, so its only entry point is a
    // component prop (DetectionQueueInsightPanel) rather than a data file.
    routed.add(DETECTION_QUEUE_PROMPT)
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

// ── Scope: Resy content stays in resy mode, and resy mode shows nothing else ──

const flowKey = (num: number) => FLOW_DEFS.find((f) => f.num === num)!.key
const RESY_KEYS = FLOW_DEFS.filter((f) => f.scope === "resy").map((f) => f.key)
const answers = (num: number) => CONVERSATIONS[flowKey(num)].filter((t) => t.role === "assistant").map((t) => t.content)

describe("promptsInScope", () => {
  it("leaves the Resy flows out of the unscoped demo", () => {
    const unscoped = promptsInScope(null, { followups: true })
    for (const k of RESY_KEYS) expect(unscoped).not.toContain(k)
  })

  it("is exactly flows 25 and 26 in resy mode", () => {
    expect(promptsInScope("resy")).toEqual([flowKey(25), flowKey(26)])
  })

  it("adds each flow's followups after its own prompt", () => {
    const withFollowups = promptsInScope("resy", { followups: true })
    const flow25 = FLOW_DEFS.find((f) => f.num === 25)!
    expect(withFollowups.slice(0, 1 + (flow25.followups?.length ?? 0))).toEqual([flow25.key, ...(flow25.followups ?? [])])
  })
})

describe("flow 17 sibling chips", () => {
  it("suggest no Resy flow", () => {
    const script = CONVERSATIONS[flowKey(17)]
    const chips = script[script.length - 1].suggestions ?? []
    expect(chips.length).toBeGreaterThan(0)
    for (const k of RESY_KEYS) expect(chips).not.toContain(k)
  })
})

describe("Resy figures in chat match their panels", () => {
  it("flow 25 states the no-show totals the panel adds up", () => {
    const [lost, fees] = NO_SHOW_CHART.datasets.map((s) => s.data.reduce((a, b) => a + b, 0))
    expect(lost).toBe(NO_SHOW_TOTALS.lostRevenue)
    expect(fees).toBe(NO_SHOW_TOTALS.feesCharged)
    const first = answers(25)[0]
    for (const figure of [formatWholeCurrency(NO_SHOW_TOTALS.lostRevenue), formatWholeCurrency(NO_SHOW_TOTALS.feesCharged), formatWholeCurrency(CHECK_PER_COVER), `${NO_SHOW_TOTALS.parties} Resy bookings`, `${NO_SHOW_TOTALS.seats} seats`]) {
      expect(first).toContain(figure)
    }
  })

  it("flow 26 ends on the report's covers, sales and per-cover figures", () => {
    const last = answers(26).at(-1)!
    for (const figure of [`${REPORT_COVERS} covers`, formatWholeCurrency(REPORT_SALES), formatCurrency(REPORT_PER_COVER), formatCurrency(RESY_PER_COVER)]) {
      expect(last).toContain(figure)
    }
  })

  it("flow 25 plays 3 answers with its deposit followup, and flow 26 plays 5", () => {
    const flow25 = FLOW_DEFS.find((f) => f.num === 25)!
    const followupAnswers = (flow25.followups ?? []).flatMap((k) => CONVERSATIONS[k].filter((t) => t.role === "assistant"))
    expect(answers(25).length + followupAnswers.length).toBe(3)
    expect(answers(26)).toHaveLength(5)
  })
})
