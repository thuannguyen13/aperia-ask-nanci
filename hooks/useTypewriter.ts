"use client"

import { useState, useEffect, useRef } from "react"

export function useTypewriter(
  text: string | null,
  options: { speed?: number; onComplete?: () => void; stopRef?: React.MutableRefObject<boolean> } = {},
) {
  const { speed = 18, onComplete, stopRef } = options
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    if (text === null) {
      setDisplayed("")
      setDone(false)
      indexRef.current = 0
      return
    }

    indexRef.current = 0
    setDisplayed("")
    setDone(false)

    const tick = () => {
      if (stopRef?.current) {
        setDisplayed(text)
        setDone(true)
        onComplete?.()
        return
      }
      if (indexRef.current < text.length) {
        const next = indexRef.current + 1
        setDisplayed(text.slice(0, next))
        indexRef.current = next
        setTimeout(tick, speed)
      } else {
        setDone(true)
        onComplete?.()
      }
    }

    const id = setTimeout(tick, speed)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return { displayed, done }
}
