import { useCallback, useRef, useState } from "react"
import type { PanelId } from "./types"

// ConceptPanelArea gives every open panel an equal share of the column height, so a
// 4th would leave all of them unreadable. Chat occupies the conceptual 4th slot
// without being a literal entry in the stack.
export const MAX_OPEN_PANELS = 3

// Ordered list of open concept panels. Insertion order is render order in
// ConceptPanelArea (stacked vertically).
export function usePanelStack() {
  const [stack, setStack] = useState<PanelId[]>([])
  // The ref is authoritative and `stack` is derived from it, so a caller that reads
  // the stack outside a render still sees the live value. The flow player needs
  // this: its async loop captures its callbacks once and runs across many renders,
  // so a closed-over `stack` is stale by the time a turn tears the panels down.
  const stackRef = useRef<PanelId[]>([])

  const write = useCallback((next: PanelId[]) => {
    stackRef.current = next
    setStack(next)
  }, [])

  const openDynamic = useCallback((id: PanelId) => {
    const prev = stackRef.current
    if (prev.includes(id)) return
    if (prev.length >= MAX_OPEN_PANELS) {
      // The stack is full, so the newest panel gives way: the first ones stay put as the
      // story's context, and the last slot refreshes with the panel just asked for. It is
      // still worth a console line, since a flow that means to drop a panel should close
      // it (closePanel) rather than lean on this.
      console.warn(
        `[panel-stack] opening "${id}" with ${MAX_OPEN_PANELS} panels open; it replaces "${prev[prev.length - 1]}".`,
      )
      write([...prev.slice(0, MAX_OPEN_PANELS - 1), id])
      return
    }
    write([...prev, id])
  }, [write])

  const closeDynamic = useCallback((id: PanelId) => {
    write(stackRef.current.filter((p) => p !== id))
  }, [write])

  const resetDynamic = useCallback(() => write([]), [write])

  return { stack, stackRef, openDynamic, closeDynamic, resetDynamic }
}
