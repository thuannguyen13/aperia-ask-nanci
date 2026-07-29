"use client"

import { DETECTION_QUEUE_PROMPT } from "@/lib/ask-nanci/data/risk-conversations"
import { NanciPanel } from "./NanciPanel"

// The Detection Queue's summoned Ask Nanci panel. Unlike the Dashboard's, it has
// one fixed opening question — the queue header's "Ask Nanci" button is the only
// thing that summons it — so it needs no panel view.
export function DetectionQueueInsightPanel() {
  return <NanciPanel panelId="detection-queue-insight" prompt={DETECTION_QUEUE_PROMPT} />
}
