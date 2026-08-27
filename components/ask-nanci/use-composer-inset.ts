"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Publishes how much of the bottom of the screen the composer occupies as
 * `--composer-inset` on <html>, so a mobile panel sheet can end exactly where the
 * composer starts instead of guessing a constant.
 *
 * The distance to the viewport's bottom edge, not the composer's own height: the app
 * frame insets itself on a phone, so the composer no longer sits flush with the
 * bottom. A sheet anchored by `bottom:` measures from that same edge, and using the
 * height alone would drop it behind the composer by exactly the frame's padding.
 *
 * Neither number is fixed. The notification banner, a long draft and the usage banner
 * all change the composer, and the viewport changes on rotation, so both are observed
 * rather than measured once.
 *
 * A callback ref, not an effect: the composer only exists in the chat view, and in the
 * full app that view mounts long after the page does. An effect with a stable dep list
 * runs once against a ref that is still null, and the var is never published — which
 * left the sheet reserving the fallback and overlapping the real composer.
 *
 * Same channel useAppTheme uses for the theme: a layout fact several components away
 * from the ones that need it.
 */
export function useComposerInset() {
  const observer = useRef<ResizeObserver | null>(null)
  const publisher = useRef<(() => void) | null>(null)

  // The inset moves with the viewport as well as with the composer, and a rotation
  // resizes neither the element nor anything the observer watches.
  useEffect(() => {
    const onResize = () => publisher.current?.()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return useCallback((el: HTMLDivElement | null) => {
    observer.current?.disconnect()
    observer.current = null
    publisher.current = null

    if (!el) {
      // No docked composer (the welcome view scrolls its own): sheets run to the bottom.
      document.documentElement.style.removeProperty("--composer-inset")
      return
    }

    const publish = () => {
      const inset = document.documentElement.clientHeight - el.getBoundingClientRect().top
      document.documentElement.style.setProperty("--composer-inset", `${Math.max(0, inset)}px`)
    }
    publisher.current = publish
    publish()
    observer.current = new ResizeObserver(publish)
    observer.current.observe(el)
  }, [])
}
