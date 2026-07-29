"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUp, CornerDownRight } from "lucide-react"
import { Button, Textarea } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { PanelShell, PanelHeader } from "@/components/ask-nanci/shared"
import { UserMessage, BotMessage } from "@/components/ask-nanci/ChatMessage"
import { ChatActiveSources } from "@/components/ask-nanci/ChatActiveSources"
import { ThinkingIndicator } from "@/components/ask-nanci/ThinkingIndicator"
import { streamWords } from "@/lib/ask-nanci/stream-words"
import { RISK_LANDING_CONVERSATIONS } from "@/lib/ask-nanci/data/risk-conversations"
import type { Message } from "@/lib/ask-nanci/types"
import { DashChartCard } from "./dashboard/DashChartCard"

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// The Ask Nanci panel every Risk destination summons beside itself: it opens on
// one scripted question and then behaves like a small chat.
//
// ponytail: it keeps its own conversation instead of the global chat session —
// summoning Nanci from the Dashboard or the Detection Queue must not hijack the
// Ask Nanci view. That also means it can't use ChatView/ChatInput (both read
// global context), so it renders the shared message bubbles and its own small
// composer. If the two ever need to merge, lift this state into AskNanciContext
// as a second session.
//
// Callers pass the panel's own registry id so its close button removes the right
// panel from the stack, and key it on `prompt` so switching questions restarts
// the conversation instead of resyncing state in an effect.
function answerTo(prompt: string, seq: number): Message[] {
  const turns = RISK_LANDING_CONVERSATIONS[prompt] ?? [
    { role: "user" as const, content: prompt },
    { role: "assistant" as const, content: "I don't have that one wired up in this demo yet — try one of the suggestions above." },
  ]
  return turns.map((t, i) => ({ ...t, id: `${seq}-${i}` }))
}

export function NanciPanel({ panelId, prompt }: { panelId: string; prompt: string }) {
  const { closePanel, sources } = useAskNanci()
  // Seeded with the question only — the answer streams in, same as the main chat.
  const [messages, setMessages] = useState<Message[]>(() => answerTo(prompt, 0).slice(0, 1))
  // Id of the message currently being typed out — it lives in `messages` and grows
  // in place, so React never swaps one node for another mid-answer (which flashed).
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [thinking, setThinking] = useState(true)
  const [value, setValue] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  // Monotonic run token. Each effect run / unmount invalidates every earlier run,
  // so StrictMode's double-invoke can't leave two players appending in parallel.
  const runRef = useRef(0)
  const busy = thinking || streamingId !== null

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, thinking])

  // Play every assistant turn: think for a beat, append the message empty, then
  // grow its content word by word before revealing its extras.
  const play = useCallback(async (turns: Message[], alive: () => boolean) => {
    for (const turn of turns) {
      setThinking(true)
      await sleep(700)
      if (!alive()) return
      setThinking(false)
      setStreamingId(turn.id)
      setMessages((prev) => [...prev, { ...turn, content: "" }])
      const grow = (content: string) =>
        setMessages((prev) => prev.map((m) => (m.id === turn.id ? { ...m, content } : m)))
      await streamWords(turn.content, grow, { shouldStop: () => !alive() })
      if (!alive()) return
      grow(turn.content)
      setStreamingId(null)
    }
  }, [])

  // The opening answer. Starts with an await so nothing sets state synchronously
  // during the effect; the component is keyed on `prompt`, so this runs once.
  useEffect(() => {
    const run = ++runRef.current
    const alive = () => runRef.current === run
    void (async () => { await sleep(0); if (alive()) void play(answerTo(prompt, 0).slice(1), alive) })()
    return () => { runRef.current = run + 1 } // invalidate this run on unmount/re-run
  }, [prompt, play])

  const ask = (p: string) => {
    const q = p.trim()
    if (!q || busy) return
    const turns = answerTo(q, messages.length)
    setMessages((prev) => [...prev, turns[0]])
    setValue("")
    const run = runRef.current
    void play(turns.slice(1), () => runRef.current === run)
  }

  return (
    <PanelShell>
      {/* Logomark beside the title, same as the Create Assignment review panel. */}
      <PanelHeader
        title={
          <span className="flex items-center gap-2">
            <Image src="/ask-nanci/ask-nanci-logomark.svg" alt="" width={22} height={22} />
            Ask Nanci
          </span>
        }
        size="lg"
        onClose={() => closePanel(panelId)}
      />

      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        {messages.map((m) =>
          m.role === "user" ? (
            <UserMessage key={m.id} message={m} />
          ) : (
            <div key={m.id}>
              {/* showExtras is off: the shared suggestion chips post to the global
                  chat, which would pull the user out of the destination. */}
              <BotMessage message={m} displayedContent={m.content} showExtras={false} />
              {/* Extras land once the answer finishes typing. */}
              {m.id === streamingId ? null : <>
              {m.dashChart && <div className="px-4"><DashChartCard id={m.dashChart} /></div>}
              {m.source && <p className="px-4 pt-1.5 text-xs text-muted-foreground">Source: {m.source}</p>}
              {m.suggestions?.length ? (
                <div className="flex flex-wrap gap-2 px-4 pt-3">
                  {m.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      disabled={busy}
                      className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:border-ring hover:bg-muted disabled:opacity-50"
                    >
                      <CornerDownRight className="size-3 shrink-0 text-muted-foreground" /> {s}
                    </button>
                  ))}
                </div>
              ) : null}
              </>}
            </div>
          ),
        )}

        {thinking && <ThinkingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Same shell as the app's ChatInput — bordered box, borderless textarea, the
          shared sources pill and the send button inside at bottom-right. The rest of
          ChatInput's toolbar (slash commands, common questions, recent chats) is
          omitted: it posts into the global chat session this panel deliberately avoids. */}
      <div className="shrink-0 p-3">
        <div className="flex flex-col rounded-xl border bg-background shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(value) } }}
            placeholder="Ask anything"
            className="min-h-[60px] resize-none border-0 bg-transparent text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <ChatActiveSources sources={sources.filter((s) => s.active)} />
            <Button size="icon-sm" disabled={!value.trim() || busy} onClick={() => ask(value)} aria-label="Send">
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
