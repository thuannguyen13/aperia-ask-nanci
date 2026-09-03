import type { Source } from "./types"
import { generateId } from "./utils"
import { SOURCES_KEY } from "./storage-keys"



export const FOUNDATION_SOURCE_ID = "foundation-built-in"


// The pre-configured foundation datasource the product ships with (the dataset a
// merchant's own added accounts layer on top of). Its value is per-host/theme —
// the Titan theme (localhost:3000, non-embed) foundation is VisionWeb. Embed
// variants swap this slot via data/sources.ts (keyed off FOUNDATION_SOURCE_ID).
// No logo: the only ABC Bank asset is a 128x24 white wordmark for the dark top bar,
// which is neither square nor visible on a light surface. SourceIcon falls back to the
// initials chip, so the slot stays filled until a square mark exists.
export const FOUNDATION_SOURCE: Source = {
  id: FOUNDATION_SOURCE_ID,
  name: "ABC Bank",
  kind: "bank",
  institution: "ABC Bank Data",
  initials: "AB",
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

function addFileSource(name: string, mimeType: string): Source {
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


