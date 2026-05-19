"use client"

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import type { Message, Session, Source, UsageData } from "@/lib/ask-nanci/types"
import {
  fetchSessions,
  persistSession,
  removeSessionById,
  newSessionId,
  fetchSources,
  persistSources,
  streamChat,
} from "@/lib/ask-nanci/api"
import { CLOVER_SOURCE } from "@/lib/ask-nanci/sourceStore"
import { MOCK_USAGE, SCRIPTED_CONVERSATIONS } from "@/lib/ask-nanci/mock-data"

const ACCESS_ONE_SOURCE: Source = {
  id: "clover-built-in",
  name: "AccessOne",
  kind: "bank",
  institution: "AccessOne Data",
  logo: "/accessOne-logo.svg",
  active: true,
  addedAt: 0,
}

const EMBED_DEMO_SOURCES: Source[] = [
  CLOVER_SOURCE,
  { id: "demo-qb", name: "Walker's Business Books", kind: "bank", institution: "QuickBooks", color: "bg-green-600", initials: "QB", logo: "/fi/quickbook.svg", active: true, addedAt: 0 },
  { id: "demo-chase", name: "Chase Business Checking ••4892", kind: "bank", institution: "Chase", color: "bg-blue-700", initials: "CH", logo: "/fi/chase.png", active: true, addedAt: 0 },
  { id: "demo-bofa", name: "BofA Savings ••2341", kind: "bank", institution: "Bank of America", color: "bg-red-600", initials: "BA", logo: "/fi/bofa.png", active: true, addedAt: 0 },
  { id: "demo-wf", name: "Wells Fargo Business ••7823", kind: "bank", institution: "Wells Fargo", color: "bg-yellow-600", initials: "WF", logo: "/fi/wellsfargo.png", active: true, addedAt: 0 },
  { id: "demo-amex", name: "Amex Business Gold ••5561", kind: "bank", institution: "American Express", color: "bg-sky-600", initials: "AX", logo: "/fi/amex.svg", active: true, addedAt: 0 },
]

const EMBED_BO_DEMO_SOURCES: Source[] = EMBED_DEMO_SOURCES.map((s) =>
  s.id === "clover-built-in" ? ACCESS_ONE_SOURCE : s
)

type ChatView = "welcome" | "chat"
type ChatState = "idle" | "thinking" | "streaming"

interface AskNanciCtx {
  isEmbed: boolean
  embedVariant: "clover" | "bo" | null
  view: ChatView
  messages: Message[]
  chatState: ChatState
  sessions: Session[]
  activeSessionId: string | null
  pendingBot: Message | null
  sendMessage: (text: string) => void
  playScripted: (prompt: string) => void
  stopAnimation: () => void
  startNewChat: () => void
  resumeSession: (id: string) => void
  deleteSessionById: (id: string) => void
  sources: Source[]
  setSources: (sources: Source[]) => void
  thinkingSource: Source | null
  thinkingLabel: string
  kbOpen: boolean
  setKbOpen: (open: boolean) => void
  draft: string
  setDraft: (text: string) => void
  error: string | null
  usage: UsageData
  tokenLimitReached: boolean
  setTokenLimitReached: (v: boolean) => void
  settingsOpen: boolean
  settingsTab: string
  openSettings: (tab?: string) => void
  setSettingsOpen: (open: boolean) => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  onboardingOpen: boolean
  setOnboardingOpen: (open: boolean) => void
}

const Ctx = createContext<AskNanciCtx | null>(null)

export function useAskNanci() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useAskNanci must be used inside AskNanciProvider")
  return ctx
}

export function AskNanciProvider({ children, isEmbed = false, embedVariant = null }: { children: React.ReactNode; isEmbed?: boolean; embedVariant?: "clover" | "bo" | null }) {
  const [view, setView] = useState<ChatView>("welcome")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatState, setChatState] = useState<ChatState>("idle")
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [pendingBot, setPendingBot] = useState<Message | null>(null)
  const [sources, setSources_] = useState<Source[]>(
    isEmbed ? (embedVariant === "bo" ? EMBED_BO_DEMO_SOURCES : EMBED_DEMO_SOURCES) : []
  )
  const [thinkingSource, setThinkingSource] = useState<Source | null>(null)
  const [thinkingLabel, setThinkingLabel] = useState("Thinking…")
  const [kbOpen, setKbOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [tokenLimitReached, setTokenLimitReached] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("usage")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const stopRef = useRef<boolean>(false)
  const sessionIdRef = useRef<string>(newSessionId())

  useEffect(() => {
    fetchSessions().then(setSessions)
    if (!isEmbed) fetchSources().then(setSources_)
    if (!localStorage.getItem("ask_nanci_onboarded")) setOnboardingOpen(true)
  }, [isEmbed])

  const reloadSessions = useCallback(() => {
    fetchSessions().then(setSessions)
  }, [])

  const persistAndReload = useCallback(async (msgs: Message[]) => {
    await persistSession(msgs, sessionIdRef.current)
    reloadSessions()
  }, [reloadSessions])

  const appendBotMessage = useCallback((msg: Message) => {
    setMessages((prev) => {
      const next = [...prev, msg]
      persistAndReload(next)
      return next
    })
    setChatState("idle")
    setPendingBot(null)
  }, [persistAndReload])

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || chatState !== "idle") return
    const userMsg: Message = { id: newSessionId(), role: "user", content: text.trim() }
    const sentSessionId = sessionIdRef.current

    setView("chat")
    setChatState("thinking")
    setError(null)
    stopRef.current = false

    setMessages((prev) => {
      const next = [...prev, userMsg]
      persistAndReload(next)
      return next
    })

    const run = async () => {
      const activeSources = sources.filter((s) => s.active)
      const allMsgs = await new Promise<Message[]>((resolve) => {
        setMessages((prev) => { resolve([...prev]); return prev })
      })

      const botMsg: Message = { id: newSessionId(), role: "assistant", content: "" }
      let started = false

      try {
        for await (const chunk of streamChat(allMsgs, activeSources, sentSessionId)) {
          if (stopRef.current) break

          if (chunk.type === "thinking") {
            setThinkingSource(chunk.source as Source)
          } else if (chunk.type === "token") {
            if (!started) {
              started = true
              setThinkingSource(null)
              setPendingBot(botMsg)
              setChatState("streaming")
            }
            botMsg.content += chunk.content
            setPendingBot({ ...botMsg })
          } else if (chunk.type === "suggestions") {
            botMsg.suggestions = chunk.items
          } else if (chunk.type === "sources") {
            botMsg.attributedSources = chunk.items
          } else if (chunk.type === "chart") {
            botMsg.chart = chunk.data
          } else if (chunk.type === "error") {
            setError(chunk.message)
            setChatState("idle")
            setPendingBot(null)
            return
          } else if (chunk.type === "done") {
            break
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
        setThinkingSource(null)
        setChatState("idle")
        setPendingBot(null)
        return
      }

      if (botMsg.content) {
        // If the session changed (user started a new chat), discard the partial
        // bot response rather than saving it under the wrong session ID.
        if (sessionIdRef.current !== sentSessionId) {
          setChatState("idle")
          setPendingBot(null)
          return
        }
        appendBotMessage({ ...botMsg, stopped: true })
      } else {
        setChatState("idle")
        setPendingBot(null)
      }
    }

    run()
  }, [chatState, sources, persistAndReload, appendBotMessage])

  const stopAnimation = useCallback(() => {
    stopRef.current = true
  }, [])

  const playScripted = useCallback((prompt: string) => {
    const script = SCRIPTED_CONVERSATIONS[prompt]
    if (!script) return
    setThinkingLabel("Updating your account…")
    setView("chat")
    setMessages([])
    setChatState("idle")
    setPendingBot(null)

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    const streamText = (text: string, id: string) =>
      new Promise<void>((resolve) => {
        const botMsg = { id, role: "assistant" as const, content: "" }
        setChatState("streaming")
        let charIdx = 0
        const interval = setInterval(() => {
          charIdx++
          setPendingBot({ ...botMsg, content: text.slice(0, charIdx) })
          if (charIdx >= text.length) {
            clearInterval(interval)
            setMessages((prev) => [...prev, { ...botMsg, content: text }])
            setPendingBot(null)
            resolve()
          }
        }, 16)
      })

    const run = async () => {
      for (let i = 0; i < script.length; i++) {
        const turn = script[i]
        if (turn.role === "user") {
          await sleep(i === 0 ? 600 : 900)
          setMessages((prev) => [...prev, { id: newSessionId(), role: "user" as const, content: turn.content }])
          setChatState("thinking")
        } else {
          await sleep(1000)
          await streamText(turn.content, newSessionId())
          if (i === script.length - 1) { setChatState("idle"); setThinkingLabel("Thinking…") }
        }
      }
    }

    run()
  }, [])

  const startNewChat = useCallback(() => {
    stopRef.current = true
    setView("welcome")
    setMessages([])
    setChatState("idle")
    setActiveSessionId(null)
    sessionIdRef.current = newSessionId()
    setPendingBot(null)
    setError(null)
  }, [])

  const resumeSession = useCallback(async (id: string) => {
    const all = await fetchSessions()
    const session = all.find((s) => s.id === id)
    if (!session) return
    stopRef.current = true
    setMessages(session.messages)
    setActiveSessionId(id)
    sessionIdRef.current = id
    setView("chat")
    setChatState("idle")
    setPendingBot(null)
    setSessions(all)
    setError(null)
  }, [])

  const deleteSessionByIdCb = useCallback(async (id: string) => {
    await removeSessionById(id)
    reloadSessions()
    if (activeSessionId === id) startNewChat()
  }, [activeSessionId, startNewChat, reloadSessions])

  const handleSetSources = useCallback((next: Source[]) => {
    setSources_(next)
    persistSources(next.filter((s) => s.id !== "clover-built-in"))
  }, [])

  const openSettings = useCallback((tab = "usage") => {
    setSettingsTab(tab)
    setSettingsOpen(true)
  }, [])

  return (
    <Ctx.Provider value={{
      isEmbed, embedVariant,
      view, messages, chatState, sessions, activeSessionId,
      pendingBot,
      sendMessage, playScripted, stopAnimation, startNewChat, resumeSession,
      deleteSessionById: deleteSessionByIdCb,
      sources, setSources: handleSetSources, thinkingSource, thinkingLabel,
      kbOpen, setKbOpen,
      draft, setDraft,
      error,
      usage: MOCK_USAGE,
      tokenLimitReached, setTokenLimitReached,
      settingsOpen, settingsTab, openSettings, setSettingsOpen,
      mobileSidebarOpen, setMobileSidebarOpen,
      onboardingOpen, setOnboardingOpen,
    }}>
      {children}
    </Ctx.Provider>
  )
}
