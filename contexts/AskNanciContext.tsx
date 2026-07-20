"use client"

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import type { Message, Session, Source, UsageData, ConceptScriptedTurn, PanelId, PanelAction, SheetActionData } from "@/lib/ask-nanci/types"
import { usePanelStack } from "@/lib/ask-nanci/use-panel-stack"
import { turnToPanelActions } from "@/lib/ask-nanci/panel-actions"
import { usePendingBotSetter } from "@/contexts/ChatStreamContext"
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
import { CONCEPT_SCRIPTED_CONVERSATIONS, CONCEPT_FLOW6_KEY, CONCEPT_ALL_PROMPTS, CONCEPT_NO_RESET_PROMPTS, CONCEPT_MANUAL_PROMPTS, CONCEPT_FLOW16_FOLLOWUPS, CONCEPT_FAKE_FOLLOWUPS, CONCEPT_CHAT_TITLES } from "@/lib/ask-nanci/concept-config"
import { ACCOUNT_CHANGE_SHEET } from "@/lib/ask-nanci/data/panels/account-change"
import { FOUNDATION_SOURCE_ID, ONBOARDING_KEY } from "@/lib/ask-nanci/sourceStore"

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// Once the conversation moves past an assistant message (a new user turn is sent),
// drop that message's suggestion pills so a clicked pill doesn't linger.
const withClearedSuggestions = (msgs: Message[]): Message[] =>
  msgs.map((m, i) =>
    i === msgs.length - 1 && m.role === "assistant" && m.suggestions ? { ...m, suggestions: undefined } : m,
  )

type ChatView = "welcome" | "chat"
type ChatState = "idle" | "thinking" | "streaming"

interface AskNanciCtx {
  isEmbed: boolean
  embedVariant: EmbedVariant | null
  view: ChatView
  messages: Message[]
  chatState: ChatState
  chatTitle: string | null
  sessions: Session[]
  activeSessionId: string | null
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
  submitOfferApplication: (panelId: PanelId, message: string, sheetAction: SheetActionData) => void
  submitStepUpPanel: () => void
  triggerProactiveFlow: () => void
  proactiveNotificationActive: boolean
  activateProactiveNotification: () => void
  closingPanels: string[]
  closePanel: (type: string) => void
  dynamicPanels: PanelId[]
  openDynamic: (id: PanelId) => void
  closeDynamicPanel: (id: PanelId) => void
  setPanelView: (id: PanelId, view: string) => void
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
  // pendingBot lives in ChatStreamContext (see that file): its per-token churn must
  // not re-render this provider's ~40 consumers. We only ever write it here.
  const setPendingBot = usePendingBotSetter()
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
  // Manual-stepping playback: the active scripted flow and the index of the next
  // turn to play. A flow advances one step per suggestion-pill click, never auto-runs.
  const activeFlowRef = useRef<{ script: ConceptScriptedTurn[]; cursor: number } | null>(null)
  const sessionIdRef = useRef<string>(newSessionId())

  useEffect(() => {
    fetchSessions().then(setSessions)
    fetchPromptCategories().then(setPromptCategories)
    fetchAllQuestions().then(setAllQuestions)
    if (!isEmbed) fetchSources().then(setSourcesState)
    // ponytail: must stay in the effect — a lazy useState initializer would read
    // localStorage on the client but not the server, mismatching Dialog's `open` on hydrate.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!localStorage.getItem(ONBOARDING_KEY)) setOnboardingOpen(true)
  }, [isEmbed])


  const persistAndReload = useCallback(async (msgs: Message[]) => {
    // Concept flows carry a curated title (Figma) instead of the raw first prompt.
    const firstUser = msgs.find((m) => m.role === "user")
    const titleOverride = firstUser ? CONCEPT_CHAT_TITLES[firstUser.content] : undefined
    await persistSession(msgs, sessionIdRef.current, titleOverride)
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

  // The single place a panel effect is applied — driven by both scripted turns (via
  // applyTurnEffects → turnToPanelActions) and a real backend stream ("action" chunk).
  const applyPanelAction = useCallback((action: PanelAction) => {
    switch (action.op) {
      case "open":
        openDynamic(action.id)
        // With a view, set it; without, reset the panel to its own default view.
        if (action.view) setPanelView(action.id, action.view)
        else clearPanelView(action.id)
        break
      case "close":
        closeDynamicPanel(action.id)
        break
      case "filterDeclineReport":
        setDeclineReportFiltered(true)
        break
    }
  }, [])

  const applyTurnEffects = useCallback((turn: ConceptScriptedTurn) => {
    turnToPanelActions(turn).forEach(applyPanelAction)
  }, [applyPanelAction])

  // Shared assistant-turn playback for both players (manual runConceptStep + auto
  // runConceptAuto): stream the reply, attach any sheet/suggestions/widget/map,
  // apply panel effects, and stagger a closeAll if the turn asks for it. `suggestions`
  // differs per caller (manual falls back to the next question), so it's passed in.
  const playAssistantTurn = useCallback(async (turn: ConceptScriptedTurn, suggestions: string[] | undefined) => {
    await streamWords(turn.content, { id: newSessionId(), shouldStop: () => scriptStopRef.current })
    if (turn.widgetDelay) await sleep(turn.widgetDelay)
    if (turn.sheetAction || suggestions || turn.widget || turn.map || turn.source) {
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last && last.role === "assistant") {
          next[next.length - 1] = {
            ...last,
            ...(turn.sheetAction ? { sheetAction: turn.sheetAction } : {}),
            ...(suggestions ? { suggestions } : {}),
            ...(turn.widget ? { widget: turn.widget } : {}),
            ...(turn.map ? { map: turn.map } : {}),
            ...(turn.source ? { source: turn.source } : {}),
          }
        }
        return next
      })
    }
    if (turn.pauseAfter) await sleep(turn.pauseAfter)
    applyTurnEffects(turn)
    if (turn.closeAllPanels) {
      await sleep(600)
      // Stagger panels closed — right column first, then left.
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
  }, [streamWords, applyTurnEffects, dynamicPanels])

  // Play one manual step of the active flow: the pending user turn (if any) plus the
  // assistant turn(s) that follow, then stop and surface the next user question as a
  // suggestion pill. Clicking it calls this again — flows never auto-advance.
  const runConceptStep = useCallback(async () => {
    const flow = activeFlowRef.current
    if (!flow) return
    const { script } = flow
    scriptStopRef.current = false
    let i = flow.cursor

    // Leading user turn — appears immediately, as if the merchant just sent it.
    if (script[i]?.role === "user") {
      const turn = script[i]
      await sleep(250)
      if (scriptStopRef.current) return
      setMessages((prev) => [...withClearedSuggestions(prev), { id: newSessionId(), role: "user" as const, content: turn.content }])
      applyTurnEffects(turn)
      if (turn.pauseAfter) await sleep(turn.pauseAfter)
      setChatState("thinking")
      i++
    }

    // Stream the assistant turn(s) up to the next user turn (or end of script).
    while (i < script.length && script[i].role === "assistant") {
      const turn = script[i]
      await sleep(turn.widget ? 1200 : 1000)
      if (scriptStopRef.current) return
      const nextIsUser = script[i + 1]?.role === "user"
      // The pill is the authored suggestions if present, else the next user question.
      const suggestions = turn.suggestions ?? (nextIsUser ? [script[i + 1].content] : undefined)
      await playAssistantTurn(turn, suggestions)
      i++
      // Stop unless the next turn is another consecutive assistant turn.
      if (script[i]?.role !== "assistant") break
    }

    // Park at the next user turn (wait for the pill click) or end the flow.
    activeFlowRef.current = script[i]?.role === "user" ? { script, cursor: i } : null
    setChatState("idle")
  }, [playAssistantTurn, applyTurnEffects])

  // Auto-play (non-manual flows): run the whole script start to finish, advancing
  // user turns on a timer. This is the original behavior for the interaction-pattern
  // flows; Merchant Money flows step manually via runConceptStep instead.
  const runConceptAuto = useCallback(async (script: ConceptScriptedTurn[]) => {
    for (let i = 0; i < script.length; i++) {
      if (scriptStopRef.current) break
      const turn = script[i]
      if (turn.role === "user") {
        await sleep(i === 0 ? 1000 : 1800)
        if (scriptStopRef.current) break
        setMessages((prev) => [...withClearedSuggestions(prev), { id: newSessionId(), role: "user" as const, content: turn.content }])
        if (turn.pauseAfter) await sleep(turn.pauseAfter)
        applyTurnEffects(turn)
        setChatState("thinking")
      } else {
        await sleep(1800)
        if (scriptStopRef.current) break
        await playAssistantTurn(turn, turn.suggestions)
        if (i === script.length - 1) setChatState("idle")
      }
    }
  }, [playAssistantTurn, applyTurnEffects])

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
    // If the script opens with an assistant turn, show the thinking indicator now.
    if (script[0]?.role === "assistant") setChatState("thinking")

    if (CONCEPT_MANUAL_PROMPTS.has(prompt)) {
      // Merchant Money flows: step one turn per pill click.
      activeFlowRef.current = { script, cursor: 0 }
      runConceptStep()
    } else {
      // Everything else auto-plays as before.
      activeFlowRef.current = null
      runConceptAuto(script)
    }
  }, [runConceptStep, runConceptAuto])

  // Advance the active flow one step when its next-question pill is clicked.
  const advanceConceptFlow = useCallback(() => {
    if (activeFlowRef.current) runConceptStep()
  }, [runConceptStep])

  const submitFormPanel = useCallback(() => {
    closeDynamicPanel("bank-account-form")
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content: "Done — your deposit bank account has been updated. Changes take effect within 1–2 business days.", suggestions: CONCEPT_ALL_PROMPTS },
    ])
  }, [closeDynamicPanel])

  // Offer flows (credit-card-offer / business-loan-offer): the panel's form submit
  // closes the panel and drops the pending-review success message + audit card. The
  // message/sheetAction are built in the panel from the offer the merchant chose.
  const submitOfferApplication = useCallback((panelId: PanelId, message: string, sheetAction: SheetActionData) => {
    closeDynamicPanel(panelId)
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content: message, sheetAction, suggestions: CONCEPT_ALL_PROMPTS },
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
    setPanelView("pending-deposits", "notified")
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
    // Confirmation is a drawer (ChangeAuditSheet), not a panel view — close the panel.
    closeDynamicPanel("account-change")
    setMessages((prev) => [...prev, { id: newSessionId(), role: "user" as const, content: "Confirm" }])
    setChatState("thinking")
    sleep(600).then(() => streamAssistantReply(
      "Request submitted at 3:40 PM. A confirmation was sent to the email teresawalker@example.com. Deposits continue going to your current account until the new one is verified — typically within 1–2 business days. I'll notify you once it's active.",
      { sheetAction: ACCOUNT_CHANGE_SHEET, suggestions: CONCEPT_FLOW16_FOLLOWUPS }
    ))
  }, [streamAssistantReply, closeDynamicPanel])

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
    if (isConceptVersion) {
      // Fake end-of-flow follow-ups are decorative only — no conversation behind them.
      if (CONCEPT_FAKE_FOLLOWUPS.has(prompt)) return
      // A pill that matches the active flow's pending user turn steps it forward,
      // rather than restarting a flow keyed by that same text.
      const flow = activeFlowRef.current
      if (flow && flow.script[flow.cursor]?.role === "user" && flow.script[flow.cursor].content === prompt) {
        advanceConceptFlow()
        return
      }
      if (CONCEPT_SCRIPTED_CONVERSATIONS[prompt]) { playConceptScripted(prompt); return }
    }
    if (isEmbed && SCRIPTED_CONVERSATIONS[prompt]) { playScripted(prompt); return }
    sendMessage(prompt)
  }, [isConceptVersion, isEmbed, sendMessage, playScripted, playConceptScripted, advanceConceptFlow])

  const startNewChat = useCallback(() => {
    stopRef.current = true
    scriptStopRef.current = true
    activeFlowRef.current = null
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
    activeFlowRef.current = null
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
    persistSources(next.filter((s) => s.id !== FOUNDATION_SOURCE_ID))
  }, [])

  const openSettings = useCallback(() => {
    setSettingsOpen(true)
  }, [])

  // Curated chat-column title (Figma) for the active concept conversation, else null.
  const firstUserContent = messages.find((m) => m.role === "user")?.content
  const chatTitle = isConceptVersion && firstUserContent ? (CONCEPT_CHAT_TITLES[firstUserContent] ?? null) : null

  return (
    <Ctx.Provider value={{
      isEmbed, embedVariant,
      view, messages, chatState, chatTitle, sessions, activeSessionId,
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
      submitFormPanel, submitOfferApplication, submitStepUpPanel,
      triggerProactiveFlow, proactiveNotificationActive, activateProactiveNotification,
      closingPanels, closePanel, closeAllNewPanels, submitDisputeDraft,
      dynamicPanels, openDynamic, closeDynamicPanel, setPanelView,
      declineReportFiltered,
      submitAccountChangeDetails, goBackAccountChangeStep, confirmAccountChange, requestDepositNotify,
      panelViews, clearPanelView,
    }}>
      {children}
    </Ctx.Provider>
  )
}
