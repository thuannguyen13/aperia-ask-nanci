"use client"

import { Button } from "aperia-ds5"
import { useAskNanci } from "@/contexts/AskNanciContext"

interface ResyConfirmCardProps {
  title: string
  detail: string
  /** Defaults to the confirm turn without its closing period. */
  buttonLabel?: string
  /** True only while the flow waits on this step's confirm turn. */
  awaiting: (messages: { role: string; content: string }[], chatState: string) => boolean
  /** The scripted user turn the button sends, the same one its chip sends. */
  onConfirmTurn: string
}

// The confirm step every Resy action shares. A double advance is already blocked by
// the player, so the button keeps no state of its own.
export function ResyConfirmCard({ title, detail, onConfirmTurn, buttonLabel = onConfirmTurn.replace(/\.$/, ""), awaiting }: ResyConfirmCardProps) {
  const { handlePrompt, chatState, messages, dismissPanelSheet } = useAskNanci()
  const confirm = () => {
    // On a phone the sheet goes down so the answer and the next chip are in view. The
    // answer's panel card brings the done view back. Desktop has no sheet to move.
    dismissPanelSheet()
    handlePrompt(onConfirmTurn)
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      <Button className="mt-3" size="sm" onClick={confirm} disabled={!awaiting(messages, chatState)}>{buttonLabel}</Button>
    </div>
  )
}
