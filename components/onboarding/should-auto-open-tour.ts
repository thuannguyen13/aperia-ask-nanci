// Whether the tour may open by itself on this render. A /tour replay owns the state, and
// a scoped mode never opens it unasked, since the tour is about the full app.
export function shouldAutoOpenTour({ run, showIntro, onboardingOpen, replayed, scoped }: {
  run: boolean
  showIntro: boolean
  onboardingOpen: boolean
  replayed: boolean
  scoped: boolean
}): boolean {
  return !run && !showIntro && !onboardingOpen && !replayed && !scoped
}
