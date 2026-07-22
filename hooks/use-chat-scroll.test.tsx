import { describe, expect, it, vi } from "vitest"
import { act, render, screen } from "@testing-library/react"
import {
  hasRoomForAnswer,
  isAtBottom,
  shouldFollowToBottom,
  useChatScroll,
  type ChatScrollPhase,
} from "./use-chat-scroll"

// ── Pure decisions — the load-bearing logic, no DOM needed ──────────────────

describe("isAtBottom", () => {
  const T = 48
  it.each([
    ["exactly at bottom", 1000, 500, 500, true],
    ["within threshold", 1000, 460, 500, true], // distance 40
    ["on the threshold edge", 1000, 452, 500, true], // distance 48
    ["just past threshold", 1000, 451, 500, false], // distance 49
    ["scrolled way up", 1000, 0, 500, false], // distance 500
    ["content fits (no scroll)", 400, 0, 500, true], // distance -100
  ])("%s", (_name, sh, st, ch, want) => {
    expect(isAtBottom(sh, st, ch, T)).toBe(want)
  })
})

describe("hasRoomForAnswer", () => {
  it("true when space below meets the ratio", () => {
    expect(hasRoomForAnswer(600, 1000, 0.5)).toBe(true)
    expect(hasRoomForAnswer(500, 1000, 0.5)).toBe(true) // on the edge
  })
  it("false when the answer wouldn't fit", () => {
    expect(hasRoomForAnswer(60, 1000, 0.5)).toBe(false)
  })
})

describe("shouldFollowToBottom (the never-fight-the-user guard)", () => {
  it("follows only when reserved AND budget fully consumed AND still pinned", () => {
    expect(shouldFollowToBottom(true, 0, true)).toBe(true)
  })
  it("does not follow when the user scrolled away", () => {
    expect(shouldFollowToBottom(true, 0, false)).toBe(false)
  })
  it("does not follow when the answer left leftover budget (short answer)", () => {
    expect(shouldFollowToBottom(true, 120, true)).toBe(false)
  })
  it("does not follow when the turn streamed in place (nothing reserved)", () => {
    expect(shouldFollowToBottom(false, 0, true)).toBe(false)
  })
})

// ── Integration — effect wiring with mocked layout ──────────────────────────

function setRect(el: HTMLElement, rect: Partial<DOMRect>) {
  el.getBoundingClientRect = vi.fn(
    () =>
      ({
        top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0,
        toJSON() {}, ...rect,
      }) as DOMRect,
  )
}

function setMetric(el: HTMLElement, prop: "clientHeight" | "scrollHeight" | "scrollTop", value: number) {
  Object.defineProperty(el, prop, { configurable: true, get: () => value })
}

function Harness({ phase }: { phase: ChatScrollPhase }) {
  const { containerRef, spacerRef, lastUserMsgRef } = useChatScroll({ phase })
  return (
    <div ref={containerRef} data-testid="container">
      <div ref={lastUserMsgRef} data-testid="user">Q</div>
      <div data-testid="answer">A</div>
      <div ref={spacerRef} data-testid="spacer" />
    </div>
  )
}

describe("useChatScroll — awaiting phase", () => {
  it("pins + reserves when the question is too low for the answer to fit", () => {
    const { rerender } = render(<Harness phase="idle" />)
    const container = screen.getByTestId("container")
    const user = screen.getByTestId("user")
    const spacer = screen.getByTestId("spacer")

    // 1000px viewport; question sits near the bottom → only 60px below it.
    // A 30px "thinking indicator" sits between the question and the spacer.
    setMetric(container, "clientHeight", 1000)
    setMetric(container, "scrollHeight", 2000)
    setMetric(container, "scrollTop", 0)
    setRect(container, { top: 0, height: 1000 })
    setRect(user, { top: 900, height: 40, bottom: 940 })
    setRect(spacer, { top: 970 }) // 30px of content between question (bottom 940) and spacer
    const scrollSpy = vi.fn()
    container.scrollTo = scrollSpy

    act(() => rerender(<Harness phase="awaiting" />))

    expect(scrollSpy).toHaveBeenCalledTimes(1) // pinned to top
    // budget = 1000 - 8 (offset) - 40 (question) = 952; minus 30px already below = 922.
    // Subtracting the below-content is what prevents extra scrollable space.
    expect(spacer.style.height).toBe("922px")
  })

  it("re-budgets the reserved spacer when the viewport resizes", () => {
    const { rerender } = render(<Harness phase="idle" />)
    const container = screen.getByTestId("container")
    const user = screen.getByTestId("user")
    const answer = screen.getByTestId("answer")
    const spacer = screen.getByTestId("spacer")

    setMetric(container, "clientHeight", 1000)
    setMetric(container, "scrollHeight", 2000)
    setMetric(container, "scrollTop", 0)
    setRect(container, { top: 0, height: 1000 })
    setRect(user, { top: 900, height: 40, bottom: 940 })
    setRect(answer, { top: 940, height: 30, bottom: 970 })
    setRect(spacer, { top: 970 })
    container.scrollTo = vi.fn()

    act(() => rerender(<Harness phase="awaiting" />))
    expect(spacer.style.height).toBe("922px") // 1000 - 8 - 40 - 30

    // Viewport shrinks by 200px → budget must drop by 200 → 722px, no stale slack.
    setMetric(container, "clientHeight", 800)
    act(() => {
      const ros = (globalThis as unknown as { __ros: { callback: ResizeObserverCallback }[] }).__ros
      ros.forEach((ro) => ro.callback([], ro as unknown as ResizeObserver))
    })
    expect(spacer.style.height).toBe("722px")
  })

  it("leaves everything in place when the question already has room", () => {
    const { rerender } = render(<Harness phase="idle" />)
    const container = screen.getByTestId("container")
    const user = screen.getByTestId("user")
    const spacer = screen.getByTestId("spacer")

    // Question near the top → ~940px of room below it (> half the viewport).
    setMetric(container, "clientHeight", 1000)
    setMetric(container, "scrollHeight", 2000)
    setMetric(container, "scrollTop", 0)
    setRect(container, { top: 0, height: 1000 })
    setRect(user, { top: 20, height: 40, bottom: 60 })
    const scrollSpy = vi.fn()
    container.scrollTo = scrollSpy

    act(() => rerender(<Harness phase="awaiting" />))

    expect(scrollSpy).not.toHaveBeenCalled() // no scroll
    expect(spacer.style.height).toBe("0px") // no reserved gap
  })
})
