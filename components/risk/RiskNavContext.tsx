"use client"

import { createContext, useContext } from "react"
import type { WorkStatus } from "@/lib/ask-nanci/data/risk-merchants"

// Every Risk destination is a registered, prop-less panel, so all navigation and
// selection state flows through this context instead of props.
export type RiskDest = "ask-nanci" | "dashboard" | "detection-queue" | "barometer-report" | "risk-report" | "assignment"

interface RiskNav {
  go: (dest: RiskDest) => void
  openBarometer: (filter?: "critical" | null) => void
  openMerchant: (id: string) => void
  merchantId: string | null
  barometerFilter: "critical" | null
  /**
   * Work state per merchant, shared rather than local to a screen: marking one in
   * the Barometer list has to move the queue card above it and the same card back
   * on the Detection Queue, and the merchant detail marks the same merchant.
   */
  workStatuses: Record<string, WorkStatus>
  markWork: (id: string, status: WorkStatus) => void
  /**
   * Phase 1 of the Risk pitch is the same console with no AI in it. Screens read
   * this instead of a build-time flag because both phases run side by side (the
   * assistant-free console at /risk-phase1, the full one at /risk), so the same
   * components have to render both ways in one build.
   */
  assistant: boolean
  /**
   * Where a screen's close button goes. Ask Nanci is home when the assistant is
   * on; the Dashboard is home when it isn't. Screens close to `nav.home` rather
   * than naming a destination, so neither phase can strand the user.
   */
  home: RiskDest
}

const RiskNavContext = createContext<RiskNav>({
  go: () => {},
  openBarometer: () => {},
  openMerchant: () => {},
  merchantId: null,
  barometerFilter: null,
  workStatuses: {},
  markWork: () => {},
  assistant: true,
  home: "ask-nanci",
})

export const RiskNavProvider = RiskNavContext.Provider
export const useRiskNav = () => useContext(RiskNavContext)
