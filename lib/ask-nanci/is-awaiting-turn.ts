/**
 * True while a scripted flow is parked on a confirm step: the chat is idle and the last
 * message is the assistant text that offers the step. Any other turn after it, a
 * partial stream or a busy chat means the step is no longer waiting.
 */
export const isAwaitingTurn = (messages: { role: string; content: string }[], chatState: string, assistantText: string) => {
  const last = messages.at(-1)
  return chatState === "idle" && last?.role === "assistant" && last.content === assistantText
}
