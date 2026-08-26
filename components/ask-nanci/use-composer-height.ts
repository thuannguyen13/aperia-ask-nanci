"use client"

import { useCallback, useRef } from "react"

/**
 * Publishes the composer's height as `--composer-h` on <html>, so a mobile panel sheet
 * can end exactly where the composer starts instead of guessing a constant. The height
 * is not fixed: the notification banner, a long draft and the usage banner all change
 * it, so it is observed rather than measured once.
 *
 * A callback ref, not an effect: the composer only exists in the chat view, and in the
 * full app that view mounts long after the page does. An effect with a stable dep list
 * runs once against a ref that is still null, and the var is never published — which
 * left the sheet reserving the fallback and overlapping the real composer.
 *
 * Same channel useAppTheme uses for the theme: a layout fact several components away
 * from the ones that need it.
 */
export function useComposerHeight() {
  const observer = useRef<ResizeObserver | null>(null)

  return useCallback((el: HTMLDivElement | null) => {
    observer.current?.disconnect()
    observer.current = null

    if (!el) {
      // No docked composer (the welcome view scrolls its own): sheets run to the bottom.
      document.documentElement.style.removeProperty("--composer-h")
      return
    }

    const publish = () =>
      document.documentElement.style.setProperty("--composer-h", `${el.offsetHeight}px`)
    publish()
    observer.current = new ResizeObserver(publish)
    observer.current.observe(el)
  }, [])
}
