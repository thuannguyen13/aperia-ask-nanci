"use client"

import { PanelRight, Check } from "lucide-react"
import { cn } from "aperia-ds5/utils"
import { PANELS, type PanelId } from "@/components/panel-registry"
import { useAskNanci } from "@/contexts/AskNanciContext"

/**
 * The card an answer leaves behind for the panel it opened.
 *
 * A panel used to exist only while it was on screen: close it and the only way back was
 * to ask Nanci the question again. The card is the panel's home in the conversation, so
 * closing one is no longer a decision the reader has to be careful about.
 *
 * It stays in place whether the panel is open or not; only the trailing state changes,
 * because a card that appeared and vanished would be a second thing to keep track of.
 */
export function PanelArtifactCard({ id }: { id: PanelId }) {
  const { dynamicPanels, shownPanelId, panelSheetDismissed, openDynamic, setShownPanelId, reopenPanelSheet } = useAskNanci()

  const panel = PANELS[id]
  if (!panel) return null

  // Three states, because "in the stack" and "on screen" stopped being the same thing
  // once a panel could be minimised: a minimised panel is still open, just parked.
  const inStack = dynamicPanels.includes(id)
  const showing = inStack && !panelSheetDismissed && (shownPanelId === id || dynamicPanels[dynamicPanels.length - 1] === id)
  // "Minimised" no longer fits the middle state: a scripted panel arrives resting
  // without ever having been open, so the copy says what a tap does rather than
  // claiming a history the panel may not have.
  const status = !inStack ? "Tap to reopen" : showing ? "Open" : "Tap to open"

  const handleClick = () => {
    // Already in the stack: bring it to the front and undo a minimise, rather than
    // pushing a duplicate. openDynamic is a no-op on a panel that is already open, so
    // the two paths cannot be collapsed into one call.
    if (inStack) {
      setShownPanelId(id)
      reopenPanelSheet()
    } else {
      openDynamic(id)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      // Deliberately not "Show X": that is the sheet handle's name, and two controls
      // sharing an accessible name is ambiguous to a screen reader before it is
      // ambiguous to a locator.
      aria-label={inStack ? `Bring ${panel.label} to the front` : `Reopen ${panel.label}`}
      className={cn(
        "mt-3 flex w-full items-center gap-3 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors",
        "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <PanelRight className="size-4.5" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-foreground">{panel.label}</span>
        <span className="truncate text-xs text-muted-foreground">{status}</span>
      </span>

      {/* Only the on-screen state gets a mark. Closed is the resting case, and marking it
          on every past answer would turn the conversation into a list of dismissals. */}
      {showing && (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="size-3" />
        </span>
      )}
    </button>
  )
}
