import { beforeEach, describe, expect, it } from "vitest"
import { readSessions, saveSession, deleteSession } from "./session-store"
import type { Message } from "./types"

const msgs = (text: string): Message[] => [{ id: "m1", role: "user", content: text }]
const ids = () => readSessions().map((s) => s.id)

beforeEach(() => localStorage.clear())

describe("saveSession", () => {
  it("titles a session from its first user message", () => {
    expect(saveSession(msgs("how are my deposits?")).title).toBe("how are my deposits?")
  })

  it("prefers an explicit title override", () => {
    expect(saveSession(msgs("raw prompt"), "a", "Curated Title").title).toBe("Curated Title")
  })

  // The bug this guards: updating an existing session used to write it back at its
  // current index. Nothing downstream sorts by updatedAt — the recent lists just
  // slice the array — so a chat you had just used stayed buried under older ones.
  it("floats an updated session back to the front", () => {
    saveSession(msgs("oldest"), "a")
    saveSession(msgs("middle"), "b")
    saveSession(msgs("newest"), "c")
    expect(ids()).toEqual(["c", "b", "a"])

    saveSession(msgs("oldest, revisited"), "a")
    expect(ids()).toEqual(["a", "c", "b"])
  })

  it("updates in place rather than duplicating", () => {
    saveSession(msgs("first"), "a")
    saveSession(msgs("second"), "a")
    expect(readSessions()).toHaveLength(1)
    expect(readSessions()[0].messages[0].content).toBe("second")
  })

  it("caps stored sessions and evicts the least recently saved", () => {
    for (let i = 0; i < 25; i++) saveSession(msgs(`chat ${i}`), `s${i}`)
    const stored = ids()
    expect(stored).toHaveLength(20)
    expect(stored[0]).toBe("s24")
    expect(stored).not.toContain("s0")
  })
})

describe("deleteSession", () => {
  it("removes only the named session", () => {
    saveSession(msgs("a"), "a")
    saveSession(msgs("b"), "b")
    deleteSession("a")
    expect(ids()).toEqual(["b"])
  })
})

describe("readSessions", () => {
  it("returns an empty list when storage holds junk", () => {
    localStorage.setItem("asknanci_chats", "{not json")
    expect(readSessions()).toEqual([])
  })
})
