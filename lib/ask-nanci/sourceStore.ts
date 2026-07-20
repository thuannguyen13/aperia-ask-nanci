import type { Source } from "./types"
import { generateId } from "./utils"

const SOURCES_KEY = "asknanci_sources"

export const FOUNDATION_SOURCE_ID = "clover-built-in"
export const ONBOARDING_KEY   = "ask_nanci_onboarded"

// The pre-configured foundation datasource the product ships with (the dataset a
// merchant's own added accounts layer on top of). Its value is per-host/theme —
// the Titan theme (localhost:3000, non-embed) foundation is VisionWeb. Embed
// variants swap this slot via data/sources.ts (keyed off FOUNDATION_SOURCE_ID).
export const FOUNDATION_SOURCE: Source = {
  id: FOUNDATION_SOURCE_ID,
  name: "VisionWeb",
  kind: "bank",
  institution: "VisionWeb Data",
  logo: "/logos/vision-web-source-logo.svg",
  active: true,
  addedAt: 0,
}

export function readSources(): Source[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SOURCES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeSources(sources: Source[]): void {
  try {
    localStorage.setItem(SOURCES_KEY, JSON.stringify(sources))
  } catch { /* ignore */ }
}

export function addFileSource(name: string, mimeType: string): Source {
  const sources = readSources()
  const source: Source = { id: generateId(), name, kind: "file", mimeType, active: true, addedAt: Date.now() }
  writeSources([source, ...sources])
  return source
}

export function addFileSources(files: FileList | null): void {
  Array.from(files ?? []).forEach((f) => addFileSource(f.name, f.type || "application/octet-stream"))
}

export function addBankSource(name: string, opts?: { institution?: string; color?: string; initials?: string; logo?: string }): Source {
  const sources = readSources()
  const source: Source = { id: generateId(), name, kind: "bank", active: true, addedAt: Date.now(), ...opts }
  writeSources([source, ...sources])
  return source
}

export function toggleSource(id: string): void {
  writeSources(readSources().map((s) => (s.id === id ? { ...s, active: !s.active } : s)))
}

export function removeSource(id: string): void {
  writeSources(readSources().filter((s) => s.id !== id))
}

export function getActiveSources(): Source[] {
  return readSources().filter((s) => s.active)
}

export function sampleSources(sources: Source[], min = 1, max = 3): Source[] {
  if (!sources.length) return []
  const count = Math.min(sources.length, Math.floor(Math.random() * (max - min + 1)) + min)
  const shuffled = [...sources].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
