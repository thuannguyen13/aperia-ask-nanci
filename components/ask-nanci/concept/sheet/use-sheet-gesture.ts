"use client"

import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

/**
 * The pointer half of the mobile panel sheet: where the card sits, how a finger moves
 * it, and where it lands on release.
 *
 * The offset is not React state. A pointermove writes the card's transform and
 * `--sheet-progress` straight to the DOM, so dragging a card costs a style recalc
 * rather than a render of the sheet and the panel inside it (a ten-row table,
 * sometimes a chart). React only learns the outcome, on release: that is the moment
 * the rest of the app cares about.
 */

/** Travel past which a release dismisses, however slowly it got there. */
const DISMISS_DISTANCE = 120
/** px per ms: a flick shorter than DISMISS_DISTANCE still counts as decisive. */
const DISMISS_VELOCITY = 0.5
/** The settle for a gesture with no flick behind it, and the bounds one can pull it to. */
const SETTLE_MS = 300
const SETTLE_MIN = 120
const SETTLE_MAX = 400
/** Movement past which a pointerdown was a swipe, not a tap. */
const TAP_SLOP = 6
/** How far a pull on the panel body must run before it takes the gesture off the list. */
const HANDOFF_SLOP = 8
/** Progress below which the sheet reads as resting rather than open. */
const RESTING = 0.02

export interface SheetGestureOptions {
  /** The edge the card is anchored to, and the axis a gesture is measured along. */
  axis: "y" | "x"
  open: boolean
  /** Whether a lip stays on screen at rest: the state the card undresses for. */
  peek: boolean
  /** Distance between the resting position and the open one, in px. */
  travel: number
  onOpen: () => void
  onClose: () => void
}

interface DragState {
  /** Pointer position along the drag axis when the drag took over. */
  pos: number
  /** ...and across it, so a pull can be told from a scroll. */
  cross: number
  t: number
  /** False while a pull on the body still belongs to the list it started on. */
  active: boolean
  /**
   * The list that pull started on, if it scrolls along the sheet's own axis: it keeps
   * the gesture until it runs out. A scroller on the other axis defers the takeover
   * (active starts false) but never gates it, since the cross-dominance check in
   * move() already proves the gesture is not that scroller's.
   */
  scroller: HTMLElement | null
  /** Whoever holds the pointer capture once the drag takes over. */
  host: HTMLElement
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/**
 * The nearest ancestor that can still scroll along the sheet's own axis: the reason a
 * pull may not be ours yet. Axis-aware because the horizontal presentations
 * (?panelui=right, ?panelui=edge) drag across the same direction a panel's wide table
 * scrolls in, so asking about overflowY there would hand the sheet a gesture the table
 * still wants.
 */
function scrollerAt(from: HTMLElement, stop: HTMLElement, axis: "y" | "x"): HTMLElement | null {
  const vertical = axis === "y"
  for (let node: HTMLElement | null = from; node && node !== stop; node = node.parentElement) {
    const style = getComputedStyle(node)
    const overflow = vertical ? style.overflowY : style.overflowX
    const room = vertical ? node.scrollHeight > node.clientHeight : node.scrollWidth > node.clientWidth
    if ((overflow === "auto" || overflow === "scroll") && room) return node
  }
  return null
}

export function useSheetGesture({ axis, open, peek, travel, onOpen, onClose }: SheetGestureOptions) {
  const vertical = axis === "y"
  const cardRef = useRef<HTMLDivElement | null>(null)
  const drag = useRef<DragState | null>(null)
  // A pointerup is followed by a click, which would immediately reopen a sheet the
  // swipe just closed. Set on release, read and cleared by the strip's onClick.
  const swiped = useRef(false)
  // A settle earned by a flick, handed to the effect that paints the settled state so
  // the render React does next keeps the duration the gesture asked for.
  const settle = useRef<number | null>(null)

  const along = (e: React.PointerEvent) => (vertical ? e.clientY : e.clientX)
  const across = (e: React.PointerEvent) => (vertical ? e.clientX : e.clientY)

  /** Where the card sits for a gesture that has moved `delta` along the axis. */
  const shiftFor = useCallback(
    (delta: number) => {
      // Open drags shut, a resting lip drags open: each direction only, so neither
      // peels the sheet off its own edge.
      const directed = open ? Math.max(0, delta) : Math.min(0, delta)
      return clamp((open ? 0 : travel) + directed, 0, travel)
    },
    [open, travel],
  )

  /**
   * The one place the sheet's position is written. `duration` is null mid-gesture,
   * where the card is already following the finger and re-declaring the transition
   * every frame would only cost work.
   */
  const paint = useCallback(
    (shift: number, duration: number | null) => {
      const root = document.documentElement
      const progress = travel > 0 ? 1 - shift / travel : open ? 1 : 0
      if (duration !== null) root.style.setProperty("--sheet-settle", `${duration}ms`)
      // globals.css drives the receding conversation off the same number, so the dim
      // and the scale track the gesture rather than waiting for it to end.
      root.style.setProperty("--sheet-progress", String(progress))
      const el = cardRef.current
      if (!el) return
      if (duration !== null) el.style.transitionDuration = `${duration}ms`
      el.style.transform = vertical ? `translateY(${shift}px)` : `translateX(${shift}px)`
      // Minimised, the card gets out of the way: surface, border and shadow fade out
      // and the handle is the only thing left. Mid-drag that has to follow the finger,
      // so it rides a data attribute rather than a render.
      if (peek && progress < RESTING) el.dataset.resting = ""
      else delete el.dataset.resting
    },
    [open, peek, travel, vertical],
  )

  // React never renders the transform: the DOM owns it, and a re-render arriving
  // mid-drag would otherwise snap the card back out from under the finger.
  useLayoutEffect(() => {
    const duration = settle.current ?? SETTLE_MS
    settle.current = null
    paint(open ? 0 : travel, duration)
  }, [paint, open, travel])

  useEffect(
    () => () => {
      const root = document.documentElement
      root.style.removeProperty("--sheet-progress")
      root.style.removeProperty("--sheet-settle")
      delete root.dataset.sheetScrub
    },
    [],
  )

  // Once the sheet owns a gesture, the browser must not also scroll with it: pointer
  // events move the card but never cancel native touch scrolling, so without this the
  // same finger drags the card AND pans or rubber-bands whatever can still scroll,
  // the page included. touch-action cannot do it, because whether a body drag is ours
  // is only decided mid-gesture (the scroll-to-drag handoff). Non-passive, on the
  // document, active drags only, so a pull that still belongs to a list scrolls it
  // exactly as before.
  useEffect(() => {
    const block = (e: TouchEvent) => {
      if (drag.current?.active && e.cancelable) e.preventDefault()
    }
    document.addEventListener("touchmove", block, { passive: false })
    return () => document.removeEventListener("touchmove", block)
  }, [])

  /** Hand the card to the finger: no easing here or the sheet lags behind it. */
  function takeOver(e: React.PointerEvent, state: DragState) {
    drag.current = state
    state.host.setPointerCapture(e.pointerId)
    document.documentElement.dataset.sheetScrub = ""
    paint(shiftFor(0), 0)
  }

  function down(e: React.PointerEvent<HTMLElement>) {
    swiped.current = false
    takeOver(e, {
      pos: along(e),
      cross: across(e),
      t: e.timeStamp,
      active: true,
      scroller: null,
      host: e.currentTarget,
    })
  }

  /**
   * The panel's own surface. Chrome (its header row above all) drags the sheet like
   * the strip does; content that can still scroll keeps the gesture until the list
   * runs out of room, which is what makes a pull from the top hand over.
   */
  function downOnBody(e: React.PointerEvent<HTMLElement>) {
    if (!open) return
    const target = e.target as HTMLElement | null
    if (!target) return
    // Controls inside the panel are the panel's, not the sheet's.
    if (target.closest("button, a, input, select, textarea, [role='button'], [contenteditable='true']")) return
    const scroller = scrollerAt(target, e.currentTarget, axis)
    // A scroller on the other axis also holds off the capture: grabbing the pointer
    // on a press inside, say, a vertical list under a horizontal sheet would eat the
    // scroll the finger was there for. It defers the takeover without gating it.
    const crossScroller = scrollerAt(target, e.currentTarget, vertical ? "x" : "y")
    const state: DragState = {
      pos: along(e),
      cross: across(e),
      t: e.timeStamp,
      active: !scroller && !crossScroller,
      scroller,
      host: e.currentTarget,
    }
    swiped.current = false
    if (state.active) takeOver(e, state)
    else drag.current = state
  }

  function move(e: React.PointerEvent) {
    const state = drag.current
    if (!state) return
    const delta = along(e) - state.pos
    if (state.active) {
      paint(shiftFor(delta), null)
      return
    }
    // Still the list's gesture. It becomes the sheet's only when it is unmistakably
    // along the sheet's axis, in the direction the sheet can go, and the list has
    // nothing left to scroll that way.
    const off = Math.abs(across(e) - state.cross)
    const towards = open ? delta > 0 : delta < 0
    if (!towards || Math.abs(delta) < HANDOFF_SLOP || Math.abs(delta) <= off) return
    // A vertical sheet closes downwards, which is the direction that scrolls a list
    // back to its top, so it only takes over at scrollTop 0. The horizontal one closes
    // rightwards, the direction that scrolls a table back to its left edge: same rule,
    // read off the other axis.
    const scrolled = state.scroller ? (vertical ? state.scroller.scrollTop : state.scroller.scrollLeft) : 0
    if (scrolled > 0) return
    // Restart from here so the card does not jump the distance the list already had.
    takeOver(e, { ...state, active: true, pos: along(e), t: e.timeStamp })
  }

  function up(e: React.PointerEvent) {
    const state = drag.current
    drag.current = null
    if (!state || !state.active) return
    delete document.documentElement.dataset.sheetScrub

    const delta = along(e) - state.pos
    const travelled = Math.abs(delta)
    const velocity = travelled / Math.max(e.timeStamp - state.t, 1)
    const decisive = travelled > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY
    // Anything past a few px was a swipe, not a tap: the click that follows is stale.
    swiped.current = travelled > TAP_SLOP

    const willOpen = open ? !(decisive && delta > 0) : decisive && delta < 0
    const from = shiftFor(delta)
    const to = willOpen ? 0 : travel
    // Carry the flick into the settle: at the speed the finger left, covering what is
    // left of the travel. A crawl lands on the slow bound, a flick on the fast one.
    const duration = velocity > 0 ? clamp(Math.abs(to - from) / velocity, SETTLE_MIN, SETTLE_MAX) : SETTLE_MS

    if (willOpen !== open) {
      settle.current = duration
      if (willOpen) onOpen()
      else onClose()
    }
    paint(to, duration)
  }

  return {
    cardRef,
    /** The grab strip, and anything else that is the sheet's rather than the panel's. */
    dragHandlers: { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up },
    /** The panel itself: a header drag, or a pull that outlives the list it started on. */
    bodyHandlers: { onPointerDown: downOnBody, onPointerMove: move, onPointerUp: up, onPointerCancel: up },
    /** True for the click that follows a swipe, which the strip must swallow. */
    consumeClick: () => {
      if (!swiped.current) return false
      swiped.current = false
      return true
    },
  }
}
