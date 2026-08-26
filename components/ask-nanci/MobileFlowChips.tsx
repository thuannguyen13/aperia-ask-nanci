"use client"

import { SuggestedQuestions } from "./SuggestedQuestions"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { useIsMobile } from "@/hooks/use-is-mobile"

/**
 * The pending follow-up chips, lifted into the composer while a mobile panel sheet is
 * open.
 *
 * A scripted flow pauses on its next user turn and offers it as a chip inside the
 * conversation — which the sheet then covers, leaving no way to advance without
 * dismissing the panel the script just announced. The chips belong to the composer for
 * as long as that is true: the composer is the one surface a sheet never covers, and
 * because the sheet is sized off --composer-h it shrinks to make room automatically.
 *
 * Only while the sheet is open, so the chips are never in both places at once.
 */
export function MobileFlowChips() {
  const { messages, panelSheetOpen } = useAskNanci()
  const isMobile = useIsMobile()

  if (!isMobile || !panelSheetOpen) return null

  const last = messages[messages.length - 1]
  if (last?.role !== "assistant" || !last.suggestions?.length) return null

  return (
    <div className="-mx-1 mb-2 overflow-x-auto px-1">
      <SuggestedQuestions suggestions={last.suggestions} />
    </div>
  )
}
