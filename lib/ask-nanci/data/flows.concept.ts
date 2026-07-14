// Scripted conversation flows for the concept demo (?mode=concept and ?mode=detect).
// All flow-key constants and the conversations record live here.
// concept-config.ts re-exports everything so existing imports don't change.

import type { ConceptScriptedTurn, SheetActionData } from "../types";

// ─── Flow-key constants ───────────────────────────────────────────────────────

export const CONCEPT_FLOW2_PROMPT = "Show me merchant volume for this week";
export const CONCEPT_FLOW2_FOLLOWUP = "Just the top 5";
export const CONCEPT_FLOW6_KEY = "__proactive__";
export const CONCEPT_DETECT_WELCOME_KEY = "__detect_welcome__";

export const CONCEPT_FLOW8_FOLLOWUP = "Filter to ones not contacted in the last 30 days";
export const CONCEPT_FLOW8_FINAL = "Send them all";
export const CONCEPT_FLOW10_FOLLOWUP = "Open the volume trend and the settlement change side by side";
export const CONCEPT_FLOW10_FOLLOWUP2 = "Who else has approved account changes for this merchant historically?";
export const CONCEPT_FLOW11_QUICKWINS = "Start with the quick wins";
export const CONCEPT_FLOW11_APPROVE = "Approve all except the third one";

export const CONCEPT_FLOW12_PROMPT = "Show me the detection queue";
export const CONCEPT_FLOW12_CONTINUE_KEY = "__dq_continue__";
export const CONCEPT_DQ_OPEN_KEY = "Yes, open it";
export const CONCEPT_DQ_COASTAL_KEY = "Pull up Coastal's risk report alongside";
export const CONCEPT_DQ_ESCALATE_KEY = "Escalate this one and open a risk case.";

export const CONCEPT_FLOW13_PROMPT = "When's my money from the weekend hitting?";
export const CONCEPT_FLOW14_PROMPT = "my fees went up this month, what happened?";
export const CONCEPT_FLOW15_PROMPT = "How'd this week go vs last week?";
export const CONCEPT_FLOW15_FOLLOWUP = "Was there a slow day too?";
export const CONCEPT_FLOW16_PROMPT = "I changed banks, send my deposits to the new account";
export const CONCEPT_FLOW9_PROMPT = "none of this is right, my payout is short by like 600 bucks and I don't get why";
export const CONCEPT_MENU_MARGIN_PROMPT = "how's the Italian combo doing this month?";

// ─── Flow registry — single source of truth for showcased flows ──────────────
// One record per welcome-view card. The slug map, the trigger-prompt list, and
// the welcome cards all derive from this: add a flow here (+ its conversation
// below) and it lights up everywhere. `num` is display order; `slug` is the embed
// ?flow=<n> entry (independent of num); `altEntries` are extra embed entry points
// into the same flow (e.g. the Detection greeting).
export interface FlowDef {
  num: number;
  title: string;
  badge: string;
  description: string;
  section: "pattern" | "merchant";
  key: string; // conversation key (also the "Try it" prompt unless proactive)
  proactive?: boolean; // card shows "Simulate login"; excluded from CONCEPT_ALL_PROMPTS
  slug?: string; // ?mode=concept-embed&flow=<slug>
  altEntries?: { slug: string; key: string }[]; // additional embed entries into this flow
}

export const FLOW_DEFS: FlowDef[] = [
  // ── Interaction patterns ──
  { num: 1, section: "pattern", title: "Simple Update", badge: "Chat only", key: "Update my phone number", description: "Update a phone number — AI confirms and shows an audit record." },
  { num: 2, section: "pattern", title: "Data Lookup", badge: "Chat + panel", key: CONCEPT_FLOW2_PROMPT, slug: "2", description: "Merchant volume table opens in a side panel, sortable by column." },
  {
    num: 3,
    section: "pattern",
    title: "Panel as Form",
    badge: "Chat + form",
    key: "Change my deposit bank account",
    description: "Pre-filled bank account form — submit from the panel, AI confirms.",
  },
  {
    num: 4,
    section: "pattern",
    title: "Step-up Auth",
    badge: "Multi-step",
    key: "I need to change my deposit account to a new bank",
    description: "Financial change requires identity verification before the form unlocks.",
  },
  {
    num: 6,
    section: "pattern",
    title: "Proactive Surfacing",
    badge: "AI-initiated",
    key: CONCEPT_FLOW6_KEY,
    slug: "6",
    proactive: true,
    description: "AI speaks first on login — flags a held batch and opens the detail panel.",
  },
  {
    num: 7,
    section: "pattern",
    title: "Case Management",
    badge: "ISO · Multi-panel",
    key: "Pull up the case for Oak Street Coffee",
    description: "Service agent works a chargeback — case, transaction, and dispute draft open side by side.",
  },
  {
    num: 8,
    section: "pattern",
    title: "Bulk Action",
    badge: "Bulk · Multi-panel",
    key: "Show me merchants with decline rates above 15% last week",
    description: "Analyst targets high-decline merchants — filtered table, email draft, and bulk send in chat.",
  },
  {
    num: 10,
    section: "pattern",
    title: "Risk Investigation",
    badge: "Risk · Multi-panel",
    key: "Show me everything unusual about Bayside Imports in the last 90 days",
    description: "Risk analyst investigates a suspicious merchant — AI flags anomalies, panels open as evidence.",
  },
  {
    num: 11,
    section: "pattern",
    title: "Work Queue",
    badge: "ISO · Queue",
    key: "Show me my work queue",
    description: "AI triages 47 cases on login — batch approvals, grouped issue, email template in one flow.",
  },
  {
    num: 12,
    section: "pattern",
    title: "Detection Queue",
    badge: "Risk · Looping",
    key: CONCEPT_FLOW12_PROMPT,
    slug: "12",
    altEntries: [{ slug: "11", key: CONCEPT_DETECT_WELCOME_KEY }],
    description: "Risk analyst works a Detection Queue assignment — Barometer Report, risk profile, and case escalation open side by side.",
  },

  // ── Merchant money questions ──
  {
    num: 13,
    section: "merchant",
    title: "Deposit Tracker",
    badge: "Chat + panel",
    key: CONCEPT_FLOW13_PROMPT,
    slug: "13",
    description: "Pending batches with a held-transaction explainer — the AI reasons about why, not just a status label.",
  },
  {
    num: 14,
    section: "merchant",
    title: "Fee Change Explainer",
    badge: "Chat + panel",
    key: CONCEPT_FLOW14_PROMPT,
    slug: "14",
    description: "Statement went up — AI attributes the delta to volume, then chains into the one real exception.",
  },
  {
    num: 15,
    section: "merchant",
    title: "Sales Snapshot",
    badge: "Chat + panel",
    key: CONCEPT_FLOW15_PROMPT,
    slug: "15",
    description: "Week-over-week sales with an AI-authored driver line and a same-panel drill-in.",
  },
  {
    num: 16,
    section: "merchant",
    title: "Account Change",
    badge: "Multi-step",
    key: CONCEPT_FLOW16_PROMPT,
    slug: "16",
    description: "Bank account change submitted as a verified request, not applied directly — the guardrail-write reference pattern.",
  },
  {
    num: 17,
    section: "merchant",
    title: "Escalation",
    badge: "Chat + panel",
    key: CONCEPT_FLOW9_PROMPT,
    slug: "9",
    description: "AI can't resolve a payout shortfall — hands off to a human with the batch context already attached, never a dead end.",
  },
  {
    num: 18,
    section: "merchant",
    title: "Menu Margin Truth",
    badge: "Chat + panel",
    key: CONCEPT_MENU_MARGIN_PROMPT,
    slug: "18",
    description: "Best-seller by volume isn't the best earner — Nanci joins sales and ingredient cost to rank the menu by profit, insight only she can surface.",
  },
  {
    num: 5,
    section: "merchant",
    title: "Error Recovery",
    badge: "Chat only",
    key: "Change my MID to a new one",
    slug: "5",
    description: "AI can't change a MID — diagnoses intent, offers alternatives via chips.",
  },
];

// Derived — do not hand-maintain; add to FLOW_DEFS above instead.
// ?mode=concept-embed&flow=<slug> → conversation key.
export const CONCEPT_FLOW_SLUGS: Record<string, string> = Object.fromEntries(
  FLOW_DEFS.flatMap((f) => [...(f.slug ? [[f.slug, f.key] as [string, string]] : []), ...(f.altEntries?.map((e) => [e.slug, e.key] as [string, string]) ?? [])]),
);

// Trigger prompts (routing guard + recycled as end-of-flow suggestion chips), in
// ascending card number. Proactive flows have no prompt and are excluded.
export const CONCEPT_ALL_PROMPTS = [...FLOW_DEFS]
  .filter((f) => !f.proactive)
  .sort((a, b) => a.num - b.num)
  .map((f) => f.key);

export const CONCEPT_NO_RESET_PROMPTS = new Set([
  CONCEPT_FLOW2_FOLLOWUP,
  CONCEPT_FLOW6_KEY,
  CONCEPT_FLOW8_FOLLOWUP,
  CONCEPT_FLOW8_FINAL,
  "Draft an outreach email for all of them",
  CONCEPT_FLOW10_FOLLOWUP,
  CONCEPT_FLOW10_FOLLOWUP2,
  "Yes, and put a temporary funding hold on the account",
  "Show me my work queue",
  CONCEPT_FLOW11_QUICKWINS,
  CONCEPT_FLOW11_APPROVE,
  "Now show me the Processor X cases",
  "Yes, send the template and mark them",
  // Detection Queue steps: continue the session rather than resetting it
  CONCEPT_FLOW12_CONTINUE_KEY,
  CONCEPT_DQ_OPEN_KEY,
  CONCEPT_DQ_COASTAL_KEY,
  CONCEPT_DQ_ESCALATE_KEY,
  // Sales Snapshot: drill-down follow-up continues the session rather than resetting it
  CONCEPT_FLOW15_FOLLOWUP,
]);

// ─── Sheet action data (populated at module load) ─────────────────────────────

const FLOW1_SHEET: SheetActionData = {
  field: "Phone Number",
  fromValue: "(512) 334-7821",
  toValue: "(415) 867-5309",
  timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
  status: "completed",
};

const FLOW5_SHEET: SheetActionData = {
  field: "DBA Name",
  fromValue: "Walker's Books",
  toValue: "Walker Bistro",
  timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
  status: "completed",
};

// ─── Scripted conversations ───────────────────────────────────────────────────

export const CONCEPT_SCRIPTED_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  // ── Flow 1: Simple Update ─────────────────────────────────────────────────
  "Update my phone number": [
    { role: "user", content: "Update my phone number" },
    { role: "assistant", content: "No problem. Your current phone number on file is (512) 334-7821, used for account verification and support callbacks.\n\nWhat's the new number you'd like to use?" },
    { role: "user", content: "(415) 867-5309" },
    { role: "assistant", content: "To confirm — updating your contact number from (512) 334-7821 to (415) 867-5309. Correct?" },
    { role: "user", content: "That's right." },
    {
      role: "assistant",
      content: "Done — phone number updated to (415) 867-5309. If you ever need to verify your account, that's the number we'll use going forward.",
      sheetAction: FLOW1_SHEET,
      suggestions: ["Change my deposit bank account", "Pull up the case for Oak Street Coffee"],
    },
  ],

  // ── Flow 2: Data Lookup ───────────────────────────────────────────────────
  [CONCEPT_FLOW2_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW2_PROMPT },
    {
      role: "assistant",
      content: "Here's your merchant volume for the week of May 15–21. I've opened the full breakdown in the panel — you can sort by any column.",
      panel: "merchant-volume",
      pauseAfter: 800,
    },
  ],
  [CONCEPT_FLOW2_FOLLOWUP]: [
    { role: "user", content: CONCEPT_FLOW2_FOLLOWUP },
    {
      role: "assistant",
      content: "Got it — filtered to your top 5 by volume.",
      panel: "merchant-volume",
      view: "top5",
      suggestions: ["Show me merchants with decline rates above 15% last week", CONCEPT_FLOW2_PROMPT],
    },
  ],

  // ── Flow 3: Panel-as-form ─────────────────────────────────────────────────
  "Change my deposit bank account": [
    { role: "user", content: "Change my deposit bank account" },
    { role: "assistant", content: "Sure. I've pulled up your current deposit account details in the panel. Review and update as needed, then hit Submit." },
    { role: "assistant", content: "Your current deposit account on file: routing •••• 4892, account •••• 7823 (Checking).", openFormPanel: true },
  ],

  // ── Flow 4: Step-up Auth ──────────────────────────────────────────────────
  "I need to change my deposit account to a new bank": [
    { role: "user", content: "I need to change my deposit account to a new bank" },
    {
      role: "assistant",
      content: "That's a financial change — I'll need to verify it's you first. Sending a 6-digit code to your phone ending in 0142. Enter it in the panel when you have it.",
      openStepUpPanel: true,
    },
    { role: "user", content: "Done" },
    {
      role: "assistant",
      content: "Verified. Enter your new bank account details in the panel — routing number, account number, and account type.",
      advanceStepUp: true,
    },
    { role: "user", content: "Submitted" },
    {
      role: "assistant",
      content: "Review your new account details in the panel and confirm when ready.",
      advanceStepUp: true,
    },
  ],

  // ── Flow 5: Error Recovery ────────────────────────────────────────────────
  "Change my MID to a new one": [
    { role: "user", content: "Change my MID to a new one" },
    {
      role: "assistant",
      content: "I can't change the MID itself — that's assigned by the processor and requires a new application. Here's what I can help with instead:",
      suggestions: ["Update my DBA name", "Start a new MID application", "Connect me with my ISO"],
    },
    { role: "user", content: "I want my receipts to show a different business name" },
    {
      role: "assistant",
      content: "Got it — that's a DBA update, not a MID change. Want to update it now?",
      suggestions: ["Yes, update my DBA name"],
    },
  ],

  "Update my DBA name": [
    { role: "user", content: "Update my DBA name" },
    { role: "assistant", content: 'Your current DBA name on file is "Walker\'s Books". What would you like to change it to?' },
    { role: "user", content: "Walker Bistro" },
    { role: "assistant", content: 'To confirm — updating your DBA name from "Walker\'s Books" to "Walker Bistro". This is what appears on receipts and cardholder statements. Correct?' },
    { role: "user", content: "Yes, go ahead." },
    {
      role: "assistant",
      content: 'Done — DBA name updated to "Walker Bistro". Receipts and statements will reflect the new name starting with your next batch.',
      sheetAction: FLOW5_SHEET,
      suggestions: ["Pull up the case for Oak Street Coffee", "Show me merchants with decline rates above 15% last week"],
    },
  ],

  "Yes, update my DBA name": [
    { role: "user", content: "Yes, update my DBA name" },
    { role: "assistant", content: "What would you like the new DBA name to be?" },
    { role: "user", content: "Walker Bistro" },
    { role: "assistant", content: 'To confirm — updating DBA from "Walker\'s Books" to "Walker Bistro". Correct?' },
    { role: "user", content: "Yes." },
    {
      role: "assistant",
      content: 'Done — DBA name updated to "Walker Bistro". Receipts will reflect this starting with your next batch.',
      sheetAction: FLOW5_SHEET,
      suggestions: ["Pull up the case for Oak Street Coffee", "Show me merchants with decline rates above 15% last week"],
    },
  ],

  // ── Flow 7: Case Management ───────────────────────────────────────────────
  "Pull up the case for Oak Street Coffee": [
    { role: "user", content: "Pull up the case for Oak Street Coffee" },
    {
      role: "assistant",
      content:
        "Reopening Case #CS-8821 — chargeback dispute for a $284.50 transaction on May 14. Last activity: you uploaded the signed receipt yesterday. The merchant called this morning — call notes are linked.",
      openPanel: "case",
    },
    { role: "user", content: "Show me the transaction and the receipt side by side" },
    {
      role: "assistant",
      content: "Transaction detail on the left, uploaded receipt on the right. Signature looks consistent with the cardholder's prior transactions — I checked the last six.",
      openPanel: "transaction-receipt",
    },
    { role: "user", content: "Draft a response to the chargeback citing the signed receipt and the customer's prior history" },
    {
      role: "assistant",
      content: "Draft ready. References the receipt, the six prior signed transactions, and the no-refund policy printed on the receipt itself. Review and submit?",
      openPanel: "dispute-draft",
    },
    { role: "user", content: "Submit" },
    {
      role: "assistant",
      content: "Submitted to the processor. Case status updated to Dispute Filed. Next deadline: processor response due May 28.",
      suggestions: ["Show me everything unusual about Bayside Imports in the last 90 days", "Show me my work queue"],
    },
  ],

  // ── Flow 8: Bulk Action ───────────────────────────────────────────────────
  "Show me merchants with decline rates above 15% last week": [
    { role: "user", content: "Show me merchants with decline rates above 15% last week" },
    { role: "assistant", content: "Found 38 merchants across 7 ISOs sorted by decline rate. Panel open — you can sort by column.", openPanel: "decline-report", suggestions: [CONCEPT_FLOW8_FOLLOWUP] },
  ],
  [CONCEPT_FLOW8_FOLLOWUP]: [
    { role: "user", content: CONCEPT_FLOW8_FOLLOWUP },
    { role: "assistant", content: "Filtered to 22 merchants — all with no contact in the last 30 days.", filterDeclineReport: true, suggestions: ["Draft an outreach email for all of them"] },
  ],
  "Draft an outreach email for all of them": [
    { role: "user", content: "Draft an outreach email for all of them" },
    {
      role: "assistant",
      content: "Drafted. Each email pulls the merchant's name, decline rate, and routes replies to their ISO. Review the template in the panel.",
      openPanel: "email-draft",
      suggestions: [CONCEPT_FLOW8_FINAL],
    },
  ],
  [CONCEPT_FLOW8_FINAL]: [
    { role: "user", content: CONCEPT_FLOW8_FINAL },
    {
      role: "assistant",
      content: "Sent to 22 merchants. Routed to their respective ISOs based on account assignments.",
      suggestions: ["Show me everything unusual about Bayside Imports in the last 90 days", "Show me my work queue"],
    },
  ],

  // ── Flow 10: Risk Investigation ───────────────────────────────────────────
  "Show me everything unusual about Bayside Imports in the last 90 days": [
    { role: "user", content: "Show me everything unusual about Bayside Imports in the last 90 days" },
    {
      role: "assistant",
      content:
        "Six flags worth a look:\n- Transaction volume up 340% in last 30 days\n- Average ticket size doubled\n- 23% of transactions are CNP from new BINs\n- Three chargebacks filed this week (prior 90: zero)\n- Settlement account changed 18 days ago\n- Business address updated 12 days ago\n\nPull the underlying data for any of these?",
      openPanel: "risk-flags",
      suggestions: [CONCEPT_FLOW10_FOLLOWUP],
    },
  ],
  [CONCEPT_FLOW10_FOLLOWUP]: [
    { role: "user", content: CONCEPT_FLOW10_FOLLOWUP },
    {
      role: "assistant",
      content: "Volume chart on the left, account change history on the right with old and new account details.",
      openPanel: "volume-settlement",
      suggestions: [CONCEPT_FLOW10_FOLLOWUP2],
    },
  ],
  [CONCEPT_FLOW10_FOLLOWUP2]: [
    { role: "user", content: CONCEPT_FLOW10_FOLLOWUP2 },
    {
      role: "assistant",
      content: "Three users — two from the assigned ISO, one from your team last month. Want me to flag the case for senior review?",
      openPanel: "change-log",
      suggestions: ["Yes, and put a temporary funding hold on the account"],
    },
  ],
  "Yes, and put a temporary funding hold on the account": [
    { role: "user", content: "Yes, and put a temporary funding hold on the account" },
    {
      role: "assistant",
      content: "Hold placed, case escalated to Risk Lead, merchant and ISO notified. Funding hold active as of 2:47pm. Audit entry logged.",
      suggestions: ["Show me my work queue", CONCEPT_FLOW12_PROMPT],
    },
  ],

  // ── Flow 11: Work Queue ───────────────────────────────────────────────────
  "Show me my work queue": [
    {
      role: "assistant",
      content: "Here's where your queue stands today — **47 open cases**, and I've already gone through them. A few need your attention soon:",
      widget: "ai-triage-summary",
      suggestions: [CONCEPT_FLOW11_QUICKWINS],
    },
  ],
  [CONCEPT_FLOW11_QUICKWINS]: [
    { role: "user", content: CONCEPT_FLOW11_QUICKWINS },
    {
      role: "assistant",
      content:
        "Filtered to 12 document-approval cases. All need your sign-off — the merchant submitted the doc, I've flagged anything that looks off. Review them one at a time or batch-approve after a quick scan?",
      panel: "work-queue",
      suggestions: [CONCEPT_FLOW11_APPROVE],
    },
  ],
  [CONCEPT_FLOW11_APPROVE]: [
    { role: "user", content: CONCEPT_FLOW11_APPROVE },
    { role: "assistant", content: "Approved 11 cases. Case #SR-4412 left open — flagged for senior review.", suggestions: ["Now show me the Processor X cases"] },
  ],
  "Now show me the Processor X cases": [
    { role: "user", content: "Now show me the Processor X cases" },
    {
      role: "assistant",
      content:
        "8 cases grouped under one issue — Processor X posted an outage at 6:14am, ETA noon. Suggested action: send a templated update to all 8, mark as Waiting on Vendor, auto-close on resolution. Do that?",
      panel: "work-queue",
      view: "outage",
      suggestions: ["Yes, send the template and mark them"],
    },
  ],
  "Yes, send the template and mark them": [
    { role: "user", content: "Yes, send the template and mark them" },
    {
      role: "assistant",
      content: "Done — 8 merchants notified, cases marked Waiting on Vendor. Auto-close will trigger when Processor X confirms resolution.",
      suggestions: [CONCEPT_FLOW12_PROMPT, "Show me merchants with decline rates above 15% last week"],
    },
  ],

  // ── Flow 11 + 12: Detection Queue (step-driven) ───────────────────────────

  // Ask button (mode=concept-embed&flow=11) → greeting + triage widget
  [CONCEPT_DETECT_WELCOME_KEY]: [
    {
      role: "assistant",
      content: "Good morning, Teresa. A few things came in while you were away — I've gone through everything and sorted it for you. Here's where your queue stands:",
      widget: "ai-triage-summary",
      widgetDelay: 1500,
      pauseAfter: 2500,
    },
  ],

  // Widget "Detection Queue" button → DQ assignment (no preceding user message)
  [CONCEPT_FLOW12_CONTINUE_KEY]: [
    {
      role: "assistant",
      content: "Your Detection Queue has an active assignment: **High Velocity Watch**. 14 merchants triggered since yesterday — 3 with risk scores above 80.\n\nWant me to open the Barometer Report?",
      openPanel: "detection-queue",
      suggestions: [CONCEPT_DQ_OPEN_KEY],
    },
  ],

  // ConceptWelcomeView Flow 12 button → same DQ conversation, shows user message first
  [CONCEPT_FLOW12_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW12_PROMPT },
    {
      role: "assistant",
      content:
        "Morning. Your Detection Queue has an active assignment: **High Velocity Watch**. 14 merchants triggered since yesterday — 3 with risk scores above 80.\n\nWant me to open the Barometer Report?",
      openPanel: "detection-queue",
      suggestions: [CONCEPT_DQ_OPEN_KEY],
    },
  ],

  [CONCEPT_DQ_OPEN_KEY]: [
    { role: "user", content: CONCEPT_DQ_OPEN_KEY },
    {
      role: "assistant",
      content: "Opening Barometer Report for High Velocity Watch. 3 merchants are flagged above risk score 80. Coastal Merchant Solutions is the highest — score 89, triggered on 4 rules.",
      openPanel: "barometer-report",
      suggestions: [CONCEPT_DQ_COASTAL_KEY],
    },
  ],

  [CONCEPT_DQ_COASTAL_KEY]: [
    { role: "user", content: CONCEPT_DQ_COASTAL_KEY },
    {
      role: "assistant",
      content: "Score climbed from 44 to 89 in 52 days. Settlement account and address both changed within the last 10 days.",
      openPanel: "coastal-risk",
      suggestions: [CONCEPT_DQ_ESCALATE_KEY],
    },
  ],

  [CONCEPT_DQ_ESCALATE_KEY]: [
    { role: "user", content: CONCEPT_DQ_ESCALATE_KEY },
    {
      role: "assistant",
      content: "Done — case opened for Coastal Merchant Solutions (Case #RR-7291). Escalated to Risk Lead. Merchant and ISO notified. Funding hold placed pending senior review.",
      closeAllPanels: true,
    },
  ],

  // ── Flow 6: Proactive ─────────────────────────────────────────────────────
  [CONCEPT_FLOW6_KEY]: [
    {
      role: "assistant",
      content: "Welcome back. Two things:\n- Your batch from yesterday hasn't settled yet — usually clears by 9am. Want me to check?\n- Your April statement is ready.",
      suggestions: ["Check the batch", "Show my statement"],
    },
    { role: "user", content: "Check the batch" },
    {
      role: "assistant",
      content:
        "Looking… Batch #4471 is held for review. One transaction over your single-ticket limit: $2,840 from a regular customer. I've opened the batch details in the panel. Want me to submit a review request?",
      openBatchPanel: true,
      suggestions: ["Yes, submit the review request", "Show me the transaction"],
    },
    { role: "user", content: "Yes, submit the review request" },
    {
      role: "assistant",
      content: "Review request submitted for Batch #4471. You'll hear back within 1 business day. The rest of the batch will settle on its normal schedule.",
      suggestions: ["Show me my work queue", CONCEPT_FLOW12_PROMPT],
    },
  ],

  // ── Flow 13: Deposit Tracker ──────────────────────────────────────────────
  [CONCEPT_FLOW13_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW13_PROMPT },
    {
      role: "assistant",
      content: "You have three batches pending. Friday and Saturday are in transit, expected in your account ending ••4432 tomorrow morning. Sunday's batch is on a temporary hold.",
      panel: "pending-deposits",
    },
    { role: "user", content: "Why's Sunday held?" },
    {
      role: "assistant",
      content:
        "A single $2,190 transaction triggered a routine review — larger than your typical ticket. No action needed on your end. It usually clears within one business day, so expected Wednesday. I can notify you the moment it funds.",
      panel: "flagged-transaction",
    },
    { role: "user", content: "Yes, do that" },
    {
      role: "assistant",
      content: "Done. You'll get a notification when Sunday's batch funds. Friday and Saturday total $4,860, landing tomorrow.",
      panel: "flagged-transaction",
      view: "notified",
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],

  // ── Flow 14: Fee Change Explainer ─────────────────────────────────────────
  [CONCEPT_FLOW14_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW14_PROMPT },
    {
      role: "assistant",
      content: "They rose $117 versus April. Almost all of it is one driver: your volume was up 18%, so per-transaction fees scaled with it. Your rate barely moved.",
      panel: "fee-summary",
    },
    { role: "user", content: "so it's just because I sold more?" },
    {
      role: "assistant",
      content:
        "Correct. Your effective rate held roughly steady — 2.67% to 2.71%. You paid more in total mostly because you processed more. The one exception is a $15 chargeback fee from a single dispute on May 3, which is what nudged the rate up slightly.",
      panel: "fee-summary",
      view: "highlighted",
    },
    { role: "user", content: "ok that makes sense. show me that chargeback" },
    {
      role: "assistant",
      content: "Here it is. It is already resolved in your favor, so the $15 will be credited back on next month's statement.",
      panel: "chargeback-status",
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],

  // ── Flow 15: Sales Snapshot ────────────────────────────────────────────────
  [CONCEPT_FLOW15_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW15_PROMPT },
    {
      role: "assistant",
      content:
        "Up 15% vs last week — you brought in $18,240 against $15,900, driven almost entirely by Saturday. You ran 96 transactions that day versus a weekday average of 60, while your average ticket held steady around $29–43. This was a busier week, not bigger baskets. Tuesday was your softest day at $1,980.",
      panel: "sales-snapshot",
    },
    { role: "user", content: "What drove Saturday?" },
    {
      role: "assistant",
      content:
        "Saturday was your best day this week at $4,110. Both traffic and basket size were up — you ran 96 transactions versus a weekday average of 78, and your average ticket rose to $42.81 versus a weekday average of $29.43.",
      panel: "sales-drilldown",
      suggestions: [CONCEPT_FLOW15_FOLLOWUP],
    },
  ],
  [CONCEPT_FLOW15_FOLLOWUP]: [
    { role: "user", content: CONCEPT_FLOW15_FOLLOWUP },
    {
      role: "assistant",
      content: "Tuesday, at $1,980. Weather was rough that day if that tracks with what you saw in-store.",
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],

  // ── Flow 16: Account Change (Guardrail Write, chunked) ────────────────────
  // Steps 1→2→3 are advanced by direct panel button pushes (submitAccountChangeDetails /
  // confirmAccountChange in AskNanciContext), not scripted turns — see AccountChangePanel.tsx.
  [CONCEPT_FLOW16_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW16_PROMPT },
    {
      role: "assistant",
      content: "I can update that. Current account ends 4432. Enter the new routing and account number and I will validate them before anything changes.",
      openDynamicPanel: "account-change",
    },
  ],

  // ── Flow 9: Escalation ─────────────────────────────────────────────────────
  [CONCEPT_FLOW9_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW9_PROMPT },
    {
      role: "assistant",
      content:
        "That is worth a person's eyes, and I do not want to guess on missing money. Here is what I have gathered so you do not have to repeat it: expected payout $3,400, received $2,800, for the batch dated May 12.",
      panel: "escalation",
    },
    { role: "user", content: "yeah exactly" },
    {
      role: "assistant",
      content:
        "I can get you to the settlement team two ways. Book a call, next slot is today at 4:30, or file a ticket now and they reach you within 4 business hours. Both carry the batch details I just pulled.",
      panel: "escalation",
      view: "paths",
    },
    { role: "user", content: "book the 4:30" },
    {
      role: "assistant",
      content: "Booked for 4:30 today. Reference SR-2205. The team will have the batch discrepancy in front of them, so you can pick up where we left off.",
      panel: "escalation",
      view: "booked",
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],

  // ── Menu Margin Truth (Merchant, Read-Only) ───────────────────────────────
  [CONCEPT_MENU_MARGIN_PROMPT]: [
    { role: "user", content: CONCEPT_MENU_MARGIN_PROMPT },
    { role: "assistant", content: "It is your volume leader. 840 sold, $7,140 in sales. It is the sandwich the shop runs on.", panel: "menu-performance" },
    { role: "user", content: "figured. that's our star" },
    {
      role: "assistant",
      content:
        "By volume, yes. By margin per sandwich, it ranks fourth. Its ingredient cost runs high, mostly the imported meats, so each one nets about $2.90. The chicken pesto nets $4.60 on far fewer sales.",
      panel: "menu-performance",
      view: "margin",
    },
    { role: "user", content: "wait, the pesto makes more per sandwich than the combo?" },
    {
      role: "assistant",
      content:
        "Yes. Here is every sandwich ranked two ways, volume on the left, profit-per-sandwich on the right. The two lists do not match. Your highest-margin items sit in the middle of your sales, and your top seller sits near the bottom on margin.",
      panel: "menu-performance",
      view: "compare",
    },
    { role: "user", content: "why's the combo's cost so high" },
    {
      role: "assistant",
      content:
        "Three imported meats carry it. Prosciutto and mortadella together are 60% of the ingredient cost. The provolone and bread are minor. Nothing here is wrong, it is just an expensive sandwich to build.",
      panel: "menu-cost-detail",
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],
};
