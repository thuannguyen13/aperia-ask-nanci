// Flow 22: Marketplace — Mastercard Services offerings shown as a full content-area view.
// ponytail: illustrative marketing copy only; not live product terms.

import { Brain, MessagesSquare, Handshake, CreditCard, FileChartLine, CalendarCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FlowScope } from "../flow-scopes";
import type { Source } from "../../types";

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

// Every listing in the design is Mastercard, so that is the default vendor. A listing
// from anyone else names its own. A null logo renders the name as text.
export interface MarketplaceVendor {
  name: string;
  logo: string | null;
}

export const MARKETPLACE_VENDOR: MarketplaceVendor = { name: "Mastercard", logo: "/logos/mastercard-logomark.svg" };

export interface MarketplaceService {
  id: string;
  icon: LucideIcon;
  /** The listing's own mark, shown in place of the icon. It names the vendor, so the card drops "Powered by". */
  logo?: string;
  title: string;
  description: string;
  /** Already enabled for this merchant — renders the green "Added" badge. */
  added?: boolean;
  /** Detail-panel body: one paragraph, then what the merchant actually gets. */
  overview: string;
  highlights: string[];
  /** Collapsed detail sections, in order. */
  sections: { title: string; body: string }[];
  /** Defaults to MARKETPLACE_VENDOR. */
  vendor?: MarketplaceVendor;
  /** Listed only in the mode with this scope, which lists nothing else. */
  scope?: FlowScope;
  /** Replaces the "Add" label, for an integration that connects an account. */
  enableLabel?: string;
  /** Replaces the "Added" badge, for an integration that connects an account. */
  enabledLabel?: string;
  /** Once on, Nanci answers from it, so Accounts and Sources Used list it under the Marketplace group. */
  isSource?: boolean;
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
    id: "resy",
    icon: CalendarCheck,
    logo: "/logos/resy-logo.png",
    title: "Resy",
    description: "Connect your Resy account so Ask Nanci can read your book, waitlist, Notify list, guestbook, events, surveys and reports, and act in Resy when you confirm.",
    vendor: { name: "Resy", logo: "/logos/resy-logo.png" },
    scope: "resy",
    enableLabel: "Connect",
    enabledLabel: "Connected",
    isSource: true,
    overview:
      "Resy runs your reservations, confirmations, waitlist, Notify list, guest profiles, events and guest surveys. Connected to Ask Nanci, it sits beside your card sales, so one question can answer from both. Ask how tonight looks, who's on Notify for Friday, who the guest at 8:15 is, how many seats are left for the wine dinner, or how this week compared with last.",
    highlights: [
      "Tonight's book, confirmations and waitlist, on request",
      "What no-shows cost you, measured against your card sales",
      "Who's on Notify, and what a table earns per seat-hour after card fees",
      "Resy's confirmation follow-up, sent with your OK",
      "Move bookings and open tables, with your OK",
      "Guest profiles with tags, notes and the cards guests pay with",
      "Tags, notes and thank-you emails drafted for your OK",
      "No-show fees charged with your OK",
      "Ticketed events, and where each payment lands",
      "Weekly reports that match Resy tables to card sales",
      "Private guest surveys, and every venue in your group side by side",
    ],
    sections: [
      { title: "What Nanci can read", body: "Reservations, confirmations, the waitlist, Notify lists, turn times, the no-show fees charged in Resy, events and ticket sales, private guest surveys, reports across every venue in your group, and the guestbook: profiles, tags, notes, visits and spend." },
      { title: "What Nanci can do", body: "Send Resy's confirmation follow-up, move a booking, change availability, update tags and notes, charge a no-show fee, and send guest emails. Nanci asks before every change, and Resy records it as made through Ask Nanci." },
      { title: "About this demo", body: "A concept built on sample data. No connection to Resy exists." },
    ],
  },
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

// Label for the group these sources are listed under, apart from linked accounts.
export const MARKETPLACE_SOURCE_GROUP = "From Marketplace";

// The on listings Nanci answers from, shaped as sources (keeping the listing id) so the source lists render them
// with the same row and avatar as a linked account.
export function listMarketplaceSources(enabled: ReadonlySet<string>): Source[] {
  return MARKETPLACE_SERVICES.filter((s) => s.isSource && enabled.has(s.id)).map((s) => ({
    id: s.id,
    name: s.title,
    kind: "bank",
    logo: s.logo,
    active: true,
    addedAt: 0,
  }));
}
