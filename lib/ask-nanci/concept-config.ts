import type { ConceptScriptedTurn, SheetActionData } from "./types"

export const CONCEPT_FLOW2_PROMPT = "Show me merchant volume for this week"
export const CONCEPT_FLOW2_FOLLOWUP = "Just the top 5"
export const CONCEPT_FLOW6_KEY = "__proactive__"
export const CONCEPT_WELCOME_KEY = "__welcome__"
export const CONCEPT_DETECT_WELCOME_KEY = "__detect_welcome__"
export const CONCEPT_DETECT_DQ_KEY = "__detect_dq__"

export const CONCEPT_FLOW8_FOLLOWUP = "Filter to ones not contacted in the last 30 days"
export const CONCEPT_FLOW8_FINAL = "Send them all"
export const CONCEPT_FLOW10_FOLLOWUP = "Open the volume trend and the settlement change side by side"
export const CONCEPT_FLOW10_FOLLOWUP2 = "Who else has approved account changes for this merchant historically?"
export const CONCEPT_FLOW11_QUICKWINS = "Start with the quick wins"
export const CONCEPT_FLOW11_APPROVE = "Approve all except the third one"

export const CONCEPT_FLOW12_PROMPT = "Show me the detection queue"
export const CONCEPT_FLOW12_CONTINUE_KEY = "__dq_continue__"

export const CONCEPT_ALL_PROMPTS = [
  "Update my phone number",
  CONCEPT_FLOW2_PROMPT,
  "Change my deposit bank account",
  "I need to change my deposit account to a new bank",
  "Change my MID to a new one",
  "Pull up the case for Oak Street Coffee",
  "Show me merchants with decline rates above 15% last week",
  "Show me everything unusual about Bayside Imports in the last 90 days",
  "Show me my work queue",
  CONCEPT_FLOW12_PROMPT,
]

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
  CONCEPT_FLOW12_CONTINUE_KEY,
  CONCEPT_DETECT_DQ_KEY,
])

const FLOW1_SHEET: SheetActionData = {
  field: "Phone Number",
  fromValue: "(512) 334-7821",
  toValue: "(415) 867-5309",
  timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
  status: "completed",
}

const FLOW5_SHEET: SheetActionData = {
  field: "DBA Name",
  fromValue: "Walker's Books",
  toValue: "Walker Bistro",
  timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
  status: "completed",
}

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
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],

  // ── Flow 2: Data Lookup ───────────────────────────────────────────────────
  [CONCEPT_FLOW2_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW2_PROMPT },
    { role: "assistant", content: "Here's your merchant volume for the week of May 15–21. I've opened the full breakdown in the panel — you can sort by any column." },
  ],
  [CONCEPT_FLOW2_FOLLOWUP]: [
    { role: "user", content: CONCEPT_FLOW2_FOLLOWUP },
    { role: "assistant", content: "Got it — filtered to your top 5 by volume.", suggestions: CONCEPT_ALL_PROMPTS },
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
    { role: "assistant", content: "Your current DBA name on file is \"Walker's Books\". What would you like to change it to?" },
    { role: "user", content: "Walker Bistro" },
    { role: "assistant", content: "To confirm — updating your DBA name from \"Walker's Books\" to \"Walker Bistro\". This is what appears on receipts and cardholder statements. Correct?" },
    { role: "user", content: "Yes, go ahead." },
    {
      role: "assistant",
      content: "Done — DBA name updated to \"Walker Bistro\". Receipts and statements will reflect the new name starting with your next batch.",
      sheetAction: FLOW5_SHEET,
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],

  "Yes, update my DBA name": [
    { role: "user", content: "Yes, update my DBA name" },
    { role: "assistant", content: "What would you like the new DBA name to be?" },
    { role: "user", content: "Walker Bistro" },
    { role: "assistant", content: "To confirm — updating DBA from \"Walker's Books\" to \"Walker Bistro\". Correct?" },
    { role: "user", content: "Yes." },
    {
      role: "assistant",
      content: "Done — DBA name updated to \"Walker Bistro\". Receipts will reflect this starting with your next batch.",
      sheetAction: FLOW5_SHEET,
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],

  // ── Flow 7: Case Management ───────────────────────────────────────────────
  "Pull up the case for Oak Street Coffee": [
    { role: "user", content: "Pull up the case for Oak Street Coffee" },
    { role: "assistant", content: "Reopening Case #CS-8821 — chargeback dispute for a $284.50 transaction on May 14. Last activity: you uploaded the signed receipt yesterday. The merchant called this morning — call notes are linked.", openPanel: "case" },
    { role: "user", content: "Show me the transaction and the receipt side by side" },
    { role: "assistant", content: "Transaction detail on the left, uploaded receipt on the right. Signature looks consistent with the cardholder's prior transactions — I checked the last six.", openPanel: "transaction-receipt" },
    { role: "user", content: "Draft a response to the chargeback citing the signed receipt and the customer's prior history" },
    { role: "assistant", content: "Draft ready. References the receipt, the six prior signed transactions, and the no-refund policy printed on the receipt itself. Review and submit?", openPanel: "dispute-draft" },
    { role: "user", content: "Submit" },
    { role: "assistant", content: "Submitted to the processor. Case status updated to Dispute Filed. Next deadline: processor response due May 28.", suggestions: CONCEPT_ALL_PROMPTS },
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
    { role: "assistant", content: "Drafted. Each email pulls the merchant's name, decline rate, and routes replies to their ISO. Review the template in the panel.", openPanel: "email-draft", suggestions: [CONCEPT_FLOW8_FINAL] },
  ],
  [CONCEPT_FLOW8_FINAL]: [
    { role: "user", content: CONCEPT_FLOW8_FINAL },
    { role: "assistant", content: "Sent to 22 merchants. Routed to their respective ISOs based on account assignments.", suggestions: CONCEPT_ALL_PROMPTS },
  ],

  // ── Flow 10: Risk Investigation ───────────────────────────────────────────
  "Show me everything unusual about Bayside Imports in the last 90 days": [
    { role: "user", content: "Show me everything unusual about Bayside Imports in the last 90 days" },
    { role: "assistant", content: "Six flags worth a look:\n- Transaction volume up 340% in last 30 days\n- Average ticket size doubled\n- 23% of transactions are CNP from new BINs\n- Three chargebacks filed this week (prior 90: zero)\n- Settlement account changed 18 days ago\n- Business address updated 12 days ago\n\nPull the underlying data for any of these?", openPanel: "risk-flags", suggestions: [CONCEPT_FLOW10_FOLLOWUP] },
  ],
  [CONCEPT_FLOW10_FOLLOWUP]: [
    { role: "user", content: CONCEPT_FLOW10_FOLLOWUP },
    { role: "assistant", content: "Volume chart on the left, account change history on the right with old and new account details.", openPanel: "volume-settlement", suggestions: [CONCEPT_FLOW10_FOLLOWUP2] },
  ],
  [CONCEPT_FLOW10_FOLLOWUP2]: [
    { role: "user", content: CONCEPT_FLOW10_FOLLOWUP2 },
    { role: "assistant", content: "Three users — two from the assigned ISO, one from your team last month. Want me to flag the case for senior review?", openPanel: "change-log", suggestions: ["Yes, and put a temporary funding hold on the account"] },
  ],
  "Yes, and put a temporary funding hold on the account": [
    { role: "user", content: "Yes, and put a temporary funding hold on the account" },
    { role: "assistant", content: "Hold placed, case escalated to Risk Lead, merchant and ISO notified. Funding hold active as of 2:47pm. Audit entry logged.", suggestions: CONCEPT_ALL_PROMPTS },
  ],

  // ── Flow 11: Work Queue ───────────────────────────────────────────────────
  "Show me my work queue": [
    { role: "assistant", content: "Here's where your queue stands today — **47 open cases**, and I've already gone through them. A few need your attention soon:", widget: "ai-triage-summary", suggestions: [CONCEPT_FLOW11_QUICKWINS] },
  ],
  [CONCEPT_FLOW11_QUICKWINS]: [
    { role: "user", content: CONCEPT_FLOW11_QUICKWINS },
    { role: "assistant", content: "Filtered to 12 document-approval cases. All need your sign-off — the merchant submitted the doc, I've flagged anything that looks off. Review them one at a time or batch-approve after a quick scan?", advanceWorkQueue: "quick-wins", suggestions: [CONCEPT_FLOW11_APPROVE] },
  ],
  [CONCEPT_FLOW11_APPROVE]: [
    { role: "user", content: CONCEPT_FLOW11_APPROVE },
    { role: "assistant", content: "Approved 11 cases. Case #SR-4412 left open — flagged for senior review.", suggestions: ["Now show me the Processor X cases"] },
  ],
  "Now show me the Processor X cases": [
    { role: "user", content: "Now show me the Processor X cases" },
    { role: "assistant", content: "8 cases grouped under one issue — Processor X posted an outage at 6:14am, ETA noon. Suggested action: send a templated update to all 8, mark as Waiting on Vendor, auto-close on resolution. Do that?", advanceWorkQueue: "outage", suggestions: ["Yes, send the template and mark them"] },
  ],
  "Yes, send the template and mark them": [
    { role: "user", content: "Yes, send the template and mark them" },
    { role: "assistant", content: "Done — 8 merchants notified, cases marked Waiting on Vendor. Auto-close will trigger when Processor X confirms resolution.", suggestions: CONCEPT_ALL_PROMPTS },
  ],

  // ── Flow 12: Detection Queue (standalone / detect embed) ─────────────────
  [CONCEPT_FLOW12_PROMPT]: [
    { role: "user", content: CONCEPT_FLOW12_PROMPT },
    {
      role: "assistant",
      content: "Morning. Your Detection Queue has an active assignment: **High Velocity Watch**. 14 merchants triggered since yesterday — 3 with risk scores above 80.\n\nWant me to open the Barometer Report?",
      openPanel: "detection-queue",
      suggestions: ["Yes, open it"],
    },
    { role: "user", content: "Yes, open it" },
    {
      role: "assistant",
      content: "Opening Barometer Report for High Velocity Watch. 3 merchants are flagged above risk score 80. Coastal Merchant Solutions is the highest — score 89, triggered on 4 rules.",
      openPanel: "barometer-report",
      suggestions: ["Pull up Coastal's risk report alongside"],
    },
    { role: "user", content: "Pull up Coastal's risk report alongside" },
    {
      role: "assistant",
      content: "Score climbed from 44 to 89 in 52 days. Settlement account and address both changed within the last 10 days.",
      openPanel: "coastal-risk",
      suggestions: ["Escalate this one and open a risk case."],
    },
    { role: "user", content: "Escalate this one and open a risk case." },
    {
      role: "assistant",
      content: "Done — case opened for Coastal Merchant Solutions (Case #RR-7291). Escalated to Risk Lead. Merchant and ISO notified. Funding hold placed pending senior review.",
      closeAllPanels: true,
      loopToPrompt: CONCEPT_WELCOME_KEY,
    },
  ],

  // ── Flow 12: Detection Queue (continued from Work Queue) ──────────────────
  [CONCEPT_FLOW12_CONTINUE_KEY]: [
    {
      role: "assistant",
      content: "Your Detection Queue has an active assignment: **High Velocity Watch**. 14 merchants triggered since yesterday — 3 with risk scores above 80.\n\nWant me to open the Barometer Report?",
      openPanel: "detection-queue",
      suggestions: ["Yes, open it"],
    },
    { role: "user", content: "Yes, open it" },
    {
      role: "assistant",
      content: "Opening Barometer Report for High Velocity Watch. 3 merchants are flagged above risk score 80. Coastal Merchant Solutions is the highest — score 89, triggered on 4 rules.",
      openPanel: "barometer-report",
      suggestions: ["Pull up Coastal's risk report alongside"],
    },
    { role: "user", content: "Pull up Coastal's risk report alongside" },
    {
      role: "assistant",
      content: "Score climbed from 44 to 89 in 52 days. Settlement account and address both changed within the last 10 days.",
      openPanel: "coastal-risk",
      suggestions: ["Escalate this one and open a risk case."],
    },
    { role: "user", content: "Escalate this one and open a risk case." },
    {
      role: "assistant",
      content: "Done — case opened for Coastal Merchant Solutions (Case #RR-7291). Escalated to Risk Lead. Merchant and ISO notified. Funding hold placed pending senior review.",
      closeAllPanels: true,
    },
  ],

  // ── Welcome: Greeting with AI Triage Summary ─────────────────────────────
  [CONCEPT_WELCOME_KEY]: [
    {
      role: "assistant",
      content: "Good morning, Teresa. A few things came in while you were away — I've gone through everything and sorted it for you. Here's where your queue stands:",
      widget: "ai-triage-summary",
    },
  ],

  // ── Detect embed: looping welcome → DQ → back ────────────────────────────
  [CONCEPT_DETECT_WELCOME_KEY]: [
    {
      role: "assistant",
      content: "Good morning, Teresa. A few things came in while you were away — I've gone through everything and sorted it for you. Here's where your queue stands:",
      widget: "ai-triage-summary",
      loopToPrompt: CONCEPT_DETECT_DQ_KEY,
    },
  ],
  [CONCEPT_DETECT_DQ_KEY]: [
    {
      role: "assistant",
      content: "Your Detection Queue has an active assignment: **High Velocity Watch**. 14 merchants triggered since yesterday — 3 with risk scores above 80.\n\nWant me to open the Barometer Report?",
      openPanel: "detection-queue",
      suggestions: ["Yes, open it"],
    },
    { role: "user", content: "Yes, open it" },
    {
      role: "assistant",
      content: "Opening Barometer Report for High Velocity Watch. 3 merchants are flagged above risk score 80. Coastal Merchant Solutions is the highest — score 89, triggered on 4 rules.",
      openPanel: "barometer-report",
      suggestions: ["Pull up Coastal's risk report alongside"],
    },
    { role: "user", content: "Pull up Coastal's risk report alongside" },
    {
      role: "assistant",
      content: "Score climbed from 44 to 89 in 52 days. Settlement account and address both changed within the last 10 days.",
      openPanel: "coastal-risk",
      suggestions: ["Escalate this one and open a risk case."],
    },
    { role: "user", content: "Escalate this one and open a risk case." },
    {
      role: "assistant",
      content: "Done — case opened for Coastal Merchant Solutions (Case #RR-7291). Escalated to Risk Lead. Merchant and ISO notified. Funding hold placed pending senior review.",
      closeAllPanels: true,
      loopToPrompt: CONCEPT_DETECT_WELCOME_KEY,
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
      content: "Looking… Batch #4471 is held for review. One transaction over your single-ticket limit: $2,840 from a regular customer. I've opened the batch details in the panel. Want me to submit a review request?",
      openBatchPanel: true,
      suggestions: ["Yes, submit the review request", "Show me the transaction"],
    },
    { role: "user", content: "Yes, submit the review request" },
    {
      role: "assistant",
      content: "Review request submitted for Batch #4471. You'll hear back within 1 business day. The rest of the batch will settle on its normal schedule.",
      suggestions: CONCEPT_ALL_PROMPTS,
    },
  ],
}

export interface MerchantVolumeRow {
  rank: number
  merchant: string
  volume: number
  txnCount: number
  avgTicket: number
}

export const MERCHANT_VOLUME_DATA: MerchantVolumeRow[] = [
  { rank: 1,  merchant: "Harbor View Hotel",     volume: 3241880, txnCount: 14312, avgTicket: 226.50 },
  { rank: 2,  merchant: "Summit Auto Group",      volume: 2918440, txnCount:  1047, avgTicket: 2787.00 },
  { rank: 3,  merchant: "Coastal Fresh Market",   volume: 2104320, txnCount: 41208, avgTicket:  51.06 },
  { rank: 4,  merchant: "Pinnacle Dental Group",  volume: 1876200, txnCount:  3881, avgTicket: 483.40 },
  { rank: 5,  merchant: "Pacific Rim Restaurant", volume: 1203440, txnCount: 19872, avgTicket:  60.56 },
  { rank: 6,  merchant: "Riviera Day Spa Chain",  volume: 1188100, txnCount: 10341, avgTicket: 114.90 },
  { rank: 7,  merchant: "Blue Oak Brewing Co.",   volume: 1044780, txnCount: 22104, avgTicket:  47.26 },
  { rank: 8,  merchant: "Greenfield Hardware",    volume:  887330, txnCount:  9812, avgTicket:  90.43 },
  { rank: 9,  merchant: "Westside CrossFit",      volume:  701240, txnCount:  5440, avgTicket: 128.90 },
  { rank: 10, merchant: "Canyon Road Bakery",     volume:  618770, txnCount: 24908, avgTicket:  24.84 },
]
