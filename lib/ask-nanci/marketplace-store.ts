// Saved Marketplace state: two id sets, one per storage key, so each toggle writes
// only its own. A missing or unreadable key reads as null, meaning "use the default".

export function readIdSet(key: string): Set<string> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw) as string[]) : null
  } catch {
    return null
  }
}

export function writeIdSet(key: string, ids: ReadonlySet<string>): void {
  try {
    localStorage.setItem(key, JSON.stringify([...ids]))
  } catch { /* ignore */ }
}
