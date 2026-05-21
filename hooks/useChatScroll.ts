import { useEffect, useRef } from "react"

const SCROLL_OFFSET = 8

export function useChatScroll(
  chatState: "idle" | "thinking" | "streaming",
  streamingContent: string | undefined,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const lastUserMsgRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  // Captured once after scroll: space available below the user message
  const availableHeightRef = useRef<number>(0)

  const cancelRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  useEffect(() => cancelRaf, [])

  // Scroll user message to top, then capture available height once
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
        const scrollTarget = container.scrollTop + targetRect.top - containerRect.top - SCROLL_OFFSET
        // Capture space below user message — used for all spacer math from here on
        availableHeightRef.current = container.clientHeight - targetRect.height - SCROLL_OFFSET
        spacer.style.height = `${availableHeightRef.current}px`
        container.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" })
      })
    })
  }, [chatState])

  // Shrink spacer as content grows using the captured height — no live position reads
  useEffect(() => {
    if (chatState === "idle") {
      cancelRaf()
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const spacer = spacerRef.current
        if (!spacer) return
        const anchor = spacer.previousElementSibling as HTMLElement | null
        if (!anchor) return
        const remaining = availableHeightRef.current - anchor.getBoundingClientRect().height
        spacer.style.height = `${Math.max(remaining, 0)}px`
      })
      return
    }
    if (chatState !== "streaming") return

    cancelRaf()
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const spacer = spacerRef.current
      if (!spacer) return
      const anchor = spacer.previousElementSibling as HTMLElement | null
      if (!anchor) return
      const remaining = availableHeightRef.current - anchor.getBoundingClientRect().height
      spacer.style.height = `${Math.max(remaining, 0)}px`
    })
  }, [streamingContent, chatState])

  return { containerRef, spacerRef, lastUserMsgRef }
}
