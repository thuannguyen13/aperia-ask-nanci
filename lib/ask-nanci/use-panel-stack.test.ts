import { describe, expect, it } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { usePanelStack } from "./use-panel-stack"
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

  it("caps the stack at 3, dropping the oldest entry", () => {
    const { result } = renderHook(() => usePanelStack())
    act(() => result.current.openDynamic(p("a")))
    act(() => result.current.openDynamic(p("b")))
    act(() => result.current.openDynamic(p("c")))
    act(() => result.current.openDynamic(p("d")))
    expect(result.current.stack).toEqual(["b", "c", "d"])
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
