// Aperia Risk — the parameter catalog, one row per rule that can raise an alert.
//
// ponytail: generated demo content. The MC side is the real product concept (a
// Mastercard score drives it); the VW side mirrors VisionWeb's numbered parameters.
// No value here comes from a client file.
//
// Why this file exists: P14, P-MC1 and friends were being referenced as bare strings
// in three places (the dashboard's parameter heat, the Risk Report's violation rows,
// the Create Assignment picker) with no shared definition, so a parameter on one
// screen could not be matched to the same parameter on another. Everything that
// names a parameter now resolves through PARAMETERS.
import { MC_PARAMETERS } from "./risk-create-assignment"

/** Which model raises the parameter. Drives the badge color wherever one renders. */
export type ParamModel = "vw" | "mc"

export interface RiskParameter {
  id: string
  name: string
  model: ParamModel
}

/**
 * VisionWeb's own parameters. The numbering is not contiguous on purpose — a real
 * VW portfolio has parameters switched off, and a gap-free P1…P7 list reads as
 * invented. These seven are the ones the demo screens reference.
 */
const VW_PARAMETERS: RiskParameter[] = [
  { id: "P11", name: "Chargeback Ratio",       model: "vw" },
  { id: "P12", name: "Chargeback Count",       model: "vw" },
  { id: "P14", name: "Daily Volume Spike",     model: "vw" },
  { id: "P26", name: "Credit Ratio",           model: "vw" },
  { id: "P38", name: "ACH Return Rate",        model: "vw" },
  { id: "P39", name: "Average Ticket Change",  model: "vw" },
  { id: "P41", name: "Deposit Velocity",       model: "vw" },
]

/**
 * The full catalog. The MC half is derived from MC_PARAMETERS rather than retyped —
 * that list already carries each parameter's alert thresholds for the Create
 * Assignment form, and two hand-kept copies of the same nine names drift.
 */
export const PARAMETERS: RiskParameter[] = [
  ...VW_PARAMETERS,
  ...MC_PARAMETERS.map((p) => ({ id: p.id, name: p.name, model: "mc" as const })),
]

export const findParameter = (id: string) => PARAMETERS.find((p) => p.id === id)
