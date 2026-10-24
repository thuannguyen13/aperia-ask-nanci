import { describe, expect, it } from "vitest"
import { shouldAutoOpenTour } from "./should-auto-open-tour"

const idle = { run: false, showIntro: false, onboardingOpen: false, replayed: false, scoped: false }

describe("shouldAutoOpenTour", () => {
  it("opens on an idle unscoped page", () => {
    expect(shouldAutoOpenTour(idle)).toBe(true)
  })

  it("never opens in a scoped mode", () => {
    expect(shouldAutoOpenTour({ ...idle, scoped: true })).toBe(false)
  })

  it.each(["run", "showIntro", "onboardingOpen", "replayed"] as const)("waits while %s", (flag) => {
    expect(shouldAutoOpenTour({ ...idle, [flag]: true })).toBe(false)
  })
})
