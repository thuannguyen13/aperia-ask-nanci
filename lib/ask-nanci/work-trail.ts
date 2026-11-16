import type { WorkTrail } from "./types"

// How a work trail plays in. Each step starts this long after the one before, and takes
// longer than that to land, so the steps overlap as they rise in rather than queueing.
// The chat (ChatMessage) staggers the steps by it, and the player (AskNanciContext) waits
// for the last one before the message under it starts streaming.
export const WORK_TRAIL_STAGGER_MS = 90
export const WORK_TRAIL_STEP_DURATION_MS = 320

/** How long a trail takes to play in, from the header to its last step landing. */
export const workTrailDuration = (trail: WorkTrail) => trail.steps.length * WORK_TRAIL_STAGGER_MS + WORK_TRAIL_STEP_DURATION_MS
