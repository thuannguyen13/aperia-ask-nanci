// Aperia Risk — scripted chat answers for the landing quick-actions and
// "Nanci's take" cards. Keyed by the prompt string the landing chip sends.
// Spread into CONCEPT_SCRIPTED_CONVERSATIONS so the risk chat can play them.
//
// ponytail: every figure quoted here is read off another data file — merchant
// scores and MIDs from risk-merchants.ts, queue counts from
// risk-detection-queue.ts, the portfolio findings from
// wiki/aperia-risk/demo-data-spec.md (Sept–Dec 2025). Change a number there and
// change it here; the demo falls apart the moment a card and its answer disagree.
import type { ConceptScriptedTurn } from "../types"
import type { RiskChipDest } from "./risk-landing"

// The opening question the Detection Queue's "Ask Nanci" button summons.
export const DETECTION_QUEUE_PROMPT = "What stands out in the Detection Queue today?"

/**
 * Suggestion pills that go somewhere instead of asking something. Clicking one is
 * the Navigate trigger issued from the conversation — allowed, because chat sits
 * outside the panel chain and is where the panel rules say a new topic may start
 * ("Move that to the conversation or the menu"). Navigating closes the panel it was
 * clicked in, since Navigate replaces Primary and closes every panel beside it.
 *
 * The label is a destination, never a question, so nobody loses their screen to a
 * pill that read like something Nanci would answer in place.
 */
export const RISK_SUGGESTION_DESTS: Record<string, RiskChipDest> = {
  "Open Detection Queue": "detection-queue",
}

export const RISK_LANDING_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  // The standing insight behind the landing's first take card.
  "How many high-MC merchants never raised a VisionWeb alert?": [
    { role: "user", content: "How many high-MC merchants never raised a VisionWeb alert?" },
    {
      role: "assistant",
      content:
        "**3,556.** In one client portfolio over Sept–Dec 2025, Mastercard scored 3,556 merchants above 700 and VisionWeb raised no alert on any of them. In the same portfolio, **317 merchants were later confirmed as fraud.**\n\nThat is the gap in one number: the signal arrived and nothing was done with it. It is not a scoring problem — the scores were there — it is that nothing was watching the Mastercard side.\n\nThe fix is an assignment with a **P-MC1 Score Threshold** parameter at 700, which turns those scores into queue items instead of rows in a file.",
      source: "Woodforest portfolio analysis · Sept–Dec 2025",
      dashChart: "high-risk",
      suggestions: ["Compare VW scores vs MC scores for the alerted portfolio", "Show me today's high risk merchants"],
    },
  ],

  "Show me today's high risk merchants": [
    { role: "user", content: "Show me today's high risk merchants" },
    {
      role: "assistant",
      content:
        "**13 of the 30 merchants on page one are High risk** — but they are High for three different reasons, and that split is the part worth reading:\n\n- **5 are critical on both models.** Start here: Northgate Appliance Ctr (VW 91 / MC 731.44), Regency Furniture Manchester (89 / 737.33, $14,896.06), Coastal Wellness Partners (86 / 704.88), Brighton Medical Supply (84 / 712.40), Harbor Point Marine Svcs (81 / 726.05).\n- **4 are Mastercard only.** Goldleaf Jewelry Exchange (78 / 733.12), Ashley Homestore – Mechanicsbu (74 / 701.05), Apex Roofing Solutions (66 / 707.19) and **Cascade Auto Parts Warehouse (62 / 711.08)** — Cascade ranks 25th of 30 on VisionWeb.\n- **4 are VisionWeb only.** Summit Ridge Outfitters (94 / 688.21), Meridian Dental Group (87 / 95.99), Velocity Wireless Retail (83 / 358.19) and Elevate Fitness Club (80 / 612.77).\n\nWork the list top-down on VW score and you reach Cascade 25th. Sort by MC and it is 4th. Want me to open the Barometer Report?",
      source: "Barometer Report · Phase 2",
      dashChart: "high-risk",
      suggestions: ["Which merchants are critical on both models?", "Why is alert volume running hot today?"],
    },
  ],

  // Also the prompt behind the landing's "better together" take card.
  "Compare VW scores vs MC scores for the alerted portfolio": [
    { role: "user", content: "Compare VW scores vs MC scores for the alerted portfolio" },
    {
      role: "assistant",
      content:
        "Neither model wins. Across **774 chargeback merchants** (Sept–Dec 2025):\n\n| Detection approach | Caught early | Avg days before first chargeback |\n|---|---|---|\n| VisionWeb alone | 93 | 37.9 |\n| Mastercard alone | 178 | 37.8 |\n| **Both together** | **210** | **40.0** |\n\nCoverage splits **326 flagged by both · 312 Mastercard only · 67 VisionWeb only · 69 missed by both** — so together you cover **91%**.\n\nAnd of the 326 both systems caught, **VisionWeb was first 184 times and Mastercard was first 142 times.** There is no consistent leader, which is exactly why both scores belong side by side on the merchant row rather than one being picked as the primary.",
      source: "Combined MC + VW analysis · 774 chargeback merchants",
      dashChart: "scatter",
      suggestions: ["Which merchants are critical on both models?", "How many high-MC merchants never raised a VisionWeb alert?"],
    },
  ],

  "What are the re-alert rates by assignment?": [
    { role: "user", content: "What are the re-alert rates by assignment?" },
    {
      role: "assistant",
      content:
        "Portfolio re-alert rate is **18.4%** today — 685 repeats across 3,724 worked, so about 1 in 5. The two queues split it unevenly: **Phase 2 - Auths runs 20.1%** on 2,184 worked, while Authorizations sits at **16.0%**.\n\nTightening the re-alert delta on P11/P12 would cut most of the repeat noise on the noisier one. Want me to review that?",
      source: "Detection Queue analytics",
      dashChart: "realert",
      suggestions: ["Review the Phase 2 - Auths re-alert rate", "Why is alert volume running hot today?"],
    },
  ],

  "Show me the top 10 parameters by heat": [
    { role: "user", content: "Show me the top 10 parameters by heat" },
    {
      role: "assistant",
      content:
        "The hottest parameters today are led by **MC Velocity** and **Auth Decline Ratio** — both firing well above their 30-day baseline. Chargeback Velocity, Cross-Border Mix and Ticket Spike round out the top five.\n\nHeat here means firing frequency relative to baseline, not severity — a hot-but-noisy parameter (MC Velocity) is a tuning candidate, while a hot-and-precise one is doing its job. Want the re-alert rates alongside so you can tell them apart?",
      source: "Parameter heat map",
      dashChart: "param-heat",
      suggestions: ["What are the re-alert rates by assignment?", "Show me today's high risk merchants"],
    },
  ],

  "Why is alert volume running hot today?": [
    { role: "user", content: "Why is alert volume running hot today?" },
    {
      role: "assistant",
      content:
        "**357 alerts today — 63 more than yesterday.** The jump is concentrated, not broad: Phase 2 - Auths accounts for the whole delta, and its **20.1% re-alert rate** says a lot of that is the same merchants tripping the same threshold repeatedly.\n\nSo this reads as a **threshold-tuning issue, not a real risk spike**. Tightening the re-alert delta on P11/P12 would bring volume back in line. The genuine risk is still concentrated in the 13 High-risk accounts.",
      source: "Detection Queue · today vs. yesterday",
      dashChart: "alert-volume",
      suggestions: ["Review the Phase 2 - Auths re-alert rate", "Show me today's high risk merchants", "Open Detection Queue"],
    },
  ],

  "Review the Phase 2 - Auths re-alert rate": [
    { role: "user", content: "Review the Phase 2 - Auths re-alert rate" },
    {
      role: "assistant",
      content:
        "**Phase 2 - Auths is your noisiest queue: a 20.1% re-alert rate, the highest today.** 438 of 2,184 worked came back — one in five is a repeat on a merchant already surfaced, which is threshold noise rather than new risk.\n\nSuggested action: **tighten the re-alert delta on P11/P12.** That trims the repeats without touching the merchants that matter (none of your 13 High-risk accounts depend on those two parameters alone). It's a low-risk tuning change you can make from Assignment Management.",
      source: "Parameter analytics · MC Velocity",
      dashChart: "realert",
      suggestions: ["What are the re-alert rates by assignment?", "Why is alert volume running hot today?", "Open Detection Queue"],
    },
  ],

  "Which merchants are critical on both models?": [
    { role: "user", content: "Which merchants are critical on both models?" },
    {
      role: "assistant",
      content:
        "**5 of the 30 on page one** are critical on both — VW ≥ 80 and MC ≥ 700:\n\n1. **Northgate Appliance Ctr** — VW 91 / MC 731.44\n2. **Regency Furniture Manchester** — VW 89 / MC 737.33. Top 2% for MCC 5712, +410 over 30 days.\n3. **Coastal Wellness Partners** — VW 86 / MC 704.88\n4. **Brighton Medical Supply** — VW 84 / MC 712.40\n5. **Harbor Point Marine Svcs** — VW 81 / MC 726.05\n\nThose five are your high-confidence starts. The useful part is the other eight High-risk merchants: **4 fire on Mastercard only** and **4 on VisionWeb only**. So a majority of today's High queue would be invisible to whichever single model you picked — which is the case for reading both before dispositioning.",
      source: "VisionWeb + MC critical overlap",
      dashChart: "scatter",
      suggestions: ["Show me today's high risk merchants", "Compare VW scores vs MC scores for the alerted portfolio", "Open Detection Queue"],
    },
  ],

  // Summoned from the Detection Queue header (Figma 401:84863). Every number here
  // is read off DETECTION_QUEUES[0] — keep the two in step if that data changes.
  [DETECTION_QUEUE_PROMPT]: [
    { role: "user", content: DETECTION_QUEUE_PROMPT },
    {
      role: "assistant",
      content:
        "Here are the key insights from **Phase 2 Parameters - Auths - Detect Q**:\n\n- **Alert Volume**: 357 of 1,240 eligible merchants (28.8%) triggered alerts, representing a total exposure of $84,901.89.\n- **Operational Bottleneck**: the workflow is completely stalled. % Worked is 0.00%, with zero items in progress and zero items completed.\n- **Idle Financials**: all 357 alerted merchants are sitting in \"Ready to work\", so the entire $84,901.89 is idle. Eleven of them have already been re-queued once.",
      source: "Detection Queue · Phase 2",
      suggestions: ["Analyze the Barometer Report", "Allocate 'Ready to Work' Items", "Unblock the Workflow"],
    },
  ],

  "Analyze the Barometer Report": [
    { role: "user", content: "Analyze the Barometer Report" },
    {
      role: "assistant",
      content:
        "The Barometer Report ranks all 357 alerted merchants by VisionWeb score, 30 to a page. On page one, **13 are High risk and 5 are critical on both models** — Regency Furniture Manchester alone carries $14,896.06.\n\nBut ranking by VW score buries the Mastercard-only cases. **Cascade Auto Parts Warehouse sits 25th of 30 on VisionWeb at 62, while Mastercard has it at 711.08** — top five on MC, $1,469.00 of exposure. Apex Roofing (66 / 707.19) has the same problem eight rows above it.\n\nSort by MC score instead and four merchants jump the queue. Open it from the queue card when you want to start.",
      source: "Barometer Report · Phase 2",
      suggestions: ["Show me today's high risk merchants", "Allocate 'Ready to Work' Items", "Unblock the Workflow"],
    },
  ],

  "Allocate 'Ready to Work' Items": [
    { role: "user", content: "Allocate 'Ready to Work' Items" },
    {
      role: "assistant",
      content:
        "There are **357 items ready to work, worth $84,901.89**, and none are assigned to an analyst yet. That is the whole alerted volume sitting in one bucket, 11 of it already re-queued once.\n\nAt your team's current throughput 357 items is several days for a single analyst, so split it rather than handing it to one person. The Barometer Report has already ranked them, so allocating the top band first puts the largest exposure under an owner today.",
      source: "Detection Queue · Phase 2",
      suggestions: ["Unblock the Workflow", "Analyze the Barometer Report"],
    },
  ],

  "Unblock the Workflow": [
    { role: "user", content: "Unblock the Workflow" },
    {
      role: "assistant",
      content:
        "The block is allocation, not capacity. **357 alerted, 357 ready, 11 re-queued, 0 in progress, 0 worked** is the signature of a queue nobody has been assigned to — if analysts were working it and stalling, you would see a work-in-progress count instead.\n\nSo the unblock is one step: put owners on the ready items. The 357 are already prioritised by the Barometer Report, so nothing else needs re-tuning first.",
      source: "Detection Queue · Phase 2",
      suggestions: ["Allocate 'Ready to Work' Items", "Show me today's high risk merchants"],
    },
  ],
}
