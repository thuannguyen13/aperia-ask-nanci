"use client"

import { createContext, useContext } from "react"

// Lets a registered panel (rendered prop-less via the panel stack) reach the Risk
// console's local nav — e.g. the Dashboard insight panel's action chips.
export interface RiskNav {
  openDetectionQueue: () => void
  openCritical: () => void
}

const RiskNavCtx = createContext<RiskNav>({ openDetectionQueue: () => {}, openCritical: () => {} })

export const RiskNavProvider = RiskNavCtx.Provider
export const useRiskNav = () => useContext(RiskNavCtx)
