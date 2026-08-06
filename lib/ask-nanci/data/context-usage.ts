// Demo context-window budget for the Context Usage banner and dialog.
//
// Not real token accounting — there is no model behind this prototype, so usage is
// derived from how far the conversation has grown (see lib/ask-nanci/context-usage.ts).
// The numbers are chosen so a demo reaches the design's exact figure: five exchanges
// lands on 180.0k / 200.0k (90%), the sixth fills it.
export const CONTEXT_WINDOW = {
  limit: 200_000,
  /** System prompt + connected sources — already spent before the first message. */
  base: 30_000,
  perUserMessage: 4_000,
  perAssistantMessage: 26_000,
  /** Fraction of the limit at which the banner starts warning. */
  approachingAt: 0.9,
}
