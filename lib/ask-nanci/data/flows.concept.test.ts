import { readFileSync } from "node:fs"
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
  CONCEPT_FLOW30_TAG,
  CONCEPT_FLOW30_SEND,
  isAwaitingFlow30Tag,
  isAwaitingFlow30Send,
  CONCEPT_FLOW31_CHARGE,
  isAwaitingFlow31Charge,
} from "./flows.concept"
import { CARD_PER_COVER, FEES_CHARGED, NO_SHOW_COST } from "./panels/resy-group"
import { BOOK_COVERS, BOOK_PARTIES, BOOK_PEAK, UNCONFIRMED_COVERS, coversWithReply, WAITING_GUESTS, WAIT_SUMMARY, LEFT_QUOTES } from "./panels/resy-tonight"
import { THANK_YOU_EMAIL } from "./panels/resy-guests"
import { NO_SHOW_FEE, FEES_AFTER_CHARGE, WINE_DINNER, EVENT_TOTALS, NIGHT_SPEND_PER_GUEST } from "./panels/resy-deposits"
import { PACING_CHECK, NOTIFY_PARTIES, NOTIFY_GUESTS, REBOOK, FOUR_TOP_SEAT_HOUR, HELD_SEAT_HOUR, AVAILABILITY, POST_OPEN } from "./panels/resy-friday"
import { MARKETPLACE_SERVICES } from "./panels/service-marketplace"
import { WEEK_REPORT, SURVEY_SUMMARY, VENUES, LOCATIONS_WINDOW } from "./panels/resy-reports"
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

  it("is exactly flows 28 to 32 in resy mode", () => {
    expect(promptsInScope("resy")).toEqual([flowKey(28), flowKey(29), flowKey(30), flowKey(31), flowKey(32)])
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

// ── Flow 30: Know your guests ──

describe("flow 30, know your guests", () => {
  const flow30 = FLOW_DEFS.find((f) => f.num === 30)!
  const script = CONVERSATIONS[flow30.key]
  const [profile, tagOffer, tagged, sendOffer, sent] = answers(30)

  it("is a manual merchant flow in resy scope, left out of the unscoped demo", () => {
    expect(flow30).toMatchObject({ section: "merchant", scope: "resy", slug: "30", badge: "Resy", title: "Know your guests" })
    expect(CONCEPT_MANUAL_PROMPTS.has(flow30.key)).toBe(true)
    expect(promptsInScope(null, { followups: true })).not.toContain(flow30.key)
  })

  it("takes five user turns, confirming with Yes. and Send.", () => {
    expect(script.map((t) => t.role)).toEqual(Array.from({ length: 10 }, (_, i) => (i % 2 ? "assistant" : "user")))
    expect(script[0].content).toBe("Tell me about the guest at 8:15 tonight.")
    expect(script[2].content).toBe("Tag him as a regular, and note his wife's shellfish allergy.")
    expect(script[4].content).toBe(CONCEPT_FLOW30_TAG)
    expect(script[6].content).toBe("Thank everyone who celebrated an anniversary with us in September.")
    expect(script[8].content).toBe(CONCEPT_FLOW30_SEND)
    expect([CONCEPT_FLOW30_TAG, CONCEPT_FLOW30_SEND]).toEqual(["Yes.", "Send."])
  })

  it("opens the profile, proposes on it, marks it done, then opens and sends the email", () => {
    expect(script[1]).toMatchObject({ panel: "resy-guest", closePanel: "resy-outreach", source: "Resy guestbook + card transactions" })
    // Only steps whose panel holds a confirm raise the phone sheet.
    expect(script[1].view).toBeUndefined()
    expect(script[1].revealPanel).toBeUndefined()
    expect(script[3]).toMatchObject({ panel: "resy-guest", view: "proposed", revealPanel: true, source: "Resy guestbook" })
    expect(script[5]).toMatchObject({ panel: "resy-guest", view: "done", source: "Resy guestbook" })
    expect(script[7]).toMatchObject({ panel: "resy-outreach", closePanel: "resy-guest", revealPanel: true, source: "Resy guestbook + card transactions" })
    expect(script[7].view).toBeUndefined()
    expect(script[9]).toMatchObject({ panel: "resy-outreach", view: "done", source: "Resy messages" })
  })

  it("quotes the figures the panels show", () => {
    for (const figure of ["Rafael Ortiz", "booth 14", "six visits since March, the last on Oct 3", "$236", "5 of the 6", "31%", "$186", "$132"]) expect(profile).toContain(figure)
    for (const figure of ["26 parties", "21 can be emailed", "$14,820 with us", "16 of the 19"]) expect(sendOffer).toContain(figure)
    expect(sent).toContain("21 guests")
  })

  it("puts the note on the profile for good and on tonight's visit only", () => {
    expect(tagOffer).toContain("every future booking")
    expect(tagOffer).toContain("tonight's visit note")
    expect(tagged).toContain("tonight's 8:15 chit")
  })

  it("never says holds, settled or Card Members", () => {
    for (const text of answers(30)) {
      expect(text).not.toMatch(/Card Member/)
      expect(text).not.toMatch(/\bholds?\b/i)
      expect(text).not.toMatch(/settled/)
    }
  })

  it("offers no discount in the outreach or the email", () => {
    for (const text of [sendOffer, sent, THANK_YOU_EMAIL.subject, THANK_YOU_EMAIL.body]) expect(text).not.toMatch(/% off|\bfree\b|discount/i)
  })

  it("waits on each confirm only while idle with its own offer as the last message", () => {
    const opening = [{ role: "user", content: flow30.key }, { role: "assistant", content: profile }]
    const tagMsg = { role: "assistant", content: tagOffer }
    const sendMsg = { role: "assistant", content: sendOffer }
    expect(isAwaitingFlow30Tag([...opening, tagMsg], "idle")).toBe(true)
    expect(isAwaitingFlow30Tag([...opening, tagMsg], "streaming")).toBe(false)
    expect(isAwaitingFlow30Tag(opening, "idle")).toBe(false)
    expect(isAwaitingFlow30Tag([...opening, tagMsg, { role: "user", content: CONCEPT_FLOW30_TAG }, { role: "assistant", content: tagged }], "idle")).toBe(false)
    expect(isAwaitingFlow30Send([sendMsg], "idle")).toBe(true)
    expect(isAwaitingFlow30Send([sendMsg, { role: "user", content: "what is the weather like" }, { role: "assistant", content: "Sunny." }], "idle")).toBe(false)
    expect(isAwaitingFlow30Tag([sendMsg], "idle")).toBe(false)
    expect(isAwaitingFlow30Send([tagMsg], "idle")).toBe(false)
  })

  it("never waits on a flow 28 or 29 cue, and flows 28 and 29 never wait on its cues", () => {
    const earlier = [...answers(28), ...answers(29)].map((content) => [{ role: "assistant", content }])
    for (const msgs of earlier) {
      expect(isAwaitingFlow30Tag(msgs, "idle")).toBe(false)
      expect(isAwaitingFlow30Send(msgs, "idle")).toBe(false)
    }
    for (const content of [tagOffer, sendOffer]) {
      const msgs = [{ role: "assistant", content }]
      for (const awaiting of [isAwaitingFlow28Send, isAwaitingFlow29Move, isAwaitingFlow29Open]) expect(awaiting(msgs, "idle")).toBe(false)
    }
  })

  it("uses confirm turns no other script or fake follow-up uses", () => {
    for (const turn of [CONCEPT_FLOW30_TAG, CONCEPT_FLOW30_SEND]) {
      expect(convKeys.has(turn)).toBe(false)
      expect(CONCEPT_FAKE_FOLLOWUPS.has(turn)).toBe(false)
      const users = Object.entries(CONVERSATIONS).filter(([k]) => k !== flow30.key).flatMap(([, turns]) => turns.filter((t) => t.role === "user").map((t) => t.content))
      expect(users).not.toContain(turn)
    }
  })
})

// ── Flow 31: No-show fees and events ──

describe("flow 31, no-show fees and events", () => {
  const flow31 = FLOW_DEFS.find((f) => f.num === 31)!
  const script = CONVERSATIONS[flow31.key]
  const [chargeOffer, charged, evidence, events] = answers(31)

  it("is a manual merchant flow in resy scope, left out of the unscoped demo", () => {
    expect(flow31).toMatchObject({ section: "merchant", scope: "resy", slug: "31", badge: "Resy", title: "No-show fees and events" })
    expect(CONCEPT_MANUAL_PROMPTS.has(flow31.key)).toBe(true)
    expect(promptsInScope(null, { followups: true })).not.toContain(flow31.key)
  })

  it("takes four user turns, confirming with Charge it.", () => {
    expect(script.map((t) => t.role)).toEqual(Array.from({ length: 8 }, (_, i) => (i % 2 ? "assistant" : "user")))
    expect(script[0].content).toBe("Did we charge the no-show fee for last night's 7:30 four-top?")
    expect(script[2].content).toBe(CONCEPT_FLOW31_CHARGE)
    expect(script[4].content).toBe("If they dispute it, are we covered?")
    expect(script[6].content).toBe("How many seats are left for the wine dinner?")
    expect(CONCEPT_FLOW31_CHARGE).toBe("Charge it.")
  })

  it("proposes on the fee panel, charges it, shows the evidence, then opens the events", () => {
    expect(script[1]).toMatchObject({ panel: "resy-fee", closePanel: "resy-events", revealPanel: true, source: "Resy reservations" })
    expect(script[1].view).toBeUndefined()
    expect(script[3]).toMatchObject({ panel: "resy-fee", view: "charged", source: "Resy reservations" })
    expect(script[5]).toMatchObject({ panel: "resy-fee", view: "evidence", source: "Resy reservations + messages" })
    expect(script[7]).toMatchObject({ panel: "resy-events", closePanel: "resy-fee", source: "Resy events + card transactions" })
    expect(script[7].view).toBeUndefined()
    // Only the step whose panel holds the confirm raises the phone sheet.
    for (const i of [3, 5, 7]) expect(script[i].revealPanel).toBeUndefined()
  })

  it("quotes the figures the panels show", () => {
    expect(chargeOffer).toContain(`${formatWholeCurrency(NO_SHOW_FEE)} is eligible`)
    expect(chargeOffer).toContain("$100")
    expect(charged).toContain(formatWholeCurrency(FEES_AFTER_CHARGE))
    expect(charged).toContain("$1,050")
    expect(events.startsWith("Seven of 48")).toBe(true)
    expect([WINE_DINNER.seats, WINE_DINNER.open]).toEqual([48, 7])
    for (const figure of ["18 guests", "$7,935", "$26,675", "95 open seats", "$13,475", "$41 a guest"]) expect(events).toContain(figure)
    expect(events).toContain(formatWholeCurrency(EVENT_TOTALS.openValue))
    expect(events).toContain(formatWholeCurrency(NIGHT_SPEND_PER_GUEST))
  })

  it("says a strong case, never a win, and where the money and the dispute land", () => {
    expect(evidence).toContain("strong case")
    for (const text of [charged, evidence, events]) expect(text).toContain("Stripe")
    expect(charged).toContain("won't appear in your card deposits")
    for (const text of answers(31)) expect(text).not.toMatch(/you'll win|you will win/i)
  })

  it("never says holds, settled or Card Members, and only the card spend settles", () => {
    for (const text of answers(31)) {
      expect(text).not.toMatch(/Card Member/)
      expect(text).not.toMatch(/\bholds?\b/i)
      expect(text).not.toMatch(/settled/)
    }
    expect(answers(31).filter((text) => /settl/.test(text))).toEqual([events])
    expect(events).toContain("settles the next business day")
  })

  it("waits on the charge only while idle with its offer as the last message", () => {
    const opening = [{ role: "user", content: flow31.key }]
    const offer = { role: "assistant", content: chargeOffer }
    expect(isAwaitingFlow31Charge([...opening, offer], "idle")).toBe(true)
    expect(isAwaitingFlow31Charge([...opening, offer], "streaming")).toBe(false)
    expect(isAwaitingFlow31Charge(opening, "idle")).toBe(false)
    expect(isAwaitingFlow31Charge([...opening, offer, { role: "user", content: CONCEPT_FLOW31_CHARGE }, { role: "assistant", content: charged }], "idle")).toBe(false)
    expect(isAwaitingFlow31Charge([...opening, offer, { role: "user", content: "what is the weather like" }, { role: "assistant", content: "Sunny." }], "idle")).toBe(false)
  })

  it("never waits on a flow 28, 29 or 30 cue, and those flows never wait on its cue", () => {
    for (const content of [...answers(28), ...answers(29), ...answers(30)]) expect(isAwaitingFlow31Charge([{ role: "assistant", content }], "idle")).toBe(false)
    const msgs = [{ role: "assistant", content: chargeOffer }]
    for (const awaiting of [isAwaitingFlow28Send, isAwaitingFlow29Move, isAwaitingFlow29Open, isAwaitingFlow30Tag, isAwaitingFlow30Send]) expect(awaiting(msgs, "idle")).toBe(false)
  })

  it("uses a confirm turn no other script or fake follow-up uses", () => {
    expect(convKeys.has(CONCEPT_FLOW31_CHARGE)).toBe(false)
    expect(CONCEPT_FAKE_FOLLOWUPS.has(CONCEPT_FLOW31_CHARGE)).toBe(false)
    const users = Object.entries(CONVERSATIONS).filter(([k]) => k !== flow31.key).flatMap(([, turns]) => turns.filter((t) => t.role === "user").map((t) => t.content))
    expect(users).not.toContain(CONCEPT_FLOW31_CHARGE)
  })
})

// ── Flow 32: How we're doing ──

describe("flow 32, how we're doing", () => {
  const flow32 = FLOW_DEFS.find((f) => f.num === 32)!
  const script = CONVERSATIONS[flow32.key]
  const [week, surveys, locations] = answers(32)
  const userTurns = script.filter((t) => t.role === "user").map((t) => t.content)
  const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8")

  it("is a manual merchant flow in resy scope, left out of the unscoped demo", () => {
    expect(flow32).toMatchObject({ section: "merchant", scope: "resy", slug: "32", badge: "Resy", title: "How we're doing" })
    expect(CONCEPT_MANUAL_PROMPTS.has(flow32.key)).toBe(true)
    expect(promptsInScope(null, { followups: true })).not.toContain(flow32.key)
  })

  it("plays three questions and three answers, in the storyboard's words", () => {
    expect(script.map((t) => t.role)).toEqual(["user", "assistant", "user", "assistant", "user", "assistant"])
    expect(userTurns).toEqual(["How did covers and turn times compare to last week?", "Any bad feedback this week?", "Which location had the most no-shows in October?"])
  })

  it("opens each panel and closes the last, with no views or reveals", () => {
    expect(script[1]).toMatchObject({ panel: "resy-report", closePanel: "resy-locations", source: "Resy reports + card transactions" })
    expect(script[3]).toMatchObject({ panel: "resy-surveys", closePanel: "resy-report", source: "Resy Surveys" })
    expect(script[5]).toMatchObject({ panel: "resy-locations", closePanel: "resy-surveys", source: "Resy multi-location + card transactions" })
    for (const turn of script) {
      expect(turn).not.toHaveProperty("view")
      expect(turn).not.toHaveProperty("revealPanel")
    }
  })

  it("has no confirm step, and its turns collide with no other script or fake follow-up", () => {
    expect(source("./flows.concept.ts")).not.toMatch(/isAwaitingFlow32/)
    const others = Object.entries(CONVERSATIONS).filter(([k]) => k !== flow32.key).flatMap(([, turns]) => turns.filter((t) => t.role === "user").map((t) => t.content))
    for (const turn of userTurns) {
      expect(others).not.toContain(turn)
      expect(CONCEPT_FAKE_FOLLOWUPS.has(turn)).toBe(false)
    }
    for (const turn of userTurns.slice(1)) expect(convKeys.has(turn)).toBe(false)
  })

  it("quotes the week report's figures", () => {
    for (const figure of ["1,312", "1,214", "8%", "1:41", "6 minutes", "71", "58", "38%", "$102,330", "32.4%"]) expect(week).toContain(figure)
    expect(week).toContain("Amex cards at 32.4%")
    expect(week).toContain(`${WEEK_REPORT.cardSales.changePct}% to ${formatWholeCurrency(WEEK_REPORT.cardSales.latest)}`)
  })

  it("names both weeks in the report caption", () => {
    expect([WEEK_REPORT.latest, WEEK_REPORT.prior]).toEqual(["Oct 17–23", "Oct 10–16"])
    expect(source("../../../components/ask-nanci/concept/ResyReportPanel.tsx")).toContain("{WEEK_REPORT.latest} against {WEEK_REPORT.prior}")
  })

  it("quotes the surveys, the two Friday tables and the 8:00 tie-in", () => {
    for (const figure of [String(SURVEY_SUMMARY.responses), String(SURVEY_SUMMARY.average), "8:00 and 8:15", "Both Friday guests are returning, on their ninth and fifth visits.", "too loud last Saturday"]) expect(surveys).toContain(figure)
    expect(surveys).toContain("Worth watching now that next Friday has two more 8:00 four-tops.")
    expect(surveys).not.toMatch(/regulars?/i)
  })

  it("quotes the locations, says so far, and draws no Amex link", () => {
    for (const figure of ["118", "4.8%", "3.5%", "2.7%", "$5,856", "$61"]) expect(locations).toContain(figure)
    expect(locations).toContain("so far")
    expect(LOCATIONS_WINDOW).toContain("so far")
    expect(locations).not.toMatch(/Amex/)
    expect(locations).toBe("By count, Tallis, with 118 covers so far. By rate it's Tallis Market at 4.8%, against 3.5% here and 2.7% at Little Tallis. That cost Market $5,856 at its $61 a cover. Market charges no fee, so none of that came back. A card-on-file fee like yours would recover part of it.")
    expect(VENUES.map((v) => v.name)).toEqual(["Tallis", "Little Tallis", "Tallis Market"])
  })

  it("never says holds, settled or Card Members", () => {
    for (const text of answers(32)) {
      expect(text).not.toMatch(/Card Member/)
      expect(text).not.toMatch(/\bholds?\b/i)
      expect(text).not.toMatch(/settled/)
    }
  })

  it("never calls the surveys reviews, in chat, data or panels", () => {
    expect(surveys).not.toMatch(/review/i)
    for (const path of ["./panels/resy-reports.ts", "../../../components/ask-nanci/concept/ResyReportPanel.tsx", "../../../components/ask-nanci/concept/ResySurveysPanel.tsx", "../../../components/ask-nanci/concept/ResyLocationsPanel.tsx"]) expect(source(path)).not.toMatch(/review/i)
    const labels = source("../../../components/panel-registry.ts").split("\n").filter((line) => /"resy-(report|surveys|locations)"/.test(line))
    expect(labels).toHaveLength(3)
    for (const line of labels) expect(line).not.toMatch(/review/i)
  })
})

describe("Resy Marketplace listing", () => {
  const resy = MARKETPLACE_SERVICES.find((s) => s.id === "resy")!

  it("reads Connect, then Connected once on", () => {
    expect(resy.enableLabel).toBe("Connect")
    expect(resy.enabledLabel).toBe("Connected")
  })

  it("promises nothing the Resy flows do not show, and names no card brand", () => {
    const text = [resy.description, resy.overview, ...(resy.highlights ?? []), ...(resy.sections ?? []).map((s) => s.body)].join(" ")
    expect(text).not.toMatch(/deposit polic|end-of-night|per cover|Amex|Card Member/i)
    expect(text).not.toMatch(/\breviews?\b/i)
  })

  it("never claims Nanci sees Stripe payouts", () => {
    const text = [resy.description, resy.overview, ...(resy.highlights ?? []), ...(resy.sections ?? []).map((s) => s.body)].join(" ")
    expect(text).not.toMatch(/\bsees?\b[^.]*Stripe payouts|Stripe payouts arrive/i)
  })

  it("names every action the Resy flows take, and asks before each", () => {
    const canDo = resy.sections?.find((s) => s.title === "What Nanci can do")?.body ?? ""
    for (const action of ["confirmation follow-up", "move a booking", "change availability", "tags and notes", "no-show fee", "guest emails", "Nanci asks before every change"]) expect(canDo).toContain(action)
    expect(resy.highlights).toContain("Move bookings and open tables, with your OK")
    expect(resy.highlights).toContain("Guest profiles with tags, notes and the cards guests pay with")
    expect(resy.highlights).toContain("Tags, notes and thank-you emails drafted for your OK")
    expect(resy.highlights).toContain("No-show fees charged with your OK")
    expect(resy.highlights).toContain("Ticketed events, and where each payment lands")
    expect(resy.overview).toContain("how many seats are left for the wine dinner")
    expect(resy.sections?.find((s) => s.title === "What Nanci can read")?.body).toContain("events and ticket sales")
  })

  it("names flow 32's weekly reports, private surveys and group comparison", () => {
    expect(resy.highlights).toContain("Weekly reports that match Resy tables to card sales")
    expect(resy.highlights).toContain("Private guest surveys, and every venue in your group side by side")
    const canRead = resy.sections?.find((s) => s.title === "What Nanci can read")?.body ?? ""
    for (const item of ["private guest surveys", "reports across every venue in your group"]) expect(canRead).toContain(item)
    expect(resy.description).toMatch(/surveys and reports/)
  })
})
