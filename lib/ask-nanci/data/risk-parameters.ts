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
  /** What trips it, for screens that explain a parameter rather than just name it. */
  blurb: string
}

/**
 * VisionWeb's own parameters. The numbering is not contiguous on purpose — a real
 * VW portfolio has parameters switched off, and a gap-free P1…P7 list reads as
 * invented. These seven are the ones the demo screens reference.
 */
export const VW_PARAMETERS: RiskParameter[] = [
  { id: "P11", name: "Chargeback Ratio",      model: "vw", blurb: "Chargebacks as a share of transaction count" },
  { id: "P12", name: "Chargeback Count",      model: "vw", blurb: "Chargeback volume against the merchant's own baseline" },
  { id: "P14", name: "Daily Volume Spike",    model: "vw", blurb: "A day's volume jumps against the 30-day average" },
  { id: "P26", name: "Credit Ratio",          model: "vw", blurb: "Credits and refunds against gross sales" },
  { id: "P38", name: "ACH Return Rate",       model: "vw", blurb: "Returned ACH items as a share of settlement" },
  { id: "P39", name: "Average Ticket Change", model: "vw", blurb: "Average ticket departs from the merchant's history" },
  { id: "P41", name: "Deposit Velocity",      model: "vw", blurb: "Deposits arrive faster than the account's pattern" },
]

/**
 * The full catalog. The MC half is derived from MC_PARAMETERS rather than retyped —
 * that list already carries each parameter's alert thresholds for the Create
 * Assignment form, and two hand-kept copies of the same nine names drift.
 */
export const PARAMETERS: RiskParameter[] = [
  ...VW_PARAMETERS,
  ...MC_PARAMETERS.map((p) => ({ id: p.id, name: p.name, model: "mc" as const, blurb: p.blurb })),
]

export const findParameter = (id: string) => PARAMETERS.find((p) => p.id === id)
