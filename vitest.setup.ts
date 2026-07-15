import { afterEach, beforeEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

// jsdom omits several APIs the hook relies on. Provide deterministic stubs so
// effects flush synchronously and the layout/scroll calls don't throw.
beforeEach(() => {
  // rAF runs synchronously → the hook's double-rAF measurements resolve in-line.
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
  vi.stubGlobal("cancelAnimationFrame", () => {})
  // Default to "motion allowed".
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} }),
  )
  // ResizeObserver that registers instances so tests can fire callbacks on demand.
  ;(globalThis as unknown as { __ros: { callback: ResizeObserverCallback }[] }).__ros = []
  vi.stubGlobal(
    "ResizeObserver",
    class {
      callback: ResizeObserverCallback
      constructor(cb: ResizeObserverCallback) {
        this.callback = cb
        ;(globalThis as unknown as { __ros: unknown[] }).__ros.push(this)
      }
      observe() {}
      unobserve() {}
      disconnect() {
        const list = (globalThis as unknown as { __ros: unknown[] }).__ros
        const i = list.indexOf(this)
        if (i >= 0) list.splice(i, 1)
      }
    },
  )
  // Element.scrollTo is unimplemented in jsdom.
  if (!Element.prototype.scrollTo) Element.prototype.scrollTo = () => {}
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
