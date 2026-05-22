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
import { CONCEPT_SCRIPTED_CONVERSATIONS, CONCEPT_FLOW2_PROMPT, CONCEPT_FLOW2_FOLLOWUP, CONCEPT_FLOW6_KEY, CONCEPT_ALL_PROMPTS, CONCEPT_NO_RESET_PROMPTS } from "@/lib/ask-nanci/concept-config"
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
  isConceptVersion: boolean
  reportPanelOpen: boolean
  setReportPanelOpen: (open: boolean) => void
  reportTopN: number
  formPanelOpen: boolean
  setFormPanelOpen: (open: boolean) => void
  submitFormPanel: () => void
  stepUpPanelOpen: boolean
  setStepUpPanelOpen: (open: boolean) => void
  stepUpPanelStep: 1 | 2 | 3
  advanceStepUpPanel: () => void
  submitStepUpPanel: () => void
  batchPanelOpen: boolean
  setBatchPanelOpen: (open: boolean) => void
  triggerProactiveFlow: () => void
  proactiveNotificationActive: boolean
  activateProactiveNotification: () => void
  openPanels: string[]
  openPanel: (type: string) => void
  closePanel: (type: string) => void
  closeAllNewPanels: () => void
  submitDisputeDraft: () => void
  declineReportFiltered: boolean
  workQueuePhase: "triage" | "quick-wins" | "outage"
}

const Ctx = createContext<AskNanciCtx | null>(null)

export function useAskNanci() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useAskNanci must be used inside AskNanciProvider")
  return ctx
}

export function AskNanciProvider({ children, isEmbed = false, embedVariant = null, isConceptVersion = false }: { children: React.ReactNode; isEmbed?: boolean; embedVariant?: EmbedVariant | null; isConceptVersion?: boolean }) {
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
  const [reportPanelOpen, setReportPanelOpen] = useState(false)
  const [reportTopN, setReportTopN] = useState(10)
  const [formPanelOpen, setFormPanelOpen] = useState(false)
  const [stepUpPanelOpen, setStepUpPanelOpen] = useState(false)
  const [stepUpPanelStep, setStepUpPanelStep] = useState<1 | 2 | 3>(1)
  const [batchPanelOpen, setBatchPanelOpen] = useState(false)
  const [openPanels, setOpenPanels] = useState<string[]>([])
  const [declineReportFiltered, setDeclineReportFiltered] = useState(false)
  const [workQueuePhase, setWorkQueuePhase] = useState<"triage" | "quick-wins" | "outage">("triage")
  const [proactiveNotificationActive, setProactiveNotificationActive] = useState(false)
  const stopRef = useRef<boolean>(false)
  const scriptStopRef = useRef<boolean>(false)
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
          } else if (chunk.type === "map") {
            botMsg.map = chunk.data
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

    const streamText = (turn: typeof script[number], id: string) =>
      new Promise<void>((resolve) => {
        const botMsg = { id, role: "assistant" as const, content: "" }
        setChatState("streaming")
        // Split into word-boundary chunks to mimic real token streaming
        const chunks = turn.content.match(/\S+\s*/g) ?? []
        let chunkIdx = 0
        const emitNext = () => {
          if (chunkIdx >= chunks.length) {
            setMessages((prev) => [...prev, { ...botMsg, content: turn.content, ...(turn.map ? { map: turn.map } : {}) }])
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
          await streamText(turn, newSessionId())
          if (i === script.length - 1) { setChatState("idle"); setThinking({ source: null, label: "Thinking…" }) }
        }
      }
    }

    run()
  }, [])

  const playConceptScripted = useCallback((prompt: string) => {
    const script = CONCEPT_SCRIPTED_CONVERSATIONS[prompt]
    if (!script) return
    scriptStopRef.current = false
    setThinking((prev) => ({ ...prev, label: "Thinking…" }))
    setView("chat")
    if (!CONCEPT_NO_RESET_PROMPTS.has(prompt)) {
      setMessages([])
    }
    setChatState("idle")
    setPendingBot(null)

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    const streamText = (text: string, id: string) =>
      new Promise<void>((resolve) => {
        const botMsg: Message = { id, role: "assistant", content: "" }
        setChatState("streaming")
        const chunks = text.match(/\S+\s*/g) ?? []
        let chunkIdx = 0
        const emitNext = () => {
          if (scriptStopRef.current) { setPendingBot(null); resolve(); return }
          if (chunkIdx >= chunks.length) {
            setMessages((prev) => [...prev, { ...botMsg, content: text }])
            setPendingBot(null)
            resolve()
            return
          }
          const batch = Math.floor(Math.random() * 2) + 1
          for (let i = 0; i < batch && chunkIdx < chunks.length; i++, chunkIdx++) {
            botMsg.content += chunks[chunkIdx]
          }
          setPendingBot({ ...botMsg })
          setTimeout(emitNext, 50 + Math.random() * 70)
        }
        emitNext()
      })

    const run = async () => {
      for (let i = 0; i < script.length; i++) {
        if (scriptStopRef.current) break
        const turn = script[i]
        if (turn.role === "user") {
          await sleep(i === 0 ? 1000 : 1800)
          if (scriptStopRef.current) break
          setMessages((prev) => [...prev, { id: newSessionId(), role: "user" as const, content: turn.content }])
          setChatState("thinking")
        } else {
          await sleep(1800)
          if (scriptStopRef.current) break
          await streamText(turn.content, newSessionId())
          if (turn.sheetAction || turn.suggestions) {
            setMessages((prev) => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last && last.role === "assistant") {
                next[next.length - 1] = {
                  ...last,
                  ...(turn.sheetAction ? { sheetAction: turn.sheetAction } : {}),
                  ...(turn.suggestions ? { suggestions: turn.suggestions } : {}),
                }
              }
              return next
            })
          }
          if (turn.openFormPanel) { setFormPanelOpen(true) }
          if (turn.openStepUpPanel) { setStepUpPanelOpen(true); setStepUpPanelStep(1) }
          if (turn.advanceStepUp) { setStepUpPanelStep((s) => Math.min(3, s + 1) as 1 | 2 | 3) }
          if (turn.openBatchPanel) { setBatchPanelOpen(true) }
          if (prompt === CONCEPT_FLOW2_PROMPT) { setReportPanelOpen(true); setReportTopN(10) }
          if (prompt === CONCEPT_FLOW2_FOLLOWUP) { setReportTopN(5) }
          if (turn.openPanel) { setOpenPanels((prev) => prev.includes(turn.openPanel!) ? prev : [...prev, turn.openPanel!]) }
          if (turn.filterDeclineReport) { setDeclineReportFiltered(true) }
          if (turn.advanceWorkQueue) { setWorkQueuePhase(turn.advanceWorkQueue) }
          if (turn.closeAllPanels) { setOpenPanels([]); setDeclineReportFiltered(false); setWorkQueuePhase("triage") }
          if (i === script.length - 1) { setChatState("idle") }
        }
      }
    }

    run()
  }, [])

  const submitFormPanel = useCallback(() => {
    setFormPanelOpen(false)
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content: "Done — your deposit bank account has been updated. Changes take effect within 1–2 business days.", suggestions: CONCEPT_ALL_PROMPTS },
    ])
  }, [])

  const advanceStepUpPanel = useCallback(() => {
    setStepUpPanelStep((s) => Math.min(3, s + 1) as 1 | 2 | 3)
  }, [])

  const submitStepUpPanel = useCallback(() => {
    setStepUpPanelOpen(false)
    setStepUpPanelStep(1)
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content: "New account confirmed and submitted. Micro-deposits will arrive in 1–2 business days — I'll notify you when they're ready to verify. Deposits continue to your current account until then.", suggestions: CONCEPT_ALL_PROMPTS },
    ])
  }, [])

  const openPanel = useCallback((type: string) => {
    setOpenPanels((prev) => prev.includes(type) ? prev : [...prev, type])
  }, [])

  const closePanel = useCallback((type: string) => {
    setOpenPanels((prev) => prev.filter((p) => p !== type))
  }, [])

  const closeAllNewPanels = useCallback(() => {
    setOpenPanels([])
    setDeclineReportFiltered(false)
    setWorkQueuePhase("triage")
  }, [])

  const submitDisputeDraft = useCallback(() => {
    setOpenPanels([])
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content: "Submitted to the processor. Case status updated to Dispute Filed. Next deadline: processor response due May 28.", suggestions: CONCEPT_ALL_PROMPTS },
    ])
  }, [])

  const activateProactiveNotification = useCallback(() => {
    setProactiveNotificationActive(true)
  }, [])

  const triggerProactiveFlow = useCallback(() => {
    playConceptScripted(CONCEPT_FLOW6_KEY)
  }, [playConceptScripted])

  const handlePrompt = useCallback((prompt: string) => {
    if (isConceptVersion && CONCEPT_SCRIPTED_CONVERSATIONS[prompt]) playConceptScripted(prompt)
    else if (isEmbed && SCRIPTED_CONVERSATIONS[prompt]) playScripted(prompt)
    else sendMessage(prompt)
  }, [isConceptVersion, isEmbed, sendMessage, playScripted, playConceptScripted])

  const startNewChat = useCallback(() => {
    stopRef.current = true
    scriptStopRef.current = true
    setView("welcome")
    setMessages([])
    setChatState("idle")
    setActiveSessionId(null)
    sessionIdRef.current = newSessionId()
    setPendingBot(null)
    setError(null)
    setReportPanelOpen(false)
    setFormPanelOpen(false)
    setStepUpPanelOpen(false)
    setStepUpPanelStep(1)
    setBatchPanelOpen(false)
    setOpenPanels([])
    setDeclineReportFiltered(false)
    setWorkQueuePhase("triage")
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
      isConceptVersion, reportPanelOpen, setReportPanelOpen, reportTopN,
      formPanelOpen, setFormPanelOpen, submitFormPanel,
      stepUpPanelOpen, setStepUpPanelOpen, stepUpPanelStep, advanceStepUpPanel, submitStepUpPanel,
      batchPanelOpen, setBatchPanelOpen,
      triggerProactiveFlow, proactiveNotificationActive, activateProactiveNotification,
      openPanels, openPanel, closePanel, closeAllNewPanels, submitDisputeDraft,
      declineReportFiltered, workQueuePhase,
    }}>
      {children}
    </Ctx.Provider>
  )
}
