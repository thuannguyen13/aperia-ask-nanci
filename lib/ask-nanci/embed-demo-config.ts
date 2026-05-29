/**
 * Static configuration for the embed demo variants (?embed=clover, ?embed=business-owner, ?embed=iso).
 *
 * This file has no real backend counterpart — it exists only to drive the
 * interactive sales demo. It is the ONE place outside api.ts that may reference
 * demo-specific data. Context and embed components import from here, not from
 * mock-data directly.
 */

export const EMBED_VARIANTS = ["clover", "business-owner", "iso", "detect"] as const
export type EmbedVariant = (typeof EMBED_VARIANTS)[number]

export interface ParsedMode {
  isEmbed: boolean
  embedVariant: EmbedVariant | null
  isConceptVersion: boolean
}

export function parseMode(mode: string | null): ParsedMode {
  switch (mode) {
    case "clover":          return { isEmbed: true,  embedVariant: "clover",         isConceptVersion: false }
    case "business-owner":  return { isEmbed: true,  embedVariant: "business-owner", isConceptVersion: false }
    case "iso":             return { isEmbed: true,  embedVariant: "iso",            isConceptVersion: false }
    case "detect":          return { isEmbed: true,  embedVariant: "detect",         isConceptVersion: true  }
    case "concept":         return { isEmbed: false, embedVariant: null,             isConceptVersion: true  }
    default:                return { isEmbed: false, embedVariant: null,             isConceptVersion: false }
  }
}

import type { Source } from "./types"
import { CLOVER_SOURCE, CLOVER_SOURCE_ID } from "./sourceStore"

import { SCRIPTED_CONVERSATIONS as BASE_SCRIPTED_CONVERSATIONS } from "./mock-data"
export type { ScriptedTurn } from "./mock-data"
import type { PromptCategory, ScriptedTurn } from "./mock-data"
export type { PromptCategory }

const ISO_SCRIPTED_CONVERSATIONS: Record<string, ScriptedTurn[]> = {
  // ── Portfolio ──────────────────────────────────────────────────────────────
  "How is my portfolio performing MTD vs last month?": [
    { role: "user", content: "How is my portfolio performing MTD vs last month?" },
    { role: "assistant", content: "Here's your portfolio MTD snapshot vs. the same period last month:\n\n| Metric | MTD (May 1–21) | Apr 1–21 | Change |\n|---|---|---|---|\n| Gross Sales | $4,812,340 | $4,391,200 | **+9.6%** |\n| Net Volume | $4,698,100 | $4,282,440 | **+9.7%** |\n| Transaction Count | 31,847 | 29,103 | **+9.4%** |\n| Active Merchants | 214 | 208 | **+2.9%** |\n| Returns | $114,240 | $108,760 | +5.0% |\n| Chargebacks | $18,920 | $21,440 | **−11.8%** |\n\nStrong month overall. Volume is pacing ahead of April across the board, and chargebacks are trending down. At this rate you're on track to exceed last month's full total by roughly $800K." },
  ],
  "Which merchants have the highest gross sales this week?": [
    { role: "user", content: "Which merchants have the highest gross sales this week?" },
    { role: "assistant", content: "Top 10 merchants by gross sales this week (May 15–21):\n\n| Rank | Merchant | MID | Gross Sales | Txns |\n|---|---|---|---|---|\n| 1 | Harbor View Hotel | 4892 | $284,310 | 1,204 |\n| 2 | Coastal Fresh Market | 7823 | $198,740 | 3,841 |\n| 3 | Summit Auto Group | 3317 | $176,550 | 89 |\n| 4 | Pinnacle Dental Group | 5509 | $141,200 | 312 |\n| 5 | Riviera Day Spa Chain | 6641 | $118,890 | 987 |\n| 6 | Blue Oak Brewing Co. | 2284 | $97,340 | 2,103 |\n| 7 | Pacific Rim Restaurant | 8812 | $86,770 | 1,654 |\n| 8 | Greenfield Hardware | 1193 | $74,220 | 918 |\n| 9 | Westside CrossFit | 4470 | $61,340 | 488 |\n| 10 | Canyon Road Bakery | 9934 | $54,880 | 2,291 |\n\nHarbor View Hotel is well ahead — likely a conference or event weekend. Summit Auto's low transaction count with high volume is typical for their ticket size." },
  ],
  "Show me my top 10 merchants by volume YTD.": [
    { role: "user", content: "Show me my top 10 merchants by volume YTD." },
    { role: "assistant", content: "Top 10 merchants by gross volume, January 1 – May 21:\n\n| Rank | Merchant | MID | YTD Volume | YTD Txns | Avg Ticket |\n|---|---|---|---|---|---|\n| 1 | Harbor View Hotel | 4892 | $3,241,880 | 14,312 | $226.50 |\n| 2 | Summit Auto Group | 3317 | $2,918,440 | 1,047 | $2,787.00 |\n| 3 | Coastal Fresh Market | 7823 | $2,104,320 | 41,208 | $51.06 |\n| 4 | Pinnacle Dental Group | 5509 | $1,876,200 | 3,881 | $483.40 |\n| 5 | Pacific Rim Restaurant | 8812 | $1,203,440 | 19,872 | $60.56 |\n| 6 | Riviera Day Spa Chain | 6641 | $1,188,100 | 10,341 | $114.90 |\n| 7 | Blue Oak Brewing Co. | 2284 | $1,044,780 | 22,104 | $47.26 |\n| 8 | Greenfield Hardware | 1193 | $887,330 | 9,812 | $90.43 |\n| 9 | Westside CrossFit | 4470 | $701,240 | 5,440 | $128.90 |\n| 10 | Canyon Road Bakery | 9934 | $618,770 | 24,908 | $24.84 |\n\nThese 10 merchants account for $15.9M of your portfolio's $28.4M YTD volume — about 56% of total." },
  ],
  "Which merchants haven't processed in the last 7 days?": [
    { role: "user", content: "Which merchants haven't processed in the last 7 days?" },
    { role: "assistant", content: "12 merchants in your portfolio haven't submitted a batch since May 14:\n\n| Merchant | MID | Last Batch | Days Inactive | Status |\n|---|---|---|---|---|\n| Sunrise Yoga Studio | 2241 | May 13 | 8 days | Open |\n| Elm Street Deli | 4417 | May 12 | 9 days | Open |\n| Bayside Florist | 8803 | May 11 | 10 days | Open |\n| Metro Dry Cleaners | 3362 | May 9 | 12 days | Open |\n| Southpark Nails | 7718 | May 7 | 14 days | Open |\n| Harbor Fish Co. | 5531 | Apr 30 | 21 days | Open |\n| Riverbend Antiques | 1124 | Apr 28 | 23 days | Open |\n| Park Ave Tailors | 9956 | Apr 22 | 29 days | Open |\n| Westlake Pet Grooming | 6673 | Apr 18 | 33 days | Open |\n| Dixon Auto Repair | 3389 | Apr 3 | 48 days | Open |\n| Old Town Ice Cream | 2256 | Mar 17 | 65 days | Open |\n| Brickyard Cafe | 4421 | Feb 28 | 82 days | Open |\n\nThe last 3 are worth a check-in — extended inactivity at 65+ days often signals equipment issues, closure, or an account that needs attention." },
  ],
  "How many new merchant activations did I have this month?": [
    { role: "user", content: "How many new merchant activations did I have this month?" },
    { role: "assistant", content: "You had **17 new merchant activations** in May so far (through May 21). Here's a breakdown by business type:\n\n| Category | Count |\n|---|---|\n| Restaurant / Food Service | 6 |\n| Retail | 4 |\n| Health & Beauty | 3 |\n| Auto Services | 2 |\n| Professional Services | 2 |\n| **Total** | **17** |\n\nFor context, you averaged 14 activations per month in Q1. May is pacing ahead of that — you still have the rest of the month to go.\n\nThe most recent activation was **Lakeview Ramen Bar** (MID 1047), activated May 20. Their first qualifying batch came in the same day." },
  ],
  "What's my total portfolio volume for the last 90 days?": [
    { role: "user", content: "What's my total portfolio volume for the last 90 days?" },
    { role: "assistant", content: "Your portfolio's total gross volume over the last 90 days (Feb 20 – May 21):\n\n| Period | Gross Volume | Net Volume | Transactions | Active Merchants |\n|---|---|---|---|---|\n| Feb 20 – Mar 21 | $7,214,880 | $7,041,200 | 52,341 | 198 |\n| Mar 22 – Apr 21 | $7,891,440 | $7,704,100 | 56,812 | 206 |\n| Apr 22 – May 21 | $8,340,220 | $8,142,300 | 61,047 | 214 |\n| **90-Day Total** | **$23,446,540** | **$22,887,600** | **170,200** | — |\n\n**$23.4M gross** over 90 days. Volume has been growing consistently — each 30-day period is up roughly 7–9% over the previous one. That's solid and consistent growth across the portfolio." },
  ],

  // ── Processing ─────────────────────────────────────────────────────────────
  "What was my total processing volume yesterday?": [
    { role: "user", content: "What was my total processing volume yesterday?" },
    { role: "assistant", content: "Today's deposit data as of 3:42 PM:\n\n| Metric | Amount |\n|---|---|\n| Total Deposits | $284,112 |\n| Deposit Count | 148 merchants |\n| Avg Deposit per Merchant | $1,919 |\n| Largest Single Deposit | $41,880 (Harbor View Hotel — MID 4892) |\n| Pending / In Transit | $38,440 (21 merchants) |\n\nDeposit volume is tracking about 6% above your 30-day daily average of $268K. End-of-day totals will finalize around 8 PM once late batches settle." },
  ],
  "Which merchants processed a batch yesterday?": [
    { role: "user", content: "Which merchants processed a batch yesterday?" },
    { role: "assistant", content: "Yes — **9 merchants** that were active the prior week did not submit a batch yesterday (May 20):\n\n| Merchant | MID | Last Batch | Normal Batch Day |\n|---|---|---|---|\n| Canyon Road Bakery | 9934 | May 18 | Daily |\n| Pacific Rim Restaurant | 8812 | May 19 | Daily |\n| Sunrise Yoga Studio | 2241 | May 13 | Mon–Sat |\n| Elm Street Deli | 4417 | May 19 | Daily |\n| Westside CrossFit | 4470 | May 18 | Daily |\n| Blue Oak Brewing Co. | 2284 | May 19 | Daily |\n| Greenfield Hardware | 1193 | May 18 | Mon–Sat |\n| Riviera Day Spa Chain | 6641 | May 19 | Tue–Sat |\n| Harbor Fish Co. | 5531 | Apr 30 | Daily |\n\nCanyon Road Bakery and Harbor Fish Co. are the most notable — both are daily bathers with gaps of 2+ days. Worth a quick outreach to verify no terminal issues." },
  ],
  "Which merchants have the highest decline rates this month?": [
    { role: "user", content: "Which merchants have the highest decline rates this month?" },
    { role: "assistant", content: "Top merchants by non-qualifying transaction count, MTD (May 1–21):\n\n| Merchant | MID | Non-Qual Txns | Total Txns | NQ Rate | Top Reason |\n|---|---|---|---|---|---|\n| Summit Auto Group | 3317 | 312 | 489 | 63.8% | Business/reward cards |\n| Pinnacle Dental Group | 5509 | 208 | 1,102 | 18.9% | Card-not-present |\n| Harbor View Hotel | 4892 | 194 | 4,218 | 4.6% | Internationally issued |\n| Coastal Fresh Market | 7823 | 143 | 13,204 | 1.1% | Business cards |\n| Pacific Rim Restaurant | 8812 | 118 | 6,841 | 1.7% | Reward cards |\n\nSummit Auto Group's rate stands out — at 63.8%, over half their volume is non-qualifying. This is common for high-ticket auto dealers where corporate and reward cards dominate, but it may be worth reviewing their interchange mix if they're seeing unexpected fees." },
  ],
  "What's my overall approval rate this month?": [
    { role: "user", content: "What's my overall approval rate this month?" },
    { role: "assistant", content: "Authorization trends for your portfolio, Apr 22 – May 21:\n\n| Week | Auth Count | Auth Amount | Approval Rate | Avg Auth Amount |\n|---|---|---|---|---|\n| Apr 22–28 | 14,204 | $1,812,440 | 94.1% | $127.60 |\n| Apr 29–May 5 | 15,881 | $2,014,330 | 94.8% | $126.84 |\n| May 6–12 | 16,340 | $2,188,110 | 95.2% | $133.91 |\n| May 13–19 | 17,012 | $2,341,880 | 95.6% | $137.66 |\n\n**Takeaways:**\n- Authorization volume is up **+19.8%** over the 30-day window\n- Approval rate has improved from 94.1% → 95.6%, a healthy trend\n- Average authorization amount is climbing (+7.9%), suggesting higher-ticket sales\n\nNo unusual decline spikes during this period." },
  ],
  "Which merchants have the highest declined rate this month?": [
    { role: "user", content: "Which merchants have the highest declined rate this month?" },
    { role: "assistant", content: "Merchants with keyed transaction rates above 20% (portfolio average is 4.2%), MTD:\n\n| Merchant | MID | Keyed Rate | Keyed Txns | Total Txns | Note |\n|---|---|---|---|---|---|\n| Pinnacle Dental Group | 5509 | 61.4% | 677 | 1,102 | Phone/online billing |\n| Summit Auto Group | 3317 | 48.2% | 236 | 489 | Deposits, remote sales |\n| Westlake Pet Grooming | 6673 | 34.7% | 89 | 256 | Possible terminal issue |\n| Old Town Ice Cream | 2256 | 28.1% | 43 | 153 | Seasonal staff, manual entry |\n| Riverbend Antiques | 1124 | 24.6% | 31 | 126 | Custom orders |\n\nPinnacle Dental and Summit Auto have operational reasons for high keyed rates. Westlake Pet Grooming at 34.7% is worth a follow-up — their rate jumped from 8% last month, which could indicate a card reader malfunction." },
  ],
  "Which merchants had their highest volume week this month?": [
    { role: "user", content: "Which merchants had their highest volume week this month?" },
    { role: "assistant", content: "**4 merchants** set new all-time batch records this week (May 15–21):\n\n| Merchant | MID | Record Batch | Previous Record | Date | Likely Cause |\n|---|---|---|---|---|---|\n| Harbor View Hotel | 4892 | $41,880 | $38,240 | May 17 | Tech conference (500+ attendees) |\n| Blue Oak Brewing Co. | 2284 | $18,440 | $16,910 | May 18 | Craft beer festival |\n| Canyon Road Bakery | 9934 | $9,220 | $8,780 | May 16 | Mother's Day weekend catering |\n| Westside CrossFit | 4470 | $7,340 | $6,890 | May 19 | Annual membership drive |\n\nAll four are explainable by events. Harbor View is your biggest record-breaker at $41.9K — up 9.5% from their previous high. Worth a check-in to see if the conference is recurring." },
  ],

  // ── Chargebacks ────────────────────────────────────────────────────────────
  "Which merchants have the highest chargeback ratio this month?": [
    { role: "user", content: "Which merchants have the highest chargeback ratio this month?" },
    { role: "assistant", content: "Merchants with the highest chargeback-to-sales ratio, MTD (May 1–21):\n\n| Merchant | MID | CB Ratio | CBs | Sales Volume | Threshold |\n|---|---|---|---|---|---|\n| Riverbend Antiques | 1124 | 1.84% | 4 | $21,740 | ⚠️ Near 2% |\n| Old Town Ice Cream | 2256 | 1.42% | 3 | $21,126 | Monitoring |\n| Brickyard Cafe | 4421 | 1.21% | 5 | $41,322 | Monitoring |\n| Metro Dry Cleaners | 3362 | 0.98% | 2 | $20,408 | Normal |\n| Bayside Florist | 8803 | 0.91% | 2 | $21,978 | Normal |\n\nPortfolio average is **0.27%**. Riverbend Antiques is the one to watch — at 1.84% they're approaching the 2% threshold that typically triggers processor review. Their chargebacks are all coded 83 (merchandise not as described), which may point to a product or fulfillment issue." },
  ],
  "Which merchants have open chargeback disputes right now?": [
    { role: "user", content: "Which merchants have open chargeback disputes right now?" },
    { role: "assistant", content: "You currently have **23 unresolved retrievals** across the portfolio:\n\n| Age | Count | Amount |\n|---|---|---|\n| 0–10 days | 11 | $4,218 |\n| 11–20 days | 7 | $2,891 |\n| 21–30 days | 4 | $1,640 |\n| 31+ days (at risk) | 1 | $440 |\n\n**Total unresolved:** $9,189\n\nThe 1 retrieval at 31+ days is on **Elm Street Deli** (MID 4417) for $440 — if not responded to soon it will likely convert to a chargeback. The 4 in the 21–30 day bucket are also worth prioritizing this week. Merchants with the most open retrievals: Brickyard Cafe (5), Harbor View Hotel (4), Coastal Fresh Market (3)." },
  ],
  "Show me chargeback trends over the last 6 months.": [
    { role: "user", content: "Show me chargeback trends over the last 6 months." },
    { role: "assistant", content: "Portfolio chargeback trends, December 2025 – May 2026 (MTD):\n\n| Month | Chargeback Count | CB Amount | CB Ratio | Retrieval Count |\n|---|---|---|---|---|\n| Dec 2025 | 48 | $28,440 | 0.38% | 31 |\n| Jan 2026 | 52 | $31,120 | 0.41% | 36 |\n| Feb 2026 | 44 | $26,880 | 0.35% | 28 |\n| Mar 2026 | 41 | $24,340 | 0.32% | 24 |\n| Apr 2026 | 38 | $21,440 | 0.29% | 22 |\n| May 2026 (MTD) | 27 | $18,920 | 0.27% | 23 |\n\n**Clear downward trend** — chargebacks are down 44% from the December peak in both count and dollar amount. Your CB ratio has improved from 0.38% to 0.27%. If May continues at this pace you'll finish around 33 chargebacks, the lowest month in this window." },
  ],
  "Which merchants are approaching chargeback thresholds?": [
    { role: "user", content: "Which merchants are approaching chargeback thresholds?" },
    { role: "assistant", content: "**3 merchants** are currently at elevated chargeback ratios that warrant monitoring:\n\n| Merchant | MID | Current CB Ratio | Visa/MC Threshold | Status |\n|---|---|---|---|---|\n| Riverbend Antiques | 1124 | 1.84% | 1.0% (Early Warning) / 2.0% (Standard) | 🔴 Above Early Warning |\n| Old Town Ice Cream | 2256 | 1.42% | 1.0% / 2.0% | 🔴 Above Early Warning |\n| Brickyard Cafe | 4421 | 1.21% | 1.0% / 2.0% | 🔴 Above Early Warning |\n\nAll three are above the **1.0% Early Warning threshold**. None have reached the 2.0% Standard Program level yet, but Riverbend Antiques at 1.84% is close. Merchants enrolled in Visa's Early Warning program may receive a notification this month. Recommended action: reach out to all three and review their dispute handling practices." },
  ],
  "What are the most common chargeback reason codes this quarter?": [
    { role: "user", content: "What are the most common chargeback reason codes this quarter?" },
    { role: "assistant", content: "Top chargeback reason codes for your portfolio, Q2 2026 (Apr 1 – May 21):\n\n| Reason Code | Description | Count | Amount | % of CBs |\n|---|---|---|---|---|\n| 83 | Merchandise not as described | 24 | $14,220 | 36.9% |\n| 53 | Not as described / defective | 18 | $10,840 | 27.7% |\n| 41 | Cancelled recurring transaction | 9 | $3,120 | 13.8% |\n| 10.4 | Fraud — card absent | 7 | $5,880 | 10.8% |\n| 13.1 | Merchandise / service not received | 5 | $2,440 | 7.7% |\n| Other | — | 2 | $860 | 3.1% |\n\nCodes 83 and 53 together account for **64.6% of chargebacks** — both relate to merchandise disputes. This is high relative to typical portfolios and suggests a pattern worth investigating. Riverbend Antiques accounts for 11 of the 24 code-83 chargebacks alone." },
  ],
  "How has my portfolio chargeback rate trended over the last 6 months?": [
    { role: "user", content: "How has my portfolio chargeback rate trended over the last 6 months?" },
    { role: "assistant", content: "Your portfolio chargeback rate vs. industry benchmarks:\n\n| Metric | Your Portfolio | Industry Avg | Status |\n|---|---|---|---|\n| Overall CB Ratio (MTD) | 0.27% | 0.60% | ✅ Well below average |\n| CB Ratio (Last 90 days) | 0.31% | 0.60% | ✅ Well below average |\n| Fraud CBs as % of Total | 10.8% | 22.0% | ✅ Low fraud exposure |\n| Retrieval-to-CB Conversion | 18.2% | 28.0% | ✅ Good resolution rate |\n| Merchants Above 1% CB Ratio | 3 (1.4%) | — | ⚠️ 3 merchants to monitor |\n\nYour portfolio is performing significantly better than industry average at roughly half the typical chargeback ratio. The 3 merchants above 1% are the only area of concern — the rest of the portfolio is in solid shape." },
  ],

  // ── Cases ──────────────────────────────────────────────────────────────────
  "Which open cases have been sitting the longest without resolution?": [
    { role: "user", content: "Which open cases have been sitting the longest without resolution?" },
    { role: "assistant", content: "**7 open cases** have exceeded their SLA deadline as of today:\n\n| Case # | Merchant | Issue | Opened | SLA Expired | Priority | Assigned To |\n|---|---|---|---|---|---|---|\n| CS-4412 | Riverbend Antiques | Chargeback dispute | May 8 | May 13 | High | Sarah M. |\n| CS-4398 | Elm Street Deli | Terminal replacement | May 7 | May 12 | High | James T. |\n| CS-4371 | Metro Dry Cleaners | Funding discrepancy | May 4 | May 11 | Medium | Sarah M. |\n| CS-4340 | Harbor Fish Co. | Account reactivation | Apr 30 | May 7 | High | Unassigned |\n| CS-4318 | Brickyard Cafe | Chargeback response | Apr 28 | May 5 | Medium | James T. |\n| CS-4301 | Old Town Ice Cream | Rate change request | Apr 25 | May 2 | Low | Lisa K. |\n| CS-4288 | Westlake Pet Grooming | Equipment issue | Apr 22 | Apr 29 | Medium | Unassigned |\n\nCS-4340 and CS-4288 are both unassigned and past SLA — those should be the immediate priority." },
  ],
  "Which of my merchants have the most open cases right now?": [
    { role: "user", content: "Which of my merchants have the most open cases right now?" },
    { role: "assistant", content: "Open case count by ownership group (as of today):\n\n| Ownership Group | Open Cases | Avg Age (days) | Past SLA | Unassigned |\n|---|---|---|---|---|\n| West Region Support | 18 | 8.4 | 3 | 2 |\n| Merchant Services Tier 1 | 14 | 5.2 | 1 | 0 |\n| Risk & Compliance | 11 | 12.1 | 2 | 1 |\n| East Region Support | 9 | 4.8 | 1 | 0 |\n| Technical Support | 7 | 6.3 | 0 | 0 |\n| Unassigned | 4 | 11.2 | 2 | 4 |\n\n**West Region Support** has the most open cases at 18 and **Risk & Compliance** has the oldest average age at 12.1 days. The 4 fully unassigned cases across the board have an average age of 11 days and 2 are past SLA — those need attention first." },
  ],
  "Show me cases opened this week sorted by priority.": [
    { role: "user", content: "Show me cases opened this week sorted by priority." },
    { role: "assistant", content: "Cases opened May 15–21, sorted by priority:\n\n**High Priority (4)**\n| Case # | Merchant | Issue | Opened | Assigned To |\n|---|---|---|---|---|\n| CS-4501 | Summit Auto Group | Funding hold — $41K batch | May 21 | Sarah M. |\n| CS-4488 | Pinnacle Dental | Suspected fraud — 12 txns | May 19 | Risk & Compliance |\n| CS-4471 | Harbor View Hotel | Chargeback — $3,240 | May 18 | James T. |\n| CS-4462 | Coastal Fresh Market | Terminal down — 3 locations | May 17 | Tech Support |\n\n**Medium Priority (6)**\n| Case # | Merchant | Issue | Opened |\n|---|---|---|---|\n| CS-4499 | Blue Oak Brewing | Batch discrepancy $184 | May 21 |\n| CS-4487 | Canyon Road Bakery | Rate inquiry | May 19 |\n| CS-4478 | Greenfield Hardware | Address update | May 18 |\n| CS-4465 | Westside CrossFit | ACH return question | May 17 |\n| CS-4458 | Pacific Rim Restaurant | Card reader pairing | May 17 |\n| CS-4451 | Riviera Day Spa | Statement access | May 16 |\n\n**Low Priority (3)** — routine inquiries, all assigned." },
  ],
  "How many cases did we open this month compared to last month?": [
    { role: "user", content: "How many cases did we open this month compared to last month?" },
    { role: "assistant", content: "Average age of open cases by issue type (as of May 21):\n\n| Issue Type | Open Cases | Avg Age (days) | Oldest Case |\n|---|---|---|---|\n| Chargeback Dispute | 11 | 14.2 | 23 days (CS-4288) |\n| Funding / Deposit Issue | 8 | 9.7 | 18 days (CS-4318) |\n| Equipment / Terminal | 7 | 6.4 | 15 days (CS-4340) |\n| Account Maintenance | 6 | 4.1 | 9 days |\n| Fraud Review | 4 | 11.8 | 19 days (CS-4488) |\n| Rate / Fee Inquiry | 4 | 3.2 | 6 days |\n| Compliance / Risk | 3 | 16.4 | 22 days |\n| Other | 4 | 5.0 | 8 days |\n\n**Chargeback Disputes** and **Compliance / Risk** cases are aging the most — both averaging 14+ days. These typically have external dependencies (card brand responses, document collection) which explains the longer cycles, but cases older than 20 days should be checked for blockers." },
  ],
  "Which merchants have the most open cases right now?": [
    { role: "user", content: "Which merchants have the most open cases right now?" },
    { role: "assistant", content: "Merchants with the most open cases as of today:\n\n| Merchant | MID | Open Cases | Oldest Case | Past SLA | Top Issue |\n|---|---|---|---|---|---|\n| Harbor View Hotel | 4892 | 5 | 18 days | 1 | Chargebacks (3 cases) |\n| Brickyard Cafe | 4421 | 4 | 23 days | 2 | Funding disputes |\n| Riverbend Antiques | 1124 | 4 | 13 days | 1 | Merchandise chargebacks |\n| Pinnacle Dental Group | 5509 | 3 | 2 days | 0 | Fraud review |\n| Coastal Fresh Market | 7823 | 3 | 17 days | 1 | Terminal / equipment |\n\nHarbor View Hotel and Brickyard Cafe together account for 9 open cases and 3 past-SLA items. The concentration of chargeback cases on Harbor View (3 of their 5 open cases) is worth a merchant-level review given the volume they run." },
  ],
  "How many cases did we close this month?": [
    { role: "user", content: "How many cases did we close this month?" },
    { role: "assistant", content: "Case activity for your portfolio, Apr 22 – May 21:\n\n| Metric | Count |\n|---|---|\n| Cases Opened | 47 |\n| Cases Closed | 51 |\n| Net Change | −4 (backlog shrinking) |\n| Currently Open | 47 |\n| Reopened Cases | 3 |\n| Avg Time to Close | 6.8 days |\n\n**Week-by-week breakdown:**\n\n| Week | Opened | Closed | Net |\n|---|---|---|---|\n| Apr 22–28 | 13 | 11 | +2 |\n| Apr 29–May 5 | 12 | 14 | −2 |\n| May 6–12 | 11 | 13 | −2 |\n| May 13–19 | 9 | 11 | −2 |\n| May 20–21 | 2 | 2 | 0 |\n\nGood trend — you've been closing more than you open for three consecutive weeks. The 3 reopened cases this month (all chargeback-related) are worth reviewing to see if the initial resolution process needs adjustment." },
  ],

  // ── Risk ───────────────────────────────────────────────────────────────────
  "Which merchants have active risk alerts on their account?": [
    { role: "user", content: "Which merchants have active risk alerts on their account?" },
    { role: "assistant", content: "**6 merchants** triggered risk alerts between May 15–21:\n\n| Merchant | MID | Alert Type | Triggered | Severity |\n|---|---|---|---|---|\n| Summit Auto Group | 3317 | Funding hold — batch exceeds 3× daily avg | May 21 | 🔴 High |\n| Pinnacle Dental Group | 5509 | Potential fraud — 12 declined, then approved txns | May 19 | 🔴 High |\n| Westlake Pet Grooming | 6673 | Keyed rate spike: 8% → 35% in 7 days | May 18 | 🟡 Medium |\n| Riverbend Antiques | 1124 | CB ratio approaching 2.0% threshold | May 17 | 🟡 Medium |\n| Harbor Fish Co. | 5531 | Processing gap — 21 days with no batch | May 16 | 🟡 Medium |\n| Old Town Ice Cream | 2256 | Velocity anomaly — 3× normal txn count in 2 hrs | May 15 | 🔴 High |\n\nSummit Auto and Pinnacle Dental are the two high-severity alerts requiring immediate review. Pinnacle's pattern of declined-then-approved transactions is a common indicator of card testing." },
  ],
  "Which merchants have had unusual spikes in transaction volume recently?": [
    { role: "user", content: "Which merchants have had unusual spikes in transaction volume recently?" },
    { role: "assistant", content: "**4 merchants** are currently flagged for velocity anomalies (unusual transaction frequency or volume spikes):\n\n| Merchant | MID | Anomaly | Normal Avg | Flagged Value | Flagged On |\n|---|---|---|---|---|---|\n| Old Town Ice Cream | 2256 | Txn burst — 94 txns in 90 min | 8–12/hr | 63/hr | May 15 |\n| Pinnacle Dental Group | 5509 | Small-dollar cycling — 12 txns $1–$5 | Rare | 12 in 22 min | May 19 |\n| Canyon Road Bakery | 9934 | Batch amount 4.1× 30-day avg | $2,240/day | $9,220 | May 16 |\n| Blue Oak Brewing Co. | 2284 | Batch amount 3.9× 30-day avg | $4,720/day | $18,440 | May 18 |\n\nCritical: Old Town Ice Cream and Pinnacle Dental show patterns consistent with fraud or account misuse. Canyon Road Bakery and Blue Oak are likely legitimate spikes (Mother's Day catering, craft beer festival) but are flagged automatically any time volume exceeds 3× the baseline." },
  ],
  "Which merchants have the most disputed transactions this month?": [
    { role: "user", content: "Which merchants have the most disputed transactions this month?" },
    { role: "assistant", content: "Portfolio fraud exposure summary, May 1–21:\n\n| Category | Count | Amount |\n|---|---|---|\n| Confirmed fraud chargebacks (code 10.x) | 7 | $5,880 |\n| Open fraud retrievals (unresolved) | 4 | $1,940 |\n| Suspected fraud — under review | 3 | $2,210 |\n| Fraud-related funding holds | 2 | $41,880 |\n| **Total Exposure** | **16 incidents** | **$51,910** |\n\n**Exposure by merchant:**\n\n| Merchant | MID | Fraud Exposure | Type |\n|---|---|---|---|\n| Summit Auto Group | 3317 | $41,880 | Funding hold pending review |\n| Pinnacle Dental Group | 5509 | $4,120 | Card testing + chargeback |\n| Old Town Ice Cream | 2256 | $3,440 | Velocity fraud, disputed txns |\n| Harbor View Hotel | 4892 | $2,470 | Confirmed fraud CBs |\n\nSummit Auto's $41.9K funding hold represents 80% of total exposure — that single case is driving the monthly number. The underlying portfolio fraud rate excluding that hold is 0.21%, which is well within normal range." },
  ],
  "Which merchants moved to a higher risk tier this month?": [
    { role: "user", content: "Which merchants moved to a higher risk tier this month?" },
    { role: "assistant", content: "**7 merchants** had a risk classification change in the last 30 days (Apr 22 – May 21):\n\n**Upgraded to Higher Risk (4)**\n| Merchant | MID | From | To | Date | Reason |\n|---|---|---|---|---|---|\n| Old Town Ice Cream | 2256 | Standard | High Risk | May 9 | CB threshold exceeded |\n| Dixon Auto Repair | 3389 | Standard | Suspended | May 15 | Processing gap + keyed rate |\n| Riverbend Antiques | 1124 | Standard | Elevated | May 2 | CB ratio trend |\n| Westlake Pet Grooming | 6673 | Standard | Elevated | May 18 | Keyed rate spike |\n\n**Downgraded to Lower Risk (3)**\n| Merchant | MID | From | To | Date | Reason |\n|---|---|---|---|---|---|\n| Pacific Rim Restaurant | 8812 | Elevated | Standard | May 14 | 90-day CB improvement |\n| Greenfield Hardware | 1193 | Elevated | Standard | May 7 | Risk score dropped to 41 |\n| Westside CrossFit | 4470 | High Risk | Standard | Apr 28 | 6-month clean record |\n\nWestside CrossFit's downgrade to Standard is a positive outcome — they were flagged 6 months ago for a chargeback spike that has since resolved." },
  ],
  "Which merchants have a high rate of declined transactions followed by approvals?": [
    { role: "user", content: "Which merchants have a high rate of declined transactions followed by approvals?" },
    { role: "assistant", content: "**5 merchants** currently show transaction patterns that warrant review:\n\n**Card Testing (small-dollar cycling)**\n- **Pinnacle Dental Group** (MID 5509) — 12 transactions between $1.00–$4.99 processed in a 22-minute window on May 19. Pattern is consistent with card testing prior to larger fraudulent charges.\n\n**Unusual Transaction Velocity**\n- **Old Town Ice Cream** (MID 2256) — 94 transactions in 90 minutes on May 15, average ticket $36.60. Normal hourly rate is 8–12. No event or promotion on record.\n\n**Split Ticket Pattern**\n- **Riverbend Antiques** (MID 1124) — 6 transactions of exactly $499.99 on May 17, same card prefix (424242). Possible attempt to stay below a $500 authorization threshold.\n\n**Refund-to-Sale Ratio**\n- **Brickyard Cafe** (MID 4421) — Refund volume is 14.2% of gross sales MTD vs. portfolio average of 2.4%. Elevated refunds without corresponding chargebacks can indicate friendly fraud or internal misuse.\n\n**After-Hours Transactions**\n- **Metro Dry Cleaners** (MID 3362) — 31% of transactions are processed between 11 PM–5 AM, unusual for a dry cleaning operation. Business hours on file are 7 AM–7 PM." },
  ],
  "How many of my merchants are currently flagged as high risk?": [
    { role: "user", content: "How many of my merchants are currently flagged as high risk?" },
    { role: "assistant", content: "Risk score distribution across your **214 active merchants** as of today:\n\n| Risk Tier | Score Range | Merchants | % of Portfolio | MTD Volume |\n|---|---|---|---|---|\n| Low Risk | 0–30 | 89 | 41.6% | $8,214,440 |\n| Standard | 31–50 | 74 | 34.6% | $7,108,320 |\n| Elevated | 51–70 | 36 | 16.8% | $4,812,110 |\n| High Risk | 71–80 | 7 | 3.3% | $1,240,880 |\n| Critical | 81–100 | 8 | 3.7% | $1,470,220 |\n\n**Portfolio Average Risk Score: 38.4** — in the Standard range.\n\nThe 15 merchants in the High Risk and Critical tiers (7.0% of your portfolio) are generating $2.7M in MTD volume, roughly 12.1% of total. That's a concentration worth monitoring — a disproportionate share of risk exposure relative to merchant count.\n\nCompared to last month, 4 merchants moved from Elevated to Standard (improving) and 4 moved from Standard to Elevated or higher (worsening)." },
  ],

  // ── Boarding ───────────────────────────────────────────────────────────────
  "How many merchants are pending approval right now?": [
    { role: "user", content: "How many merchants are pending approval right now?" },
    { role: "assistant", content: "You currently have **23 merchants in the approval pipeline** as of today:\n\n| Stage | Count | Avg Time in Stage |\n|---|---|---|\n| Application received | 6 | 1.2 days |\n| Underwriting review | 9 | 3.4 days |\n| Approval pending DDA verification | 5 | 2.1 days |\n| Conditionally approved | 3 | 4.8 days |\n\n**Oldest pending application:** Harborside Gym & Spa (submitted May 12 — 9 days). Currently stuck in underwriting review.\n\nFor context, your average approval-to-activation time this month is **5.6 days**, compared to your Q1 average of 6.8 days — you're processing applications faster than earlier this year." },
  ],
  "Which merchants were boarded this month but haven't run their first batch yet?": [
    { role: "user", content: "Which merchants were boarded this month but haven't run their first batch yet?" },
    { role: "assistant", content: "**5 merchants** were approved and activated in May but have not yet submitted a qualifying batch:\n\n| Merchant | MID | Approved | Days Since Activation | SIC/MCC |\n|---|---|---|---|---|\n| Eastside Barbershop | 1052 | May 19 | 2 days | 7230 (Beauty/Barber) |\n| Lakeside Brewing Taproom | 1058 | May 15 | 6 days | 5812 (Restaurant) |\n| Pacific Coast Pilates | 1061 | May 13 | 8 days | 7941 (Sports/Recreation) |\n| Northgate Auto Detail | 1067 | May 10 | 11 days | 7542 (Auto Services) |\n| Mesa Flower Studio | 1071 | May 8 | 13 days | 5992 (Florists) |\n\n**Eastside Barbershop** just activated 2 days ago — normal. **Mesa Flower Studio** at 13 days without a batch is worth a follow-up. Equipment delivery and terminal setup issues are the most common causes at this stage." },
  ],
  "Show me my boarding pipeline for the last 30 days.": [
    { role: "user", content: "Show me my boarding pipeline for the last 30 days." },
    { role: "assistant", content: "Boarding pipeline summary, Apr 22 – May 21:\n\n| Stage | Applications | Approved | Declined | Withdrawn |\n|---|---|---|---|---|\n| Restaurants / Food Service | 9 | 7 | 1 | 1 |\n| Retail | 7 | 5 | 2 | 0 |\n| Health & Beauty | 6 | 6 | 0 | 0 |\n| Auto Services | 4 | 3 | 1 | 0 |\n| Professional Services | 3 | 2 | 0 | 1 |\n| Other | 4 | 4 | 0 | 0 |\n| **Total** | **33** | **27** | **4** | **2** |\n\n**Approval rate: 81.8%** (27 of 33 applications). Of the 27 approved, **22 have submitted at least one qualifying batch**.\n\n**4 declines this period** — 2 for insufficient business history, 1 for TIN mismatch, 1 for high-risk MCC. All received written notification within 48 hours per your SLA." },
  ],
  "Which merchants I boarded this month have already processed their first batch?": [
    { role: "user", content: "Which merchants I boarded this month have already processed their first batch?" },
    { role: "assistant", content: "Time-to-first-batch analysis for merchants activated Apr 22 – May 21 (22 merchants with at least one qualifying batch):\n\n| Time to First Batch | Merchants | % |\n|---|---|---|\n| Same day as activation | 4 | 18.2% |\n| 1–3 days | 9 | 40.9% |\n| 4–7 days | 6 | 27.3% |\n| 8–14 days | 3 | 13.6% |\n\n**Median time to first batch: 3 days**\n**Average time to first batch: 4.1 days**\n\n**Breakdown by stage:**\n\n| Stage | Avg Days |\n|---|---|\n| Application → Approval | 5.6 days |\n| Approval → Equipment delivery | 2.8 days |\n| Equipment delivery → First batch | 1.3 days |\n| **Total: Application → First batch** | **9.7 days** |\n\nYour fastest activation this month was **Lakeview Ramen Bar** (MID 1047) — approved and first batch on the same day, May 20. The 3 merchants in the 8–14 day window all involved equipment shipping delays." },
  ],
  "Which new merchants have the highest volume in their first 30 days?": [
    { role: "user", content: "Which new merchants have the highest volume in their first 30 days?" },
    { role: "assistant", content: "Top 5 new merchants by volume in their first 30 days of processing (activated Apr–May 2026):\n\n| Merchant | MID | Activated | 30-Day Volume | Txn Count | Avg Ticket | SIC/MCC |\n|---|---|---|---|---|---|---|\n| Oceanfront Gifts | 3348 | May 12 | $84,320 | 1,204 | $70.03 | 5947 (Gift/Card/Novelty) |\n| Mesa Verde Catering | 4415 | May 8 | $71,440 | 312 | $228.97 | 5812 (Restaurant) |\n| Sunrise Pilates Studio | 2291 | May 17 | $58,880 | 984 | $59.84 | 7941 (Sports/Recreation) |\n| Northpark Nail Salon | 5562 | May 3 | $48,210 | 1,641 | $29.38 | 7230 (Beauty/Barber) |\n| Hillcrest Pet Supply | 6619 | Apr 25 | $41,770 | 887 | $47.09 | 5995 (Pet Shops) |\n\nOceanfront Gifts and Mesa Verde Catering are strong early performers. Mesa Verde's $228.97 average ticket is high for a new merchant — worth monitoring, but consistent with a catering operation handling event bookings." },
  ],
  "What's the current status of my most recent merchant applications?": [
    { role: "user", content: "What's the current status of my most recent merchant applications?" },
    { role: "assistant", content: "Which merchant are you looking up? You can search by application number, business name, or the owner's name." },
    { role: "user", content: "Harborside Gym & Spa" },
    { role: "assistant", content: "**Application Status — Harborside Gym & Spa**\n\n| Field | Detail |\n|---|---|\n| Application # | APP-2026-0841 |\n| Submitted | May 12, 2026 |\n| Business Type | Health Club / Spa (MCC 7997) |\n| Legal Name | Harborside Wellness LLC |\n| Owner | Marcus T. Reyes |\n| TIN | Verified ✅ |\n| DDA | On file — pending micro-deposit verification ⏳ |\n| Current Status | **Underwriting Review** |\n| Days in Current Stage | 9 days |\n| Assigned Underwriter | Dana L. |\n\n**Timeline:**\n- May 12 — Application received\n- May 13 — TIN verified via Middesk\n- May 13 — DDA submitted; micro-deposits sent\n- May 14 — Underwriting review opened\n- May 21 — Still in review (9 days)\n\n**Notes:** DDA micro-deposit confirmation has not been received. Merchant was contacted May 17 with no response. Recommend follow-up today — DDA verification is the only remaining blocker before approval." },
  ],

  // ── Merchants ──────────────────────────────────────────────────────────────
  "Pull up the profile for merchant ID 4892.": [
    { role: "user", content: "Pull up the profile for merchant ID 4892." },
    { role: "assistant", content: "**Merchant Profile — Harbor View Hotel** (MID 4892)\n\n**Business Information**\n- Legal Name: Harbor View Hospitality LLC\n- DBA: Harbor View Hotel\n- Address: 1200 Harbor Drive, San Diego, CA 92101\n- Phone: (619) 555-0142\n- SIC/MCC: 7011 (Hotels & Motels)\n- Status: Open — Active\n- Approved: March 14, 2019\n\n**Processing Summary (MTD)**\n- Gross Sales: $284,310 | Net Volume: $277,880\n- Transaction Count: 1,204 | Avg Ticket: $236.14\n- Chargeback Ratio: 0.34%\n\n**Account Information**\n- Card Types: Visa, Mastercard, Amex, Discover\n- Program: Interchange Plus\n- Processor: TSYS\n\n**Hierarchy**\n- ISO: Pacific Coast Payments\n- Agent: Westfield Sales Group\n- Chain: Harbor Hospitality Group (HQ)\n\n**Open Cases:** 5 (1 past SLA)\n**Last Batch:** May 21 — $41,880 (record batch)" },
  ],
  "Which merchants changed status in the last 30 days?": [
    { role: "user", content: "Which merchants changed status in the last 30 days?" },
    { role: "assistant", content: "**14 merchants** had a status change between Apr 22 – May 21:\n\n**Newly Activated (6)**\n| Merchant | MID | Activated | First Batch |\n|---|---|---|---|\n| Lakeview Ramen Bar | 1047 | May 20 | May 20 |\n| Sunrise Pilates Studio | 2291 | May 17 | May 18 |\n| Oceanfront Gifts | 3348 | May 12 | May 14 |\n| Mesa Verde Catering | 4415 | May 8 | May 10 |\n| Northpark Nail Salon | 5562 | May 3 | May 4 |\n| Hillcrest Pet Supply | 6619 | Apr 25 | Apr 28 |\n\n**Closed / Terminated (5)**\n| Merchant | MID | Closed | Reason |\n|---|---|---|---|\n| Silverline Drycleaners | 7726 | May 19 | Merchant request |\n| Corner Deli & Market | 8883 | May 11 | Business closed |\n| Portside Barber | 9940 | May 6 | Non-performance |\n| Bay Area Bookstore | 1114 | Apr 30 | Merchant request |\n| Lakewood Florist | 2271 | Apr 24 | Business closed |\n\n**Hold / Suspended (3)**\n| Merchant | MID | Date | Reason |\n|---|---|---|---|\n| Dixon Auto Repair | 3389 | May 15 | Risk review |\n| Old Town Ice Cream | 2256 | May 9 | Chargeback threshold |\n| Brickyard Cafe | 4421 | Apr 29 | Funding dispute |\n\n6 activations vs. 5 closures gives you a net gain of 1 merchant this period." },
  ],
  "Which of my merchants are based in Texas?": [
    { role: "user", content: "Which of my merchants are based in Texas?" },
    { role: "assistant", content: "**Southwest Region** — 38 merchants across AZ, NM, NV, and UT:\n\n**By State:**\n\n| State | Merchant Count | MTD Volume | Active |\n|---|---|---|---|\n| Arizona | 16 | $1,241,880 | 15 |\n| Nevada | 11 | $984,440 | 10 |\n| New Mexico | 7 | $412,320 | 7 |\n| Utah | 4 | $218,770 | 4 |\n| **Total** | **38** | **$2,857,410** | **36** |\n\n**Top 5 by MTD Volume:**\n\n| Merchant | MID | State | MTD Volume |\n|---|---|---|---|\n| Desert Ridge Resort | 5574 | AZ | $318,440 |\n| Vegas Strip Steakhouse | 3312 | NV | $241,880 |\n| Scottsdale Med Spa | 6631 | AZ | $198,220 |\n| Red Rock Canyon Tours | 7788 | NV | $164,110 |\n| Albuquerque Auto Center | 2245 | NM | $141,330 |\n\n2 merchants are currently inactive: **Dixon Auto Repair** (AZ, on hold) and **Harbor Fish Co.** (NV, no batch in 21 days)." },
  ],
  "Which merchants are in the same chain as MID 7823?": [
    { role: "user", content: "Which merchants are in the same chain as MID 7823?" },
    { role: "assistant", content: "**MID 7823** is Coastal Fresh Market — part of the **Fresh Coast Grocery Group** chain (Chain ID: CFG-001).\n\nThis chain has **6 merchant IDs** in total:\n\n| Merchant | MID | Location | Status | MTD Volume |\n|---|---|---|---|---|\n| Coastal Fresh Market *(HQ)* | 7823 | San Diego, CA | Active | $198,740 |\n| Coastal Fresh — Mission Valley | 7824 | San Diego, CA | Active | $144,320 |\n| Coastal Fresh — La Jolla | 7825 | La Jolla, CA | Active | $161,880 |\n| Coastal Fresh — Chula Vista | 7826 | Chula Vista, CA | Active | $118,440 |\n| Coastal Fresh — Escondido | 7827 | Escondido, CA | Active | $98,110 |\n| Coastal Fresh — Oceanside | 7828 | Oceanside, CA | Active | $87,440 |\n\n**Chain Total MTD:** $808,930 across 6 locations — making Fresh Coast Grocery Group your **#2 chain** by volume this month. All 6 locations are active and processing normally." },
  ],
  "Find merchants with a risk score above 80.": [
    { role: "user", content: "Find merchants with a risk score above 80." },
    { role: "assistant", content: "**8 merchants** in your portfolio currently have a risk score above 80:\n\n| Merchant | MID | Risk Score | CB Ratio | Keyed % | Status | Primary Flag |\n|---|---|---|---|---|---|---|\n| Riverbend Antiques | 1124 | 94 | 1.84% | 24.6% | Open | CB ratio + merchandise disputes |\n| Old Town Ice Cream | 2256 | 91 | 1.42% | 28.1% | On Hold | CB threshold, CB increase |\n| Brickyard Cafe | 4421 | 88 | 1.21% | 12.4% | On Hold | Funding disputes, CB ratio |\n| Dixon Auto Repair | 3389 | 87 | 0.44% | 38.2% | Suspended | High keyed rate, batch gap |\n| Westlake Pet Grooming | 6673 | 85 | 0.31% | 34.7% | Open | Sudden keyed rate spike |\n| Harbor Fish Co. | 5531 | 84 | 0.28% | 6.1% | Open | 21-day processing gap |\n| Metro Dry Cleaners | 3362 | 83 | 0.98% | 11.2% | Open | CB trend increasing |\n| Bayside Florist | 8803 | 81 | 0.91% | 8.4% | Open | CB ratio trending up |\n\nRiverbend Antiques (94) and Old Town Ice Cream (91) are the highest-risk accounts and warrant proactive outreach this week." },
  ],
  "Which merchants have been inactive for more than 60 days?": [
    { role: "user", content: "Which merchants have been inactive for more than 60 days?" },
    { role: "assistant", content: "**5 merchants** with Open status haven't submitted a batch in 60+ days:\n\n| Merchant | MID | Last Batch | Days Inactive | MTD (Prior) | Notes |\n|---|---|---|---|---|---|\n| Old Town Ice Cream | 2256 | Mar 17 | 65 days | $14,880 | Account on hold since May 9 |\n| Brickyard Cafe | 4421 | Feb 28 | 82 days | $41,320 | Funding dispute, on hold |\n| Sunrise Yoga Studio | 2241 | Feb 12 | 98 days | $8,440 | No response to outreach |\n| Dixon Auto Repair | 3389 | Jan 28 | 113 days | $22,100 | Suspended — risk review |\n| Harbor Fish Co. | 5531 | Apr 30 | 21 days | $31,220 | *(approaching threshold)* |\n\nNote: Harbor Fish Co. is included as a heads-up — at 21 days they're not yet in the 60-day category but are trending that way.\n\nSunrise Yoga Studio is the most concerning — 98 days with no response to outreach and no documented closure. Consider escalating to verify business status before account goes dormant." },
  ],
}

export const SCRIPTED_CONVERSATIONS = { ...BASE_SCRIPTED_CONVERSATIONS, ...ISO_SCRIPTED_CONVERSATIONS }

// Content overrides specific to the business-owner variant (AccessOne replaces Clover branding)
export const BUSINESS_OWNER_CONTENT_OVERRIDES: Record<string, string> = {
  "bank-match":
    "Two deposits from Friday ($847 and $456) are still in transit and will post Monday. Once they post, the gap between your AccessOne sales and your bank balance narrows to $12 — which is your processing fee for the period.\n\n**Reconciliation summary**\n\n- AccessOne sales: $4,827\n- Bank deposits: $3,512\n- Difference: $1,315 (in-transit + fees)",
}

export const ISO_PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: "portfolio",
    label: "Portfolio",
    prompts: [
      "How is my portfolio performing MTD vs last month?",
      "Which merchants have the highest gross sales this week?",
      "Show me my top 10 merchants by volume YTD.",
      "Which merchants haven't processed in the last 7 days?",
      "How many new merchant activations did I have this month?",
      "What's my total portfolio volume for the last 90 days?",
    ],
  },
  {
    id: "boarding",
    label: "Boarding",
    prompts: [
      "How many merchants are pending approval right now?",
      "Which merchants were boarded this month but haven't run their first batch yet?",
      "Show me my boarding pipeline for the last 30 days.",
      "Which merchants I boarded this month have already processed their first batch?",
      "Which new merchants have the highest volume in their first 30 days?",
      "What's the current status of my most recent merchant applications?",
    ],
  },
  {
    id: "processing",
    label: "Processing",
    prompts: [
      "What was my total processing volume yesterday?",
      "Which merchants processed a batch yesterday?",
      "Which merchants have the highest decline rates this month?",
      "What's my overall approval rate this month?",
      "Which merchants have the highest declined rate this month?",
      "Which merchants had their highest volume week this month?",
    ],
  },
  {
    id: "chargebacks",
    label: "Chargebacks",
    prompts: [
      "Which merchants have the highest chargeback ratio this month?",
      "Which merchants have open chargeback disputes right now?",
      "Show me chargeback trends over the last 6 months.",
      "Which merchants are approaching chargeback thresholds?",
      "What are the most common chargeback reason codes this quarter?",
      "How has my portfolio chargeback rate trended over the last 6 months?",
    ],
  },
  {
    id: "cases",
    label: "Cases",
    prompts: [
      "Which open cases have been sitting the longest without resolution?",
      "Which of my merchants have the most open cases right now?",
      "Show me cases opened this week sorted by priority.",
      "How many cases did we open this month compared to last month?",
      "Which merchants have the most open cases right now?",
      "How many cases did we close this month?",
    ],
  },
  {
    id: "risk",
    label: "Risk",
    prompts: [
      "Which merchants have active risk alerts on their account?",
      "Which merchants have had unusual spikes in transaction volume recently?",
      "Which merchants have the most disputed transactions this month?",
      "Which merchants moved to a higher risk tier this month?",
      "Which merchants have a high rate of declined transactions followed by approvals?",
      "How many of my merchants are currently flagged as high risk?",
    ],
  },
  {
    id: "merchants",
    label: "Merchants",
    prompts: [
      "Pull up the profile for merchant ID 4892.",
      "Which merchants changed status in the last 30 days?",
      "Which of my merchants are based in Texas?",
      "Which merchants are in the same chain as MID 7823?",
      "Find merchants with a risk score above 80.",
      "Which merchants have been inactive for more than 60 days?",
    ],
  },
]

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

export const EMBED_DEMO_SOURCES: Source[] = [
  CLOVER_SOURCE,
  { id: "demo-qb",    name: "Walker's Business Books",        kind: "bank", institution: "QuickBooks",       color: "bg-green-600",  initials: "QB", logo: "/fi/quickbook.svg",  active: true, addedAt: 0 },
  { id: "demo-chase", name: "Chase Business Checking ••4892", kind: "bank", institution: "Chase",            color: "bg-blue-700",   initials: "CH", logo: "/fi/chase.png",      active: true, addedAt: 0 },
  { id: "demo-bofa",  name: "BofA Savings ••2341",            kind: "bank", institution: "Bank of America",  color: "bg-red-600",    initials: "BA", logo: "/fi/bofa.png",       active: true, addedAt: 0 },
  { id: "demo-wf",    name: "Wells Fargo Business ••7823",    kind: "bank", institution: "Wells Fargo",      color: "bg-yellow-600", initials: "WF", logo: "/fi/wellsfargo.png", active: true, addedAt: 0 },
  { id: "demo-amex",  name: "Amex Business Gold ••5561",      kind: "bank", institution: "American Express", color: "bg-sky-600",    initials: "AX", logo: "/fi/amex.svg",       active: true, addedAt: 0 },
]

export const EMBED_ISO_DEMO_SOURCES: Source[] = [
  APERIA_SOURCE,
  { id: "iso-alloy",    name: "Alloy",              kind: "bank", institution: "Alloy",               logo: "/iso/alloy.svg",          active: true, addedAt: 0 },
  { id: "iso-middesk",  name: "Middesk",             kind: "bank", institution: "Middesk",              logo: "/iso/middesk.svg",        active: true, addedAt: 0 },
  { id: "iso-visa",     name: "Visa",                kind: "bank", institution: "Visa",                 logo: "/iso/visa.svg",           active: true, addedAt: 0 },
  { id: "iso-zendesk",  name: "Zendesk",             kind: "bank", institution: "Zendesk",              logo: "/iso/zendesk.svg",        active: true, addedAt: 0 },
  { id: "iso-cb911",    name: "Chargeback911",       kind: "bank", institution: "Chargeback911",        logo: "/iso/chargeback911.svg",  active: true, addedAt: 0 },
  { id: "iso-sf",       name: "Salesforce",          kind: "bank", institution: "Salesforce",           logo: "/iso/salesforce.svg",     active: true, addedAt: 0 },
  { id: "iso-mc",       name: "Mastercard",          kind: "bank", institution: "Mastercard",           logo: "/iso/mastercard.svg",     active: true, addedAt: 0 },
  { id: "iso-g2risk",   name: "G2 Risk Solutions",   kind: "bank", institution: "G2 Risk Solutions",    logo: "/iso/g2risk.svg",         active: true, addedAt: 0 },
]

export const EMBED_BUSINESS_OWNER_DEMO_SOURCES: Source[] = EMBED_DEMO_SOURCES.map((s) =>
  s.id === CLOVER_SOURCE_ID ? ACCESS_ONE_SOURCE : s
)

export const EMBED_DETECT_DEMO_SOURCES: Source[] = [
  APERIA_SOURCE,
  { id: "detect-visa",      name: "Visa",              kind: "bank", institution: "Visa",              logo: "/iso/visa.svg",          active: true, addedAt: 0 },
  { id: "detect-mc",        name: "Mastercard",        kind: "bank", institution: "Mastercard",        logo: "/iso/mastercard.svg",    active: true, addedAt: 0 },
  { id: "detect-alloy",     name: "Alloy",             kind: "bank", institution: "Alloy",             logo: "/iso/alloy.svg",         active: true, addedAt: 0 },
  { id: "detect-cb911",     name: "Chargeback911",     kind: "bank", institution: "Chargeback911",     logo: "/iso/chargeback911.svg", active: true, addedAt: 0 },
  { id: "detect-g2risk",    name: "G2 Risk Solutions", kind: "bank", institution: "G2 Risk Solutions", logo: "/iso/g2risk.svg",        active: true, addedAt: 0 },
]
