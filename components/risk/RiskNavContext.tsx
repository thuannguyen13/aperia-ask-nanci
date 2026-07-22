"use client"

import { createContext, useContext } from "react"

// Every Risk destination is a registered, prop-less panel, so all navigation and
// selection state flows through this context instead of props.
export type RiskDest = "ask-nanci" | "dashboard" | "detection-queue" | "barometer-report" | "risk-report" | "assignment"

interface RiskNav {
  go: (dest: RiskDest) => void
  openBarometer: (filter?: "critical" | null) => void
  openMerchant: (id: string) => void
  merchantId: string | null
  barometerFilter: "critical" | null
}

const RiskNavCtx = createContext<RiskNav>({
  go: () => {},
  openBarometer: () => {},
  openMerchant: () => {},
  merchantId: null,
  barometerFilter: null,
})

export const RiskNavProvider = RiskNavCtx.Provider
export const useRiskNav = () => useContext(RiskNavCtx)
