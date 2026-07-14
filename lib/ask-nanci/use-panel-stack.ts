import { useCallback, useState } from "react"
import type { PanelId } from "./types"

// Ordered list of open concept panels. Insertion order is render order in
// ConceptPanelArea (stacked vertically). Capped at 3 — chat occupies the
// conceptual 4th slot without being a literal entry in this array.
export function usePanelStack() {
  const [stack, setStack] = useState<PanelId[]>([])

  const openDynamic = useCallback((id: PanelId) => {
    setStack((prev) => (prev.includes(id) ? prev : [...prev, id].slice(-3)))
  }, [])

  const closeDynamic = useCallback((id: PanelId) => {
    setStack((prev) => prev.filter((p) => p !== id))
  }, [])

  const resetDynamic = useCallback(() => setStack([]), [])

  return { stack, openDynamic, closeDynamic, resetDynamic }
}
