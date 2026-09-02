"use client"

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import type { Message, Session, Source, UsageData, ConceptScriptedTurn, PanelId, PanelAction, SheetActionData } from "@/lib/ask-nanci/types"
import { usePanelStack } from "@/lib/ask-nanci/use-panel-stack"
import { turnToPanelActions } from "@/lib/ask-nanci/panel-actions"
import { streamWords as streamWordChunks } from "@/lib/ask-nanci/stream-words"
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
import { CONCEPT_SCRIPTED_CONVERSATIONS, CONCEPT_FLOW6_KEY, CONCEPT_ALL_PROMPTS, CONCEPT_PANEL_REPLIES, CONCEPT_NO_RESET_PROMPTS, CONCEPT_MANUAL_PROMPTS, CONCEPT_FLOW16_FOLLOWUPS, CONCEPT_FAKE_FOLLOWUPS, CONCEPT_CHAT_TITLES, CONCEPT_DECLINE_REPLIES, CONCEPT_OFFER_NO } from "@/lib/ask-nanci/data/flows.concept"
import { ACCOUNT_CHANGE_SHEET } from "@/lib/ask-nanci/data/panels/account-change"
import { FOUNDATION_SOURCE_ID } from "@/lib/ask-nanci/source-store"
import { ONBOARDING_KEY } from "@/lib/ask-nanci/storage-keys"

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
  marketplaceOpen: boolean
  setMarketplaceOpen: (open: boolean) => void
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
  // The mobile panel sheet (MobilePanelSwitcher). Below md a panel cannot sit beside
  // the chat, so one sheet carries it and this is the whole of its state: which panel
  // it shows, and whether it has been swiped away. Both live here rather than in the
  // sheet because the panel-opening path is what sets them.
  /** Which panel the phone's single sheet is showing. */
  shownPanelId: PanelId | null
  setShownPanelId: (id: PanelId) => void
  /** The sheet was dismissed (swipe, Escape, back or scrim) with panels still open. */
  panelSheetDismissed: boolean
  dismissPanelSheet: () => void
  /** The brand-bar toggle's way back to a dismissed sheet. */
  reopenPanelSheet: () => void
  /**
   * Derived: a panel is open and the sheet has not been dismissed. True on desktop
   * too, where no sheet renders, so a consumer that means "the phone sheet is up"
   * has to pair this with useIsMobile().
   */
  panelSheetOpen: boolean
  onboardingOpen: boolean
  setOnboardingOpen: (open: boolean) => void
  /** `?mode=onboarding` — replay onboarding on every load and never record that it ran. */
  forceOnboarding: boolean
  /** `?brand=generic` — the offer flows drop partner branding for neutral descriptors. */
  genericBrand: boolean
  /**
   * The product tour is running. The sidebar reads this to stay expanded: it is a
   * hover rail by default, and three tour steps point at things only the open rail
   * renders (the Link Accounts card is not in the DOM when collapsed).
   */
  tourActive: boolean
  setTourActive: (active: boolean) => void
  /**
   * Bumped by `/tour` to replay the walkthrough on demand. A counter rather than a
   * boolean so asking twice in one session starts it twice — a flag would already be
   * true the second time and do nothing.
   */
  tourRequest: number
  requestTour: () => void
  /**
   * True once a concept flow has played its last turn. `chatState === "idle"` cannot
   * stand in for this: a manual (Merchant Money) flow goes idle between every step
   * while it waits for the next pill click, so it would read as finished mid-demo.
   */
  flowFinished: boolean
  /**
   * Would clicking this suggestion abandon the demo the URL pinned? Only ever true
   * in a `?flow=` embed, where the flow is the whole point of the page — elsewhere a
   * chip that starts another conversation is exactly what the user wants.
   */
  leavesCurrentFlow: (prompt: string) => boolean
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
  /**
   * Opens a panel. `reveal` is whether the phone's sheet should come up with it:
   * true when the reader asked (tapping the artifact card, a console button), false
   * when a scripted turn opened it on their behalf. Defaults to true, so a caller that
   * has not thought about it gets the deliberate case.
   */
  openDynamic: (id: PanelId, opts?: { reveal?: boolean }) => void
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

const AskNanciContext = createContext<AskNanciCtx | null>(null)

export function useAskNanci() {
  const ctx = useContext(AskNanciContext)
  if (!ctx) throw new Error("useAskNanci must be used inside AskNanciProvider")
  return ctx
}

// A panel reads its current view via this hook, falling back to its own default
// when a flow hasn't set one. Replaces the per-flow phase enums.
export function usePanelView(id: PanelId, fallback: string): string {
  return useAskNanci().panelViews[id] ?? fallback
}

export function AskNanciProvider({ children, isEmbed = false, embedVariant = null, isConceptVersion = false, autoPlayFlow = null, autoPlay = false, initialView, initialMarketplaceOpen = false, forceOnboarding = false, genericBrand = false }: { children: React.ReactNode; isEmbed?: boolean; embedVariant?: EmbedVariant | null; isConceptVersion?: boolean; autoPlayFlow?: string | null; autoPlay?: boolean; initialView?: ChatView; initialMarketplaceOpen?: boolean; forceOnboarding?: boolean; genericBrand?: boolean }) {
  const [view, setView] = useState<ChatView>(initialView ?? (embedVariant === "concept-embed" ? "chat" : "welcome"))
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
      embedVariant === "vw" || embedVariant === "abc" || embedVariant === "concept-embed" ? EMBED_VW_DEMO_SOURCES :
      EMBED_DEMO_SOURCES) : []
  )
  const [thinking, setThinking] = useState<{ source: Source | null; label: string }>({ source: null, label: "Thinking…" })
  // Teach Nanci and Service Marketplace are mutually exclusive — opening one
  // closes the other (one panel per user action). Enforced in the setters so
  // every call site (sidebar, welcome page) gets the behavior for free.
  const [kbOpen, setKbOpenState] = useState(false)
  const [marketplaceOpen, setMarketplaceOpenState] = useState(initialMarketplaceOpen)
  const setKbOpen = useCallback((open: boolean) => {
    setKbOpenState(open)
    if (open) setMarketplaceOpenState(false)
  }, [])
  const setMarketplaceOpen = useCallback((open: boolean) => {
    setMarketplaceOpenState(open)
    if (open) setKbOpenState(false)
  }, [])
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const usage: UsageData = MOCK_USAGE
  const currentUser: CurrentUser | null = DEFAULT_CURRENT_USER
  const [promptCategories, setPromptCategories] = useState<PromptCategory[]>([])
  const [allQuestions, setAllQuestions] = useState<string[]>([])
  const [tokenLimitReached, setTokenLimitReached] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const [flowFinished, setFlowFinished] = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const [tourRequest, setTourRequest] = useState(0)
  const requestTour = useCallback(() => setTourRequest((n) => n + 1), [])
  const [closingPanels, setClosingPanels] = useState<string[]>([])
  const { stack: dynamicPanels, stackRef: dynamicPanelsRef, openDynamic: pushPanel, closeDynamic: closeDynamicPanel, resetDynamic: resetPanelStack } = usePanelStack()
  // The mobile sheet's state, set from the panel-opening path below rather than
  // watched for from the sheet: a stack the sheet only observes cannot tell an open
  // from a close, and only an open should move it.
  const [shownPanelId, setShownPanelId] = useState<PanelId | null>(null)
  const [panelSheetDismissed, setPanelSheetDismissed] = useState(false)
  const dismissPanelSheet = useCallback(() => setPanelSheetDismissed(true), [])
  const reopenPanelSheet = useCallback(() => setPanelSheetDismissed(false), [])
  const panelSheetOpen = dynamicPanels.length > 0 && !panelSheetDismissed

  // A turn that opens a panel should show it on a phone, not just park it behind the
  // brand-bar badge: the script says "I've opened the breakdown in the panel" and the
  // panel has to be there. Guarded the same way the stack itself is, so re-opening a
  // panel that is already up is still a no-op and closing one never yanks another
  // into view.
  const openDynamic = useCallback((id: PanelId, opts?: { reveal?: boolean }) => {
    if (dynamicPanelsRef.current.includes(id)) return
    pushPanel(id)
    setShownPanelId(id)
    // Only a panel the reader asked for takes over the phone's screen. One the script
    // opened waits as its handle instead, because covering the answer they are still
    // reading to show them the thing that answer just described is the wrong trade.
    // Nothing changes on desktop: panelSheetDismissed only feeds the mobile sheet.
    setPanelSheetDismissed(opts?.reveal === false)
  }, [pushPanel, dynamicPanelsRef])

  // Every path that empties the stack goes through here, so the sheet's two fields
  // are reset in one place rather than at each of the five call sites.
  const resetDynamic = useCallback(() => {
    resetPanelStack()
    setShownPanelId(null)
    setPanelSheetDismissed(false)
  }, [resetPanelStack])
  const [declineReportFiltered, setDeclineReportFiltered] = useState(false)
  // Unified panel view state (concept-flow pipeline): one map replaces the per-flow
  // phase enums. A panel reads its view via usePanelView(id, fallback).
  const [panelViews, setPanelViews] = useState<Record<string, string>>({})
  const [proactiveNotificationActive, setProactiveNotificationActive] = useState(false)
  const stopRef = useRef<boolean>(false)
  const scriptStopRef = useRef<boolean>(false)
  // Manual-stepping playback: the active scripted flow and the index of the next
  // turn to play. A flow advances one step per suggestion-pill click, never auto-runs.
  const activeFlowRef = useRef<{ key: string; script: ConceptScriptedTurn[]; cursor: number } | null>(null)
  // Reentrancy guard for runConceptStep: a step reads activeFlowRef.cursor at the top and
  // only writes it back at the end, so a second pill click mid-step would replay the same
  // cursor and interleave two runs. While a step is in flight, further calls are no-ops.
  const isAdvancingRef = useRef<boolean>(false)
  const sessionIdRef = useRef<string>(newSessionId())

  useEffect(() => {
    fetchSessions().then(setSessions)
    fetchPromptCategories().then(setPromptCategories)
    fetchAllQuestions().then(setAllQuestions)
    if (!isEmbed) fetchSources().then(setSourcesState)
    // ponytail: must stay in the effect — a lazy useState initializer would read
    // localStorage on the client but not the server, mismatching Dialog's `open` on hydrate.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (forceOnboarding || !localStorage.getItem(ONBOARDING_KEY)) setOnboardingOpen(true)
  }, [isEmbed, forceOnboarding])


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
  const streamWords = useCallback(async (
    text: string,
    opts: { id?: string; extra?: Partial<Message>; shouldStop?: () => boolean; onDone?: () => void } = {},
  ) => {
    const botMsg: Message = { id: opts.id ?? newSessionId(), role: "assistant", content: "" }
    setChatState("streaming")
    const done = await streamWordChunks(text, (partial) => setPendingBot({ ...botMsg, content: partial }), {
      shouldStop: opts.shouldStop,
    })
    if (done) setMessages((prev) => [...prev, { ...botMsg, content: text, ...opts.extra }])
    setPendingBot(null)
    if (done) opts.onDone?.()
  }, [])

  // Append one canned assistant message — the tail every panel-submit handler shares.
  // Pills default to the full prompt set, which is what a completed panel action ends
  // with; pass `suggestions: undefined` in `extra` to opt out (the offer flows do —
  // their follow-ups live on the sheet instead).
  const appendAssistant = useCallback((content: string, extra?: Partial<Message>) => {
    setMessages((prev) => [
      ...prev,
      { id: newSessionId(), role: "assistant" as const, content, suggestions: CONCEPT_ALL_PROMPTS, ...extra },
    ])
  }, [])

  const playScripted = useCallback((prompt: string) => {
    const script = SCRIPTED_CONVERSATIONS[prompt]
    if (!script) return
    // Same reset the concept players do before a run: a previous startNewChat/stopAnimation
    // left the stop refs raised, and this playback owns them from here.
    scriptStopRef.current = false
    stopRef.current = false
    setThinking((prev) => ({ ...prev, label: "Updating your account…" }))
    setView("chat")
    setMessages([])
    setChatState("idle")
    setPendingBot(null)

    // startNewChat raises both refs; either one ends this playback.
    const shouldStop = () => scriptStopRef.current || stopRef.current

    const streamText = (turn: typeof script[number], id: string) =>
      streamWords(turn.content, { id, extra: turn.map ? { map: turn.map } : undefined, shouldStop })

    const run = async () => {
      for (let i = 0; i < script.length; i++) {
        if (shouldStop()) break
        const turn = script[i]
        if (turn.role === "user") {
          await sleep(i === 0 ? 1000 : 1800)
          if (shouldStop()) break
          setMessages((prev) => [...prev, { id: newSessionId(), role: "user" as const, content: turn.content }])
          setChatState("thinking")
        } else {
          await sleep(1800)
          if (shouldStop()) break
          await streamText(turn, newSessionId())
          if (i === script.length - 1) { setChatState("idle"); setThinking({ source: null, label: "Thinking…" }) }
        }
      }
      // Bail leaves the thinking indicator up and (mid-stream) a partial bubble —
      // clear both, the same way sendMessage's run() bails.
      if (shouldStop()) { setChatState("idle"); setPendingBot(null) }
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
        // A scripted turn, or a backend "action" chunk: the reader did not ask for this
        // panel, so it arrives resting rather than open. See openDynamic.
        openDynamic(action.id, { reveal: false })
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
    if (turn.sheetAction || suggestions || turn.widget || turn.dashChart || turn.map || turn.source || turn.panel) {
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last && last.role === "assistant") {
          next[next.length - 1] = {
            ...last,
            ...(turn.sheetAction ? { sheetAction: turn.sheetAction } : {}),
            ...(suggestions ? { suggestions } : {}),
            ...(turn.widget ? { widget: turn.widget } : {}),
            ...(turn.dashChart ? { dashChart: turn.dashChart } : {}),
            ...(turn.map ? { map: turn.map } : {}),
            ...(turn.source ? { source: turn.source } : {}),
            ...(turn.panel ? { panel: turn.panel } : {}),
          }
        }
        return next
      })
    }
    if (turn.pauseAfter) await sleep(turn.pauseAfter)
    applyTurnEffects(turn)
    if (turn.closeAllPanels) {
      await sleep(600)
      // Stagger panels closed — right column first, then left. Read the stack from
      // its ref, not from a closed-over `dynamicPanels`: the players call this from
      // an async loop that captured one version of this callback when the flow
      // started, so any panel opened since would be missing from a closure value.
      const current = [...dynamicPanelsRef.current]
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
  }, [streamWords, applyTurnEffects])

  // Play one manual step of the active flow: the pending user turn (if any) plus the
  // assistant turn(s) that follow, then stop and surface the next user question as a
  // suggestion pill. Clicking it calls this again — flows never auto-advance.
  const runConceptStep = useCallback(async () => {
    const flow = activeFlowRef.current
    if (!flow) return
    // A step is already in flight — the pill it started from is still on screen for the
    // first 250ms, so a second click must not replay the same cursor.
    if (isAdvancingRef.current) return
    isAdvancingRef.current = true
    try {
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
      activeFlowRef.current = script[i]?.role === "user" ? { key: flow.key, script, cursor: i } : null
      setChatState("idle")
      // Parked mid-flow is not finished — only a script with nothing left to play is.
      //
      // Running out on a *user* turn is not the end either: that turn opened a panel and
      // handed the demo to it, so the steps still ahead (verify, review, submit) are panel
      // buttons rather than script turns. The offer flows are the only two scripts shaped
      // that way, and their real ending is submitOfferApplication. Every other script
      // closes on an assistant turn, which is what finished actually looks like.
      if (!activeFlowRef.current && script[script.length - 1]?.role === "assistant") setFlowFinished(true)
    } finally {
      isAdvancingRef.current = false
    }
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
        if (i === script.length - 1) { setChatState("idle"); setFlowFinished(true) }
      }
    }
  }, [playAssistantTurn, applyTurnEffects])

  const playConceptScripted = useCallback((prompt: string) => {
    const script = CONCEPT_SCRIPTED_CONVERSATIONS[prompt]
    if (!script) return
    scriptStopRef.current = false
    setFlowFinished(false)
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
      activeFlowRef.current = { key: prompt, script, cursor: 0 }
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
    appendAssistant(CONCEPT_PANEL_REPLIES.bankAccountUpdated)
  }, [closeDynamicPanel, appendAssistant])

  // Offer flows (credit-card-offer / business-loan-offer): the panel's form submit
  // closes the panel and drops the pending-review success message + audit card. The
  // message/sheetAction are built in the panel from the offer the merchant chose.
  const submitOfferApplication = useCallback((panelId: PanelId, message: string, sheetAction: SheetActionData) => {
    closeDynamicPanel(panelId)
    appendAssistant(message, { suggestions: undefined, sheetAction })
    // The script handed these flows to the panel and stopped; this submit is where they
    // actually end, so it is what earns the Restart button (see runConceptStep).
    setFlowFinished(true)
  }, [closeDynamicPanel, appendAssistant])

  const submitStepUpPanel = useCallback(() => {
    closeDynamicPanel("step-up-auth")
    appendAssistant(CONCEPT_PANEL_REPLIES.stepUpConfirmed)
  }, [closeDynamicPanel, appendAssistant])

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
    appendAssistant(CONCEPT_PANEL_REPLIES.depositNotifyOn)
  }, [appendAssistant])

  const streamAssistantReply = useCallback(
    (content: string, extra?: Partial<Message>) =>
      streamWords(content, { extra, onDone: () => setChatState("idle") }),
    [streamWords],
  )

  // The "merchant acts, Nanci answers" beat: their turn lands in the chat, Nanci
  // thinks, then streams the reply. Used wherever a click reads as the merchant
  // speaking — a panel button or a decline pill. Clearing the previous turn's pills
  // is the same rule a typed message follows (see withClearedSuggestions).
  const replyToUserAction = useCallback(async (userContent: string, reply: string, extra?: Partial<Message>) => {
    setMessages((prev) => [...withClearedSuggestions(prev), { id: newSessionId(), role: "user" as const, content: userContent }])
    setChatState("thinking")
    await sleep(600)
    await streamAssistantReply(reply, extra)
  }, [streamAssistantReply])

  const submitAccountChangeDetails = useCallback(() => {
    setPanelView("account-change", "confirm")
    replyToUserAction("Request Changes", CONCEPT_PANEL_REPLIES.accountChangeVerify)
  }, [replyToUserAction])

  const goBackAccountChangeStep = useCallback(() => {
    setPanelView("account-change", "details")
  }, [])

  const confirmAccountChange = useCallback(() => {
    // Confirmation is a drawer (ChangeAuditSheet), not a panel view — close the panel.
    closeDynamicPanel("account-change")
    replyToUserAction("Confirm", CONCEPT_PANEL_REPLIES.accountChangeSubmitted, {
      sheetAction: ACCOUNT_CHANGE_SHEET,
      suggestions: CONCEPT_FLOW16_FOLLOWUPS,
    })
  }, [replyToUserAction, closeDynamicPanel])

  const submitDisputeDraft = useCallback(() => {
    resetDynamic()
    appendAssistant(CONCEPT_PANEL_REPLIES.disputeSubmitted)
  }, [appendAssistant])

  const activateProactiveNotification = useCallback(() => {
    setProactiveNotificationActive(true)
  }, [])

  const triggerProactiveFlow = useCallback(() => {
    playConceptScripted(CONCEPT_FLOW6_KEY)
  }, [playConceptScripted])

  /**
   * Mirrors handlePrompt's routing below, in the same order, and answers the one
   * question a `?flow=` embed cares about: does this chip leave the pinned demo?
   *
   * The pending-user-turn check has to come first for the same reason it does there —
   * a manual flow surfaces its next user turn as a pill, and that text can itself be a
   * conversation key. Testing the key first would hide the pill that advances the demo.
   */
  const leavesCurrentFlow = useCallback((prompt: string) => {
    if (!autoPlayFlow) return false
    const flow = activeFlowRef.current
    if (flow && flow.script[flow.cursor]?.role === "user" && flow.script[flow.cursor].content === prompt) return false
    // A follow-up continues the thread it is already in — it is a conversation key
    // like any other, but CONCEPT_NO_RESET_PROMPTS is exactly the set that does not
    // start over. Without this, every follow-up chip in flows 2, 12, 15 and friends
    // would be filtered away and those demos would dead-end after one turn.
    if (CONCEPT_NO_RESET_PROMPTS.has(prompt)) return false
    return prompt !== autoPlayFlow && !!CONCEPT_SCRIPTED_CONVERSATIONS[prompt]
  }, [autoPlayFlow])

  const handlePrompt = useCallback((prompt: string) => {
    if (isConceptVersion) {
      // Declining an offer gets a real reply when the active flow has one authored —
      // the pill text is shared across offer flows, so the flow decides what it means.
      const declineReply = activeFlowRef.current && CONCEPT_DECLINE_REPLIES[activeFlowRef.current.key]
      if (prompt === CONCEPT_OFFER_NO && declineReply) {
        activeFlowRef.current = null
        // No pills: declining ends the thread, and the reply already says how to come back.
        // It is the offer flows' other ending, so it earns the Restart button too.
        replyToUserAction(prompt, declineReply)
        setFlowFinished(true)
        return
      }
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
  }, [isConceptVersion, isEmbed, sendMessage, playScripted, playConceptScripted, advanceConceptFlow, replyToUserAction])

  const startNewChat = useCallback(() => {
    stopRef.current = true
    scriptStopRef.current = true
    activeFlowRef.current = null
    setFlowFinished(false)
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
    setFlowFinished(false)
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

  // `?autoplay` plays the flow on load instead of waiting for the Ask button. Opt-in:
  // without the param an embed sits idle exactly as before. Reuses doReplayFlow so
  // there is one definition of "play this flow from the top".
  const autoPlayedRef = useRef(false)
  useEffect(() => {
    if (!autoPlay || !autoPlayFlow || autoPlayedRef.current) return
    autoPlayedRef.current = true
    doReplayFlow()
  }, [autoPlay, autoPlayFlow, doReplayFlow])

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
    <AskNanciContext.Provider value={{
      isEmbed, embedVariant,
      view, messages, chatState, chatTitle, sessions, activeSessionId,
      sendMessage, handlePrompt, stopAnimation, startNewChat, replayFlow, resumeSession,
      deleteSessionById,
      sources, setSources: handleSetSources, thinking,
      kbOpen, setKbOpen,
      marketplaceOpen, setMarketplaceOpen,
      draft, setDraft,
      error,
      usage, currentUser, promptCategories, allQuestions,
      tokenLimitReached, setTokenLimitReached,
      settingsOpen, openSettings, setSettingsOpen,
      mobileSidebarOpen, setMobileSidebarOpen,
      shownPanelId, setShownPanelId, panelSheetDismissed, dismissPanelSheet, reopenPanelSheet, panelSheetOpen,
      onboardingOpen, setOnboardingOpen, forceOnboarding, genericBrand, tourActive, setTourActive, tourRequest, requestTour, flowFinished, leavesCurrentFlow,
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
    </AskNanciContext.Provider>
  )
}
