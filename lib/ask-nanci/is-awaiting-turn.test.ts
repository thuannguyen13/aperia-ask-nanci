import { describe, expect, it } from "vitest"
import { isAwaitingTurn } from "./is-awaiting-turn"

const OFFER = "Want me to do it?"
const ask = { role: "user", content: "Can we?" }
const offer = { role: "assistant", content: OFFER }

describe("isAwaitingTurn", () => {
  it("is true while idle with the offer last", () => {
    expect(isAwaitingTurn([ask, offer], "idle", OFFER)).toBe(true)
  })

  it("is false while the offer is still streaming", () => {
    expect(isAwaitingTurn([ask, offer], "streaming", OFFER)).toBe(false)
  })

  it("is false on a partial offer", () => {
    expect(isAwaitingTurn([ask, { role: "assistant", content: OFFER.slice(0, 8) }], "idle", OFFER)).toBe(false)
  })

  it("is false once a user message follows the offer", () => {
    expect(isAwaitingTurn([ask, offer, { role: "user", content: "Actually, wait" }], "idle", OFFER)).toBe(false)
  })

  it("is false on a different assistant text", () => {
    expect(isAwaitingTurn([ask, offer, { role: "user", content: "Why?" }, { role: "assistant", content: "Because." }], "idle", OFFER)).toBe(false)
  })

  it("is false on an empty chat", () => {
    expect(isAwaitingTurn([], "idle", OFFER)).toBe(false)
  })
})
