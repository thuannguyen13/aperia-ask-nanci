// Scripted conversation flows for the concept demo (?mode=concept and ?mode=detect).
// All flow-key constants and the conversations record live here.
// concept-config.ts re-exports everything so existing imports don't change.

import type { ConceptScriptedTurn, SheetActionData } from "../types";
import { RISK_LANDING_CONVERSATIONS } from "./risk-conversations";

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
export const CONCEPT_FLOW15_PROMPT = "how'd this week go vs last week?";
export const CONCEPT_FLOW15_FOLLOWUP = "nice. was there a slow day?";
export const CONCEPT_FLOW16_PROMPT = "I changed banks, send my deposits to the new account";
export const CONCEPT_FLOW9_PROMPT = "none of this is right, my payout is short by like 600 bucks and I don't get why";
export const CONCEPT_MENU_MARGIN_PROMPT = "how's the Italian combo doing this month?";
export const CONCEPT_ADDRESS_PROMPT = "Change my business address";
export const CONCEPT_CREDIT_CARD_PROMPT = "Who am I paying the most on food cost?";
export const CONCEPT_BUSINESS_LOAN_PROMPT = "Do I have enough money for payroll?";
// Both offer flows share the same accept/decline pills (matched per-active-flow, so
// reuse is safe). "No, ignore for now" is decorative — registered as a fake follow-up.
export const CONCEPT_OFFER_YES = "Yes, show me";
export const CONCEPT_OFFER_NO = "No, ignore for now";

// Destination card id — an internal key, never sent as a prompt (see FlowDef.destination).
export const CONCEPT_MARKETPLACE_KEY = "__marketplace__";

// Declining an offer isn't a dead end: the flow that made the offer gets the last
// word, restating the problem that is still there. Keyed by flow prompt because both
// offer flows share the same "No, ignore for now" pill. A flow with no entry here
// keeps the old no-op behavior (see CONCEPT_FAKE_FOLLOWUPS).
export const CONCEPT_DECLINE_REPLIES: Record<string, string> = {
  [CONCEPT_CREDIT_CARD_PROMPT]:
    "Got it. If you want to look later, just ask me for offers or say \"what could I be earning on Sysco?\" and I'll pull it back up.",
  [CONCEPT_BUSINESS_LOAN_PROMPT]:
    "Understood. Just so you're not caught out: you're still projected $4,230 short Friday. If something changes or you want to see options, ask me for financing anytime.",
};

// Curated conversation titles (chat-column header + sidebar item). Figma shows a
// summarized title, not the raw first prompt. Keyed by the flow's opening prompt;
// add entries here as each flow's Figma frame specifies a title.
export const CONCEPT_CHAT_TITLES: Record<string, string> = {
  [CONCEPT_CREDIT_CARD_PROMPT]: "Top Food Cost Vendor",
  [CONCEPT_BUSINESS_LOAN_PROMPT]: "Payroll Funds Check",
};

// Fake end-of-flow follow-up questions — shown for realism only, with no scripted
// conversation behind them. Clicking one is a no-op (see CONCEPT_FAKE_FOLLOWUPS).
export const CONCEPT_FLOW5_FOLLOWUPS = ["Show yesterday's summary", "Break down my spending", "Check payroll affordability"];

export const CONCEPT_FLOW13_FOLLOWUPS = ["Investigate payout discrepancy", "Compare this week vs last week", "Review this month's fee changes", "Update deposit bank account"];

export const CONCEPT_FLOW14_FOLLOWUPS = ["Investigate payout discrepancy", "Compare this week vs last week", "Check weekend deposit timing"];

export const CONCEPT_FLOW15_FOLLOWUPS_FAKE = ["Check weekend deposit timing", "Review this month's fee changes", "Investigate payout discrepancy"];

export const CONCEPT_FLOW16_FOLLOWUPS = ["Check weekend deposit timing", "Investigate payout discrepancy", "Update phone number", "Compare this week vs last week"];

export const CONCEPT_FLOW18_FOLLOWUPS = ["Compare this week vs last week", "Review this month's fee changes"];

export const CONCEPT_FLOW19_FOLLOWUPS = ["Update payment processor MID", "Update deposit bank account"];

// Every fake follow-up across flows — handlePrompt treats these as no-op decoration.
// Add each flow's follow-up array here as the treatment rolls out.
// Flow 6 (proactive auto-play): decorative "road not taken" pills on non-final turns.
// The flow auto-advances down its scripted branch, so these are never the real path —
// register them as fake so a click is a no-op instead of falling through to sendMessage.
const CONCEPT_FLOW6_FOLLOWUPS_FAKE = ["Show my statement", "Show me the transaction"];

export const CONCEPT_FAKE_FOLLOWUPS = new Set<string>([
  CONCEPT_OFFER_NO,
  ...CONCEPT_FLOW5_FOLLOWUPS,
  ...CONCEPT_FLOW6_FOLLOWUPS_FAKE,
  ...CONCEPT_FLOW13_FOLLOWUPS,
  ...CONCEPT_FLOW14_FOLLOWUPS,
  ...CONCEPT_FLOW15_FOLLOWUPS_FAKE,
  ...CONCEPT_FLOW16_FOLLOWUPS,
  ...CONCEPT_FLOW18_FOLLOWUPS,
  ...CONCEPT_FLOW19_FOLLOWUPS,
]);

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
  followups?: string[]; // continuation keys kept in-session (derive CONCEPT_NO_RESET_PROMPTS)
  keepSession?: boolean; // this flow's own key is reachable mid-session — don't reset on it
  manual?: boolean; // step one turn per pill click instead of auto-playing the script
  // A destination card opens a surface instead of playing a conversation. Its `key`
  // is an internal id, not a prompt, so it stays out of the trigger-prompt lists.
  destination?: "marketplace";
}

export const FLOW_DEFS: FlowDef[] = [
  // ── Interaction patterns ──
  { num: 1, section: "pattern", title: "Simple Update", badge: "Chat only", key: "Update my phone number", description: "Update a phone number — AI confirms and shows an audit record." },
  {
    num: 2,
    section: "pattern",
    title: "Data Lookup",
    badge: "Chat + panel",
    key: CONCEPT_FLOW2_PROMPT,
    slug: "2",
    followups: [CONCEPT_FLOW2_FOLLOWUP],
    description: "Merchant volume table opens in a side panel, sortable by column.",
  },
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
    keepSession: true,
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
    followups: [CONCEPT_FLOW8_FOLLOWUP, CONCEPT_FLOW8_FINAL, "Draft an outreach email for all of them"],
    description: "Analyst targets high-decline merchants — filtered table, email draft, and bulk send in chat.",
  },
  {
    num: 10,
    section: "pattern",
    title: "Risk Investigation",
    badge: "Risk · Multi-panel",
    key: "Show me everything unusual about Bayside Imports in the last 90 days",
    followups: [CONCEPT_FLOW10_FOLLOWUP, CONCEPT_FLOW10_FOLLOWUP2, "Yes, and put a temporary funding hold on the account"],
    description: "Risk analyst investigates a suspicious merchant — AI flags anomalies, panels open as evidence.",
  },
  {
    num: 11,
    section: "pattern",
    title: "Work Queue",
    badge: "ISO · Queue",
    key: "Show me my work queue",
    keepSession: true,
    followups: [CONCEPT_FLOW11_QUICKWINS, CONCEPT_FLOW11_APPROVE, "Now show me the Processor X cases", "Yes, send the template and mark them"],
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
    followups: [CONCEPT_FLOW12_CONTINUE_KEY, CONCEPT_DQ_OPEN_KEY, CONCEPT_DQ_COASTAL_KEY, CONCEPT_DQ_ESCALATE_KEY],
    description: "Risk analyst works a Detection Queue assignment — Barometer Report, risk profile, and case escalation open side by side.",
  },

  // ── Merchant money questions ──
  {
    num: 13,
    section: "merchant",
    title: "Deposit Tracker",
    badge: "Deposits",
    key: CONCEPT_FLOW13_PROMPT,
    slug: "13",
    description: "Pending batches with a held-transaction explainer — the AI reasons about why, not just a status label.",
  },
  {
    num: 14,
    section: "merchant",
    title: "Fee Change Explainer",
    badge: "Fees",
    key: CONCEPT_FLOW14_PROMPT,
    slug: "14",
    description: "Statement went up — AI attributes the delta to volume, then chains into the one real exception.",
  },
  {
    num: 15,
    section: "merchant",
    title: "Sales Snapshot",
    badge: "Sales",
    key: CONCEPT_FLOW15_PROMPT,
    slug: "15",
    followups: [CONCEPT_FLOW15_FOLLOWUP],
    description: "Week-over-week sales with an AI-authored driver line and a same-panel drill-in.",
  },
  {
    num: 16,
    section: "merchant",
    title: "Account Change",
    badge: "Secure Authorization",
    key: CONCEPT_FLOW16_PROMPT,
    slug: "16",
    description: "Bank account change submitted as a verified request, not applied directly — the guardrail-write reference pattern.",
  },
  {
    num: 19,
    section: "merchant",
    title: "Address Change",
    badge: "Account Maintenance",
    key: CONCEPT_ADDRESS_PROMPT,
    slug: "19",
    description: "A business address change, confirmed on an inline map — Nanci shows the current and new locations, then submits it as a request rather than editing your account directly.",
  },
  {
    num: 17,
    section: "merchant",
    title: "Escalation",
    badge: "Payouts",
    key: CONCEPT_FLOW9_PROMPT,
    slug: "9",
    description: "AI can't resolve a payout shortfall — hands off to a human with the batch context already attached, never a dead end.",
  },
  {
    num: 18,
    section: "merchant",
    title: "Menu Margin Truth",
    badge: "Inventory",
    key: CONCEPT_MENU_MARGIN_PROMPT,
    slug: "18",
    description: "Best-seller by volume isn't the best earner — Nanci joins sales and ingredient cost to rank the menu by profit, insight only she can surface.",
  },
  {
    num: 5,
    section: "merchant",
    title: "Error Recovery",
    badge: "Escalation",
    key: "Change my MID to a new one",
    slug: "5",
    followups: ["Update my DBA name"],
    description: "AI can't change a MID — diagnoses intent, offers alternatives via chips.",
  },
  {
    num: 20,
    section: "merchant",
    title: "Credit Card Offer",
    badge: "Financing",
    key: CONCEPT_CREDIT_CARD_PROMPT,
    slug: "20",
    description: "A vendor-spend spike leads into a ranked business-card list — tap any card to submit a pre-filled application, sent as a request rather than an instant approval.",
  },
  {
    num: 21,
    section: "merchant",
    title: "Business Loan Offer",
    badge: "Financing",
    key: CONCEPT_BUSINESS_LOAN_PROMPT,
    slug: "21",
    description: "A projected payroll shortfall leads into a ranked lender list — tap any option to submit a pre-filled application, handed off to the account services team for review.",
  },
  {
    num: 22,
    section: "merchant",
    title: "Service Marketplace",
    badge: "Destination",
    key: CONCEPT_MARKETPLACE_KEY,
    destination: "marketplace",
    description: "Add-ons and integrations that extend Ask Nanci — browse, search and enable services. A destination, not a conversation: the card opens it directly.",
  },
];

// Derived — do not hand-maintain; add to FLOW_DEFS above instead.
// ?mode=concept-embed&flow=<slug> → conversation key.
export const CONCEPT_FLOW_SLUGS: Record<string, string> = Object.fromEntries(
  FLOW_DEFS.flatMap((f) => [...(f.slug ? [[f.slug, f.key] as [string, string]] : []), ...(f.altEntries?.map((e) => [e.slug, e.key] as [string, string]) ?? [])]),
);

// Per-flow embed layout overrides (?mode=concept-embed&flow=<slug>). Default
// concept-embed is the sidebar-less compact chat widget; a flow listed here opts
// into the full app shell (sidebar + standard welcome page) instead. Extend per flow.
export interface ConceptEmbedLayout {
  fullApp: boolean; // render Sidebar + standard WelcomeView instead of the compact widget
  openMarketplace?: boolean; // auto-open the Service Marketplace panel on load
}
export const CONCEPT_EMBED_FLOW_LAYOUTS: Record<string, ConceptEmbedLayout> = {
  "22": { fullApp: true }, // Merchant Service Marketplace — panel opens from the sidebar banner
};

// Trigger prompts (routing guard + recycled as end-of-flow suggestion chips), in
// ascending card number. Proactive and destination flows have no prompt — excluded.
export const CONCEPT_ALL_PROMPTS = [...FLOW_DEFS]
  .filter((f) => !f.proactive && !f.destination)
  .sort((a, b) => a.num - b.num)
  .map((f) => f.key);

// Merchant-money group prompts, ascending. End-of-flow chips suggest sibling flows
// in the same group — otherMerchantPrompts(self) drops the flow that just finished.
export const CONCEPT_MERCHANT_PROMPTS = [...FLOW_DEFS]
  .filter((f) => f.section === "merchant" && !f.proactive && !f.destination)
  .sort((a, b) => a.num - b.num)
  .map((f) => f.key);

const otherMerchantPrompts = (self: string) => CONCEPT_MERCHANT_PROMPTS.filter((k) => k !== self);

// Derived — a prompt that continues an in-progress flow must not reset the session.
// Owned by each flow via `keepSession` (its own key) + `followups` (continuation keys).
export const CONCEPT_NO_RESET_PROMPTS = new Set<string>([...FLOW_DEFS.filter((f) => f.keepSession).map((f) => f.key), ...FLOW_DEFS.flatMap((f) => f.followups ?? [])]);

// Flows that step one turn per suggestion-pill click instead of auto-playing.
// Defaults to the Merchant Money section; a flow's `manual` prop overrides it.
// Includes each flow's followup/alt-entry keys so continuations step too.
export const CONCEPT_MANUAL_PROMPTS = new Set<string>(
  FLOW_DEFS.filter((f) => !f.destination && (f.manual ?? f.section === "merchant")).flatMap((f) => [f.key, ...(f.followups ?? []), ...(f.altEntries?.map((e) => e.key) ?? [])]),
);

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
  timestamp: "Today, 11:20 AM",
  status: "submitted",
  reference: "DBA-4416",
  sentTo: "Merchant Support team",
  iconKind: "name",
};

const FLOW19_SHEET: SheetActionData = {
  field: "Business Address",
  fromValue: "142 Oak Street, Austin, TX 78701",
  toValue: "456 Market St, San Francisco, CA 94105",
  timestamp: "Today, 2:14 PM",
  status: "submitted",
  reference: "AD-3307",
  sentTo: "Account Services team",
  iconKind: "address",
};

// ─── Scripted conversations ───────────────────────────────────────────────────

export const CONCEPT_SCRIPTED_CONVERSATIONS: Record<string, ConceptScriptedTurn[]> = {
  // Aperia Risk theme — landing quick-action / Nanci's-take chat answers.
  ...RISK_LANDING_CONVERSATIONS,
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
    { role: "assistant", content: "Your current deposit account on file: routing •••• 4892, account •••• 7823 (Checking).", panel: "bank-account-form" },
  ],

  // ── Flow 4: Step-up Auth ──────────────────────────────────────────────────
  "I need to change my deposit account to a new bank": [
    { role: "user", content: "I need to change my deposit account to a new bank" },
    {
      role: "assistant",
      content: "That's a financial change — I'll need to verify it's you first. Sending a 6-digit code to your phone ending in 0142. Enter it in the panel when you have it.",
      panel: "step-up-auth",
    },
    { role: "user", content: "Done" },
    {
      role: "assistant",
      content: "Verified. Enter your new bank account details in the panel — routing number, account number, and account type.",
      panel: "step-up-auth",
      view: "2",
    },
    { role: "user", content: "Submitted" },
    {
      role: "assistant",
      content: "Review your new account details in the panel and confirm when ready.",
      panel: "step-up-auth",
      view: "3",
    },
  ],

  // ── Flow 5: Error Recovery ────────────────────────────────────────────────
  "Change my MID to a new one": [
    { role: "user", content: "Update payment processor MID" },
    {
      role: "assistant",
      content:
        "I can't change the MID itself — that's assigned by the processor and requires a new application. But if the goal is a different business name on receipts, that's a DBA update I can do.",
      suggestions: ["Update my DBA name"],
    },
  ],

  "Update my DBA name": [
    { role: "user", content: "Update my DBA name" },
    { role: "assistant", content: 'Your current DBA name on file is "Walker\'s Books". What would you like to change it to?' },
    { role: "user", content: "Walker Bistro" },
    { role: "assistant", content: 'To confirm — submit a request to change your DBA name from "Walker\'s Books" to "Walker Bistro"? This is what appears on receipts and cardholder statements.' },
    { role: "user", content: "Yes, go ahead." },
    {
      role: "assistant",
      content:
        "Your DBA name change has been submitted for review — I can't update what appears on receipts directly, so this goes to the team that can. Once it's approved, \"Walker Bistro\" will show on receipts and statements, typically within 1–2 business days.",
      sheetAction: FLOW5_SHEET,
      suggestions: CONCEPT_FLOW5_FOLLOWUPS,
    },
  ],

  // ── Flow 7: Case Management ───────────────────────────────────────────────
  "Pull up the case for Oak Street Coffee": [
    { role: "user", content: "Pull up the case for Oak Street Coffee" },
    {
      role: "assistant",
      content:
        "Reopening Case #CS-8821 — chargeback dispute for a $284.50 transaction on May 14. Last activity: you uploaded the signed receipt yesterday. The merchant called this morning — call notes are linked.",
      panel: "case",
    },
    { role: "user", content: "Show me the transaction and the receipt side by side" },
    {
      role: "assistant",
      content: "Transaction detail on the left, uploaded receipt on the right. Signature looks consistent with the cardholder's prior transactions — I checked the last six.",
      panel: "transaction-receipt",
    },
    { role: "user", content: "Draft a response to the chargeback citing the signed receipt and the customer's prior history" },
    {
      role: "assistant",
      content: "Draft ready. References the receipt, the six prior signed transactions, and the no-refund policy printed on the receipt itself. Review and submit?",
      panel: "dispute-draft",
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
    { role: "assistant", content: "Found 38 merchants across 7 ISOs sorted by decline rate. Panel open — you can sort by column.", panel: "decline-report", suggestions: [CONCEPT_FLOW8_FOLLOWUP] },
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
      panel: "email-draft",
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
      panel: "risk-flags",
      suggestions: [CONCEPT_FLOW10_FOLLOWUP],
    },
  ],
  [CONCEPT_FLOW10_FOLLOWUP]: [
    { role: "user", content: CONCEPT_FLOW10_FOLLOWUP },
    {
      role: "assistant",
      content: "Volume chart on the left, account change history on the right with old and new account details.",
      panel: "volume-settlement",
      suggestions: [CONCEPT_FLOW10_FOLLOWUP2],
    },
  ],
  [CONCEPT_FLOW10_FOLLOWUP2]: [
    { role: "user", content: CONCEPT_FLOW10_FOLLOWUP2 },
    {
      role: "assistant",
      content: "Three users — two from the assigned ISO, one from your team last month. Want me to flag the case for senior review?",
      panel: "change-log",
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
      panel: "detection-queue",
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
      panel: "detection-queue",
      suggestions: [CONCEPT_DQ_OPEN_KEY],
    },
  ],

  [CONCEPT_DQ_OPEN_KEY]: [
    { role: "user", content: CONCEPT_DQ_OPEN_KEY },
    {
      role: "assistant",
      content: "Opening Barometer Report for High Velocity Watch. 3 merchants are flagged above risk score 80. Coastal Merchant Solutions is the highest — score 89, triggered on 4 rules.",
      panel: "barometer-report",
      closePanel: "detection-queue",
      suggestions: [CONCEPT_DQ_COASTAL_KEY],
    },
  ],

  [CONCEPT_DQ_COASTAL_KEY]: [
    { role: "user", content: CONCEPT_DQ_COASTAL_KEY },
    {
      role: "assistant",
      content: "Score climbed from 44 to 89 in 52 days. Settlement account and address both changed within the last 10 days.",
      panel: "coastal-risk",
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
      panel: "batch-detail",
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
      content:
        "You have $8,435 coming in total. Your $940 in cash deposits already posted. On the card side, three batches are pending: Friday and Saturday are in transit, expected in your account ending ••4432 tomorrow morning, and Sunday's batch is on a temporary hold.",
      panel: "pending-deposits",
    },
    { role: "user", content: "Why's Sunday held?" },
    {
      role: "assistant",
      content:
        "A single $2,190 transaction triggered a routine review — larger than your typical ticket. No action needed on your end. It usually clears within one business day, so expected Wednesday. I can notify you the moment it funds.",
      panel: "pending-deposits",
      view: "flagged",
    },
    { role: "user", content: "Yes, do that" },
    {
      role: "assistant",
      content: "Done. You'll get a notification when Sunday's batch funds. Friday and Saturday total $4,860, landing tomorrow.",
      panel: "pending-deposits",
      view: "notified",
      suggestions: CONCEPT_FLOW13_FOLLOWUPS,
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
      panel: "fee-summary",
      view: "chargeback",
      suggestions: CONCEPT_FLOW14_FOLLOWUPS,
    },
  ],

  // ── Flow 15: Sales Snapshot ────────────────────────────────────────────────
  [CONCEPT_FLOW15_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW15_PROMPT },
    {
      role: "assistant",
      content: "Up. $18,240 this week against $15,900 last week, a 15% lift. Saturday was your best day at $4,110.",
      panel: "sales-snapshot",
    },
    { role: "user", content: "what drove saturday?" },
    {
      role: "assistant",
      content: "Higher ticket count, not bigger tickets. You ran 96 transactions versus a weekday average of 60. Average ticket held steady around $43.",
      panel: "sales-drilldown",
      suggestions: [CONCEPT_FLOW15_FOLLOWUP],
    },
  ],
  [CONCEPT_FLOW15_FOLLOWUP]: [
    { role: "user", content: CONCEPT_FLOW15_FOLLOWUP },
    {
      role: "assistant",
      content: "Tuesday, at $1,980 — your slowest by a good margin. I can't tell why from the sales data alone; anything different in-store that day?",
      panel: "sales-snapshot",
      view: "slow",
      suggestions: CONCEPT_FLOW15_FOLLOWUPS_FAKE,
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
      panel: "account-change",
    },
  ],

  // ── Address Change (chat + inline map) — ported from the persona embed flow ──
  [CONCEPT_ADDRESS_PROMPT]: [
    { role: "user", content: CONCEPT_ADDRESS_PROMPT },
    {
      role: "assistant",
      content: "Sure. Your current business address on file is:\n\n142 Oak Street, Austin, TX 78701\n\nWhat would you like to change it to? Please include street, city, state, and ZIP.",
      map: { address: "142 Oak Street, Austin, TX 78701", lat: 30.2645, lng: -97.743 },
    },
    { role: "user", content: "456 Market St, San Francisco, CA 94105" },
    {
      role: "assistant",
      content:
        "Got it — just to confirm, you'd like to update your business address from 142 Oak Street, Austin, TX 78701 to:\n\n456 Market St, San Francisco, CA 94105\n\nIs that correct?\n\n{{MAP}}",
      map: { address: "456 Market St, San Francisco, CA 94105", lat: 37.7915, lng: -122.3972 },
    },
    { role: "user", content: "Yes, that's correct." },
    {
      role: "assistant",
      content:
        "Your change request has been submitted for review — I can't update account details like your business address directly, so this goes to the team that can. Once it's approved, the change to 456 Market St, San Francisco, CA 94105 will be reflected on your account, typically within 1–2 business days. You'll get a confirmation email at your primary address.",
      sheetAction: FLOW19_SHEET,
      suggestions: CONCEPT_FLOW19_FOLLOWUPS,
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
      suggestions: otherMerchantPrompts(CONCEPT_FLOW9_PROMPT),
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
        "Three imported meats carry it. Prosciutto and mortadella together are 60% of the ingredient cost. The provolone and bread are minor. Nothing here is wrong, it is just an expensive sandwich to make.",
      panel: "menu-cost-detail",
      suggestions: CONCEPT_FLOW18_FOLLOWUPS,
    },
  ],

  // ── Flow 20: Credit Card Offer ────────────────────────────────────────────
  // A cost-spike answer nudges toward a card; "Yes" opens the ranked offer list.
  // The application form + pending-review success live in the panel (submitOfferApplication).
  [CONCEPT_CREDIT_CARD_PROMPT]: [
    { role: "user", content: CONCEPT_CREDIT_CARD_PROMPT },
    {
      role: "assistant",
      content:
        "Your largest food-cost vendor over the last 30 days is **Sysco Foodservice** — $18,420, about 34% of total food spend, up 6% from last month.\n\nYou're paying that by ACH, so it isn't earning anything back. A business card could help you manage this spend and return about $368/mo on Sysco alone.\n\nI've pre-filled an application from your connected accounts, you'd just confirm your credit limit. Want me to open it?",
      source: "Vendor Spend Breakdown",
      suggestions: [CONCEPT_OFFER_YES, CONCEPT_OFFER_NO],
    },
    // "Yes, show me" opens the panel directly — no assistant bubble (per Figma);
    // the panel's own NanciInsight carries the framing.
    { role: "user", content: CONCEPT_OFFER_YES, panel: "credit-card-offer" },
  ],

  // ── Flow 21: Business Loan Offer ──────────────────────────────────────────
  [CONCEPT_BUSINESS_LOAN_PROMPT]: [
    { role: "user", content: CONCEPT_BUSINESS_LOAN_PROMPT },
    {
      role: "assistant",
      content:
        "Looking at your current balance and upcoming payroll run, you're projected to be **$4,230 short** on Friday. Two open invoices ($6,800 total) aren't expected to land until early next week — after payroll is due.\n\nBased on your processing history, you're already qualified for an option that can help you manage this spend and close the gap. Want me to show you the terms?",
      source: "Cash Flow Forecast",
      suggestions: [CONCEPT_OFFER_YES, CONCEPT_OFFER_NO],
    },
    // "Yes, show me" opens the panel directly — no assistant bubble (per Figma).
    { role: "user", content: CONCEPT_OFFER_YES, panel: "business-loan-offer" },
  ],
};
