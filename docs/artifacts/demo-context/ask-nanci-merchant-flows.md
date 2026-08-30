# Ask Nanci — Merchant Flows

Conversational flows for the nine merchant panel use cases. Merchant persona throughout. Nanci's spoken lines follow brand voice (no contractions, no em dashes); panel actions in *[italics]*.

---

## Flow 1: Deposit Tracker (Merchant, Chat + Panel)
**Task:** Merchant expecting money from the weekend wants to know when it lands.

> **User:** when's my money from the weekend hitting?
>
> **AI:** You have three batches pending. *[panel opens: pending deposits]* Friday and Saturday are in transit, expected in your account ending 4432 tomorrow morning. Sunday's batch is on a temporary hold.
>
> **User:** why's Sunday held?
>
> **AI:** *[panel expands the held batch]* A single $2,190 transaction triggered a routine review, larger than your typical ticket. No action needed on your end. It usually clears within one business day, so expected Wednesday. I can notify you the moment it funds.
>
> **User:** yes do that
>
> **AI:** Done. You will get a notification when Sunday's batch funds. Friday and Saturday total $4,860, landing tomorrow.

**Design notes**
- The held batch is the real test, not the happy path — merchant must understand *why* and that it resolves itself, or they call support
- AI does the reasoning (flags *why* the hold fired) instead of just showing a status label
- Source is visible (batch amounts, account last-4, dates) so "did it actually check" is answerable by looking
- Retires the single highest-frequency merchant anxiety: *where is my money*
- **Risk exercised:** trust, latency/reliability. Watch for "is this right?" hesitation — that means the source line isn't landing

---

## Flow 2: Fee Change Explainer (Merchant, Chat + Panel)
**Task:** Merchant's statement looks higher than last month and they do not know why.

> **User:** my fees went up this month, what happened
>
> **AI:** They rose $84 versus April. *[panel opens: month-over-month]* Almost all of it is one driver: your volume was up 18%, so per-transaction fees scaled with it. Your rate did not change.
>
> **User:** so it's just because I sold more?
>
> **AI:** Correct. *[panel highlights the volume row]* Effective rate held steady at 2.71%. You paid more in total because you processed more. The one exception is a $15 chargeback fee from a single dispute on May 3.
>
> **User:** ok that makes sense. show me that chargeback
>
> **AI:** *[opens dispute detail]* Here it is. It is already resolved in your favor, so the $15 will be credited back on next month's statement.

**Design notes**
- The driver callout is what converts "a number moved" into "here is the cause" — test whether the merchant reaches the reason unprompted
- Delta is shown and sourced, so the merchant trusts it without pulling their paper statement
- AI connects two panels in one thread (fee explainer → dispute detail) without losing context
- Reframes a support-call-generating moment into self-serve understanding
- **Risk exercised:** hallucination/silent-error. Flag any moment the merchant reaches for the original statement to double-check

---

## Flow 3: Dispute Queue (Merchant, Chat + Panel, Confirmed Write)
**Task:** Merchant heard they got a chargeback and needs to know what to do and by when.

> **User:** someone said I got a chargeback?? what do I do
>
> **AI:** You have one open dispute. *[panel opens: dispute queue]* Case CB-4471, $340, reason code "product not received." You have until May 28 to respond, that is 9 days.
>
> **User:** I definitely shipped that. I have tracking
>
> **AI:** Then you have a strong case. *[panel shows evidence checklist]* Upload the tracking number and proof of delivery, and I will build the response around them. Drag the file in or paste the tracking number.
>
> **User:** *[uploads delivery confirmation]*
>
> **AI:** Got it. *[panel: drafted response]* I have drafted a response citing the delivery confirmation dated May 12, three days before the dispute. Review and file it?
>
> **User:** file it
>
> **AI:** Filed at 2:14 PM, confirmation DR-9930. Status is now *Response Submitted*. The processor's decision is expected by June 4. I will notify you when it lands.

**Design notes**
- Deadline is bound and visible from the first line — text handles this worst, which is why it is the lead panel to build and test
- The *accept liability* path (not shown here) is the highest-stakes interaction in the product: it must gate on explicit confirm so no one forfeits money by accident
- AI does real work — drafts the response with reasoning tied to the evidence, merchant provides judgment
- Test the **upload-fails** branch separately: merchant must know their evidence was saved and the clock still runs
- **Risk exercised:** audit/compliance, trust. Deadline must never read as optional

---

## Flow 4: Transaction Search (Merchant, Chat + Panel)
**Task:** A customer disputes a charge; merchant needs to find it fast.

> **User:** customer says they got charged 340 on tuesday, find it
>
> **AI:** *[panel opens: search results]* One match. $340.00, Tuesday May 13 at 4:52 PM, Visa ending 8801, approved, at your Main Street terminal.
>
> **User:** that's the one. did they get charged twice?
>
> **AI:** *[panel filters to the card]* No. That card was used once this month, this single transaction. No duplicates.
>
> **User:** ok good, they were wrong. thanks
>
> **AI:** Anytime. The receipt is on file if you need to send it to them.

**Design notes**
- Scan-and-click beats a paragraph — this is the clearest *speed* play in the set
- Filter chips stay visible so the merchant sees *why* results narrowed, which makes empty/too-many states recoverable in one step
- AI answers the *real* question (charged twice?) by re-filtering, not by making the merchant restate
- **Instrument this one:** time-on-task against the current portal. If the panel is slower than what merchants already have, it fails on arrival regardless of polish
- **Risk exercised:** speed-for-simple-tasks

---

## Flow 5: Sales Snapshot (Merchant, Chat + Panel)
**Task:** Merchant wants a quick read on the week versus last.

> **User:** how'd this week go vs last week?
>
> **AI:** Up. *[panel opens: weekly trend]* $18,240 this week against $15,900 last week, a 15% lift. Saturday was your best day at $4,110.
>
> **User:** what drove saturday?
>
> **AI:** *[panel drills into Saturday]* Higher ticket count, not bigger tickets. You ran 96 transactions versus a weekday average of 60. Average ticket held steady around $43.
>
> **User:** nice. was there a slow day?
>
> **AI:** Tuesday, at $1,980. Weather was rough that day if that tracks with what you saw in-store.

**Design notes**
- Chart-shaped data should never come back as prose — the panel *is* the answer
- Test the merchant's mental model of "this week": Mon–Sun vs. rolling 7 must match what they expect, or the number reads as wrong even when it is right
- AI adds interpretation (ticket count vs. ticket size) rather than dumping a chart and stopping
- **Risk exercised:** uncanny-valley of partial intelligence. A snapshot that is *almost* their week is worse than none

---

## Flow 6: Effective Rate Breakdown (Merchant, Chat + Panel)
**Task:** Merchant keeps hearing about their "real" rate and wants to know what they actually pay.

> **User:** what am I actually paying to process? like the real number
>
> **AI:** Your effective rate last month was 2.71%. *[panel opens: rate breakdown]* That is total fees of $712 on $26,300 in volume. Here is every fee that rolls into it.
>
> **User:** is that high?
>
> **AI:** *[panel shows benchmark band]* For a coffee and quick-service merchant, typical is 2.5% to 2.9%. You sit in the middle of that range. Nothing here looks off.
>
> **User:** what would it be if I did 40k a month?
>
> **AI:** *[panel models the change]* Roughly 2.68%. Most of your fees scale with volume, so the rate barely moves. The fixed portion just spreads across more sales.

**Design notes**
- The math is *shown*, not asserted — volume, itemized fees, effective % — so the merchant can reproduce it and trusts it
- Benchmark band is the trust lever: it reframes the number from a sales pitch into a fact. Test whether it builds confidence or triggers a "why am I high?" escalation
- AI handles the "what if" (volume modeling) live — this is where it beats a static statement
- **Risk exercised:** trust, cost-predictability

---

## Flow 7: PCI Status (Merchant, Chat + Panel)
**Task:** Merchant wants to know if they are compliant and whether they have to do anything.

> **User:** am I pci compliant? do I need to do anything
>
> **AI:** You are compliant through August 14. *[panel opens: PCI status]* Your SAQ is on file and your last scan passed on May 1. Nothing is due right now.
>
> **User:** what happens when august comes
>
> **AI:** You will re-attest, about a 10-minute questionnaire, and run one scan. I will remind you three weeks out so it never becomes urgent. If it ever lapses, there is a $19.95 monthly non-compliance fee, so it is worth staying ahead of.
>
> **User:** can I just do it now?
>
> **AI:** *[panel: start SAQ]* You can. I will pull forward last year's answers so you are only confirming what changed. Want to start?

**Design notes**
- Compliant vs. overdue framing are different tests — overdue must convey urgency (fee exposure) without inducing a panic support call
- AI separates SAQ status from scan status so a scan-vendor outage never wrongly reads as "not compliant"
- Pre-filling last year's answers is real work that lowers the effort of the compliant path
- **Risk exercised:** audit/PCI exposure. Test the **scan-down** branch: a scan hiccup must not read as non-compliance

---

## Flow 8: Account Change (Merchant, Chat + Panel, Guardrail Write)
**Task:** Merchant switched banks and wants deposits routed to the new account.

> **User:** I changed banks, send my deposits to the new account
>
> **AI:** I can update that. *[panel opens: deposit account form]* Current account ends 4432. Enter the new routing and account number and I will validate them before anything changes.
>
> **User:** *[enters new details]*
>
> **AI:** Routing number checks out to First National. *[panel: confirm step]* To confirm, new deposits will route to the account ending 7715 starting with your next batch. Verify the last four digits and I will apply it.
>
> **User:** 7715
>
> **AI:** Confirmed and updated at 3:40 PM. A confirmation was sent to the email ending in ...@oakst.com. Your next deposit, tomorrow's batch, will go to the new account.

**Design notes**
- The confirm gate *is* the design — an irreversible, PCI-adjacent write must never fire off free-text intent alone
- Two-step verification (validate routing, then confirm last-4 + effective date) is the guardrail thesis under test: try to make a participant change banking carelessly and see if they can
- AI validates before committing, and confirms *after*, so the merchant is never left wondering "did that save?"
- Test the **write-fails** branch: on failure, nothing changes and the merchant is told so explicitly
- **Risk exercised:** silent-error, audit

---

## Flow 9: Escalation (Merchant, Chat + Panel)
**Task:** Nanci cannot resolve the merchant's issue and needs to hand off without dead-ending.

> **User:** none of this is right, my payout is short by like 600 bucks and I don't get why
>
> **AI:** That is worth a person's eyes, and I do not want to guess on missing money. *[panel opens: escalation]* Here is what I have gathered so you do not have to repeat it: expected payout $3,400, received $2,800, for the batch dated May 12.
>
> **User:** yeah exactly
>
> **AI:** I can get you to the settlement team two ways. *[panel shows paths]* Book a call, next slot is today at 4:30, or file a ticket now and they reach you within 4 business hours. Both carry the batch details I just pulled.
>
> **User:** book the 4:30
>
> **AI:** Booked for 4:30 today. Reference SR-2205. The team will have the batch discrepancy in front of them, so you can pick up where we left off.

**Design notes**
- The failure moment is where trust is won or lost — build and test it as rigorously as any happy path
- Carrying context into the handoff (the numbers, the batch) is the whole point: the merchant must not have to start over with a human
- AI is honest about its limit ("I do not want to guess on missing money") rather than faking an answer — this *protects* trust instead of spending it
- Never dead-ends: if ticketing is down, surface phone + hours as fallback
- **Risk exercised:** trust-at-the-limit, single-point-of-failure

---

## Build & test order

Start with **Flow 3 (dispute queue)** and **Flow 8 (account change)** — they carry the confirmed-write gate every other write panel inherits. Prove the mechanic once and it is reusable everywhere. **Flow 4 (transaction search)** and **Flow 5 (sales snapshot)** are the speed tests: instrument time-on-task against the current portal, because a panel slower than what merchants already have fails on arrival. **Flow 9 (escalation)** should be tested last but not skipped — it is the safety net the other eight lean on when they miss.
