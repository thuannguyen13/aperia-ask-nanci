import type { WorkTrail } from "./types"

// How a work trail plays in: each step lands this long after the one before, and the
// message under it starts streaming once the last has landed. The chat (ChatMessage)
// staggers the steps by it, and the player (AskNanciContext) waits on it.
export const WORK_TRAIL_STEP_MS = 550

/** How long a trail takes to play in, from the header to its last step. */
export const workTrailDuration = (trail: WorkTrail) => (trail.steps.length + 1) * WORK_TRAIL_STEP_MS
