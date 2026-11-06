"use client"

import { useEffect, useRef, useState } from "react"
import { useAskNanci } from "@/contexts/AskNanciContext"

const TICK_MS = 50
// Time per character, at the pace a person types.
const TYPE_MS = 90
// The passcode a verification step types, and the beat before it presses Confirm.
const AUTOPLAY_CODE = "482913"
const CODE_FROM_MS = 700
const CODE_CONFIRM_AT_MS = CODE_FROM_MS + AUTOPLAY_CODE.length * TYPE_MS + 1100

export interface AutoplayStep {
  at: number
  run: () => void
}

/**
 * Under ?autoplay a panel plays its own steps, because nobody is there to fill it in.
 * The clock starts once `active` holds and the chat is idle, so no step lands on an
 * answer that is still streaming. Each step runs once, at its time in ms. Returns the
 * time on the clock, or null off autoplay, where the panel's fields stay the person's.
 */
export function usePanelAutoplay(steps: AutoplayStep[], active = true): number | null {
  const { autoplaying, chatState } = useAskNanci()
  const [elapsed, setElapsed] = useState(0)
  const stepsRef = useRef(steps)
  useEffect(() => { stepsRef.current = steps })
  // Kept across a pause, so a chat that goes busy mid-run resumes the clock rather
  // than replaying the steps already taken.
  const startRef = useRef<number | null>(null)
  const nextRef = useRef(0)
  const running = autoplaying && active && chatState === "idle"

  useEffect(() => {
    if (!running) return
    startRef.current ??= Date.now()
    const start = startRef.current
    const id = setInterval(() => {
      const t = Date.now() - start
      setElapsed(t)
      const all = stepsRef.current
      while (nextRef.current < all.length && t >= all[nextRef.current].at) all[nextRef.current++].run()
      if (nextRef.current >= all.length) clearInterval(id)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [running])

  return autoplaying ? elapsed : null
}

/** The part of `text` typed by `elapsed`, when typing starts at `from`. */
export function typeAt(text: string, elapsed: number, from: number): string {
  return text.slice(0, Math.max(0, Math.floor((elapsed - from) / TYPE_MS)))
}

/** When typing `text` from `from` is done. */
export function typedBy(text: string, from: number): number {
  return from + text.length * TYPE_MS
}

/**
 * A verification step under ?autoplay: it types the passcode, then presses Confirm.
 * Returns the code so far, or undefined off autoplay, where the field is left empty.
 */
export function useAutoplayCode(onConfirm: () => void): string | undefined {
  const elapsed = usePanelAutoplay([{ at: CODE_CONFIRM_AT_MS, run: onConfirm }])
  return elapsed === null ? undefined : typeAt(AUTOPLAY_CODE, elapsed, CODE_FROM_MS)
}

// An offer form under ?autoplay: a beat to read it, a scroll to the consent, the box
// ticked, then Submit.
const FORM_SCROLL_AT_MS = 3000
const FORM_CONSENT_AT_MS = 4600
const FORM_SUBMIT_AT_MS = 5800

/**
 * Plays an offer form under ?autoplay while `active`. Put `endRef` on the consent row.
 * `consented` is undefined off autoplay, where the checkbox stays the person's own.
 */
export function useAutoplayForm(active: boolean, onSubmit: () => void) {
  const endRef = useRef<HTMLDivElement>(null)
  const elapsed = usePanelAutoplay([
    { at: FORM_SCROLL_AT_MS, run: () => endRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }) },
    { at: FORM_SUBMIT_AT_MS, run: onSubmit },
  ], active)
  return { endRef, consented: elapsed === null ? undefined : elapsed >= FORM_CONSENT_AT_MS }
}
