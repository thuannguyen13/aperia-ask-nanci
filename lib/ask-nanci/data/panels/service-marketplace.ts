// Flow 22: Marketplace — Mastercard Services offerings shown as a full content-area view.
// ponytail: illustrative marketing copy only; not live product terms.

import { Brain, MessagesSquare, Handshake, CreditCard, FileChartLine } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Page title, and the sidebar nav label that opens it.
export const MARKETPLACE_TITLE = "Marketplace"

export const MARKETPLACE_INTRO =
  "Add-ons and integrations that fit your business, not the mass market. Extend Ask Nanci your way."

export const MARKETPLACE_SEARCH_PLACEHOLDER = "Search marketplace"

// Single category in the design; the section label is data so more can be added later
// without touching the panel.
export const MARKETPLACE_CATEGORY = "Essential"

export const MARKETPLACE_EMPTY = {
  title: "No add-ons found",
  description: "Try a different search term to find services for your business.",
}

// ponytail: every listing in the design is Mastercard, so the vendor is one constant
// rather than a per-service field.
export const MARKETPLACE_VENDOR = { name: "Mastercard", logo: "/logos/mastercard-logomark.svg" }

export interface MarketplaceService {
  id: string
  icon: LucideIcon
  title: string
  description: string
  /** Already enabled for this merchant — renders the green "Added" badge. */
  added?: boolean
}

export const MARKETPLACE_SERVICES: MarketplaceService[] = [
  {
    id: "portfolio-intelligence",
    icon: Brain,
    title: "Portfolio Intelligence Solutions",
    description:
      "Mastercard Business Intelligence platform provides powerful benchmarking and payments data insights for issuers, acquirers, fintech companies and co-brand cards.",
    added: true,
  },
  {
    id: "sme-value-proposition",
    icon: MessagesSquare,
    title: "SME Commercial Value Proposition",
    description:
      "Future-proof your card value proposition with Mastercard's current state assessment, competitive analysis and product ideation workshop.",
    added: true,
  },
  {
    id: "business-card-acquisition",
    icon: Handshake,
    title: "Business Card Acquisition",
    description:
      "Acquire and engage new SME customers with Mastercard's SME Acquisition.",
  },
  {
    id: "credit-analytics",
    icon: CreditCard,
    title: "Small Business Credit Analytics",
    description:
      "Improve small business performance evaluation with data-driven insights.",
  },
  {
    id: "portfolio-optimization",
    icon: FileChartLine,
    title: "SME Portfolio Optimization",
    description:
      "Mastercard's SME Portfolio Optimization solution helps you drive consistent growth and retention in your business card portfolio.",
  },
]
