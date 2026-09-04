"use client"

import { useEffect } from "react"

/**
 * Publishes how much of the screen the on-screen keyboard covers as `--keyboard-h`.
 *
 * iOS and Android Chrome shrink the visual viewport for the keyboard without touching
 * the layout viewport, so a fixed element keeps its full height and its bottom edge
 * ends up behind the keyboard. Anything anchored to the bottom subtracts this to stay
 * above it: the chat composer pads by it (app/(app)/page.tsx), and the panel sheet's
 * over-composer frame anchors to it (MobilePanelSwitcher).
 *
 * Mounted once, by the page. The value lives on <html> like --composer-inset, so a
 * second mount would only add a second cleanup that removes it too early.
 */
export function useKeyboardInset() {
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const publish = () => {
      const covered = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      document.documentElement.style.setProperty("--keyboard-h", `${covered}px`)
    }
    publish()
    viewport.addEventListener("resize", publish)
    viewport.addEventListener("scroll", publish)
    return () => {
      viewport.removeEventListener("resize", publish)
      viewport.removeEventListener("scroll", publish)
      document.documentElement.style.removeProperty("--keyboard-h")
    }
  }, [])
}
