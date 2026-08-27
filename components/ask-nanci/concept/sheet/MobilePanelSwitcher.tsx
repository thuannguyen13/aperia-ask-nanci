"use client"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"
import { useAskNanci } from "@/contexts/AskNanciContext"
import { useIsMobile } from "@/hooks/use-is-mobile"
import type { PanelId } from "@/lib/ask-nanci/types"
import { PANELS } from "../panel-registry"
import { usePanelUi } from "./use-panel-ui"
import { useSheetDismissal } from "./use-sheet-dismissal"
import { useSheetFocus } from "./use-sheet-focus"
import { useKeyboardInset } from "../../use-keyboard-inset"
import { useSheetGesture } from "./use-sheet-gesture"
import type { PanelSheetConfig } from "@/lib/ask-nanci/data/panel-ui"

// Below `md` the chat and the panel column cannot sit side by side, so the panel moves
// into this sheet. One panel at a time: a phone shows the newest one, with no overview
// to pick from — a chooser for a single card is pure friction, and only a couple of
// flows ever open a second. Desktop is untouched: ConceptPanelArea still renders the
// real stack at `md:` and up.
//
// The sheet is a fixed-position layer over the whole app, so it talks to the rest of
// it through the DOM rather than through props. Every one of those channels, with who
// writes it and who reads it:
//
//   --sheet-progress   written by use-sheet-gesture (0 resting, 1 open, and every
//                      value between while a finger is down), read by globals.css to
//                      scale and dim [data-nest].
//   --sheet-settle     written by use-sheet-gesture on release, read by the same
//                      globals.css rule so the conversation lands with the card.
//   data-sheet-scrub   written on <html> by use-sheet-gesture for the length of a
//                      drag, read by globals.css to drop the easing mid-gesture.
//   --composer-h       written by use-composer-height (mounted in app/(app)/page.tsx),
//                      read here: SHEET_FRAME ends exactly at the composer.
//   --keyboard-h       written by use-keyboard-inset, read by the same SHEET_FRAME so
//                      an open keyboard lifts the sheet instead of hiding it.
//   [data-nest]        set in ChatView.tsx on the conversation, styled by globals.css
//                      off --sheet-progress, and given aria-hidden by use-sheet-focus
//                      while the sheet is open.

/**
 * A sheet is a card floating on the dimmed page: inset by the same 12px the composer
 * uses, so the two line up, stopping a gap above it and below the brand bar — the
 * panel toggle lives up there and has to stay reachable while a panel is open. The
 * composer publishes its own height (use-composer-height.ts); the fallback covers the
 * first paint before the observer has run.
 */
const SHEET_FRAME =
  "fixed inset-x-0 top-9 bottom-[calc(var(--composer-h,0px)+var(--keyboard-h,0px))] z-20 overflow-hidden"
const SHEET_CARD = "absolute inset-3 rounded-2xl border"

/** The card's inset inside the clipping frame — its gap to the composer when open. */
const CARD_INSET = 12
/** How far past its own edge a non-peeking sheet goes, so its shadow clears too. */
const OFF_SCREEN = 48

function PanelSheet({ config, present, open, label, pager, onOpen, onClose, children }: {
  /** Which presentation to draw. See lib/ask-nanci/data/panel-ui.ts. */
  config: PanelSheetConfig
  /** Whether a panel exists at all: without one there is nothing to rest as a lip. */
  present: boolean
  open: boolean
  label?: string
  /** Shown in the grab strip while open: the way to the panels this one is hiding. */
  pager?: React.ReactNode
  onOpen: () => void
  onClose: () => void
  children: React.ReactNode
}) {
  const vertical = config.axis === "y"
  // A lip only exists while a panel does, so the two conditions travel together.
  const peek = present && config.lip > 0

  // How far the sheet travels between resting and open. Measured into state rather
  // than assumed: the sheet's height depends on the composer, which changes with its
  // own content, and a ref cannot be read during render.
  const [span, setSpan] = useState(600)
  // Measured from the clip line, not the card's own edge: the frame ends at the
  // composer, so a card dragged past it is cut there rather than sliding behind it.
  const travel = peek ? span + CARD_INSET - config.lip : span + CARD_INSET + OFF_SCREEN

  const { cardRef, dragHandlers, bodyHandlers, consumeClick } = useSheetGesture({
    axis: config.axis,
    open,
    peek,
    travel,
    onOpen,
    onClose,
  })

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const measure = () => setSpan(vertical ? el.offsetHeight : el.offsetWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [cardRef, vertical])

  useSheetDismissal(open, onClose)
  useSheetFocus(cardRef, open)
  useKeyboardInset()

  return (
    <>
      {/* The DS DrawerOverlay treatment, copied rather than imported: that component
          only renders inside DrawerContent's own portal, which is the thing this sheet
          exists to avoid.

          Sits under the sheet (z-20) and under the composer (z-30), and starts below
          the h-10 brand bar: the composer and the panel toggle both stay live controls
          while a panel is open, so neither is dimmed nor blocked.

          Unlike the rest of the sheet this does not scrub with the drag. The composer
          only turns transparent for a fully open sheet, so a half-dimmed screen leaves
          a visible seam around it; the dim belongs to the settled state. */}
      <div
        onClick={onClose}
        className={`fixed inset-x-0 bottom-0 top-10 z-10 bg-black/10 transition-opacity duration-300 supports-backdrop-filter:backdrop-blur-xs ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* A clipping frame ending exactly at the composer, with the card inset inside it.
          Without it a dragged card slides on past the composer, which paints over its
          lower half: content cut on a hard edge with its shadow hidden behind the
          composer. Clipped at the composer line instead, the card reads as tucking
          under it, and the inset leaves room for the shadow on the other three sides. */}
      {/* The frame is a clip region only. It spans the whole chat area, so it must
          never take pointer events itself: a resting sheet would otherwise swallow
          every tap and text selection on the conversation behind it. The card
          re-enables events for its own box. */}
      <div className={`${SHEET_FRAME} pointer-events-none`}>
      {/* Resting, the card is a handle and nothing else, so it is a dialog only while
          it is open. data-resting is written by the gesture, not rendered: it has to
          follow the finger. */}
      <div
        ref={cardRef}
        data-sheet-card
        role={open ? "dialog" : undefined}
        aria-label={open ? label : undefined}
        tabIndex={-1}
        style={{ opacity: peek || open ? 1 : 0 }}
        className={`${SHEET_CARD} group flex overflow-hidden outline-none ${
          open || peek ? "pointer-events-auto" : ""
        } ${
          vertical ? "flex-col" : "flex-row"
        } border-border bg-background shadow-2xl data-[resting]:border-transparent data-[resting]:bg-transparent data-[resting]:shadow-none transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out`}
      >
        {/* The grab strip runs along the anchored edge: across the top for a bottom
            sheet, down the left for a right-side one. While peeking it is the whole
            visible surface, so it takes a tap as well as a drag. */}
        <button
          type="button"
          {...dragHandlers}
          onClick={() => {
            if (consumeClick()) return
            if (open) onClose()
            else onOpen()
          }}
          aria-label={`${open ? "Hide" : "Show"} ${label ?? "panel"}`}
          className={`relative flex shrink-0 cursor-grab touch-none justify-center active:cursor-grabbing ${
            vertical
              // Resting, the handle sits at the strip's bottom edge, a few px above the
              // composer, while the rest of the strip stays a comfortable target.
              ? "h-6 w-full items-center group-data-[resting]:h-8 group-data-[resting]:items-end group-data-[resting]:pb-1"
              // Same idea rotated: the handle hugs the card's left edge, which is the
              // part still on screen when the card rests against the right edge.
              : "h-full w-6 items-center group-data-[resting]:w-10 group-data-[resting]:justify-start group-data-[resting]:pl-1.5"
          }`}
        >
          {/* The iOS grabber. On an open card it is trim, drawn light against the
              surface. Minimised it is the whole control — the only thing saying a panel
              is there and can be pulled back up — so it is longer, thicker and darker,
              with nothing else around it. */}
          <span
            className={`rounded-full bg-muted-foreground/30 group-data-[resting]:bg-muted-foreground/70 ${
              vertical
                ? "h-1 w-10 group-data-[resting]:h-1.5 group-data-[resting]:w-16"
                : "h-10 w-1 group-data-[resting]:h-16 group-data-[resting]:w-1.5"
            }`}
          />
        </button>
        {/* The pager sits with the strip rather than in the panel's own header: it
            belongs to the container (which panel is showing), not to the panel. A
            sibling of the strip, not a child, because the strip is a button now. */}
        {open && pager && (
          <span
            className={`absolute top-0 flex h-6 items-center ${vertical ? "right-1.5" : "left-0 pl-1.5"}`}
          >
            {pager}
          </span>
        )}
        <div
          {...bodyHandlers}
          aria-hidden={!open}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden opacity-100 transition-opacity duration-200 group-data-[resting]:opacity-0"
        >
          {children}
        </div>
      </div>
      </div>
    </>
  )
}

export function MobilePanelSwitcher() {
  // Which panel and whether it has been dismissed both live in AskNanciContext: the
  // panel-opening path is what sets them, and the brand-bar toggle is what undoes a
  // dismissal. One panel at a time, but not always the newest: a flow that opens two
  // leaves the first reachable through the pager instead of stranding it behind the
  // badge.
  const {
    dynamicPanels,
    shownPanelId,
    setShownPanelId,
    panelSheetDismissed,
    dismissPanelSheet,
    reopenPanelSheet,
  } = useAskNanci()
  const isMobile = useIsMobile()
  // Which presentation this session runs, from ?panelui=. Unset means the bottom sheet
  // that ships, so every existing demo URL is unaffected. See data/panel-ui.ts.
  const { sheet } = usePanelUi()

  // Not `md:hidden`: a sheet opened on a phone would otherwise stay open when the
  // viewport grows. Skipping the render entirely is what keeps desktop clean.
  if (!isMobile) return null

  // Derived, never synced: a panel closed from anywhere falls out of the stack and the
  // sheet lands on the newest survivor on the next render.
  const sheetId: PanelId | null =
    (shownPanelId && dynamicPanels.includes(shownPanelId) ? shownPanelId : null) ??
    dynamicPanels[dynamicPanels.length - 1] ??
    null
  const sheetPanel = sheetId ? PANELS[sheetId] : null
  const index = sheetId ? dynamicPanels.indexOf(sheetId) : -1

  return (
    <PanelSheet
      config={sheet}
      present={!!sheetId}
      open={!!sheetId && !panelSheetDismissed}
      label={sheetPanel?.label}
      pager={
        dynamicPanels.length > 1 ? (
          <button
            onClick={() => setShownPanelId(dynamicPanels[(index + 1) % dynamicPanels.length])}
            aria-label="Show the next open panel"
            className="flex h-6 items-center gap-0.5 rounded-md px-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted"
          >
            {index + 1}/{dynamicPanels.length}
            <ChevronRight className="size-3.5" />
          </button>
        ) : undefined
      }
      onOpen={reopenPanelSheet}
      onClose={dismissPanelSheet}
    >
      {sheetPanel && <sheetPanel.component />}
    </PanelSheet>
  )
}
