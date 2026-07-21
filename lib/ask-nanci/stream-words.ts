// Word-boundary chunking that mimics token streaming. The single source of the
// typing cadence — used by the global chat stream (AskNanciContext.streamWords)
// and by the Dashboard's local chat panel, so both feel like the same assistant.
// Resolves true when the text finished, false when `shouldStop` cut it short.
export function streamWords(
  text: string,
  onPartial: (partial: string) => void,
  opts: { shouldStop?: () => boolean } = {},
): Promise<boolean> {
  return new Promise((resolve) => {
    const chunks = text.match(/\S+\s*/g) ?? []
    let i = 0
    let partial = ""
    const tick = () => {
      if (opts.shouldStop?.()) { resolve(false); return }
      if (i >= chunks.length) { resolve(true); return }
      partial += chunks[i++]
      onPartial(partial)
      setTimeout(tick, 50 + Math.random() * 70)
    }
    tick()
  })
}
