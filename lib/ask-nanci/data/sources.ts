// Demo source arrays for each embed variant.
// Swap with real API data when wiring the backend.

import type { Source } from "../types"
import type { ThemeId } from "./theme-logos"
import { FOUNDATION_SOURCE, FOUNDATION_SOURCE_ID } from "../source-store"
import { CARRIER } from "./carrier"

// ─── Internal build blocks ────────────────────────────────────────────────────
// Per-host foundation sources (all share FOUNDATION_SOURCE_ID so the "is built-in?"
// checks stay theme-agnostic). FOUNDATION_SOURCE itself is ABC Bank (see source-store).

const CLOVER_SOURCE: Source = {
  id: FOUNDATION_SOURCE_ID,
  name: "Clover",
  kind: "bank",
  institution: "Clover Data",
  logo: "/ask-nanci/clover-logo-color.svg",
  active: true,
  addedAt: 0,
}

const ACCESS_ONE_SOURCE: Source = {
  id: FOUNDATION_SOURCE_ID,
  name: "AccessOne",
  kind: "bank",
  institution: "AccessOne Data",
  logo: "/logos/access-one.svg",
  active: true,
  addedAt: 0,
}

// The AMEX and Resy modes wear the American Express brand but their built-in data is
// VisionWeb's.
export const VISION_WEB_SOURCE: Source = {
  id: FOUNDATION_SOURCE_ID,
  name: "VisionWeb",
  kind: "bank",
  institution: "VisionWeb Data",
  logo: "/logos/vision-web-source-logo.svg",
  active: true,
  addedAt: 0,
}

// The carrier modes' built-in data: the business owner's carrier account, with calls,
// service status, lines and billing, under the AT&T globe.
export const CARRIER_SOURCE: Source = {
  id: FOUNDATION_SOURCE_ID,
  name: `${CARRIER.business} account`,
  kind: "bank",
  institution: CARRIER.business,
  color: "bg-sky-700",
  initials: "AT",
  logo: "/logos/att-globe.svg",
  active: true,
  addedAt: 0,
}

// The register, as an answer cites it. Clover's data under its own id, so it never reads
// as the built-in source.
export const REGISTER_SOURCE: Source = { ...CLOVER_SOURCE, id: "cited-clover" }

// Sources a scripted answer can name by their own name, beside the built-in source and
// the marketplace services.
export const CITABLE_SOURCES: Source[] = [REGISTER_SOURCE]

// What the carrier stories cite: the carrier account alone, or with the register's sales.
export const CARRIER_CITES = {
  account: CARRIER_SOURCE.name,
  withSales: `${CARRIER_SOURCE.name} + ${REGISTER_SOURCE.name}`,
}

// A theme can replace the default foundation with its own built-in data.
export const THEME_FOUNDATION: Partial<Record<ThemeId, Source>> = {
  amex: VISION_WEB_SOURCE,
}

// The merchant's American Express account. The embed demo lists it among the linked
// accounts. The AMEX theme has it always linked.
const AMEX_ACCOUNT: Source = { id: "demo-amex", name: "Amex Business Gold ••5561", kind: "bank", institution: "American Express", color: "bg-sky-600", initials: "AX", logo: "/fi/amex.svg", active: true, addedAt: 0 }

const CHASE_ACCOUNT: Source = { id: "demo-chase", name: "Chase Business Checking ••4892", kind: "bank", institution: "Chase", color: "bg-blue-700", initials: "CH", logo: "/fi/chase.png", active: true, addedAt: 0 }

// Accounts a theme always has linked, after its foundation. They cannot be removed
// and are never saved, so every load starts with them.
export const THEME_ACCOUNTS: Partial<Record<ThemeId, Source[]>> = {
  amex: [AMEX_ACCOUNT],
}

// ─── Per-variant source lists ─────────────────────────────────────────────────

export const EMBED_DEMO_SOURCES: Source[] = [
  CLOVER_SOURCE,
  { id: "demo-qb",    name: "Walker's Business Books",        kind: "bank", institution: "QuickBooks",       color: "bg-green-600",  initials: "QB", logo: "/fi/quickbook.svg",  active: true, addedAt: 0 },
  CHASE_ACCOUNT,
  { id: "demo-bofa",  name: "BofA Savings ••2341",            kind: "bank", institution: "Bank of America",  color: "bg-red-600",    initials: "BA", logo: "/fi/bofa.png",       active: true, addedAt: 0 },
  { id: "demo-wf",    name: "Wells Fargo Business ••7823",    kind: "bank", institution: "Wells Fargo",      color: "bg-yellow-600", initials: "WF", logo: "/fi/wellsfargo.png", active: true, addedAt: 0 },
  AMEX_ACCOUNT,
]

export const EMBED_BUSINESS_OWNER_DEMO_SOURCES: Source[] = EMBED_DEMO_SOURCES.map((s) =>
  s.id === FOUNDATION_SOURCE_ID ? ACCESS_ONE_SOURCE : s
)

export const EMBED_VW_DEMO_SOURCES: Source[] = EMBED_DEMO_SOURCES.map((s) =>
  s.id === FOUNDATION_SOURCE_ID ? FOUNDATION_SOURCE : s
)

export const EMBED_ISO_DEMO_SOURCES: Source[] = [
  FOUNDATION_SOURCE,
  { id: "iso-alloy",   name: "Alloy",            kind: "bank", institution: "Alloy",            logo: "/iso/alloy.svg",         active: true, addedAt: 0 },
  { id: "iso-middesk", name: "Middesk",           kind: "bank", institution: "Middesk",           logo: "/iso/middesk.svg",       active: true, addedAt: 0 },
  { id: "iso-visa",    name: "Visa",              kind: "bank", institution: "Visa",              logo: "/iso/visa.svg",          active: true, addedAt: 0 },
  { id: "iso-zendesk", name: "Zendesk",           kind: "bank", institution: "Zendesk",           logo: "/iso/zendesk.svg",       active: true, addedAt: 0 },
  { id: "iso-cb911",   name: "Chargeback911",     kind: "bank", institution: "Chargeback911",     logo: "/iso/chargeback911.svg", active: true, addedAt: 0 },
  { id: "iso-sf",      name: "Salesforce",        kind: "bank", institution: "Salesforce",        logo: "/iso/salesforce.svg",    active: true, addedAt: 0 },
  { id: "iso-mc",      name: "Mastercard",        kind: "bank", institution: "Mastercard",        logo: "/iso/mastercard.svg",    active: true, addedAt: 0 },
  { id: "iso-g2risk",  name: "G2 Risk Solutions", kind: "bank", institution: "G2 Risk Solutions", logo: "/iso/g2risk.svg",        active: true, addedAt: 0 },
]

