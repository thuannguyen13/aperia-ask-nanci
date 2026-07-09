import { useCallback, useState } from "react"
import type { DynamicPanelId } from "./types"

// Ordered list of open "dynamic" panels (new mechanism), separate from the
// legacy `openPanels` array used by the 11 hardcoded scripted flows.
// Insertion order doubles as slot order — see ConceptPanelArea's
// slotsFromDynamicPanels(). Capped at 3 because chat occupies the conceptual
// 4th slot without being a literal entry in this array.
export function usePanelStack() {
  const [stack, setStack] = useState<DynamicPanelId[]>([])

  const openDynamic = useCallback((id: DynamicPanelId) => {
    setStack((prev) => (prev.includes(id) ? prev : [...prev, id].slice(-3)))
  }, [])

  const closeDynamic = useCallback((id: DynamicPanelId) => {
    setStack((prev) => prev.filter((p) => p !== id))
  }, [])

  const resetDynamic = useCallback(() => setStack([]), [])

  return { stack, openDynamic, closeDynamic, resetDynamic }
}
