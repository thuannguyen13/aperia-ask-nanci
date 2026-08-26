"use client"

import { useEffect, type RefObject } from "react"

/**
 * The sheet's presence for a keyboard and a screen reader: focus follows the panel in
 * and back out, and the conversation it covers is hidden while it is open.
 *
 * The conversation is reached by its `data-nest` attribute rather than by a prop. The
 * same element already takes its scale and its dim from the sheet through
 * --sheet-progress, so this is the channel that already exists.
 */
export function useSheetFocus(cardRef: RefObject<HTMLElement | null>, open: boolean) {
  useEffect(() => {
    if (!open) return
    const conversation = document.querySelector("[data-nest]")
    conversation?.setAttribute("aria-hidden", "true")
    return () => conversation?.removeAttribute("aria-hidden")
  }, [open])

  useEffect(() => {
    if (!open) return
    const card = cardRef.current
    const previous = document.activeElement as HTMLElement | null
    card?.focus({ preventScroll: true })
    return () => {
      // Only take focus back if it is still ours: a tap on the composer while the
      // sheet closes should keep the caret where the user just put it.
      if (card?.contains(document.activeElement) && previous?.isConnected) {
        previous.focus({ preventScroll: true })
      }
    }
  }, [cardRef, open])
}
