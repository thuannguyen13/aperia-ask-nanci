"use client"

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import type { Message, Session, Source, UsageData, ConceptScriptedTurn, PanelId } from "@/lib/ask-nanci/types"
import { usePanelStack } from "@/lib/ask-nanci/use-panel-stack"
import {
  fetchSessions,
  persistSession,
  removeSessionById,
  newSessionId,
  fetchSources,
  persistSources,
  streamChat,
  fetchPromptCategories,
  fetchAllQuestions,
} from "@/lib/ask-nanci/api"
import type { CurrentUser, PromptCategory } from "@/lib/ask-nanci/api"
import { MOCK_USAGE, DEFAULT_CURRENT_USER } from "@/lib/ask-nanci/mock-data"
import { EMBED_DEMO_SOURCES, EMBED_BUSINESS_OWNER_DEMO_SOURCES, EMBED_ISO_DEMO_SOURCES, EMBED_VW_DEMO_SOURCES, SCRIPTED_CONVERSATIONS } from "@/lib/ask-nanci/embed-demo-config"
import type { EmbedVariant } from "@/lib/ask-nanci/embed-demo-config"
import { CONCEPT_SCRIPTED_CONVERSATIONS, CONCEPT_FLOW6_KEY, CONCEPT_ALL_PROMPTS, CONCEPT_NO_RESET_PROMPTS } from "@/lib/ask-nanci/concept-config"
import { CLOVER_SOURCE_ID, ONBOARDING_KEY } from "@/lib/ask-nanci/sourceStore"

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

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
  stopAnimation: () => void
  startNewChat: () => void
  replayFlow: (() => void) | null
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
  tokenLimitReached: boolean
  setTokenLimitReached: (v: boolean) => void
  settingsOpen: boolean
  openSettings: () => void
  setSettingsOpen: (open: boolean) => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
  onboardingOpen: boolean
  setOnboardingOpen: (open: boolean) => void
  isConceptVersion: boolean
  submitFormPanel: () => void
  submitStepUpPanel: () => void
  triggerProactiveFlow: () => void
  proactiveNotificationActive: boolean
  activateProactiveNotification: () => void
  closingPanels: string[]
  closePanel: (type: string) => void
  dynamicPanels: PanelId[]
  closeDynamicPanel: (id: PanelId) => void
  closeAllNewPanels: () => void
  submitDisputeDraft: () => void
  declineReportFiltered: boolean
  submitAccountChangeDetails: () => void
  goBackAccountChangeStep: () => void
  confirmAccountChange: () => void
  requestDepositNotify: () => void
  panelViews: Record<string, string>
  clearPanelView: (id: PanelId) => void
}

const Ctx = createContext<AskNanciCtx | null>(null)

export function useAskNanci() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useAskNanci must be used inside AskNanciProvider")
  return ctx
}

// A panel reads its current view via this hook, falling back to its own default
// when a flow hasn't set one. Replaces the per-flow phase enums.
export function usePanelView(id: PanelId, fallback: string): string {
  return useAskNanci().panelViews[id] ?? fallback
}

export function AskNanciProvider({ children, isEmbed = false, embedVariant = null, isConceptVersion = false, autoPlayFlow = null }: { children: React.ReactNode; isEmbed?: boolean; embedVariant?: EmbedVariant | null; isConceptVersion?: boolean; autoPlayFlow?: string | null }) {
  const [view, setView] = useState<ChatView>(embedVariant === "concept-embed" ? "chat" : "welcome")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatState, setChatState] = useState<ChatState>("idle")
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [pendingBot, setPendingBot] = useState<Message | null>(null)
  const [sources, setSourcesState] = useState<Source[]>(
    isEmbed ? (
      embedVariant === "business-owner" ? EMBED_BUSINESS_OWNER_DEMO_SOURCES :
      embedVariant === "iso" ? EMBED_ISO_DEMO_SOURCES :
      embedVariant === "vw" ? EMBED_VW_DEMO_SOURCES :
      EMBED_DEMO_SOURCES) : []
  )
  const [thinking, setThinking] = useState<{ source: Source | null; label: string }>({ source: null, label: "Thinking…" })
  const [kbOpen, setKbOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [usage] = useState<UsageData>(MOCK_USAGE)
  const [currentUser] = useState<CurrentUser | null>(DEFAULT_CURRENT_USER)
  const [promptCategories, setPromptCategories] = useState<PromptCategory[]>([])
  const [allQuestions, setAllQuestions] = useState<string[]>([])
  const [tokenLimitReached, setTokenLimitReached] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [closingPanels, setClosingPanels] = useState<string[]>([])
  const { stack: dynamicPanels, openDynamic, closeDynamic: closeDynamicPanel, resetDynamic } = usePanelStack()
  const [declineReportFiltered, setDeclineReportFiltered] = useState(false)
  // Unified panel view state (concept-flow pipeline): one map replaces the per-flow
  // phase enums. A panel reads its view via usePanelView(id, fallback).
  const [panelViews, setPanelViews] = useState<Record<string, string>>({})
  const [proactiveNotificationActive, setProactiveNotificationActive] = useState(false)
  const stopRef = useRef<boolean>(false)
  const scriptStopRef = useRef<boolean>(false)
  const sessionIdRef = useRef<string>(newSessionId())

  useEffect(() => {
    fetchSessions().then(setSessions)
    fetchPromptCategories().then(setPromptCategories)
    fetchAllQuestions().then(setAllQuestions)
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
        for await (const chunk of streamChat(allMsgs, activeSources, sentSessionId, embedVariant)) {
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

  // Stream `text` word-by-word into pendingBot, then commit it to messages.
  // The one place all three scripted playback paths do token-streaming.
  const streamWords = useCallback((
    text: string,
    opts: { id?: string; extra?: Partial<Message>; shouldStop?: () => boolean; onDone?: () => void } = {},
  ) =>
    new Promise<void>((resolve) => {
      const botMsg: Message = { id: opts.id ?? newSessionId(), role: "assistant", content: "" }
      setChatState("streaming")
      const chunks = text.match(/\S+\s*/g) ?? []   // word-boundary chunks mimic token streaming
      let i = 0
      const tick = () => {
        if (opts.shouldStop?.()) { setPendingBot(null); resolve(); return }
        if (i >= chunks.length) {
          setMessages((prev) => [...prev, { ...botMsg, content: text, ...opts.extra }])
          setPendingBot(null)
          opts.onDone?.()
          resolve()
          return
        }
        botMsg.content += chunks[i++]
        setPendingBot({ ...botMsg })
        setTimeout(tick, 50 + Math.random() * 70)
      }
      tick()
    }), [])

  const playScripted = useCallback((prompt: string) => {
    const script = SCRIPTED_CONVERSATIONS[prompt]
    if (!script) return
    setThinking((prev) => ({ ...prev, label: "Updating your account…" }))
    setView("chat")
    setMessages([])
    setChatState("idle")
    setPendingBot(null)

    const streamText = (turn: typeof script[number], id: string) =>
      streamWords(turn.content, { id, extra: turn.map ? { map: turn.map } : undefined })

    const run = async () => {
      for (let i = 0; i < script.length; i++) {
        const turn = script[i]
        if (turn.role === "user") {
          await sleep(i === 0 ? 1000 : 1800)
          setMessages((prev) => [...prev, { id: newSessionId(), role: "user" as const, content: turn.content }])
          setChatState("thinking")
        } else {
          await sleep(1800)
          await streamText(turn, newSessionId())
          if (i === script.length - 1) { setChatState("idle"); setThinking({ source: null, label: "Thinking…" }) }
        }
      }
    }

    run()
  }, [])

  // Unified panel view setters (concept-flow pipeline).
  const setPanelView = useCallback((id: PanelId, view: string) => {
    setPanelViews((prev) => ({ ...prev, [id]: view }))
  }, [])
  const clearPanelView = useCallback((id: PanelId) => {
    setPanelViews((prev) => {
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])
  const resetPanelViews = useCallback(() => setPanelViews({}), [])

  const applyTurnEffects = useCallback((turn: ConceptScriptedTurn) => {
    // Unified vocabulary: `panel` opens (idempotent); `view` sets its view, else the
    // panel resets to its own default view on open; `closePanel` closes one panel.
    if (turn.panel) {
      openDynamic(turn.panel)
      if (turn.view) setPanelView(turn.panel, turn.view)
      else clearPanelView(turn.panel)
    }
    if (turn.closePanel) { closeDynamicPanel(turn.closePanel) }
    if (turn.filterDeclineReport) { setDeclineReportFiltered(true) }
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

    const streamText = (text: string, id: string) =>
      streamWords(text, { id, shouldStop: () => scriptStopRef.current })

    // If the script starts with an assistant turn (no leading user message),
    // show the thinking indicator immediately so there's feedback on click.
    if (script[0]?.role === "assistant") setChatState("thinking")

    const run = async () => {
      for (let i = 0; i < script.length; i++) {
        if (scriptStopRef.current) break
        const turn = script[i]
        if (turn.role === "user") {
          await sleep(i === 0 ? 1000 : 1800)
          if (scriptStopRef.current) break
          setMessages((prev) => [...prev, { id: newSessionId(), role: "user" as const, content: turn.content }])
          if (turn.pauseAfter) await sleep(turn.pauseAfter)
          applyTurnEffects(turn)
          setChatState("thinking")
        } else {
          await sleep(1800)
          if (scriptStopRef.current) break
          await streamText(turn.content, newSessionId())
          if (turn.widgetDelay) await sleep(turn.widgetDelay)
          if (turn.sheetAction || turn.suggestions || turn.widget || turn.map) {
            setMessages((prev) => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last && last.role === "assistant") {
                next[next.length - 1] = {
                  ...last,
                  ...(turn.sheetAction ? { sheetAction: turn.sheetAction } : {}),
                  ...(turn.suggestions ? { suggestions: turn.suggestions } : {}),
                  ...(turn.widget ? { widget: turn.widget } : {}),
                  ...(turn.map ? { map: turn.map } : {}),
                }
              }
              return next
            })
          }
          if (turn.pauseAfter) await sleep(turn.pauseAfter)
          applyTurnEffects(turn)
          if (turn.closeAllPanels) {
            await sleep(600)
            // Stagger panels closed — right column first, then left
            const current = [...dynamicPanels]
            const rightFirst = ["coastal-risk", "transaction-receipt", "email-draft", "change-log"]
            const first = current.find(p => rightFirst.includes(p))
            const rest = current.filter(p => p !== first)
            if (first) { setClosingPanels([first]); await sleep(350) }
            if (rest.length) { setClosingPanels(current); await sleep(350) }
            setClosingPanels([])
            resetDynamic()
            setDeclineReportFiltered(false)
            resetPanelViews()
          }
          if (i === script.length - 1) {
            setChatState("idle")
          }
        }
      }
    }

    run()
  }, [])

  const submitFormPanel = useCallback(() => {
    closeDynamicPanel("bank-account-form")
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content: "Done — your deposit bank account has been updated. Changes take effect within 1–2 business days.", suggestions: CONCEPT_ALL_PROMPTS },
    ])
  }, [closeDynamicPanel])

  const submitStepUpPanel = useCallback(() => {
    closeDynamicPanel("step-up-auth")
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content: "New account confirmed and submitted. Micro-deposits will arrive in 1–2 business days — I'll notify you when they're ready to verify. Deposits continue to your current account until then.", suggestions: CONCEPT_ALL_PROMPTS },
    ])
  }, [closeDynamicPanel])

  // Every panel is now on the dynamic stack; closePanel(id) just closes it there.
  const closePanel = useCallback((id: string) => {
    closeDynamicPanel(id as PanelId)
  }, [closeDynamicPanel])

  const closeAllNewPanels = useCallback(() => {
    resetDynamic()
    setDeclineReportFiltered(false)
    resetPanelViews()
  }, [])

  const requestDepositNotify = useCallback(() => {
    setPanelView("flagged-transaction", "notified")
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content: "Done. You'll get a notification when Sunday's batch funds.", suggestions: CONCEPT_ALL_PROMPTS },
    ])
  }, [])

  const streamAssistantReply = useCallback(
    (content: string, extra?: Partial<Message>) =>
      streamWords(content, { extra, onDone: () => setChatState("idle") }),
    [streamWords],
  )

  const submitAccountChangeDetails = useCallback(() => {
    setPanelView("account-change", "confirm")
    setMessages((prev) => [...prev, { id: newSessionId(), role: "user" as const, content: "Request Changes" }])
    setChatState("thinking")
    sleep(600).then(() => streamAssistantReply(
      "Routing number checks out to First National. This is a financial change, so I'll verify it's you first — I've sent a 6-digit code to your email teresawalker@example.com. Enter it to confirm."
    ))
  }, [streamAssistantReply])

  const goBackAccountChangeStep = useCallback(() => {
    setPanelView("account-change", "details")
  }, [])

  const confirmAccountChange = useCallback(() => {
    setPanelView("account-change", "done")
    setMessages((prev) => [...prev, { id: newSessionId(), role: "user" as const, content: "Confirm" }])
    setChatState("thinking")
    sleep(600).then(() => streamAssistantReply(
      "Request submitted at 3:40 PM. A confirmation was sent to the email teresawalker@example.com. Deposits continue going to your current account until the new one is verified — typically within 1–2 business days. I'll notify you once it's active.",
      { suggestions: CONCEPT_ALL_PROMPTS }
    ))
  }, [streamAssistantReply])

  const submitDisputeDraft = useCallback(() => {
    resetDynamic()
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
    resetDynamic()
    setDeclineReportFiltered(false)
    resetPanelViews()
  }, [])

  // Always call the hook (rules-of-hooks); expose it only when there's a flow to replay.
  const doReplayFlow = useCallback(() => {
    if (!autoPlayFlow) return
    scriptStopRef.current = true
    stopRef.current = true
    setMessages([])
    setChatState("idle")
    setPendingBot(null)
    setError(null)
    resetDynamic()
    setClosingPanels([])
    setDeclineReportFiltered(false)
    setProactiveNotificationActive(false)
    resetPanelViews()
    setTimeout(() => playConceptScripted(autoPlayFlow), 300)
  }, [autoPlayFlow])
  const replayFlow: (() => void) | null = autoPlayFlow ? doReplayFlow : null

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

  const openSettings = useCallback(() => {
    setSettingsOpen(true)
  }, [])

  return (
    <Ctx.Provider value={{
      isEmbed, embedVariant,
      view, messages, chatState, sessions, activeSessionId,
      pendingBot,
      sendMessage, handlePrompt, stopAnimation, startNewChat, replayFlow, resumeSession,
      deleteSessionById,
      sources, setSources: handleSetSources, thinking,
      kbOpen, setKbOpen,
      draft, setDraft,
      error,
      usage, currentUser, promptCategories, allQuestions,
      tokenLimitReached, setTokenLimitReached,
      settingsOpen, openSettings, setSettingsOpen,
      mobileSidebarOpen, setMobileSidebarOpen,
      onboardingOpen, setOnboardingOpen,
      isConceptVersion,
      submitFormPanel, submitStepUpPanel,
      triggerProactiveFlow, proactiveNotificationActive, activateProactiveNotification,
      closingPanels, closePanel, closeAllNewPanels, submitDisputeDraft,
      dynamicPanels, closeDynamicPanel,
      declineReportFiltered,
      submitAccountChangeDetails, goBackAccountChangeStep, confirmAccountChange, requestDepositNotify,
      panelViews, clearPanelView,
    }}>
      {children}
    </Ctx.Provider>
  )
}
