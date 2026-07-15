"use client"

import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react"
import type { Message } from "@/lib/ask-nanci/types"

// `pendingBot` — the in-flight assistant message — changes on every streamed token.
// It lives in its own provider, split into separate state/setter contexts, so that
// the per-token churn re-renders ONLY the message list (the reader), not the ~40
// consumers of AskNanciContext. AskNanciProvider writes it via the stable setter
// context (identity never changes → the writer never re-renders on a token); the
// chat view reads it via the state context (re-renders per token, which is correct).

const PendingBotStateContext = createContext<Message | null>(null)
const PendingBotSetContext = createContext<Dispatch<SetStateAction<Message | null>> | null>(null)

export function ChatStreamProvider({ children }: { children: React.ReactNode }) {
  const [pendingBot, setPendingBot] = useState<Message | null>(null)
  // `children` is a stable element passed from the parent, so this provider's
  // per-token re-render does not re-render the child tree — only context readers.
  return (
    <PendingBotSetContext.Provider value={setPendingBot}>
      <PendingBotStateContext.Provider value={pendingBot}>
        {children}
      </PendingBotStateContext.Provider>
    </PendingBotSetContext.Provider>
  )
}

/** Read the in-flight streaming message. Re-renders on every token — for the chat view. */
export function usePendingBot(): Message | null {
  return useContext(PendingBotStateContext)
}

/** Get the stable setter to write the in-flight message. Never triggers a re-render. */
export function usePendingBotSetter(): Dispatch<SetStateAction<Message | null>> {
  const set = useContext(PendingBotSetContext)
  if (!set) throw new Error("usePendingBotSetter must be used inside ChatStreamProvider")
  return set
}
