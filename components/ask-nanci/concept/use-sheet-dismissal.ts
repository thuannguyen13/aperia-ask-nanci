"use client"

import { useEffect, useRef } from "react"

/**
 * The two ways out of an open sheet that are not a gesture: the Escape key, and the
 * back button or back swipe. Both close it rather than leaving the demo.
 *
 * `onClose` is held in a ref so neither listener is rebuilt on every render. The
 * parent passes a fresh arrow each time, and a popstate listener that re-registered
 * per streamed token would push a second history entry along with it.
 */
export function useSheetDismissal(open: boolean, onClose: () => void) {
  const close = useRef(onClose)
  useEffect(() => { close.current = onClose })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close.current() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // One entry per open, popped again when the sheet closes any other way, so the
  // history stack never grows.
  useEffect(() => {
    if (!open) return
    let entryStanding = true
    window.history.pushState({ panelSheet: true }, "")
    const onPop = () => { entryStanding = false; close.current() }
    window.addEventListener("popstate", onPop)
    return () => {
      window.removeEventListener("popstate", onPop)
      if (entryStanding) window.history.back()
    }
  }, [open])
}
