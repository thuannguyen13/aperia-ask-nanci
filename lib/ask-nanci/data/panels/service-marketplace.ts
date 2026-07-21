// Flow 22: Marketplace — Mastercard Services offerings shown as a full content-area view.
// ponytail: illustrative marketing copy only; not live product terms.

import { Brain, MessagesSquare, Handshake, CreditCard, FileChartLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Page title, and the sidebar nav label that opens it.
export const MARKETPLACE_TITLE = "Marketplace";

export const MARKETPLACE_INTRO = "Add-ons and integrations that fit your business, not the mass market. Extend Ask Nanci your way.";

export const MARKETPLACE_SEARCH_PLACEHOLDER = "Search marketplace";

// Single category in the design; the section label is data so more can be added later
// without touching the panel.
export const MARKETPLACE_CATEGORY = "Essential";

export const MARKETPLACE_EMPTY = {
  title: "No add-ons found",
  description: "Try a different search term to find services for your business.",
};

// ponytail: every listing in the design is Mastercard, so the vendor is one constant
// rather than a per-service field.
export const MARKETPLACE_VENDOR = { name: "Mastercard", logo: "/logos/mastercard-logomark.svg" };

export interface MarketplaceService {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** Already enabled for this merchant — renders the green "Added" badge. */
  added?: boolean;
  /** Detail-panel body: one paragraph, then what the merchant actually gets. */
  overview: string;
  highlights: string[];
  /** Collapsed detail sections, in order. */
  sections: { title: string; body: string }[];
}

export const MARKETPLACE_DETAIL_LABELS = {
  builtBy: "Built by",
  overview: "Overview",
  highlights: "What you get",
  enable: "Add",
  enabled: "Added",
  added: "Added",
  remove: "Remove", // the toggle-off action on an already-added service
};

export const MARKETPLACE_SERVICES: MarketplaceService[] = [
  {
    id: "portfolio-intelligence",
    icon: Brain,
    title: "Portfolio Intelligence Solutions",
    description: "Mastercard Business Intelligence platform provides powerful benchmarking and payments data insights for issuers, acquirers, fintech companies and co-brand cards.",
    added: true,
    overview:
      "The Mastercard Intelligence Center platform provides powerful benchmarking and payments data insights for issuers, acquirers, FinTechs and co-brand cards. It delivers actionable portfolio insights and benchmarks for more accurate data-driven decisions.",
    highlights: [
      "Near real-time business intelligence through centralized payment analytics",
      "Datasets across authentication, authorization, clearing, declines, fraud, chargebacks, interchange and digital",
      "Anonymized peer and country benchmarks across 9,000+ card products",
    ],
    sections: [
      {
        title: "Benchmarking",
        body: "Detailed, anonymized peer and country benchmarks show how the broader market is trending against key performance metrics, with filters across over 9,000 card products issued by different schemes and issuers.",
      },
      { title: "Who it's for", body: "Issuers, acquirers, FinTechs, co-brand card programs and merchant services providers looking to optimize payment portfolios and identify market opportunities." },
    ],
  },
  {
    id: "sme-value-proposition",
    icon: MessagesSquare,
    title: "SME Commercial Value Proposition",
    description: "Future-proof your card value proposition with Mastercard's current state assessment, competitive analysis and product ideation workshop.",
    added: true,
    overview:
      "Mastercard SME Commercial Value Proposition helps issuers meet the needs of small and medium-sized businesses through a current state assessment, competitive analysis and product ideation workshop.",
    highlights: [
      "Market analysis of the SME payments landscape and high-value segments",
      "Competitive review, global innovation scan and customer research",
      "Product design covering benefits, rewards, digital features and pricing",
    ],
    sections: [
      {
        title: "Market and competitive research",
        body: "Understand the current payments landscape and trends for SMEs, identify potential high value segments and their pain points, then conduct a competitive review, global innovation scan and customer research on the needs of those segments.",
      },
      {
        title: "Product development and support",
        body: "Finalize product design, including benefits and rewards, digital features and value adding services, pricing and financial modeling — then get support planning implementation across product development, technical integration and sales training.",
      },
    ],
  },
  {
    id: "business-card-acquisition",
    icon: Handshake,
    title: "Business Card Acquisition",
    description: "Acquire and engage new SME customers with Mastercard's SME Acquisition.",
    overview:
      "For SME issuers, acquisition is the first step towards a superior customer engagement strategy — one that increases account profitability and motivates brand preference. Small and medium enterprises vary by size, sector, financial sophistication and business maturity, which is why a one-size-fits-all approach doesn't work.",
    highlights: [
      "Current state assessment of your SME products, competitors and practices",
      "Data-driven identification of SMEs open to a new banking relationship",
      "Test vs. control methodology to measure campaign response",
    ],
    sections: [
      {
        title: "How targeting works",
        body: "A data-driven approach to identify SMEs open to a new banking relationship, find potential SME clients hidden in a consumer portfolio, or understand which existing business clients are likely to add a business card to the products they already use.",
      },
      {
        title: "Why it's tailored",
        body: "Acquisition works best when issuers promote specific features of business cards that address the needs of SMEs by industry — improving cashflow management, managing finances easily, supporting business activities, or simply being recognized as a business.",
      },
    ],
  },
  {
    id: "credit-analytics",
    icon: CreditCard,
    title: "Small Business Credit Analytics",
    description: "Improve small business performance evaluation with data-driven insights.",
    overview:
      "Mastercard Small Business Credit Analytics is an API that provides organizations enhanced insights into a small business' health and retail sales across all stages of underwriting and performance monitoring, helping underwriters build a more complete view of business performance and creditworthiness.",
    highlights: [
      "Weekly metrics across sales, channels, loyalty and risk",
      "Monthly benchmark insights against competitive peers",
      "Near real-time signals built on anonymized, aggregated transaction data",
    ],
    sections: [
      {
        title: "What it measures",
        body: "Verifies whether a business is active by checking for recent Mastercard transactions and tracks weekly sales performance, including growth in spend per card, ticket size and chargebacks. Insights are refreshed weekly.",
      },
      {
        title: "Where it's used",
        body: "Extends more loans and reduces loss ratios across small business credit cards, term loans and merchant cash advance — and beyond initial underwriting, to update risk ratings, power dynamic line assignment and personalize the small business experience.",
      },
    ],
  },
  {
    id: "portfolio-optimization",
    icon: FileChartLine,
    title: "SME Portfolio Optimization",
    description: "Mastercard's SME Portfolio Optimization solution helps you drive consistent growth and retention in your business card portfolio.",
    overview:
      "SME Portfolio Optimization analyzes your business, the market and your competitors to find the best opportunities to drive growth within your SME portfolio, helping you grow your SME card portfolio from strategy through execution.",
    highlights: ["Opportunity analysis across your business, the market and competitors", "Growth strategy grounded in portfolio performance", "Support from strategy through execution"],
    sections: [
      { title: "What it analyzes", body: "Your business, the market and your competitors — surfacing where the best growth opportunities sit within your existing SME portfolio." },
      { title: "How far it goes", body: "Covers the full path from strategy through execution, rather than stopping at a recommendation." },
    ],
  },
];
