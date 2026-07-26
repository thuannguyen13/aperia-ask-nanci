import { describe, expect, it, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { usePanelStack, MAX_OPEN_PANELS } from "./use-panel-stack"
import type { PanelId } from "./types"

const p = (id: string) => id as PanelId

describe("usePanelStack", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => usePanelStack())
    expect(result.current.stack).toEqual([])
  })

  it("pushes panels in insertion (render) order", () => {
    const { result } = renderHook(() => usePanelStack())
    act(() => result.current.openDynamic(p("a")))
    act(() => result.current.openDynamic(p("b")))
    expect(result.current.stack).toEqual(["a", "b"])
  })

  it("is idempotent — re-opening an already-open panel is a no-op", () => {
    const { result } = renderHook(() => usePanelStack())
    act(() => result.current.openDynamic(p("a")))
    act(() => result.current.openDynamic(p("b")))
    act(() => result.current.openDynamic(p("a")))
    expect(result.current.stack).toEqual(["a", "b"])
  })

  it("caps the stack at MAX_OPEN_PANELS, dropping the oldest entry", () => {
    const { result } = renderHook(() => usePanelStack())
    act(() => result.current.openDynamic(p("a")))
    act(() => result.current.openDynamic(p("b")))
    act(() => result.current.openDynamic(p("c")))
    act(() => result.current.openDynamic(p("d")))
    expect(result.current.stack).toEqual(["b", "c", "d"])
    expect(MAX_OPEN_PANELS).toBe(3)
  })

  it("warns when the cap evicts a panel, and stays quiet below it", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const { result } = renderHook(() => usePanelStack())
    act(() => result.current.openDynamic(p("a")))
    act(() => result.current.openDynamic(p("b")))
    act(() => result.current.openDynamic(p("c")))
    expect(warn).not.toHaveBeenCalled()

    act(() => result.current.openDynamic(p("d")))
    expect(warn).toHaveBeenCalledTimes(1)
    // The message has to name both panels to be actionable from a console line.
    expect(warn.mock.calls[0][0]).toContain('"d"')
    expect(warn.mock.calls[0][0]).toContain('"a"')
    warn.mockRestore()
  })

  // The flow player calls the staggered teardown from an async loop that captured
  // its callbacks one render earlier, so it reads the stack through this ref. If the
  // ref ever lags the state, closeAllPanels silently stops animating.
  it("keeps stackRef live for readers outside the render cycle", () => {
    const { result } = renderHook(() => usePanelStack())
    let seenDuringOpen: PanelId[] = []
    act(() => {
      result.current.openDynamic(p("a"))
      // Same tick, before React has re-rendered: the ref is already current.
      seenDuringOpen = [...result.current.stackRef.current]
    })
    expect(seenDuringOpen).toEqual(["a"])
    expect(result.current.stackRef.current).toEqual(result.current.stack)

    act(() => result.current.openDynamic(p("b")))
    expect(result.current.stackRef.current).toEqual(["a", "b"])

    act(() => result.current.closeDynamic(p("a")))
    expect(result.current.stackRef.current).toEqual(["b"])

    act(() => result.current.resetDynamic())
    expect(result.current.stackRef.current).toEqual([])
  })

  it("closes a specific panel, preserving order of the rest", () => {
    const { result } = renderHook(() => usePanelStack())
    act(() => result.current.openDynamic(p("a")))
    act(() => result.current.openDynamic(p("b")))
    act(() => result.current.openDynamic(p("c")))
    act(() => result.current.closeDynamic(p("b")))
    expect(result.current.stack).toEqual(["a", "c"])
  })

  it("closing a panel that isn't open is a no-op", () => {
    const { result } = renderHook(() => usePanelStack())
    act(() => result.current.openDynamic(p("a")))
    act(() => result.current.closeDynamic(p("z")))
    expect(result.current.stack).toEqual(["a"])
  })

  it("resets the whole stack", () => {
    const { result } = renderHook(() => usePanelStack())
    act(() => result.current.openDynamic(p("a")))
    act(() => result.current.openDynamic(p("b")))
    act(() => result.current.resetDynamic())
    expect(result.current.stack).toEqual([])
  })
})
