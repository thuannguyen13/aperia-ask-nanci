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
  fetchUsage,
  fetchCurrentUser,
  fetchPromptCategories,
  fetchAllQuestions,
  fetchPlanTiers,
  fetchActivity,
} from "@/lib/ask-nanci/api"
import type { CurrentUser, PromptCategory, PlanTier, ActivityItem } from "@/lib/ask-nanci/api"
import { EMBED_DEMO_SOURCES, EMBED_BUSINESS_OWNER_DEMO_SOURCES, EMBED_ISO_DEMO_SOURCES, SCRIPTED_CONVERSATIONS } from "@/lib/ask-nanci/embed-demo-config"
import type { EmbedVariant } from "@/lib/ask-nanci/embed-demo-config"
import { CLOVER_SOURCE_ID, ONBOARDING_KEY } from "@/lib/ask-nanci/sourceStore"

type ChatView = "welcome" | "chat"
type ChatState = "idle" | "thinking" | "streaming"

interface AskNanciCtx {
  isEmbed: boolean
  embedVariant: EmbedVariant | null
  view: ChatView
  messages: Message[]
  chatState: ChatState
  sessions: Session[]
  activeSessionId: string | null
  pendingBot: Message | null
  sendMessage: (text: string) => void
  handlePrompt: (prompt: string) => void
  playScripted: (prompt: string) => void
  stopAnimation: () => void
  startNewChat: () => void
  resumeSession: (id: string) => void
  deleteSessionById: (id: string) => void
  sources: Source[]
  setSources: (sources: Source[]) => void
  thinking: { source: Source | null; label: string }
  kbOpen: boolean
  setKbOpen: (open: boolean) => void
  draft: string
  setDraft: (text: string) => void
  error: string | null
  usage: UsageData
  currentUser: CurrentUser | null
  promptCategories: PromptCategory[]
  allQuestions: string[]
  planTiers: PlanTier[]
  activity: ActivityItem[]
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

export function AskNanciProvider({ children, isEmbed = false, embedVariant = null }: { children: React.ReactNode; isEmbed?: boolean; embedVariant?: EmbedVariant | null }) {
  const [view, setView] = useState<ChatView>("welcome")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatState, setChatState] = useState<ChatState>("idle")
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [pendingBot, setPendingBot] = useState<Message | null>(null)
  const [sources, setSourcesState] = useState<Source[]>(
    isEmbed ? (
      embedVariant === "business-owner" ? EMBED_BUSINESS_OWNER_DEMO_SOURCES : 
      embedVariant === "iso" ? EMBED_ISO_DEMO_SOURCES :
      EMBED_DEMO_SOURCES) : []
  )
  const [thinking, setThinking] = useState<{ source: Source | null; label: string }>({ source: null, label: "Thinking…" })
  const [kbOpen, setKbOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [usage, setUsage] = useState<UsageData>({ plan: "Gold", tokens: { used: 0, limit: 15000 }, chats: { used: 0, limit: 10 }, files: { used: 0, limit: 5 } })
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [promptCategories, setPromptCategories] = useState<PromptCategory[]>([])
  const [allQuestions, setAllQuestions] = useState<string[]>([])
  const [planTiers, setPlanTiers] = useState<PlanTier[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [tokenLimitReached, setTokenLimitReached] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState("usage")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const stopRef = useRef<boolean>(false)
  const sessionIdRef = useRef<string>(newSessionId())

  useEffect(() => {
    fetchSessions().then(setSessions)
    fetchUsage().then(setUsage)
    fetchCurrentUser().then(setCurrentUser)
    fetchPromptCategories().then(setPromptCategories)
    fetchAllQuestions().then(setAllQuestions)
    fetchPlanTiers().then(setPlanTiers)
    fetchActivity().then(setActivity)
    if (!isEmbed) fetchSources().then(setSourcesState)
    if (!localStorage.getItem(ONBOARDING_KEY)) setOnboardingOpen(true)
  }, [isEmbed])

  const persistAndReload = useCallback(async (msgs: Message[]) => {
    await persistSession(msgs, sessionIdRef.current)
    fetchSessions().then(setSessions)
  }, [])

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
      // Read the latest messages from React state synchronously.
      // setMessages callback is guaranteed to receive the current state value,
      // so resolving the promise from inside it is the safest way to avoid stale closures.
      const allMsgs = await new Promise<Message[]>((resolve) => {
        setMessages((prev) => { resolve([...prev]); return prev })
      })

      const botMsg: Message = { id: newSessionId(), role: "assistant", content: "" }
      let started = false

      try {
        for await (const chunk of streamChat(allMsgs, activeSources, sentSessionId)) {
          if (stopRef.current) break

          if (chunk.type === "thinking") {
            setThinking((prev) => ({ ...prev, source: chunk.source as Source }))
          } else if (chunk.type === "token") {
            if (!started) {
              started = true
              setThinking((prev) => ({ ...prev, source: null }))
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
        setThinking((prev) => ({ ...prev, source: null }))
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
    setThinking((prev) => ({ ...prev, label: "Updating your account…" }))
    setView("chat")
    setMessages([])
    setChatState("idle")
    setPendingBot(null)

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    const streamText = (text: string, id: string) =>
      new Promise<void>((resolve) => {
        const botMsg = { id, role: "assistant" as const, content: "" }
        setChatState("streaming")
        // Split into word-boundary chunks to mimic real token streaming
        const chunks = text.match(/\S+\s*/g) ?? []
        let chunkIdx = 0
        const emitNext = () => {
          if (chunkIdx >= chunks.length) {
            setMessages((prev) => [...prev, { ...botMsg, content: text }])
            setPendingBot(null)
            resolve()
            return
          }
          // Emit 1-3 chunks per tick with ~30-80ms variable delay
          const batch = Math.floor(Math.random() * 3) + 1
          for (let i = 0; i < batch && chunkIdx < chunks.length; i++, chunkIdx++) {
            botMsg.content += chunks[chunkIdx]
          }
          setPendingBot({ ...botMsg })
          setTimeout(emitNext, 30 + Math.random() * 50)
        }
        emitNext()
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
          if (i === script.length - 1) { setChatState("idle"); setThinking({ source: null, label: "Thinking…" }) }
        }
      }
    }

    run()
  }, [])

  const handlePrompt = useCallback((prompt: string) => {
    if (isEmbed && SCRIPTED_CONVERSATIONS[prompt]) playScripted(prompt)
    else sendMessage(prompt)
  }, [isEmbed, sendMessage, playScripted])

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

  const deleteSessionById = useCallback(async (id: string) => {
    await removeSessionById(id)
    fetchSessions().then(setSessions)
    if (activeSessionId === id) startNewChat()
  }, [activeSessionId, startNewChat])

  const handleSetSources = useCallback((next: Source[]) => {
    setSourcesState(next)
    persistSources(next.filter((s) => s.id !== CLOVER_SOURCE_ID))
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
      sendMessage, handlePrompt, playScripted, stopAnimation, startNewChat, resumeSession,
      deleteSessionById,
      sources, setSources: handleSetSources, thinking,
      kbOpen, setKbOpen,
      draft, setDraft,
      error,
      usage, currentUser, promptCategories, allQuestions, planTiers, activity,
      tokenLimitReached, setTokenLimitReached,
      settingsOpen, settingsTab, openSettings, setSettingsOpen,
      mobileSidebarOpen, setMobileSidebarOpen,
      onboardingOpen, setOnboardingOpen,
    }}>
      {children}
    </Ctx.Provider>
  )
}
