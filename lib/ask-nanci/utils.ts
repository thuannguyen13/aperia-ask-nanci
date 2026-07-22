export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str
}

