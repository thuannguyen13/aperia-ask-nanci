import { describe, expect, it } from "vitest"
import {
  FLOW_DEFS,
  CONCEPT_SCRIPTED_CONVERSATIONS,
  CONCEPT_FAKE_FOLLOWUPS,
  CONCEPT_FLOW_SLUGS,
  CONCEPT_ALL_PROMPTS,
  CONCEPT_MANUAL_PROMPTS,
  promptsInScope,
  CONCEPT_FLOW28_SEND,
  isAwaitingFlow28Send,
  CONCEPT_FLOW29_MOVE,
  CONCEPT_FLOW29_OPEN,
  isAwaitingFlow29Move,
  isAwaitingFlow29Open,
} from "./flows.concept"
import { CARD_PER_COVER, FEES_CHARGED, NO_SHOW_COST } from "./panels/resy-group"
import { BOOK_COVERS, BOOK_PARTIES, BOOK_PEAK, UNCONFIRMED_COVERS, coversWithReply, WAITING_GUESTS, WAIT_SUMMARY, LEFT_QUOTES } from "./panels/resy-tonight"
import { PACING_CHECK, NOTIFY_PARTIES, NOTIFY_GUESTS, REBOOK, FOUR_TOP_SEAT_HOUR, HELD_SEAT_HOUR, AVAILABILITY, POST_OPEN } from "./panels/resy-friday"
import { MARKETPLACE_SERVICES } from "./panels/service-marketplace"
import { formatWholeCurrency } from "../../../components/shared/format"
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

describe("promptsInScope", () => {
  it("leaves the Resy flows out of the unscoped demo", () => {
    const unscoped = promptsInScope(null, { followups: true })
    for (const k of RESY_KEYS) expect(unscoped).not.toContain(k)
  })

  it("is exactly flows 28, 29 and 30 in resy mode", () => {
    expect(promptsInScope("resy")).toEqual([flowKey(28), flowKey(29), flowKey(30)])
  })

  it("adds each flow's followups after its own prompt", () => {
    const withFollowups = promptsInScope(null, { followups: true })
    const withFollowupsFlow = FLOW_DEFS.find((f) => f.followups?.length && !f.scope && !f.destination && !f.proactive)!
    const at = withFollowups.indexOf(withFollowupsFlow.key)
    expect(withFollowups.slice(at, at + 1 + withFollowupsFlow.followups!.length)).toEqual([withFollowupsFlow.key, ...withFollowupsFlow.followups!])
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

// ── Flow 28: Tonight's service ──

const answers = (num: number) => CONVERSATIONS[flowKey(num)].filter((t) => t.role === "assistant").map((t) => t.content)

describe("flow 28, tonight's service", () => {
  const flow28 = FLOW_DEFS.find((f) => f.num === 28)!
  const script = CONVERSATIONS[flow28.key]

  it("is a manual merchant flow in resy scope, left out of the unscoped demo", () => {
    expect(flow28).toMatchObject({ section: "merchant", scope: "resy", slug: "28" })
    expect(CONCEPT_MANUAL_PROMPTS.has(flow28.key)).toBe(true)
    expect(promptsInScope(null, { followups: true })).not.toContain(flow28.key)
  })

  it("plays four questions and four answers, the third question being the confirm step", () => {
    expect(script.map((t) => t.role)).toEqual(["user", "assistant", "user", "assistant", "user", "assistant", "user", "assistant"])
    expect(script[4].content).toBe(CONCEPT_FLOW28_SEND)
  })

  it("flips the confirm panel to its sent view only on the answer to Send it", () => {
    expect(script[3]).toMatchObject({ panel: "resy-confirm" })
    expect(script[3].view).toBeUndefined()
    expect(script[5]).toMatchObject({ panel: "resy-confirm", view: "sent" })
  })

  it("quotes the figures the panels render", () => {
    const [book, unconfirmed, replies, wait] = answers(28)
    for (const figure of [`${BOOK_COVERS} covers`, `${BOOK_PARTIES} parties`, `${BOOK_PEAK.time} with ${BOOK_PEAK.covers}`]) expect(book).toContain(figure)
    for (const figure of [`${UNCONFIRMED_COVERS} covers`, formatWholeCurrency(NO_SHOW_COST), formatWholeCurrency(CARD_PER_COVER), formatWholeCurrency(FEES_CHARGED), "yesterday's 4pm confirmation text"]) expect(unconfirmed).toContain(figure)
    for (const figure of ["Five have confirmed", `${coversWithReply("confirmed")} covers`, "Resy has alerted your Notify list"]) expect(replies).toContain(figure)
    for (const figure of [`${WAITING_GUESTS} guests`, `${WAIT_SUMMARY.avgWaited} minutes against ${WAIT_SUMMARY.avgQuoted} quoted`, LEFT_QUOTES.join(" and ")]) expect(wait).toContain(figure)
  })

  it("waits on Send it only while idle with the offer as the last message", () => {
    const offer = { role: "assistant", content: script[3].content }
    const opening = [{ role: "user", content: flow28.key }, { role: "assistant", content: script[1].content }, { role: "user", content: script[2].content }]
    expect(isAwaitingFlow28Send([...opening, offer], "idle")).toBe(true)
    expect(isAwaitingFlow28Send([...opening, offer], "streaming")).toBe(false)
    expect(isAwaitingFlow28Send([...opening, { role: "assistant", content: script[3].content.slice(0, 40) }], "idle")).toBe(false)
    expect(isAwaitingFlow28Send([...opening, offer, { role: "user", content: "what is the weather like" }, { role: "assistant", content: "Sunny." }], "idle")).toBe(false)
    expect(isAwaitingFlow28Send([...opening, offer, { role: "user", content: CONCEPT_FLOW28_SEND }, { role: "assistant", content: script[5].content }], "idle")).toBe(false)
    expect(isAwaitingFlow28Send([], "idle")).toBe(false)
  })

  it("never says holds, settled or Card Members", () => {
    for (const text of answers(28)) {
      expect(text).not.toMatch(/Card Member/)
      expect(text).not.toMatch(/\bholds?\b/i)
      expect(text).not.toMatch(/settled/)
    }
  })
})

// ── Flow 29: Filling the book ──

describe("flow 29, filling the book", () => {
  const flow29 = FLOW_DEFS.find((f) => f.num === 29)!
  const script = CONVERSATIONS[flow29.key]
  const [move, moved, notify, open, opened] = answers(29)

  it("is a manual merchant flow in resy scope, left out of the unscoped demo", () => {
    expect(flow29).toMatchObject({ section: "merchant", scope: "resy", slug: "29", badge: "Resy", title: "Filling the book" })
    expect(CONCEPT_MANUAL_PROMPTS.has(flow29.key)).toBe(true)
    expect(promptsInScope(null, { followups: true })).not.toContain(flow29.key)
  })

  it("plays five questions and five answers, the second and fifth questions being the confirm steps", () => {
    expect(script.map((t) => t.role)).toEqual(["user", "assistant", "user", "assistant", "user", "assistant", "user", "assistant", "user", "assistant"])
    expect(script[0].content).toBe("The Marsh party of 6 on Friday wants 7:30 instead of 8. Can we do it?")
    expect(script[2].content).toBe(CONCEPT_FLOW29_MOVE)
    expect(script[4].content).toBe("Who's on Notify for Friday?")
    expect(script[6].content).toBe("Open two more 8pm tables Friday.")
    expect(script[8].content).toBe(CONCEPT_FLOW29_OPEN)
    expect([CONCEPT_FLOW29_MOVE, CONCEPT_FLOW29_OPEN]).toEqual(["Do it.", "Go ahead."])
  })

  it("opens each panel without a view and flips it to done only on the answer to its confirm", () => {
    expect(script[1]).toMatchObject({ panel: "resy-change", closePanel: "resy-availability", revealPanel: true, source: "Resy reservations" })
    expect(script[3]).toMatchObject({ panel: "resy-change", view: "done", source: "Resy reservations" })
    expect(script[5]).toMatchObject({ panel: "resy-notify", closePanel: "resy-change", source: "Resy Notify + card transactions" })
    expect(script[5].revealPanel).toBeUndefined()
    expect(script[7]).toMatchObject({ panel: "resy-availability", closePanel: "resy-notify", revealPanel: true, source: "Resy timing + card transactions" })
    expect(script[9]).toMatchObject({ panel: "resy-availability", view: "done", source: "Resy reservations + card transactions" })
    for (const i of [1, 5, 7]) expect(script[i].view).toBeUndefined()
  })

  it("quotes the figures the panels render", () => {
    expect(move).toContain(`${PACING_CHECK.before} of ${PACING_CHECK.cap}`)
    expect(PACING_CHECK.before).toBe(26)
    for (const figure of [`${NOTIFY_PARTIES} parties`, `${NOTIFY_GUESTS} guests`, `${REBOOK.minutes} minutes`, formatWholeCurrency(REBOOK.value)]) expect(notify).toContain(figure)
    for (const figure of ["37 parties", "105 guests", "11 minutes", "$440"]) expect(notify).toContain(figure)
    for (const figure of [formatWholeCurrency(FOUR_TOP_SEAT_HOUR), formatWholeCurrency(Math.round(HELD_SEAT_HOUR)), `${AVAILABILITY.pacing.before} to ${AVAILABILITY.pacing.after}`]) expect(open).toContain(figure)
    for (const figure of ["$44", "$27", "16 to 24"]) expect(open).toContain(figure)
    expect(opened).toContain(formatWholeCurrency(POST_OPEN.value))
    expect(opened).toContain("$320")
    expect(moved).toContain("Resy will send them the updated booking")
  })

  it("names both changes after card fees and credits Resy for every Notify alert", () => {
    for (const phrase of ["after card fees", "T21 and T22", "16 to 24"]) expect(open).toContain(phrase)
    expect(opened).toContain("Notify alerted")
    for (const text of answers(29)) expect(text).not.toMatch(/\bI offered\b/)
  })

  it("never says holds, settled or Card Members", () => {
    for (const text of answers(29)) {
      expect(text).not.toMatch(/Card Member/)
      expect(text).not.toMatch(/\bholds?\b/i)
      expect(text).not.toMatch(/settled/)
    }
  })

  it("waits on each confirm only while idle with its own offer as the last message", () => {
    const opening = [{ role: "user", content: flow29.key }]
    const moveOffer = { role: "assistant", content: move }
    const openOffer = { role: "assistant", content: open }
    expect(isAwaitingFlow29Move([...opening, moveOffer], "idle")).toBe(true)
    expect(isAwaitingFlow29Move([...opening, moveOffer], "streaming")).toBe(false)
    expect(isAwaitingFlow29Move([...opening, moveOffer, { role: "user", content: CONCEPT_FLOW29_MOVE }, { role: "assistant", content: moved }], "idle")).toBe(false)
    expect(isAwaitingFlow29Open([openOffer], "idle")).toBe(true)
    expect(isAwaitingFlow29Open([openOffer, { role: "user", content: "what is the weather like" }, { role: "assistant", content: "Sunny." }], "idle")).toBe(false)
    expect(isAwaitingFlow29Move([openOffer], "idle")).toBe(false)
    expect(isAwaitingFlow29Open([...opening, moveOffer], "idle")).toBe(false)
  })
})

describe("Resy Marketplace listing", () => {
  const resy = MARKETPLACE_SERVICES.find((s) => s.id === "resy")!

  it("links flows 28, 29 and 30", () => {
    expect(resy.connected?.flowSlugs).toEqual(["28", "29", "30"])
  })

  it("promises nothing the Resy flows do not show, and names no card brand", () => {
    const text = [resy.description, resy.overview, resy.connected?.message, ...(resy.highlights ?? []), ...(resy.sections ?? []).map((s) => s.body)].join(" ")
    expect(text).not.toMatch(/deposit polic|end-of-night|per cover|Amex|Card Member/i)
  })

  it("names every action the Resy flows take, and asks before each", () => {
    const canDo = resy.sections?.find((s) => s.title === "What Nanci can do")?.body ?? ""
    for (const action of ["confirmation follow-up", "move a booking", "change availability", "tags and notes", "guest emails", "Nanci asks before every change"]) expect(canDo).toContain(action)
    expect(resy.highlights).toContain("Move bookings and open tables, with your OK")
    expect(resy.highlights).toContain("Guest profiles with tags, notes and the cards guests pay with")
    expect(resy.highlights).toContain("Tags, notes and thank-you emails drafted for your OK")
  })
})
