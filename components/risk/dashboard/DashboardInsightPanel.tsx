"use client"

import { usePanelView } from "@/contexts/AskNanciContext"
import { RISK_NANCI_TAKES } from "@/lib/ask-nanci/data/risk-landing"
import { NanciPanel } from "../NanciPanel"

const PANEL_ID = "dashboard-insight"
const FIRST = RISK_NANCI_TAKES[0].title

// The Dashboard's summoned Ask Nanci panel. Its view is the clicked take's title;
// everything about playing the conversation lives in the shared NanciPanel.
export function DashboardInsightPanel() {
  const takeTitle = usePanelView(PANEL_ID, FIRST)
  const prompt = RISK_NANCI_TAKES.find((t) => t.title === takeTitle)?.prompt ?? RISK_NANCI_TAKES[0].prompt
  // Keyed on the prompt: clicking a different take remounts, restarting the
  // conversation on that question without an effect to resync state.
  return <NanciPanel key={prompt} panelId={PANEL_ID} prompt={prompt} />
}
