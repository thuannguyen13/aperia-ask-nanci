import type { Session, Message } from "./types"
import { generateId } from "./utils"
import { SESSIONS_KEY } from "./storage-keys"


const MAX_SESSIONS = 20

export function readSessions(): Session[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  } catch {
    /* ignore quota errors */
  }
}

export function saveSession(messages: Message[], existingId?: string, titleOverride?: string): Session {
  const sessions = readSessions()
  const id = existingId ?? generateId()
  const firstUser = messages.find((m) => m.role === "user")
  const title = titleOverride ?? (firstUser ? (firstUser.content.length > 60 ? firstUser.content.slice(0, 60) + "…" : firstUser.content) : "Untitled chat")

  const session: Session = { id, title, messages, updatedAt: Date.now() }
  // Always float the saved session to the front: nothing downstream sorts by
  // updatedAt (the recent lists just slice the array), so an in-place update
  // would leave a chat you just used sitting below older ones — and let
  // MAX_SESSIONS evict the active chat while keeping stale ones.
  const idx = sessions.findIndex((s) => s.id === id)
  if (idx !== -1) sessions.splice(idx, 1)
  sessions.unshift(session)

  writeSessions(sessions.slice(0, MAX_SESSIONS))
  return session
}

export function deleteSession(id: string): void {
  writeSessions(readSessions().filter((s) => s.id !== id))
}

