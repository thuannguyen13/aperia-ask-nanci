import { useCallback, useEffect, useRef, useState } from "react"

/**
 * The chat lifecycle, generalized so any chat state machine can map onto it:
 *   - `"awaiting"`  — a new user turn was just sent; waiting on the answer (reserve/pin runs here).
 *   - `"streaming"` — the assistant answer is actively growing.
 *   - `"idle"`      — no answer in flight.
 *
 * If your app only has an `isStreaming` boolean plus a "just sent" moment,
 * derive it trivially: `phase = justSent ? "awaiting" : isStreaming ? "streaming" : "idle"`.
 */
export type ChatScrollPhase = "idle" | "awaiting" | "streaming"

export interface UseChatScrollOptions {
  /** Pixels of gap above the user message when it's pinned to the top. Default: 8 */
  scrollOffset?: number
  /**
   * Minimum scroll distance as a ratio of container height before the pin
   * scroll fires. Prevents scrolling when the message is already near the top.
   * Default: 0.25
   */
  scrollTriggerRatio?: number
  /**
   * Distance from the bottom (px) still counted as "pinned to bottom". While
   * pinned, the finished answer auto-scrolls into view; once the user scrolls
   * further than this, auto-follow yields to them. Default: 48
   */
  bottomThreshold?: number
  /**
   * How much room below the question (as a ratio of container height) counts as
   * "enough for the answer". If the question already has at least this much space
   * beneath it on send, the hook leaves everything in place — no scroll, no
   * reserved gap. It only pins the question to the top when the answer wouldn't
   * otherwise fit. Default: 0.5
   */
  comfortableAnswerRatio?: number
  /**
   * Wait an extra animation frame before the idle measurement so post-idle
   * renders (suggestion chips, follow-up prompts, etc.) are included in the
   * anchor height before the final spacer adjustment. Default: true
   */
  waitForPostIdleRender?: boolean
}

export interface UseChatScrollParams extends UseChatScrollOptions {
  /** Current chat lifecycle phase. See {@link ChatScrollPhase}. */
  phase: ChatScrollPhase
}

export interface UseChatScrollResult {
  /** Attach to the scrollable overflow container. */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Attach to an empty element rendered as the LAST child of the message list. */
  spacerRef: React.RefObject<HTMLDivElement | null>
  /** Attach to the wrapper of the most recent user message. */
  lastUserMsgRef: React.RefObject<HTMLDivElement | null>
  /**
   * True while the view is following the bottom. Flips false the moment the user
   * scrolls up past `bottomThreshold` (any input: wheel, trackpad, keyboard,
   * scrollbar). Drives the visibility of a scroll-to-bottom affordance.
   */
  isPinnedToBottom: boolean
  /** Scroll to the bottom and re-engage auto-follow. Safe to call anytime. */
  scrollToBottom: () => void
}

// ── Pure decisions (exported for unit tests; no DOM/layout needed) ──────────

/** True when the viewport is within `threshold` px of the bottom. */
export function isAtBottom(
  scrollHeight: number,
  scrollTop: number,
  clientHeight: number,
  threshold: number,
): boolean {
  return scrollHeight - scrollTop - clientHeight <= threshold
}

/** True when the question already has enough room below it to skip pinning. */
export function hasRoomForAnswer(
  spaceBelow: number,
  clientHeight: number,
  comfortableAnswerRatio: number,
): boolean {
  return spaceBelow >= clientHeight * comfortableAnswerRatio
}

/**
 * True when the finished answer should scroll fully into view: only when this
 * turn actually reserved space, the answer consumed the whole budget, and the
 * user never scrolled away.
 */
export function shouldFollowToBottom(
  reservedThisTurn: boolean,
  spacerAfterStream: number,
  isPinned: boolean,
): boolean {
  return reservedThisTurn && spacerAfterStream === 0 && isPinned
}

/**
 * Streaming-chat scroll behaviour — the ChatGPT/Claude pattern: pin the new
 * question near the top and stream the answer into pre-reserved space so the
 * viewport never jumps mid-stream. "Never move the reader against their intent":
 * once the user scrolls up, auto-follow yields until they return or call
 * `scrollToBottom()`.
 *
 * ── Wiring (the DOM contract) ──
 * Render, inside the scroll container, the message list followed by an empty
 * spacer as its LAST child, and attach:
 *   - `containerRef`   → the scrollable overflow container
 *   - `lastUserMsgRef` → wrapper of the most recent user message
 *   - `spacerRef`      → the trailing empty element
 * The live answer is resolved internally as `spacer.previousElementSibling`
 * (correct while streaming AND at idle, where the answer commits into the list),
 * so there is no anchor ref to wire.
 *
 * ── Behaviour by phase ──
 *   awaiting  → if the question already has room below it (>= `comfortableAnswerRatio`
 *               of the viewport) leave everything in place; otherwise pin it near
 *               the top and reserve the answer's height budget.
 *   streaming → a ResizeObserver on the answer (and the container) shrinks the
 *               spacer as the answer grows and re-budgets on viewport resize —
 *               no per-token layout reads, no mid-stream scrolling.
 *   idle      → finalise the spacer and scroll to the bottom only if this turn
 *               reserved space and the user is still pinned.
 *
 * Programmatic scrolls are tagged so they aren't mistaken for the user taking
 * control. Honors `prefers-reduced-motion` (instant scroll). SSR-safe.
 *
 * @example
 * const { containerRef, spacerRef, lastUserMsgRef, isPinnedToBottom, scrollToBottom } =
 *   useChatScroll({ phase })
 * return (
 *   <div ref={containerRef} className="overflow-y-auto">
 *     {messages.map((m, i) => (
 *       <div key={m.id} ref={i === lastUserIndex ? lastUserMsgRef : undefined}>…</div>
 *     ))}
 *     <div ref={spacerRef} />
 *   </div>
 * )
 */
export function useChatScroll({
  phase,
  scrollOffset = 8,
  scrollTriggerRatio = 0.25,
  bottomThreshold = 48,
  comfortableAnswerRatio = 0.5,
  waitForPostIdleRender = true,
}: UseChatScrollParams): UseChatScrollResult {
  const containerRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const lastUserMsgRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const availableHeightRef = useRef<number>(0)
  // Whether THIS turn pinned the question + reserved answer space. When false
  // (the question already had room), streaming/idle skip their spacer + scroll work.
  const reservedThisTurnRef = useRef(false)
  // Container height when the budget was reserved — lets streaming recompute the
  // budget if the viewport resizes mid-answer (rotation, devtools, panel reflow).
  const reservedClientHeightRef = useRef(0)

  // Auto-follow tracking. `isPinnedRef` is the hot-path source of truth (read in
  // effects without re-subscribing); `isPinnedToBottom` mirrors it for React.
  const isPinnedRef = useRef(true)
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true)
  // True while a scroll WE initiated is settling, so its scroll events aren't
  // misread as the user grabbing control.
  const isProgrammaticRef = useRef(false)

  const setPinned = useCallback((pinned: boolean) => {
    isPinnedRef.current = pinned
    setIsPinnedToBottom(pinned) // React bails out if the value is unchanged
  }, [])

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true

  // Tag + perform a scroll we own. The programmatic flag is cleared by the scroll
  // listener once the motion settles (debounced), covering browsers without
  // `scrollend`.
  const programmaticScrollTo = useCallback((top: number) => {
    const c = containerRef.current
    if (!c) return
    isProgrammaticRef.current = true
    c.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }, [])

  const scrollToBottom = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    setPinned(true)
    programmaticScrollTo(c.scrollHeight)
  }, [setPinned, programmaticScrollTo])

  // Stable cancel helper — lives in a ref so effects never close over a stale copy
  const cancelRafRef = useRef(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  })

  useEffect(() => cancelRafRef.current, [])

  // Detect user-initiated scroll from EVERY source (wheel, trackpad, keyboard,
  // scrollbar) via one passive scroll listener, gated by the programmatic flag.
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    let settleTimer: number | undefined
    const onScroll = () => {
      if (isProgrammaticRef.current) {
        // Our scroll is still moving; debounce-clear the flag once it stops.
        window.clearTimeout(settleTimer)
        settleTimer = window.setTimeout(() => {
          isProgrammaticRef.current = false
        }, 150)
        return
      }
      setPinned(isAtBottom(c.scrollHeight, c.scrollTop, c.clientHeight, bottomThreshold))
    }
    c.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      c.removeEventListener("scroll", onScroll)
      window.clearTimeout(settleTimer)
    }
  }, [bottomThreshold, setPinned])

  // Phase: awaiting — pin the question toward the top (only if the answer won't
  // otherwise fit) and capture the height budget for the incoming answer.
  useEffect(() => {
    if (phase !== "awaiting") return
    // New question = fresh intent to watch the answer: re-engage auto-follow.
    setPinned(true)
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const container = containerRef.current
        const spacer = spacerRef.current
        const target = lastUserMsgRef.current
        if (!container || !spacer || !target) return

        // Zero out the spacer before measuring so we see the natural layout.
        spacer.style.height = "0px"
        const targetRect = target.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const currentTopGap = targetRect.top - containerRect.top
        const spaceBelow = container.clientHeight - currentTopGap - targetRect.height

        // Enough room below the question already? Leave everything in place — no
        // scroll, no reserved gap. The answer streams into the space that's there.
        if (hasRoomForAnswer(spaceBelow, container.clientHeight, comfortableAnswerRatio)) {
          availableHeightRef.current = 0
          reservedThisTurnRef.current = false
          return
        }

        // Not enough room: pin the question toward the top and reserve a screen of
        // answer space below it.
        reservedThisTurnRef.current = true
        const scrollTarget = container.scrollTop + currentTopGap - scrollOffset
        const willScroll = scrollTarget > container.clientHeight * scrollTriggerRatio

        // Reserve exactly enough to fill below the message's FINAL on-screen top.
        // If we scroll it up, that's `scrollOffset`; if the trigger ratio suppresses
        // the scroll (message already near the top), it stays at `currentTopGap` —
        // reserving as if it had moved would leave a small scrollable gap.
        const finalTopGap = willScroll ? scrollOffset : currentTopGap
        availableHeightRef.current =
          container.clientHeight - finalTopGap - targetRect.height
        reservedClientHeightRef.current = container.clientHeight

        // Anything already between the question and the spacer (e.g. the thinking
        // indicator) occupies part of the budget. Subtract it, or that content
        // becomes extra scrollable space below the pinned question. (Streaming's
        // shrink does the same via the answer's height.)
        const belowContent = spacer.getBoundingClientRect().top - targetRect.bottom
        spacer.style.height = `${Math.max(availableHeightRef.current - belowContent, 0)}px`

        if (willScroll) {
          programmaticScrollTo(Math.max(0, scrollTarget))
        }
      })
    })
  }, [phase, scrollOffset, scrollTriggerRatio, comfortableAnswerRatio, setPinned, programmaticScrollTo])

  // Phase: streaming — a ResizeObserver on the answer shrinks the spacer whenever
  // the answer's height changes. No per-token layout reads, off the render path.
  // Skipped when this turn reserved nothing (the question already had room).
  // Viewport resize is handled by the always-on observer below.
  useEffect(() => {
    if (phase !== "streaming" || !reservedThisTurnRef.current) return
    const spacer = spacerRef.current
    const anchor = spacer?.previousElementSibling as HTMLElement | null
    if (!spacer || !anchor) return

    const shrink = () => {
      const remaining = availableHeightRef.current - anchor.getBoundingClientRect().height
      spacer.style.height = `${Math.max(remaining, 0)}px`
    }
    shrink() // initial frame
    const ro = new ResizeObserver(shrink)
    ro.observe(anchor)
    return () => ro.disconnect()
  }, [phase])

  // Always-on: keep the reserved budget correct across viewport resizes in ANY
  // reserved phase (thinking / streaming / idle). Without this, resizing after the
  // answer settles restores scrollable slack below the pinned question. Adjusts the
  // budget by the height delta and re-derives the spacer from the live answer size,
  // so it also picks up a width reflow that changes the answer's height.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const rebudget = () => {
      if (!reservedThisTurnRef.current) return
      const spacer = spacerRef.current
      const anchor = spacer?.previousElementSibling as HTMLElement | null
      if (!spacer || !anchor) return
      const ch = container.clientHeight
      if (ch !== reservedClientHeightRef.current) {
        availableHeightRef.current += ch - reservedClientHeightRef.current
        reservedClientHeightRef.current = ch
      }
      const remaining = availableHeightRef.current - anchor.getBoundingClientRect().height
      spacer.style.height = `${Math.max(remaining, 0)}px`
    }
    const ro = new ResizeObserver(rebudget)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // Phase: idle — finalise the spacer (accounting for post-idle renders) and, only
  // if the user is still pinned, scroll the completed answer fully into view.
  useEffect(() => {
    if (phase !== "idle") return
    cancelRafRef.current()

    const measure = () => {
      rafRef.current = null
      const container = containerRef.current
      const spacer = spacerRef.current
      if (!spacer || !container) return
      const anchor = spacer.previousElementSibling as HTMLElement | null
      if (!anchor) return

      const spacerAfterStream = parseFloat(spacer.style.height) || 0
      const remaining =
        availableHeightRef.current - anchor.getBoundingClientRect().height
      spacer.style.height = `${Math.max(remaining, 0)}px`

      if (shouldFollowToBottom(reservedThisTurnRef.current, spacerAfterStream, isPinnedRef.current)) {
        programmaticScrollTo(container.scrollHeight)
      }
    }

    if (waitForPostIdleRender) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(measure)
      })
    } else {
      rafRef.current = requestAnimationFrame(measure)
    }
  }, [phase, waitForPostIdleRender, programmaticScrollTo])

  return { containerRef, spacerRef, lastUserMsgRef, isPinnedToBottom, scrollToBottom }
}
