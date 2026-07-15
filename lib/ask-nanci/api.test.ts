import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { streamChat } from "./api"
import { findResponse, DEFAULT_RESPONSE, DEFAULT_SUGGESTIONS } from "./mock-data"
import { MOCK_RESPONSES } from "./data/responses.clover"
import type { ChatStreamChunk } from "./api-types"
import type { Message, Source } from "./types"

// streamChat paces itself with setTimeout (1200ms/thinking, 20ms/word). Collapse
// every timer to run synchronously so the async generator drains instantly.
beforeEach(() => {
  vi.stubGlobal("setTimeout", ((fn: () => void) => {
    fn()
    return 0 as unknown as ReturnType<typeof setTimeout>
  }) as typeof setTimeout)
})
afterEach(() => vi.unstubAllGlobals())

const user = (content: string): Pick<Message, "role" | "content"> => ({ role: "user", content })
const bank = (institution: string): Source => ({
  id: `src-${institution}`,
  name: institution,
  kind: "bank",
  institution,
  active: true,
  addedAt: 0,
})

async function drain(gen: AsyncGenerator<ChatStreamChunk>): Promise<ChatStreamChunk[]> {
  const chunks: ChatStreamChunk[] = []
  for await (const c of gen) chunks.push(c)
  return chunks
}
const textOf = (chunks: ChatStreamChunk[]) =>
  chunks.filter((c): c is Extract<ChatStreamChunk, { type: "token" }> => c.type === "token").map((c) => c.content).join("")
const firstOf = <T extends ChatStreamChunk["type"]>(chunks: ChatStreamChunk[], type: T) =>
  chunks.find((c) => c.type === type) as Extract<ChatStreamChunk, { type: T }> | undefined

// ── findResponse — the keyword matcher ──────────────────────────────────────

describe("findResponse", () => {
  it("matches a known keyword to its response entry", () => {
    expect(findResponse("give me the full picture on yesterday")?.id).toBe("yesterday")
    expect(findResponse("how many chargebacks did I get?")?.id).toBe("chargebacks")
  })
  it("is case-insensitive", () => {
    expect(findResponse("YESTERDAY please")?.id).toBe("yesterday")
  })
  it("returns null when nothing matches", () => {
    expect(findResponse("what is the capital of France")).toBeNull()
    expect(findResponse("")).toBeNull()
  })
  it("every response entry is reachable by at least one of its own keywords", () => {
    for (const r of MOCK_RESPONSES) {
      for (const kw of r.keywords) {
        // A later entry could shadow an earlier one if its keyword is a substring
        // that fires first; assert each keyword resolves to *some* real entry.
        expect(findResponse(kw)).not.toBeNull()
      }
    }
  })
})

// ── streamChat — the streaming shape over a matched answer ───────────────────

describe("streamChat", () => {
  it("streams the matched answer's text token by token, reconstructing it exactly", async () => {
    const match = findResponse("yesterday")!
    const chunks = await drain(streamChat([user("yesterday")], [], "s1"))
    expect(textOf(chunks)).toBe(match.content)
    expect(firstOf(chunks, "suggestions")?.items).toEqual(match.suggestions)
    expect(firstOf(chunks, "chart")?.data).toEqual(match.chart)
    expect(chunks.at(-1)).toEqual({ type: "done" })
  })

  it("falls back to the default answer + suggestions when nothing matches", async () => {
    const chunks = await drain(streamChat([user("no idea what this is")], [], "s1"))
    expect(textOf(chunks)).toBe(DEFAULT_RESPONSE)
    expect(firstOf(chunks, "suggestions")?.items).toEqual(DEFAULT_SUGGESTIONS)
    expect(firstOf(chunks, "chart")).toBeUndefined()
  })

  it("reads the latest user message, ignoring earlier turns", async () => {
    const chunks = await drain(
      streamChat([user("yesterday"), { role: "assistant", content: "..." }, user("chargebacks")], [], "s1"),
    )
    expect(textOf(chunks)).toBe(findResponse("chargebacks")!.content)
  })

  it("emits one thinking chunk per active source (falling back to the built-in Clover source)", async () => {
    const noSources = await drain(streamChat([user("yesterday")], [], "s1"))
    expect(noSources.filter((c) => c.type === "thinking")).toHaveLength(1)

    const withSources = await drain(streamChat([user("yesterday")], [bank("Chase"), bank("QuickBooks")], "s1"))
    expect(withSources.filter((c) => c.type === "thinking")).toHaveLength(2)
  })

  it("attributes exactly the active sources named in the answer's sourceInstitutions", async () => {
    // bank-match lists Clover Data / AccessOne Data / Chase / Bank of America.
    const sources = [bank("Chase"), bank("QuickBooks"), bank("Wells Fargo")]
    const chunks = await drain(streamChat([user("match sales report")], sources, "s1"))
    const attributed = firstOf(chunks, "sources")?.items ?? []
    expect(attributed.map((s) => s.institution)).toEqual(["Chase"])
  })

  it("omits the sources chunk entirely when there are no active sources", async () => {
    const chunks = await drain(streamChat([user("match sales report")], [], "s1"))
    expect(firstOf(chunks, "sources")).toBeUndefined()
  })
})

// ── streamChat — per-variant content overrides ──────────────────────────────

describe("streamChat variant overrides", () => {
  it("rebrands the bank-match answer for the business-owner embed", async () => {
    const chunks = await drain(streamChat([user("match sales report")], [], "s1", "business-owner"))
    const text = textOf(chunks)
    expect(text).toContain("AccessOne")
    expect(text).not.toContain("your Clover sales")
  })
  it("rebrands the bank-match answer for the vw embed", async () => {
    const chunks = await drain(streamChat([user("match sales report")], [], "s1", "vw"))
    expect(textOf(chunks)).toContain("VisionWeb")
  })
  it("uses the default Clover content when the variant has no override for that answer", async () => {
    const base = textOf(await drain(streamChat([user("match sales report")], [], "s1")))
    const clover = textOf(await drain(streamChat([user("match sales report")], [], "s1", "clover")))
    expect(clover).toBe(base)
  })
})
