// Flow 22: Service Marketplace — Mastercard Services offerings shown in a sidebar panel.
// ponytail: illustrative marketing copy only; not live product terms.

import { Brain, MessagesSquare, Handshake, CreditCard, FileChartLine } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const MARKETPLACE_INTRO =
  "Mastercard Services brings financial tools built for businesses like yours, not generic consumer products."

export interface MarketplaceService {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

export const MARKETPLACE_SERVICES: MarketplaceService[] = [
  {
    id: "portfolio-intelligence",
    icon: Brain,
    title: "Portfolio Intelligence Solutions",
    description:
      "Mastercard Business Intelligence platform provides powerful benchmarking and payments data insights for issuers, acquirers, fintech companies and co-brand cards.",
  },
  {
    id: "sme-value-proposition",
    icon: MessagesSquare,
    title: "SME Commercial Value Proposition",
    description:
      "Future-proof your card value proposition with Mastercard's current state assessment, competitive analysis and product ideation workshop.",
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
