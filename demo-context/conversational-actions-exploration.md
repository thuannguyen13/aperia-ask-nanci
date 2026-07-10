# Conversational Actions: Exploration Brief

**Audience:** Internal design & product team
**Status:** Working draft — exploration phase
**Owner:** Danny Nguyen

---

## Context

Across our products, users complete simple tasks by navigating multi-step flows — Settings > Business Info > Edit > Save — or by calling their ISO to make changes on their behalf. The interaction model puts the burden on the user to know where things live and how the system is structured. There's a faster path.

## The Idea

A conversational layer that runs alongside — and over time, replaces — the traditional UI. Instead of navigating, a user says *"Update my business address to 142 Oak Street."* The AI confirms intent, executes the change, and confirms completion.

The real shift isn't "chat replaces UI." It's **intent replaces navigation.** The user expresses what they want, and the system assembles the right surface in response — chat for dialogue and confirmation, panels for density and interaction. The user never has to learn the product's information architecture.

## Example

On VisionWeb and AccessOne, merchants can view their information but can't change it themselves. Updating a business address or phone number requires a call to their ISO. It's a pattern across many of our products — and the clearest opportunity to start.

## What Makes This Hard

The chat is the interface. The real work is underneath:

- An **action registry** that defines what's callable, by whom, with what parameters
- A **permissions model** that knows what each user role can actually do
- A **rollback and audit layer** so every change is reviewable and reversible
- A **fallback path** to the traditional UI when the AI can't complete the task confidently

The UX patterns matter, but the architecture is what unlocks the model working across products.

## Goal

Define an interaction model and the underlying capability layer that lets us ship conversational actions across multiple products — starting with the highest-friction merchant self-service tasks, and scaling to the ISO and above-ISO operational interfaces.

---

# The Interaction Model

## Chat + Panels

**Chat** is the conversational thread — intent, confirmation, status, recall. Linear, ephemeral, and the user's primary input.

**Panels** are the work surface — tables, forms, dashboards, embedded views, generated reports. Addressable (the user can return to them), interactive (sortable, editable), dismissible.

The AI decides which surface fits the response.

## The Interaction Grammar

- **Chat-only response** — short factual answer, confirmation of an action, error message, clarifying question
- **Chat + panel** — AI explains in chat, opens a panel with the substance (*"Here's last quarter's volume by merchant"* + table panel)
- **Panel-only update** — user is already working in a panel, AI modifies it directly without verbose chat narration
- **Panel-as-form** — AI gathered enough intent to know what's needed, opens a panel with a pre-filled form for the user to review and submit
- **Panel-as-report** — one-time generated view, like Claude's HTML artifacts. Static-ish, shareable, exportable

Naming these and being consistent about when each fires is most of the design system right now.

## Open Design Questions

**Interaction design**
1. How do we signal when the AI is acting vs. answering — including pending, succeeded, and failed states?
2. What does a tiered confirmation pattern look like? Working assumption: instant (display prefs), confirm (contact info), step-up auth (financial/legal), out-of-band approval (anything needing a second party).
3. How do we handle multi-step intents? "Update my address" is one turn. "Onboard a new location" is twenty. When does the AI ask, assume, or hand off to a form?
4. How do errors recover gracefully in conversation, and when do we fall back to the traditional UI?

**System design**
5. Where does the audit trail live, and how do users review and reverse changes?
6. How do permissions map from existing roles to chat actions? An ISO admin and a merchant user have very different blast radii.
7. How do we handle identity for high-stakes actions — confirmation alone isn't enough for a bank account change.

**Panels specifically**
8. When do panels update in place vs. open new? Working rule: update in place for the same intent, new panel for a new intent.
9. Can users have multiple panels open at once? Required for ISO and above-ISO workflows.
10. How do chat and panels share state — what does the AI know about what the user is currently viewing or editing?
11. How do users return to past panels? History, pinning, search?
12. What's the mobile story? Panels become full-screen takeovers, which changes the feel significantly.

**Discovery and adoption**
13. How does the system proactively surface what's possible — *"Looks like you're trying to X, I can do that"* — rather than relying on users to discover capabilities?

## Success Metrics

What we'd want to measure in a pilot:

- Task completion time vs. traditional flow
- Reduction in inbound ISO requests for self-serviceable changes
- Containment rate (tasks completed in chat without UI fallback)
- User trust signals — confirmation rates, abandonment, return usage

---

# The Three Personas

The model serves three distinct user types, each with different cognitive loads and workflow shapes:

**1. Merchants** — Use the product occasionally. Want speed. Low complexity, high simplicity.

**2. ISO users** — Service agents, risk analysts, sales agents, case managers. Service dozens of merchants a day. Need density, parallelism, and AI doing real first-pass work.

**3. Above-ISO users** — Aperia service analysts and similar. Manage multiple ISOs. Work at portfolio scale — thousands of accounts. Need pattern recognition and bulk action with judgment in the loop.

The same chat + panel model serves all three, but the **panel layer scales harder than the chat layer.** Chat stays roughly constant. Panels go from single → parallel → bulk as you move up the persona ladder.

---

# Canonical Flows

Ten flows spanning all three personas, covering the range from simple updates to high-stakes actions and bulk operations.

---

## Flow 1: Simple Update (Merchant, Chat-only)

**Task:** Merchant updates their business phone number.

**Today:** Login → Settings → Business Info → Edit → Update Phone → Save → Confirmation toast. Five clicks, three screens.

**New flow:**

> **User:** Update my business phone to 214-555-0142
>
> **AI:** Got it — updating the business phone for *Oak Street Coffee* from (214) 555-0099 to (214) 555-0142. Confirm?
>
> **User:** Yes
>
> **AI:** Done. Updated 2:14pm. *[view change]*

**Design notes**
- AI surfaces the *current* value before changing it — prevents silent errors
- Confirmation is one tap, not a typed "yes" — chip or button
- "view change" opens the audit panel scoped to this change
- No panel needed. Whole transaction lives in chat.

---

## Flow 2: Data Lookup (ISO User, Chat + Panel)

**Task:** ISO admin wants to see last quarter's transaction volume by merchant.

**Today:** Reports → Transaction Reports → Date Range → Filter by Merchant → Group By → Run → Export. Six to eight clicks, multiple form fields, and you need to know the report exists.

**New flow:**

> **User:** Show me last quarter's volume by merchant
>
> **AI:** Pulling Q1 2026 — 47 merchants, sorted by volume. *[panel opens]*

**Panel contents:** Sortable table with Merchant, Volume, Transaction Count, Avg Ticket. Filter chips at top (date range, merchant tier). Export button in corner.

**Follow-up:**

> **User:** Just the top 10
>
> **AI:** *[panel updates in place — table now shows top 10]*
>
> **User:** Export this as a PDF for Tri
>
> **AI:** Exported and shared with Tri. *[link]*

**Design notes**
- Panel updates in place because the *intent* is the same — still looking at quarterly volume
- A new question ("show me declined transactions instead") would open a new panel
- Direct manipulation in the panel (clicking a column to sort) feeds back to chat state
- Export is conversational, not a button hunt

---

## Flow 3: Multi-Step Task (Merchant, Panel-as-Form)

**Task:** Merchant onboards a new business location.

**Today:** A 20-field form across four screens — business info, address, banking, equipment selection. Easy to lose track, easy to abandon.

**New flow:**

> **User:** I'm opening a second location at 1820 Greenville Ave
>
> **AI:** Got it — setting up a new location for *Oak Street Coffee* at 1820 Greenville Ave. I've pre-filled what I already know. Want to review it together? *[panel opens]*

**Panel contents:** Form with sections — Business Info (pre-filled), Location Details (address filled, hours and contact blank), Banking (pre-filled but flagged "confirm before submitting"), Equipment (blank, with a "same as Oak Street" shortcut).

**Continued:**

> **User:** Same equipment as Oak Street, same banking
>
> **AI:** Done — copied both. The Banking section is still flagged for confirmation since it's a financial setup. Hours and a location contact are the only things left. *[panel updates]*
>
> **User:** Hours are 6am-8pm daily, contact is the same as the main account
>
> **AI:** Filled in. Ready to review and submit? *[panel scrolls to review state]*

**Design notes**
- Chat handles intent and shortcuts ("same as Oak Street"); panel handles structured input and review
- AI doesn't dump 20 questions into chat — it opens the form and lets the user work through it visually
- Sensitive sections (banking) stay flagged regardless of how the user got there
- User can type, click in the panel, or mix both — neither is canonical

---

## Flow 4: High-Stakes Action (Merchant, Step-up Auth)

**Task:** Merchant changes the bank account where deposits land.

**Today:** Usually *requires a phone call to the ISO* — the exact problem the VisionWeb example calls out.

**New flow:**

> **User:** I need to change my deposit account to a new bank
>
> **AI:** That's a financial change, so we'll need to verify it's you and confirm the new account before it takes effect. Ready to walk through it? *[panel opens]*

**Panel contents:** Three-step flow — (1) identity verification (SMS or authenticator code), (2) new account entry with micro-deposit verification, (3) review and confirm with current account shown alongside new.

**Continued:**

> **User:** Yes
>
> **AI:** Sent a verification code to the phone on file ending in 0142. *[panel waits on code entry]*
>
> *[after verification]*
>
> **AI:** Verified. Enter the new account details in the panel, and we'll send two small deposits to confirm it's yours. *[panel advances]*
>
> *[after submission]*
>
> **AI:** New account submitted. Micro-deposits will arrive in 1-2 business days — I'll notify you when they hit so you can verify the amounts. Until then, deposits continue to your current account.

**Design notes**
- The AI never bypasses the security flow, even though the user asked conversationally
- Step-up auth is real auth, not just a "confirm?" chip
- Conversation acknowledges latency and sets expectations
- Status persists — the user can ask *"what's the status of my bank change?"* tomorrow and get a real answer
- Notification on completion closes the loop without requiring the user to come back and check

---

## Flow 5: Error Recovery (Merchant, Chat-only)

**Task:** Merchant tries to update something the AI can't actually do.

> **User:** Change my MID to a new one
>
> **AI:** I can't change the MID itself — that's assigned by the processor and requires a new application. I *can* help with related things:
> - Update the DBA name attached to this MID
> - Start a new MID application for a different business
> - Connect you with your ISO if you need the MID reissued
>
> What were you trying to do?
>
> **User:** I want my receipts to show a different business name
>
> **AI:** Got it — that's a DBA change, not a MID change. Want to update it now?

**Design notes**
- AI doesn't just fail — it diagnoses *why* the user might have asked, and offers the right path
- Multiple recovery options as chips, not buried in prose
- Conversation continues toward the real intent without restarting
- Only works if the AI knows the product's *concepts*, not just its actions

---

## Flow 6: Proactive Surfacing (Merchant, AI-initiated)

**Task:** AI notices something worth flagging without being asked.

> **AI:** *[on login]* Welcome back. Two things to flag:
> - Your batch from yesterday hasn't settled yet — usually clears by 9am, want me to check?
> - Your statement for April is ready *[view]*
>
> **User:** Yeah check the batch
>
> **AI:** Looking… *[panel opens with batch detail]* Batch #4471 is held for review — looks like one transaction over your single-ticket limit triggered it. The transaction is for $2,840 from a regular customer. Want me to submit a review request?

**Design notes**
- Ambient awareness rebuilt inside chat — replaces the "dashboard tiles" pattern of traditional UIs
- AI surfaces *anomalies and actions*, not just data
- User can ignore, defer, or act — proactive shouldn't mean pushy
- Escalation path is one conversational step, not a separate workflow
- Worth deciding: how often does the AI volunteer? On login? On a schedule? On detected events?

---

## Flow 7: Case Management (ISO User, Chat + Multiple Panels)

**Task:** Service agent working a case for a merchant who called about a chargeback.

> **User:** Pull up the case I was working on for Oak Street Coffee
>
> **AI:** Reopening Case #CS-8821 — chargeback dispute for transaction on May 14. *[panel opens with case detail]* Last activity: you uploaded the signed receipt yesterday. The merchant called this morning — call notes are linked.
>
> **User:** Show me the transaction and the receipt side by side
>
> **AI:** *[opens second panel]* Transaction detail on the left, uploaded receipt on the right. Signature looks consistent with the cardholder's prior transactions — I checked the last six.
>
> **User:** Good. Draft a response to the chargeback citing the signed receipt and the customer's prior history
>
> **AI:** *[third panel: drafted dispute response]* Draft ready. References the receipt, the six prior signed transactions, and the merchant's no-refund policy on the receipt itself. Review and submit?
>
> **User:** Submit
>
> **AI:** Submitted to the processor. Case status updated to *Dispute Filed*. Next deadline: processor response due May 28.

**Design notes**
- ISO users need **parallel panels** — comparing data, drafting alongside source material, switching context fast
- AI does real work in the panel (drafted the response with reasoning), not just rendering
- Case state, deadlines, and audit trail are all maintained without the user managing them
- Power-user behavior: pin panels, run two cases side by side, use chat as a command bar
- Agent's job becomes *judgment and oversight*, not data entry and form navigation

---

## Flow 8: Bulk Action (Above-ISO User, Chat + Panel)

**Task:** Aperia service analyst needs to act across many merchants at once.

> **User:** Show me all merchants across the ISOs I cover that had a decline rate above 15% last week
>
> **AI:** *[panel opens]* 38 merchants across 7 ISOs. Sorted by decline rate descending.
>
> **User:** Filter to just the ones that haven't been contacted in the last 30 days
>
> **AI:** *[panel updates]* 22 merchants left.
>
> **User:** Draft an outreach email to all of them — flag the decline rate, offer a 15-minute review call, and route the responses to the right ISO based on who services them
>
> **AI:** Drafted. *[second panel: email template with per-merchant variables and routing logic shown]* Each email will pull the merchant's name, decline rate, primary contact, and ISO contact. Routing is based on the ISO assignment in the system. Send all 22, send in batches, or review individually first?
>
> **User:** Let me review the first three, then send the rest in a batch
>
> **AI:** *[panel shows first three with preview]* Approve each or edit inline.

**Design notes**
- This is the persona where the model *most clearly beats* traditional UI — bulk action with conditional logic is brutally slow with a mouse
- Chat carries the *intent and rules*; panel handles the *scale*
- Per-record review with approve/edit is critical — bulk action without granular oversight is dangerous at this level
- AI surfaces its routing logic so the user can verify and trust it
- 30+ minute task collapses to 3-5 minutes including review

---

## Flow 9: Cross-Persona Handoff (Merchant → ISO User)

**Task:** Merchant asks for something only an ISO can authorize. The system has to hand off cleanly.

**Merchant side:**

> **User:** I need to increase my single-ticket limit to $5,000
>
> **AI:** That needs approval from your ISO. I can send the request now — they'll review it and I'll let you know either way.
>
> Want to add a reason? It usually helps approval go faster.
>
> **User:** A regular customer wants to prepay for catering through end of year
>
> **AI:** Sent. Request #LR-1209 is now with your ISO. I'll notify you when there's an update.

**ISO side, later:**

> **AI:** *[in the ISO user's pending queue]* New limit-increase request from Oak Street Coffee — $1,500 → $5,000. *[view request]*
>
> **User:** *[opens it, sees panel with merchant history, current limits, reason from merchant, processing volume trends]* Approve it
>
> **AI:** Approved. Limit updated, merchant notified, audit entry logged.

**Merchant side, automatically:**

> **AI:** Good news — your limit increase to $5,000 was approved by your ISO. Effective immediately.

**Design notes**
- The conversation persists *across personas* — the request is a real object that lives between them, not a one-off message
- Each persona sees a view appropriate to their role: the merchant sees status, the ISO sees decision context
- AI handles routing, notification, and audit trail without either party managing it
- This is where the system becomes *more* than chat — it's a coordination layer across roles

---

## Flow 10: Risk Investigation (ISO User, Power Pattern)

**Task:** Risk analyst investigating a possibly fraudulent merchant.

> **User:** Show me everything unusual about Bayside Imports in the last 90 days
>
> **AI:** *[panel opens — investigation view]* Six flags worth a look:
> - Transaction volume up 340% in last 30 days
> - Average ticket size doubled
> - 23% of transactions are CNP from new BINs
> - Three chargebacks filed in the last week (prior 90: zero)
> - Settlement account changed 18 days ago
> - Business address updated 12 days ago
>
> Want me to pull the underlying data for any of these?
>
> **User:** Open the volume trend and the settlement change side by side
>
> **AI:** *[two panels open]* Volume chart on the left, account change history on the right with old and new account details.
>
> **User:** Who else has approved account changes for this merchant historically?
>
> **AI:** Three users — *[third panel: change log]* Two from the assigned ISO, one from your team last month. Want me to flag the case for senior review?
>
> **User:** Yes, and put a temporary funding hold on the account pending review
>
> **AI:** Hold placed, case escalated to Risk Lead, merchant and ISO notified. Funding hold active as of 2:47pm. *[audit entry logged]*

**Design notes**
- AI's job is *pattern surfacing* — six flags pre-identified, ranked by significance
- Risk analysts work investigatively, jumping between data points; multiple panels are essential
- High-stakes actions (funding hold) execute conversationally but log fully and notify the right parties automatically
- System reduces "where do I look next?" friction, which is most of the actual job

---

# Spotlight: Work Queues

Work queues deserve their own section because they're where the traditional UI is *most* entrenched and where the conversational model has to prove it can do more than save a few clicks. They're the operational backbone for ISO and above-ISO users — risk queues, service queues, application review queues, dispute queues, exception queues.

## The Work Queue Problem Today

The traditional pattern is the same everywhere: a table view with filters at the top, each row a case, click in, work the case, return to the list, pick the next one.

It works, but it has real problems:

**Prioritization is manual.** The user has to scan and decide what to work next. Sort by date, sort by priority, sort by SLA — but the *judgment* of what matters most is on the human, every time.

**Context is fragmented.** Working a case means opening it, then opening related records in other tabs. The queue itself doesn't show enough; the case detail shows too much. The user spends a lot of time *assembling context*.

**Bulk patterns are invisible.** If 12 cases are actually the same underlying issue (a processor outage, a new fraud pattern, a botched batch), the queue doesn't tell you. You discover it case by case.

**Handoffs are clunky.** Escalating, reassigning, or asking another team for input usually means leaving the queue and writing a note elsewhere.

**The queue is dumb.** It shows what's there. It doesn't think about what's *important*, *related*, or *actionable now vs. blocked*.

## The Conversational Work Queue

The queue is still a panel — dense, scannable, sortable. What changes is *everything around it*.

**On opening the queue:**

> **AI:** Morning. You have 47 open cases. Here's how I'd suggest working them:
>
> - **4 are time-critical** — SLA breaches within 2 hours
> - **8 look like the same issue** — all merchants on Processor X reporting settlement delays since 6am. Want me to group them?
> - **12 are quick wins** — all need a single document upload that the merchant has already provided, just needs your approval
> - **The rest** are normal-priority service requests
>
> Where do you want to start?

The user doesn't start their day by staring at a list and deciding. They start by seeing the AI's read of the day.

**Working a batch:**

> **User:** Start with the quick wins
>
> **AI:** *[panel shifts to filtered view]* All 12 are document-approval cases — merchant submitted the requested doc, you just need to verify and approve. One at a time, or batch-approve after a quick scan?
>
> **User:** Let me see them
>
> **AI:** *[panel: cases listed with merchant name, doc type, doc preview thumbnail, AI's read on whether the doc looks legitimate]*
>
> **User:** Approve all except the third one — that doc looks off
>
> **AI:** Approved 11 cases. Case #SR-4412 left open for review. Flag it for senior review or open it now?

**Handling a grouped pattern:**

> **User:** Now the Processor X cases
>
> **AI:** *[panel: 8 cases grouped under one parent issue]* All 8 merchants reporting the same symptom — yesterday's settlements showing as "pending" past the usual 8am cutoff. I checked: Processor X posted an outage notice at 6:14am, ETA to resolve by noon.
>
> Suggested action: send a templated update to all 8 merchants with the outage info and ETA, mark the cases as *Waiting on Vendor*, and auto-close once Processor X confirms resolution. Want to do that?
>
> **User:** Yes, but let me see the template first
>
> **AI:** *[opens template panel]* Pre-filled with merchant names, ETA, and a check-in promise. Send all 8 or review each?

## What This Changes

**The queue becomes a conversation, not a list.** The user no longer scans rows and decides what to work next — they ask the AI for a read, get a triaged view, and act. The queue panel is the *substrate*; the chat is the *interface to it*. The cleanest expression yet of "intent replaces navigation."

**Pattern matching is automated.** The AI sees the Processor X grouping in seconds; a human agent might catch it after working three or four cases individually. Multiply across a queue of hundreds and the productivity story is real.

**Bulk action with judgment in the loop.** The user approves 11 cases in one turn, but the AI surfaces the one that looks suspect. The right division of labor — AI handles volume, human handles judgment.

**Context assembly disappears.** When the user opens a case, the AI brings the related history, the merchant detail, the prior cases — already loaded into the panel.

**SLAs and deadlines become ambient.** The user doesn't have to sort by SLA to know what's at risk — the AI flags it on opening. The system is *advocating for the work*, not just storing it.

**Cross-team coordination gets cleaner.** *Waiting on Vendor* with auto-close on resolution is a state the AI maintains. No spreadsheet, no email chain, no Slack thread.

## How Personas See the Queue

**ISO user (service agent or risk analyst):** Works the queue all day. Chat is their command line. Wants speed, density, parallel panels, and AI doing first-pass analysis on every case before they open it.

**Above-ISO user (Aperia service analyst):** Doesn't work individual cases — works *across queues* for multiple ISOs. Their queue isn't 47 cases; it's "show me what's going wrong across my portfolio today." AI's pattern matching becomes the entire product for this user.

**Merchant:** Doesn't see a queue at all. But their requests live in someone's queue, and the AI gives them visibility into status without exposing the queue mechanics. *"Your limit increase request is in review with your ISO — typical turnaround is 2 business days."*

---

# Patterns Across All Flows

A few things worth pulling up:

**Chat does less than you'd expect.** It carries intent in, status out, and shortcuts in between. The substance of the work — the table, the form, the verification flow — lives in the panel. Chat is the *conductor*, not the *performer*.

**Pre-filling is the magic trick.** Flow 3 only works because the AI brings everything it already knows into the panel before asking the user anything. Without that, it's just a form with a chatbot on top.

**Tiered confirmation maps cleanly to surface choice.** Low-risk = chat confirm. Medium-risk = panel review. High-risk = panel with step-up auth. The interaction grammar makes risk legible.

**State flows both ways.** The user can act in chat or in the panel, and the other surface stays in sync. The engineering hard part, but also what makes the model feel coherent.

**Status and recall matter as much as action.** Flow 4 ends with a notification days later. The conversation has to be durable — users come back, ask follow-ups, check on things. Not chat-as-command-line; chat-as-relationship-with-the-product.

**Chat is constant; panels scale.** All three personas use chat similarly — short, intent-driven, conversational. What changes is the panel layer. Merchants get one panel at a time. ISO users get parallel panels. Above-ISO users get bulk panels with filtering and per-record review.

**AI value increases with persona seniority.** For merchants, the AI mostly saves clicks. For ISO users, it does real work — drafting, routing, pattern matching. For above-ISO users, it operates at a scale a human couldn't. The pitch sharpens as you go up.

**Cross-persona handoff is a first-class concept.** Flow 9 isn't an edge case — it's the connective tissue of the platform. Requests, approvals, escalations, notifications all flow between roles, and the AI is the medium.

**Trust scales with stakes, not just with persona.** A merchant changing an address is low-trust-needed. A risk analyst placing a funding hold is high-trust-needed, even though they're more senior. Tiered confirmation, audit trails, and step-up auth aren't about who the user is — they're about what's being done.

**The hardest UX problem isn't chat or panels — it's queues, notifications, and state.** Flow 9 only works if requests persist as objects with status. Flow 6 only works if the AI knows what's worth flagging. Flow 10 only works if the system maintains an audit trail across multiple users.

---

# The Strategic Point

Conversational actions aren't a chat feature. They're an operating model.

The merchant gets self-service. The ISO user gets a smarter queue. The Aperia analyst gets portfolio-level pattern recognition. All three are different surfaces of the same underlying system — intent in, action and context out.

The traditional product has three distinct UIs for these three personas. The conversational product has **one model, three views.** That's a stronger architectural story and a stronger business story.

---

# Next Steps

- Sketch the actual visual design for the canonical panel types (table, form, dashboard, report, case detail, queue)
- Define the action registry and permissions model — what's callable, by whom, with what guardrails
- Identify a pilot product and persona for the first build (likely VisionWeb merchant + a focused set of self-service actions)
- Define the measurement plan so we can defend the model in front of execs and clients
