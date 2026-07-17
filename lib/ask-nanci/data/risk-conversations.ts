// Aperia Risk — scripted chat answers for the landing quick-actions and
// "Nanci's take" cards. Keyed by the prompt string the landing chip sends.
// Spread into CONCEPT_SCRIPTED_CONVERSATIONS so the risk chat can play them.
import type { ConceptScriptedTurn } from "../types"

// Sibling chips offered after each answer — all resolve to entries in this file.
const SIBLINGS = [
  "Show me today's high risk merchants",
  "Show the 5 merchants that are both VW and MC critical",
  "Why is alert volume running hot today?",
]

export const RISK_LANDING_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  "Show me today's high risk merchants": [
    { role: "user", content: "Show me today's high risk merchants" },
    {
      role: "assistant",
      content:
        "**3 merchants are High risk today**, and risk lines up with exposure so working them top-down also works them by dollars:\n\n1. **Regency Furniture Manchester** — VW 89 / MC 940, $48,200 exposure. Your clear #1.\n2. **PBBILLER.COM** — VW 83 / MC 920, $31,500.\n3. **Ashley Homestore – Mechanicsbu** — VW 81 / MC 830, $27,800 (already Worked).\n\nEverything below is Medium and tapers off fast. Want me to open the Barometer Report so you can work them in order?",
      source: "Detection Queue · Esquire - Phase 2",
      suggestions: ["Show the 5 merchants that are both VW and MC critical", "Why is alert volume running hot today?"],
    },
  ],

  "Compare VW scores vs MC scores for the alerted portfolio": [
    { role: "user", content: "Compare VW scores vs MC scores for the alerted portfolio" },
    {
      role: "assistant",
      content:
        "Across the alerted portfolio the two models **mostly agree** — the correlation holds tightest at the top. Regency (89/940), PBBILLER (83/920) and Ashley (81/830) rank the same on both.\n\nThe disagreements are worth a look: a handful of merchants sit High on MC but only Medium on VW — usually a velocity or cross-border pattern MC weights harder. Those are where a scatter view earns its keep.",
      source: "VisionWeb · MC/Brighterion",
      suggestions: SIBLINGS,
    },
  ],

  "What are the re-alert rates by assignment?": [
    { role: "user", content: "What are the re-alert rates by assignment?" },
    {
      role: "assistant",
      content:
        "Portfolio re-alert rate is **20.1%** today — about 1 in 5 alerts is a repeat. By assignment, **MC Velocity is the outlier at 45.6%**: only 18 alerts but very noisy, which usually means the threshold is set too tight. The Auths - Detect Q assignment is healthier at ~16%.\n\nRaising MC Velocity from 15 → 20 points would cut most of the repeat noise. Want me to review that one?",
      source: "Detection Queue analytics",
      suggestions: ["Review MC Velocity re-alert rate", "Why is alert volume running hot today?"],
    },
  ],

  "Show me the top 10 parameters by heat": [
    { role: "user", content: "Show me the top 10 parameters by heat" },
    {
      role: "assistant",
      content:
        "The hottest parameters today are led by **MC Velocity** and **Auth Decline Ratio** — both firing well above their 30-day baseline. Chargeback Velocity, Cross-Border Mix and Ticket Spike round out the top five.\n\nHeat here means firing frequency relative to baseline, not severity — a hot-but-noisy parameter (MC Velocity) is a tuning candidate, while a hot-and-precise one is doing its job. Want the re-alert rates alongside so you can tell them apart?",
      source: "Parameter heat map",
      suggestions: ["What are the re-alert rates by assignment?", "Show me today's high risk merchants"],
    },
  ],

  "Why is alert volume running hot today?": [
    { role: "user", content: "Why is alert volume running hot today?" },
    {
      role: "assistant",
      content:
        "**357 alerts today — 63 more than yesterday.** The jump is concentrated, not broad: MC Velocity alone accounts for most of the delta, and its **45.6% re-alert rate** says a lot of that is the same merchants tripping the same threshold repeatedly.\n\nSo this reads as a **threshold-tuning issue, not a real risk spike**. Tightening MC Velocity (15 → 20 pts) would bring volume back in line. The genuine risk is still concentrated in the 3 High-risk accounts.",
      source: "Detection Queue · today vs. yesterday",
      suggestions: ["Review MC Velocity re-alert rate", "Show me today's high risk merchants"],
    },
  ],

  "Review MC Velocity re-alert rate": [
    { role: "user", content: "Review MC Velocity re-alert rate" },
    {
      role: "assistant",
      content:
        "**MC Velocity is your noisiest parameter: 45.6% re-alert rate, the highest today.** Only 18 alerts, but nearly half are repeats on merchants already surfaced — that's threshold noise, not new risk.\n\nSuggested action: **raise the velocity threshold from 15 → 20 points.** That trims the repeats without touching the merchants that matter (none of your 3 High-risk accounts depend on this parameter alone). It's a low-risk tuning change you can make from Assignment Management.",
      source: "Parameter analytics · MC Velocity",
      suggestions: ["What are the re-alert rates by assignment?", "Why is alert volume running hot today?"],
    },
  ],

  "Show the 5 merchants that are both VW and MC critical": [
    { role: "user", content: "Show the 5 merchants that are both VW and MC critical" },
    {
      role: "assistant",
      content:
        "**5 merchants are critical on both models** — the ones no one should sit on:\n\n1. **0553 – OH Toledo** — highest priority, +180 score delta.\n2. **8040 – NY Rochester** — +140 delta.\n3. **Regency Furniture Manchester** — TX, VW 89 / MC 940.\n4. **PBBILLER.COM** — VW 83 / MC 920.\n5. **Ashley Homestore – Mechanicsbu** — VW 81 / MC 830.\n\nBoth models agreeing at the top is a strong signal — start with Toledo and Rochester given the score deltas. Want the Barometer Report to work them?",
      source: "VisionWeb + MC critical overlap",
      suggestions: ["Show me today's high risk merchants", "Why is alert volume running hot today?"],
    },
  ],
}
