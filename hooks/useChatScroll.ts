import { useEffect, useRef } from "react"

export type ChatScrollState = "idle" | "thinking" | "streaming"

export interface UseChatScrollOptions {
  /** Pixels of gap above the user message when scrolled to top. Default: 8 */
  scrollOffset?: number
  /**
   * Minimum scroll distance as a ratio of container height before scroll-to-top
   * fires. Prevents scrolling when the message is already near the top.
   * Default: 0.25
   */
  scrollTriggerRatio?: number
  /**
   * Wait an extra animation frame before the idle measurement so post-idle
   * renders (suggestion chips, follow-up prompts, etc.) are included in the
   * anchor height before the final spacer adjustment. Default: true
   */
  waitForPostIdleRender?: boolean
}

/**
 * Manages scroll behaviour for a streaming chat interface.
 *
 * Three refs must be attached in the consuming component:
 *   - `containerRef`   — the scrollable overflow container
 *   - `lastUserMsgRef` — wrapper element of the most recent user message
 *   - `spacerRef`      — empty element at the very bottom of the message list
 *
 * Phases:
 *   thinking  → scrolls user message toward top (if travel distance warrants it)
 *               and captures the available height budget for the incoming response
 *   streaming → shrinks the spacer each token so the response stays pinned to
 *               the bottom without triggering a layout reflow
 *   idle      → finalises spacer height (accounting for any post-idle renders)
 *               and scrolls to bottom if the response fully consumed the budget
 */
export function useChatScroll(
  chatState: ChatScrollState,
  streamingContent: string | undefined,
  options: UseChatScrollOptions = {},
): {
  containerRef: React.RefObject<HTMLDivElement | null>
  spacerRef: React.RefObject<HTMLDivElement | null>
  lastUserMsgRef: React.RefObject<HTMLDivElement | null>
} {
  const {
    scrollOffset = 8,
    scrollTriggerRatio = 0.25,
    waitForPostIdleRender = true,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const lastUserMsgRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const availableHeightRef = useRef<number>(0)

  // Stable cancel helper — lives in a ref so effects never close over a stale copy
  const cancelRafRef = useRef(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  })

  useEffect(() => cancelRafRef.current, [])

  // Phase: thinking — scroll user message toward top and capture height budget
  useEffect(() => {
    if (chatState !== "thinking") return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const container = containerRef.current
        const spacer = spacerRef.current
        const target = lastUserMsgRef.current
        if (!container || !spacer || !target) return

        const targetRect = target.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const scrollTarget =
          container.scrollTop + targetRect.top - containerRect.top - scrollOffset

        availableHeightRef.current =
          container.clientHeight - targetRect.height - scrollOffset
        spacer.style.height = `${availableHeightRef.current}px`

        if (scrollTarget > container.clientHeight * scrollTriggerRatio) {
          container.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" })
        }
      })
    })
  }, [chatState, scrollOffset, scrollTriggerRatio])

  // Phase: streaming + idle — shrink spacer each token; finalise and push on idle
  useEffect(() => {
    if (chatState === "idle") {
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

        if (spacerAfterStream === 0) {
          container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
        }
      }

      if (waitForPostIdleRender) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(measure)
        })
      } else {
        rafRef.current = requestAnimationFrame(measure)
      }
      return
    }

    if (chatState !== "streaming") return

    cancelRafRef.current()
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const spacer = spacerRef.current
      if (!spacer) return
      const anchor = spacer.previousElementSibling as HTMLElement | null
      if (!anchor) return
      const remaining =
        availableHeightRef.current - anchor.getBoundingClientRect().height
      spacer.style.height = `${Math.max(remaining, 0)}px`
    })
  }, [streamingContent, chatState, waitForPostIdleRender, scrollOffset])

  return { containerRef, spacerRef, lastUserMsgRef }
}
