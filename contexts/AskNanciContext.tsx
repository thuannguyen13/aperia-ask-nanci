"use client"

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import type { Message, Session, PinnedWidget, Source } from "@/lib/ask-nanci/types"
import {
  fetchSessions,
  persistSession,
  removeSessionById,
  newSessionId,
  fetchSources,
  persistSources,
  streamChat,
} from "@/lib/ask-nanci/api"

type ChatView = "welcome" | "chat"
type ChatState = "idle" | "thinking" | "streaming"

interface AskNanciCtx {
  view: ChatView
  messages: Message[]
  chatState: ChatState
  sessions: Session[]
  activeSessionId: string | null
  pendingBot: Message | null
  setPendingBot: (m: Message | null) => void
  sendMessage: (text: string) => void
  stopAnimation: () => void
  startNewChat: () => void
  resumeSession: (id: string) => void
  deleteSessionById: (id: string) => void
  appendBotMessage: (msg: Message) => void
  appendToken: (token: string) => void
  pinnedWidgets: PinnedWidget[]
  pinWidget: (widget: PinnedWidget) => void
  unpinWidget: (id: string) => void
  sources: Source[]
  setSources: (sources: Source[]) => void
  stopRef: React.RefObject<boolean>
  kbOpen: boolean
  setKbOpen: (open: boolean) => void
  draft: string
  setDraft: (text: string) => void
  error: string | null
}

const Ctx = createContext<AskNanciCtx | null>(null)

export function useAskNanci() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useAskNanci must be used inside AskNanciProvider")
  return ctx
}

export function AskNanciProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ChatView>("welcome")
  const [messages, setMessages] = useState<Message[]>([])
  const [chatState, setChatState] = useState<ChatState>("idle")
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [pendingBot, setPendingBot] = useState<Message | null>(null)
  const [pinnedWidgets, setPinnedWidgets] = useState<PinnedWidget[]>([])
  const [sources, setSources_] = useState<Source[]>([])
  const [kbOpen, setKbOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const stopRef = useRef(false)
  const sessionIdRef = useRef<string>(newSessionId())

  useEffect(() => {
    fetchSessions().then(setSessions)
    fetchSources().then(setSources_)
  }, [])

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

  // Appends a streaming token to the in-progress pendingBot message.
  // Called once per token chunk while chatState === "streaming".
  const appendToken = useCallback((token: string) => {
    setPendingBot((prev) => {
      if (!prev) return prev
      return { ...prev, content: prev.content + token }
    })
  }, [])

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || chatState !== "idle") return
    const userMsg: Message = { id: newSessionId(), role: "user", content: text.trim() }

    setView("chat")
    setChatState("thinking")
    setError(null)
    stopRef.current = false

    setMessages((prev) => {
      const next = [...prev, userMsg]
      persistAndReload(next)
      return next
    })

    // Start streaming — transition to "streaming" once first token arrives
    const run = async () => {
      const activeSources = (await fetchSources()).filter((s) => s.active)
      const allMsgs = await new Promise<Message[]>((resolve) => {
        setMessages((prev) => { resolve([...prev]); return prev })
      })

      const botMsg: Message = { id: newSessionId(), role: "assistant", content: "" }
      let started = false

      try {
        for await (const chunk of streamChat(allMsgs, activeSources, sessionIdRef.current)) {
          if (stopRef.current) break

          if (chunk.type === "token") {
            if (!started) {
              started = true
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
        setChatState("idle")
        setPendingBot(null)
        return
      }

      if (botMsg.content) {
        appendBotMessage({ ...botMsg, stopped: true })
      } else {
        setChatState("idle")
        setPendingBot(null)
      }
    }

    run()
  }, [chatState, persistAndReload, appendBotMessage])

  const stopAnimation = useCallback(() => {
    stopRef.current = true
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

  const pinWidget = useCallback((widget: PinnedWidget) => {
    setPinnedWidgets((prev) => prev.some((w) => w.id === widget.id) ? prev : [...prev, widget])
  }, [])

  const unpinWidget = useCallback((id: string) => {
    setPinnedWidgets((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const handleSetSources = useCallback((next: Source[]) => {
    setSources_(next)
    persistSources(next)
  }, [])

  return (
    <Ctx.Provider value={{
      view, messages, chatState, sessions, activeSessionId,
      pendingBot, setPendingBot,
      sendMessage, stopAnimation, startNewChat, resumeSession,
      deleteSessionById: deleteSessionByIdCb,
      appendBotMessage, appendToken,
      pinnedWidgets, pinWidget, unpinWidget,
      sources, setSources: handleSetSources,
      stopRef,
      kbOpen, setKbOpen,
      draft, setDraft,
      error,
    }}>
      {children}
    </Ctx.Provider>
  )
}
