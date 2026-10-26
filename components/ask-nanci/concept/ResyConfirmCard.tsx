"use client"

import { Button } from "aperia-ds5"
import { CircleAlert, type LucideIcon } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { PanelItem } from "@/components/shared"

interface ResyConfirmCardProps {
  title: string
  detail: string
  /** Names the change in the media box. Defaults to the alert circle. */
  icon?: LucideIcon
  /** Defaults to the confirm turn without its closing period. */
  buttonLabel?: string
  /** True only while the flow waits on this step's confirm turn. */
  awaiting: (messages: { role: string; content: string }[], chatState: string) => boolean
  /** The scripted user turn the button sends, the same one its chip sends. */
  onConfirmTurn: string
}

// The confirm step every Resy action shares. A double advance is already blocked by
// the player, so the button keeps no state of its own.
export function ResyConfirmCard({ title, detail, icon = CircleAlert, onConfirmTurn, buttonLabel = onConfirmTurn.replace(/\.$/, ""), awaiting }: ResyConfirmCardProps) {
  const { handlePrompt, chatState, messages, dismissPanelSheet } = useAskNanci()
  const confirm = () => {
    // On a phone the sheet goes down so the answer and the next chip are in view. The
    // answer's panel card brings the done view back. Desktop has no sheet to move.
    dismissPanelSheet()
    handlePrompt(onConfirmTurn)
  }

  return (
    <PanelItem variant="muted" icon={icon} iconClassName="text-primary">
      <div className="min-w-0 flex-1 space-y-1 text-sm">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-muted-foreground">{detail}</p>
        <Button className="mt-2" size="sm" onClick={confirm} disabled={!awaiting(messages, chatState)}>{buttonLabel}</Button>
      </div>
    </PanelItem>
  )
}
