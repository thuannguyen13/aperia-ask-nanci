import { beforeEach, describe, expect, it } from "vitest"
import { readIdSet, writeIdSet } from "./marketplace-store"
import { ALL_STORAGE_KEYS, MARKETPLACE_ENABLED_KEY, MARKETPLACE_MUTED_KEY } from "./storage-keys"

describe("marketplace-store", () => {
  beforeEach(() => localStorage.clear())

  it("reads null until something is saved, so the defaults apply", () => {
    expect(readIdSet(MARKETPLACE_ENABLED_KEY)).toBeNull()
  })

  it("round-trips a set, including an empty one", () => {
    writeIdSet(MARKETPLACE_ENABLED_KEY, new Set(["resy", "sme-value-proposition"]))
    expect(readIdSet(MARKETPLACE_ENABLED_KEY)).toEqual(new Set(["resy", "sme-value-proposition"]))
    writeIdSet(MARKETPLACE_MUTED_KEY, new Set())
    expect(readIdSet(MARKETPLACE_MUTED_KEY)).toEqual(new Set())
  })

  it("reads unreadable JSON as null", () => {
    localStorage.setItem(MARKETPLACE_ENABLED_KEY, "{")
    expect(readIdSet(MARKETPLACE_ENABLED_KEY)).toBeNull()
  })

  it("is cleared by a full reset", () => {
    expect(ALL_STORAGE_KEYS).toEqual(expect.arrayContaining([MARKETPLACE_ENABLED_KEY, MARKETPLACE_MUTED_KEY]))
  })
})
