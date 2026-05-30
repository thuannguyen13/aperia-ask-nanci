// Demo source arrays for each embed variant.
// Swap with real API data when wiring the backend.

import type { Source } from "../types"
import { CLOVER_SOURCE, CLOVER_SOURCE_ID } from "../sourceStore"

// ─── Internal build blocks ────────────────────────────────────────────────────

const ACCESS_ONE_SOURCE: Source = {
  id: CLOVER_SOURCE_ID,
  name: "AccessOne",
  kind: "bank",
  institution: "AccessOne Data",
  logo: "/logos/access-one.svg",
  active: true,
  addedAt: 0,
}

const APERIA_SOURCE: Source = {
  id: CLOVER_SOURCE_ID,
  name: "VisionWeb",
  kind: "bank",
  institution: "VisionWeb Data",
  logo: "/logos/aperia.svg",
  active: true,
  addedAt: 0,
}

// ─── Per-variant source lists ─────────────────────────────────────────────────

export const EMBED_DEMO_SOURCES: Source[] = [
  CLOVER_SOURCE,
  { id: "demo-qb",    name: "Walker's Business Books",        kind: "bank", institution: "QuickBooks",       color: "bg-green-600",  initials: "QB", logo: "/fi/quickbook.svg",  active: true, addedAt: 0 },
  { id: "demo-chase", name: "Chase Business Checking ••4892", kind: "bank", institution: "Chase",            color: "bg-blue-700",   initials: "CH", logo: "/fi/chase.png",      active: true, addedAt: 0 },
  { id: "demo-bofa",  name: "BofA Savings ••2341",            kind: "bank", institution: "Bank of America",  color: "bg-red-600",    initials: "BA", logo: "/fi/bofa.png",       active: true, addedAt: 0 },
  { id: "demo-wf",    name: "Wells Fargo Business ••7823",    kind: "bank", institution: "Wells Fargo",      color: "bg-yellow-600", initials: "WF", logo: "/fi/wellsfargo.png", active: true, addedAt: 0 },
  { id: "demo-amex",  name: "Amex Business Gold ••5561",      kind: "bank", institution: "American Express", color: "bg-sky-600",    initials: "AX", logo: "/fi/amex.svg",       active: true, addedAt: 0 },
]

export const EMBED_BUSINESS_OWNER_DEMO_SOURCES: Source[] = EMBED_DEMO_SOURCES.map((s) =>
  s.id === CLOVER_SOURCE_ID ? ACCESS_ONE_SOURCE : s
)

export const EMBED_ISO_DEMO_SOURCES: Source[] = [
  APERIA_SOURCE,
  { id: "iso-alloy",   name: "Alloy",            kind: "bank", institution: "Alloy",            logo: "/iso/alloy.svg",         active: true, addedAt: 0 },
  { id: "iso-middesk", name: "Middesk",           kind: "bank", institution: "Middesk",           logo: "/iso/middesk.svg",       active: true, addedAt: 0 },
  { id: "iso-visa",    name: "Visa",              kind: "bank", institution: "Visa",              logo: "/iso/visa.svg",          active: true, addedAt: 0 },
  { id: "iso-zendesk", name: "Zendesk",           kind: "bank", institution: "Zendesk",           logo: "/iso/zendesk.svg",       active: true, addedAt: 0 },
  { id: "iso-cb911",   name: "Chargeback911",     kind: "bank", institution: "Chargeback911",     logo: "/iso/chargeback911.svg", active: true, addedAt: 0 },
  { id: "iso-sf",      name: "Salesforce",        kind: "bank", institution: "Salesforce",        logo: "/iso/salesforce.svg",    active: true, addedAt: 0 },
  { id: "iso-mc",      name: "Mastercard",        kind: "bank", institution: "Mastercard",        logo: "/iso/mastercard.svg",    active: true, addedAt: 0 },
  { id: "iso-g2risk",  name: "G2 Risk Solutions", kind: "bank", institution: "G2 Risk Solutions", logo: "/iso/g2risk.svg",        active: true, addedAt: 0 },
]

export const EMBED_DETECT_DEMO_SOURCES: Source[] = [
  APERIA_SOURCE,
  { id: "detect-visa",   name: "Visa",              kind: "bank", institution: "Visa",              logo: "/iso/visa.svg",          active: true, addedAt: 0 },
  { id: "detect-mc",     name: "Mastercard",        kind: "bank", institution: "Mastercard",        logo: "/iso/mastercard.svg",    active: true, addedAt: 0 },
  { id: "detect-alloy",  name: "Alloy",             kind: "bank", institution: "Alloy",             logo: "/iso/alloy.svg",         active: true, addedAt: 0 },
  { id: "detect-cb911",  name: "Chargeback911",     kind: "bank", institution: "Chargeback911",     logo: "/iso/chargeback911.svg", active: true, addedAt: 0 },
  { id: "detect-g2risk", name: "G2 Risk Solutions", kind: "bank", institution: "G2 Risk Solutions", logo: "/iso/g2risk.svg",        active: true, addedAt: 0 },
]
