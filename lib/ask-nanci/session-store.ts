import type { Session, Message } from "./types"
import { generateId, truncate } from "./utils"

const SESSIONS_KEY = "asknanci_chats"
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
  const title = titleOverride ?? (firstUser ? truncate(firstUser.content, 60) : "Untitled chat")

  const session: Session = { id, title, messages, updatedAt: Date.now() }
  const idx = sessions.findIndex((s) => s.id === id)
  if (idx !== -1) sessions[idx] = session
  else sessions.unshift(session)

  writeSessions(sessions.slice(0, MAX_SESSIONS))
  return session
}

export function deleteSession(id: string): void {
  writeSessions(readSessions().filter((s) => s.id !== id))
}

