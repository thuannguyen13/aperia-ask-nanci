"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable) return
      if (e.key === "d" || e.key === "D") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme])

  return null
}
