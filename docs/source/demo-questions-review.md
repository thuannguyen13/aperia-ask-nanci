# Ask Nanci — Demo Questions Review

> **Status:** Needs review
> **Variants:** Clover · Business Owner · ISO
>
> These are the scripted demo questions and answers used in the three embed variants (`?embed=clover`, `?embed=business-owner`, `?embed=iso`). Source files: `aperia-ask-nanci/lib/ask-nanci/mock-data.ts` and `embed-demo-config.ts`.

---

## Clover Variant (`?embed=clover`)

**Persona:** Restaurant merchant with Clover POS connected.
**Data sources:** Clover Data, AccessOne Data, QuickBooks, Chase, Bank of America, Amex, Wells Fargo.

### Prompt Categories (Question Explorer)

#### Overview
- Give me the full picture on yesterday.
- How much did I actually make last week?
- How come I had a great month but I can't pay my bills?
- Was Saturday worth it?
- Where's all my money going?
- Which location should I be worried about?

#### Top Items
- What should I charge more for?
- What's my best-selling item this week?
- Which menu items have the highest margin?
- What items are dragging down my average ticket?

#### Inventory
- I feel like we're throwing away too much food. Are we?
- How much is Sysco costing me?
- Which ingredients am I over-ordering?
- How does my food cost percentage compare to last month?

#### Operation
- Is it worth staying open past 9?
- Can I afford to give my staff a raise?
- Am I going to be able to make payroll on Friday?
- Who's my best employee?

#### Refunds & Voids
- Why do I keep getting chargebacks?
- Which server has the most voids this week?
- How much did refunds cost me this month?
- Are my chargebacks trending up or down?

#### Payment
- Why doesn't my bank match my sales report?
- I'm paying way too much in fees. How bad is it?
- Which card type is costing me the most?
- Are any transactions still pending from last week?

#### Maintenance
- Change my business address
- Update my primary email
- Update my phone number
- Change my statement descriptor
- Update customer service phone
- Update my business name

---

### Scripted Q&A — Business Insights

#### Why doesn't my bank match my sales report?

**Answer:**
Two deposits from Friday ($847 and $456) are still in transit and will post Monday. Once they do, your bank balance will match within $12 of your Clover sales. That remaining $12 is your processing fee for the period.

**Reconciliation summary**
- Clover sales: $4,827
- Bank deposits: $3,512
- Difference: $1,315 (in-transit + fees)

---

#### Is it worth staying open past 9?

**Answer:**
Over the last 30 days, your average revenue after 9pm is $380 per night across about 15 orders. The cost to stay open — extra staff hours, utilities, and additional prep — runs about $420 per night. So you're losing roughly $40 a night by staying open. The exception is Fridays and Saturdays, where post-9pm revenue averages $680. If you cut late hours to weekdays only, you'd save about $200/week.

- Avg Post-9pm Revenue: $380
- Avg Post-9pm Cost: $420
- Daily Loss: -$40
- Fri/Sat Avg Revenue: $680

---

#### Give me the full picture on yesterday.

**Answer:**
Yesterday was a solid day. 94 orders totaling $4,100 in sales. Top sellers: brisket plate (28), margaritas (34), fish tacos (19). Maria handled 38 orders, Jamal 31, Carlos 25. There were 2 voids ($36) and 1 comp ($14). Processing fees came to $118, and one transaction for $85 is under review. Your batch settled and $3,940 should deposit tomorrow. On the expense side: $800 food delivery came in, labor was $1,400. Net contribution for the day: roughly $1,782.

- Orders: 94
- Total Sales: $4,100
- Processing Fees: $118
- Net Contribution: $1,782

---

#### Who's my best employee?

**Answer:**
By gross sales, Maria leads at $4,200 last week. But Maria's customers pay mostly Amex (3.2% avg fee), she comped $180 and voided $90. Net contribution: $3,795. Jamal rang up $3,600 but his customers skew debit (1.1% avg fee), with only $40 in comps and no voids. Net contribution: $3,520. Maria still edges ahead, but Jamal is more efficient per dollar. Carlos did $2,800 with $210 in comps — that's worth a conversation.

- Maria Net: $3,795
- Jamal Net: $3,520
- Carlos Net: $2,530
- **Top Performer: Maria**

---

#### What should I charge more for?

**Answer:**
Three items stand out where your costs went up but your prices didn't. The brisket sandwich: ingredient cost up 18% this quarter, you're still charging $9, margin dropped from 52% to 44%. The fish tacos: cost up 12%, priced at $11, margin down from 48% to 42%. The chef's salad has been stable. Your brisket sandwich sells 40/day — even a $1 increase would add $1,200/month with minimal volume risk.

- Brisket Margin: 52% → 44%
- Fish Tacos: 48% → 42%
- Brisket Sales: 40/day
- Revenue Impact: +$1,200/mo

---

#### Can I afford to give my staff a raise?

**Answer:**
Current payroll is $12,000/month. A $1/hour raise across your 6 full-time staff adds about $1,040/month. Your revenue has grown 8% quarter over quarter for the past three quarters, and your average monthly cash reserve after all expenses is $18,200. You can absorb it — even in a down month, your reserves cover the increase 17 times over. The trend supports it.

- Current Payroll: $12K/mo
- Raise Cost: $1,040/mo
- Revenue Growth: +8% QoQ
- Cash Reserve: $18.2K

---

#### I feel like we're throwing away too much food. Are we?

**Answer:**
This week your POS shows you sold 300 chicken plates, 180 fish plates, and 220 pasta dishes. Based on your supplier invoices, you purchased enough for roughly 400, 210, and 240 servings respectively. That's a gap of about 100 chicken servings (25%), 30 fish (14%), and 20 pasta (8%). Chicken is your biggest waste problem — that's roughly $350 in lost product this week alone.

- Chicken Waste: 25%
- Fish Waste: 14%
- Pasta Waste: 8%
- Weekly Loss: $350

---

#### Which location should I be worried about?

**Answer:**
Downtown does $38,000/month in revenue. Suburb does $27,000. Looks like downtown wins, right? But downtown has $6,500 rent, $14,200 labor, and pays 2.8% in processing fees. Suburb has $2,800 rent, $8,600 labor, and 2.1% in fees. After all expenses: Downtown nets $6,240/month. Suburb nets $8,100. Your 'smaller' location is actually more profitable by almost $2,000.

- Downtown Revenue: $38K / Net: $6,240
- Suburb Revenue: $27K / Net: $8,100

---

#### How much is Sysco costing me?

**Answer:**
QuickBooks shows $14,200 across 12 invoices from Sysco this quarter. But your bank shows 14 debits to Sysco totaling $15,800. The $1,600 gap breaks down to: two rush delivery surcharges ($340 each), one payment made before the invoice was entered ($580), and a credit memo that was never applied ($340). Your real cost is $15,800 — about 11% more than what's on the books.

- Invoiced (QB): $14,200
- Actually Paid: $15,800
- Gap: $1,600 (+11%)

---

#### Why do I keep getting chargebacks?

**Answer:**
You've had 14 chargebacks this month totaling $1,840. Looking at the pattern: 9 of them (64%) were Friday or Saturday night transactions, all over $75, and 6 of those were from the same server station. The most common reason code is 'service not received' — which usually means the customer disputes a bar tab. It looks like late-night high-dollar bar tabs are your biggest exposure.

- Total Chargebacks: 14
- Total Amount: $1,840
- Weekend %: 64%
- Avg Per CB: $131

---

#### I'm paying way too much in fees. How bad is it?

**Answer:**
This month you paid $2,870 in total processing fees. Amex is your most expensive at $1,120 (avg 3.2% per transaction), followed by Visa at $940 (2.4%), Mastercard at $610 (2.3%), and Discover at $200 (2.5%). Here's what makes it interesting: your Amex customers spend $47 per visit on average versus $28 for Visa. They're expensive but they're your biggest spenders.

- Total Fees: $2,870
- Amex: $1,120 (3.2% avg)
- Visa: $940 (2.4% avg)
- Mastercard: $610 (2.3% avg)

---

#### Am I going to be able to make payroll on Friday?

**Answer:**
Right now you have $11,400 in the bank. Payroll on Friday is $8,200, and you have two vendor invoices totaling $3,100 due before then. That puts you $100 short. But — you have $4,800 in settled card transactions depositing Wednesday and another $3,200 coming Thursday. After everything clears, you should land around $8,100 by Friday evening. You'll be fine, but it'll be tight.

- Current Balance: $11,400
- Payroll Friday: $8,200
- Bills Due: $3,100
- Projected Friday: $8,100

---

#### How come I had a great month but I can't pay my bills?

**Answer:**
Your sales were actually up 15% this month — $62,400 vs $54,300 last month. But your bank balance dropped $3,100. Here's what happened: A chargeback batch of $3,200 hit on the 14th. Your quarterly tax estimate of $4,800 went out on the 15th. Annual insurance premium of $2,900 auto-debited on the 18th. So you had $10,900 in unusual outflows that ate your growth and then some.

- Sales Growth: +15%
- Balance Change: -$3,100
- Unusual Outflows: $10,900
- This Month: $62,400

---

#### Was Saturday worth it?

**Answer:**
Saturday brought in $7,840 across 162 orders. But here's the cost side: weekend staff was $2,400, food/beverage cost of goods was $2,740, and you had $180 in overtime bumps. Total cost to run Saturday: $5,320. That leaves you $2,520 in gross profit — about a 32% margin. Decent, but your weekday average margin is 41%. Saturdays are busier but less efficient.

- Revenue: $7,840
- Total Costs: $5,320
- Profit: $2,520
- Margin: 32% (vs 41% weekday avg)

---

#### Where's all my money going?

**Answer:**
This month you've spent $38,400 total. Here's the breakdown: Payroll is your biggest at $12,000 (31%), followed by suppliers/inventory at $9,800 (26%), rent at $4,500 (12%), card processing fees at $2,870 (7%), utilities at $2,340 (6%), chargebacks at $1,200 (3%), and other expenses at $5,690 (15%). Your processing fees alone are more than your electric bill.

- Total Spending: $38,400
- Payroll: $12,000 (31%)
- Processing Fees: $2,870 (7%)
- Chargebacks: $1,200 (3%)

---

#### How much did I actually make last week?

**Answer:**
Last week you brought in $14,820 in total sales across the register. After processing fees ($431), chargebacks ($180), and one pending hold ($85), your net settled amount was $14,124. Your bank received $14,124 from card settlements, plus $940 in cash deposits and a $200 catering check — so your actual total income was $15,264.

- Gross Sales: $14,820
- Processing Fees: $431
- Chargebacks: $180
- **Actual Income: $15,264**

---

### Scripted Flows — Account Maintenance

#### Change my business address

| Turn | Message |
|------|---------|
| User | Change my business address |
| Nanci | Sure. Your current business address on file is: **142 Oak Street, Austin, TX 78701**. What would you like to change it to? Please include street, city, state, and ZIP. |
| User | 456 Market St, San Francisco, CA 94105 |
| Nanci | Got it — just to confirm, you'd like to update your business address from 142 Oak Street, Austin, TX 78701 to: **456 Market St, San Francisco, CA 94105**. Is that correct? |
| User | Yes, that's correct. |
| Nanci | Done! Your business address has been updated to 456 Market St, San Francisco, CA 94105. The change will be reflected on your account within 1–2 business days. You'll receive a confirmation email at your primary address shortly. |

---

#### Update my primary email

| Turn | Message |
|------|---------|
| User | Update my primary email |
| Nanci | Of course. Your current primary email is **teresa.w@email.com** — this is where we send account notifications, receipts, and important updates. What would you like to change it to? |
| User | teresa.walker@walkerbiz.com |
| Nanci | Just to confirm — you want to change your primary email from teresa.w@email.com to **teresa.walker@walkerbiz.com**. Is that right? |
| User | Yes, go ahead. |
| Nanci | Your primary email has been updated to teresa.walker@walkerbiz.com. A confirmation link has been sent to your old address to verify the change. Future notifications will go to the new address once confirmed. |

---

#### Update my phone number

| Turn | Message |
|------|---------|
| User | Update my phone number |
| Nanci | No problem. Your current phone number on file is **(512) 334-7821**, used for account verification and support callbacks. What's the new number you'd like to use? |
| User | (415) 867-5309 |
| Nanci | To confirm — updating your contact number from (512) 334-7821 to **(415) 867-5309**. Correct? |
| User | That's right. |
| Nanci | Your phone number has been updated to (415) 867-5309. If you ever need to verify your account, that's the number we'll use going forward. |

---

#### Change my statement descriptor

| Turn | Message |
|------|---------|
| User | Change my statement descriptor |
| Nanci | Sure — your statement descriptor is what appears on your customers' credit card statements after a purchase. Your current descriptor is **"WALKER'S BOOKS"** (13 characters). What would you like it to say? Keep it under 22 characters so it displays cleanly. |
| User | WALKER BISTRO SF |
| Nanci | "WALKER BISTRO SF" is 16 characters — perfect. Just to confirm, this will replace "WALKER'S BOOKS" on all new transactions. Ready to update? |
| User | Yes, update it. |
| Nanci | Done! Your statement descriptor has been changed to "WALKER BISTRO SF". It will appear on all new transactions going forward. Existing pending transactions may still show the old descriptor. |

---

#### Update customer service phone

| Turn | Message |
|------|---------|
| User | Update customer service phone |
| Nanci | Got it. Your current customer service number is **(512) 334-7821** — this is what appears on receipts and cardholder dispute communications. What would you like to change it to? |
| User | (415) 555-0192 |
| Nanci | Confirm update from (512) 334-7821 to **(415) 555-0192** for customer service? This will appear on all future receipts. |
| User | Yes, confirm. |
| Nanci | Updated! Your customer service phone is now (415) 555-0192. Customers will see this number on their receipts starting with your next batch. |

---

#### Update my business name

| Turn | Message |
|------|---------|
| User | Update my business name |
| Nanci | I can help with that. Your business name is currently registered as **"Walker's Business Books LLC"**. What would you like to change it to? If this is a legal entity name change, you may need to provide supporting documentation such as an updated business license. |
| User | Walker Bistro & Events LLC |
| Nanci | Got it — changing from "Walker's Business Books LLC" to **"Walker Bistro & Events LLC"**. Is this a legal name change or just a DBA (doing business as) update? |
| User | It's a legal name change. |
| Nanci | Understood. Your business name has been updated to Walker Bistro & Events LLC. Since this is a legal name change, our compliance team may follow up within 2–3 business days to request a copy of your updated documentation. You'll receive a confirmation at your primary email shortly. |

---

## Business Owner Variant (`?embed=business-owner`)

**Persona:** Business owner with AccessOne data connected (not Clover).
**Data sources:** AccessOne Data, QuickBooks, Chase, Bank of America, Amex, Wells Fargo.

> **Note:** The Business Owner variant omits the **Top Items** and **Inventory** categories. Those are Clover POS-specific. All other categories and scripted conversations are the same, with AccessOne as the primary data source.

---

### Prompt Categories (Question Explorer)

#### Overview
- Give me the full picture on yesterday.
- How much did I actually make last week?
- How come I had a great month but I can't pay my bills?
- Was Saturday worth it?
- Where's all my money going?
- Which location should I be worried about?

#### Operation
- Is it worth staying open past 9?
- Can I afford to give my staff a raise?
- Am I going to be able to make payroll on Friday?
- Who's my best employee?

#### Refunds & Voids
- Why do I keep getting chargebacks?
- Which server has the most voids this week?
- How much did refunds cost me this month?
- Are my chargebacks trending up or down?

#### Payment
- Why doesn't my bank match my sales report?
- I'm paying way too much in fees. How bad is it?
- Which card type is costing me the most?
- Are any transactions still pending from last week?

#### Maintenance
- Change my business address
- Update my primary email
- Update my phone number
- Change my statement descriptor
- Update customer service phone
- Update my business name

---

### Scripted Q&A — Business Insights

#### Why doesn't my bank match my sales report?

**Answer:**
Two deposits from Friday ($847 and $456) are still in transit and will post Monday. Once they do, your bank balance will match within $12 of your AccessOne sales. That remaining $12 is your processing fee for the period.

**Reconciliation summary**
- AccessOne sales: $4,827
- Bank deposits: $3,512
- Difference: $1,315 (in-transit + fees)

---

#### Is it worth staying open past 9?

**Answer:**
Over the last 30 days, your average revenue after 9pm is $380 per night across about 15 orders. The cost to stay open — extra staff hours, utilities, and additional prep — runs about $420 per night. So you're losing roughly $40 a night by staying open. The exception is Fridays and Saturdays, where post-9pm revenue averages $680. If you cut late hours to weekdays only, you'd save about $200/week.

- Avg Post-9pm Revenue: $380
- Avg Post-9pm Cost: $420
- Daily Loss: -$40
- Fri/Sat Avg Revenue: $680

---

#### Give me the full picture on yesterday.

**Answer:**
Yesterday was a solid day. 94 orders totaling $4,100 in sales. Top sellers: brisket plate (28), margaritas (34), fish tacos (19). Maria handled 38 orders, Jamal 31, Carlos 25. There were 2 voids ($36) and 1 comp ($14). Processing fees came to $118, and one transaction for $85 is under review. Your batch settled and $3,940 should deposit tomorrow. On the expense side: $800 food delivery came in, labor was $1,400. Net contribution for the day: roughly $1,782.

- Orders: 94
- Total Sales: $4,100
- Processing Fees: $118
- Net Contribution: $1,782

---

#### Who's my best employee?

**Answer:**
By gross sales, Maria leads at $4,200 last week. But Maria's customers pay mostly Amex (3.2% avg fee), she comped $180 and voided $90. Net contribution: $3,795. Jamal rang up $3,600 but his customers skew debit (1.1% avg fee), with only $40 in comps and no voids. Net contribution: $3,520. Maria still edges ahead, but Jamal is more efficient per dollar. Carlos did $2,800 with $210 in comps — that's worth a conversation.

- Maria Net: $3,795
- Jamal Net: $3,520
- Carlos Net: $2,530
- **Top Performer: Maria**

---

#### Can I afford to give my staff a raise?

**Answer:**
Current payroll is $12,000/month. A $1/hour raise across your 6 full-time staff adds about $1,040/month. Your revenue has grown 8% quarter over quarter for the past three quarters, and your average monthly cash reserve after all expenses is $18,200. You can absorb it — even in a down month, your reserves cover the increase 17 times over. The trend supports it.

- Current Payroll: $12K/mo
- Raise Cost: $1,040/mo
- Revenue Growth: +8% QoQ
- Cash Reserve: $18.2K

---

#### Which location should I be worried about?

**Answer:**
Downtown does $38,000/month in revenue. Suburb does $27,000. Looks like downtown wins, right? But downtown has $6,500 rent, $14,200 labor, and pays 2.8% in processing fees. Suburb has $2,800 rent, $8,600 labor, and 2.1% in fees. After all expenses: Downtown nets $6,240/month. Suburb nets $8,100. Your 'smaller' location is actually more profitable by almost $2,000.

- Downtown Revenue: $38K / Net: $6,240
- Suburb Revenue: $27K / Net: $8,100

---

#### Why do I keep getting chargebacks?

**Answer:**
You've had 14 chargebacks this month totaling $1,840. Looking at the pattern: 9 of them (64%) were Friday or Saturday night transactions, all over $75, and 6 of those were from the same server station. The most common reason code is 'service not received' — which usually means the customer disputes a bar tab. It looks like late-night high-dollar bar tabs are your biggest exposure.

- Total Chargebacks: 14
- Total Amount: $1,840
- Weekend %: 64%
- Avg Per CB: $131

---

#### I'm paying way too much in fees. How bad is it?

**Answer:**
This month you paid $2,870 in total processing fees. Amex is your most expensive at $1,120 (avg 3.2% per transaction), followed by Visa at $940 (2.4%), Mastercard at $610 (2.3%), and Discover at $200 (2.5%). Here's what makes it interesting: your Amex customers spend $47 per visit on average versus $28 for Visa. They're expensive but they're your biggest spenders.

- Total Fees: $2,870
- Amex: $1,120 (3.2% avg)
- Visa: $940 (2.4% avg)
- Mastercard: $610 (2.3% avg)

---

#### Am I going to be able to make payroll on Friday?

**Answer:**
Right now you have $11,400 in the bank. Payroll on Friday is $8,200, and you have two vendor invoices totaling $3,100 due before then. That puts you $100 short. But — you have $4,800 in settled card transactions depositing Wednesday and another $3,200 coming Thursday. After everything clears, you should land around $8,100 by Friday evening. You'll be fine, but it'll be tight.

- Current Balance: $11,400
- Payroll Friday: $8,200
- Bills Due: $3,100
- Projected Friday: $8,100

---

#### How come I had a great month but I can't pay my bills?

**Answer:**
Your sales were actually up 15% this month — $62,400 vs $54,300 last month. But your bank balance dropped $3,100. Here's what happened: A chargeback batch of $3,200 hit on the 14th. Your quarterly tax estimate of $4,800 went out on the 15th. Annual insurance premium of $2,900 auto-debited on the 18th. So you had $10,900 in unusual outflows that ate your growth and then some.

- Sales Growth: +15%
- Balance Change: -$3,100
- Unusual Outflows: $10,900
- This Month: $62,400

---

#### Was Saturday worth it?

**Answer:**
Saturday brought in $7,840 across 162 orders. But here's the cost side: weekend staff was $2,400, food/beverage cost of goods was $2,740, and you had $180 in overtime bumps. Total cost to run Saturday: $5,320. That leaves you $2,520 in gross profit — about a 32% margin. Decent, but your weekday average margin is 41%. Saturdays are busier but less efficient.

- Revenue: $7,840
- Total Costs: $5,320
- Profit: $2,520
- Margin: 32% (vs 41% weekday avg)

---

#### Where's all my money going?

**Answer:**
This month you've spent $38,400 total. Here's the breakdown: Payroll is your biggest at $12,000 (31%), followed by suppliers/inventory at $9,800 (26%), rent at $4,500 (12%), card processing fees at $2,870 (7%), utilities at $2,340 (6%), chargebacks at $1,200 (3%), and other expenses at $5,690 (15%). Your processing fees alone are more than your electric bill.

- Total Spending: $38,400
- Payroll: $12,000 (31%)
- Processing Fees: $2,870 (7%)
- Chargebacks: $1,200 (3%)

---

#### How much did I actually make last week?

**Answer:**
Last week you brought in $14,820 in total sales across the register. After processing fees ($431), chargebacks ($180), and one pending hold ($85), your net settled amount was $14,124. Your bank received $14,124 from card settlements, plus $940 in cash deposits and a $200 catering check — so your actual total income was $15,264.

- Gross Sales: $14,820
- Processing Fees: $431
- Chargebacks: $180
- **Actual Income: $15,264**

---

### Scripted Flows — Account Maintenance

#### Change my business address

| Turn | Message |
|------|---------|
| User | Change my business address |
| Nanci | Sure. Your current business address on file is: **142 Oak Street, Austin, TX 78701**. What would you like to change it to? Please include street, city, state, and ZIP. |
| User | 456 Market St, San Francisco, CA 94105 |
| Nanci | Got it — just to confirm, you'd like to update your business address from 142 Oak Street, Austin, TX 78701 to: **456 Market St, San Francisco, CA 94105**. Is that correct? |
| User | Yes, that's correct. |
| Nanci | Done! Your business address has been updated to 456 Market St, San Francisco, CA 94105. The change will be reflected on your account within 1–2 business days. You'll receive a confirmation email at your primary address shortly. |

---

#### Update my primary email

| Turn | Message |
|------|---------|
| User | Update my primary email |
| Nanci | Of course. Your current primary email is **teresa.w@email.com** — this is where we send account notifications, receipts, and important updates. What would you like to change it to? |
| User | teresa.walker@walkerbiz.com |
| Nanci | Just to confirm — you want to change your primary email from teresa.w@email.com to **teresa.walker@walkerbiz.com**. Is that right? |
| User | Yes, go ahead. |
| Nanci | Your primary email has been updated to teresa.walker@walkerbiz.com. A confirmation link has been sent to your old address to verify the change. Future notifications will go to the new address once confirmed. |

---

#### Update my phone number

| Turn | Message |
|------|---------|
| User | Update my phone number |
| Nanci | No problem. Your current phone number on file is **(512) 334-7821**, used for account verification and support callbacks. What's the new number you'd like to use? |
| User | (415) 867-5309 |
| Nanci | To confirm — updating your contact number from (512) 334-7821 to **(415) 867-5309**. Correct? |
| User | That's right. |
| Nanci | Your phone number has been updated to (415) 867-5309. If you ever need to verify your account, that's the number we'll use going forward. |

---

#### Change my statement descriptor

| Turn | Message |
|------|---------|
| User | Change my statement descriptor |
| Nanci | Sure — your statement descriptor is what appears on your customers' credit card statements after a purchase. Your current descriptor is **"WALKER'S BOOKS"** (13 characters). What would you like it to say? Keep it under 22 characters so it displays cleanly. |
| User | WALKER BISTRO SF |
| Nanci | "WALKER BISTRO SF" is 16 characters — perfect. Just to confirm, this will replace "WALKER'S BOOKS" on all new transactions. Ready to update? |
| User | Yes, update it. |
| Nanci | Done! Your statement descriptor has been changed to "WALKER BISTRO SF". It will appear on all new transactions going forward. Existing pending transactions may still show the old descriptor. |

---

#### Update customer service phone

| Turn | Message |
|------|---------|
| User | Update customer service phone |
| Nanci | Got it. Your current customer service number is **(512) 334-7821** — this is what appears on receipts and cardholder dispute communications. What would you like to change it to? |
| User | (415) 555-0192 |
| Nanci | Confirm update from (512) 334-7821 to **(415) 555-0192** for customer service? This will appear on all future receipts. |
| User | Yes, confirm. |
| Nanci | Updated! Your customer service phone is now (415) 555-0192. Customers will see this number on their receipts starting with your next batch. |

---

#### Update my business name

| Turn | Message |
|------|---------|
| User | Update my business name |
| Nanci | I can help with that. Your business name is currently registered as **"Walker's Business Books LLC"**. What would you like to change it to? If this is a legal entity name change, you may need to provide supporting documentation such as an updated business license. |
| User | Walker Bistro & Events LLC |
| Nanci | Got it — changing from "Walker's Business Books LLC" to **"Walker Bistro & Events LLC"**. Is this a legal name change or just a DBA (doing business as) update? |
| User | It's a legal name change. |
| Nanci | Understood. Your business name has been updated to Walker Bistro & Events LLC. Since this is a legal name change, our compliance team may follow up within 2–3 business days to request a copy of your updated documentation. You'll receive a confirmation at your primary email shortly. |

---

## ISO Variant (`?embed=iso`)

**Persona:** ISO admin / service agent managing a portfolio of merchants.
**Data sources:** VisionWeb, Alloy, Middesk, Visa, Zendesk, Chargeback911, Salesforce, Mastercard, G2 Risk Solutions.

### Prompt Categories (Question Explorer)

#### Portfolio
- How is my portfolio performing MTD vs last month?
- Which merchants have the highest gross sales this week?
- Show me my top 10 merchants by volume YTD.
- Which merchants haven't processed in the last 7 days?
- How many new merchant activations did I have this month?
- What's my total portfolio volume for the last 90 days?

#### Boarding
- How many merchants are pending approval right now?
- Which merchants were boarded this month but haven't run their first batch yet?
- Show me my boarding pipeline for the last 30 days.
- How long does it take from application to first batch for new merchants?
- Which new merchants have the highest volume in their first 30 days?
- Show me the approval history and status for a specific merchant application.

#### Processing
- What's the total deposit volume for my portfolio today?
- Are any merchants missing batches from yesterday?
- Which merchants have the most non-qualifying transactions?
- Show me authorization trends for the past 30 days.
- Which merchants have unusually high keyed transaction rates?
- Which merchants had their largest batch ever this week?

#### Chargebacks
- Which merchants have the highest chargeback ratio this month?
- How many retrievals are still unresolved in my portfolio?
- Show me chargeback trends over the last 6 months.
- Which merchants are approaching chargeback thresholds?
- What are the most common chargeback reason codes this quarter?
- How does my portfolio chargeback rate compare to industry average?

#### Cases
- How many open cases are past their SLA deadline?
- Which ownership group has the most unresolved cases?
- Show me cases opened this week sorted by priority.
- What's the average age of open cases by issue type?
- Which merchants have the most open cases right now?
- How many cases were closed vs opened in the last 30 days?

#### Risk
- Which merchants triggered a risk alert this week?
- Show me all merchants flagged for velocity anomalies.
- What's the fraud exposure across my portfolio this month?
- Which merchants had their risk classification change recently?
- Show me merchants with suspicious transaction patterns.
- What's my portfolio's overall risk score distribution?

#### Merchants
- Pull up the profile for merchant ID 4892.
- Which merchants changed status in the last 30 days?
- Show me all merchants in the Southwest region.
- Which merchants are in the same chain as MID 7823?
- Find merchants with a risk score above 80.
- Which merchants have been inactive for more than 60 days?

---

### Scripted Q&A — ISO

#### How is my portfolio performing MTD vs last month?

**Answer:**

| Metric | MTD (May 1–21) | Apr 1–21 | Change |
|---|---|---|---|
| Gross Sales | $4,812,340 | $4,391,200 | **+9.6%** |
| Net Volume | $4,698,100 | $4,282,440 | **+9.7%** |
| Transaction Count | 31,847 | 29,103 | **+9.4%** |
| Active Merchants | 214 | 208 | **+2.9%** |
| Returns | $114,240 | $108,760 | +5.0% |
| Chargebacks | $18,920 | $21,440 | **−11.8%** |

Strong month overall. Volume is pacing ahead of April across the board, and chargebacks are trending down. At this rate you're on track to exceed last month's full total by roughly $800K.

---

#### Which merchants have the highest gross sales this week?

**Answer:**

Top 10 merchants by gross sales this week (May 15–21):

| Rank | Merchant | MID | Gross Sales | Txns |
|---|---|---|---|---|
| 1 | Harbor View Hotel | 4892 | $284,310 | 1,204 |
| 2 | Coastal Fresh Market | 7823 | $198,740 | 3,841 |
| 3 | Summit Auto Group | 3317 | $176,550 | 89 |
| 4 | Pinnacle Dental Group | 5509 | $141,200 | 312 |
| 5 | Riviera Day Spa Chain | 6641 | $118,890 | 987 |
| 6 | Blue Oak Brewing Co. | 2284 | $97,340 | 2,103 |
| 7 | Pacific Rim Restaurant | 8812 | $86,770 | 1,654 |
| 8 | Greenfield Hardware | 1193 | $74,220 | 918 |
| 9 | Westside CrossFit | 4470 | $61,340 | 488 |
| 10 | Canyon Road Bakery | 9934 | $54,880 | 2,291 |

Harbor View Hotel is well ahead — likely a conference or event weekend. Summit Auto's low transaction count with high volume is typical for their ticket size.

---

#### Show me my top 10 merchants by volume YTD.

**Answer:**

Top 10 merchants by gross volume, January 1 – May 21:

| Rank | Merchant | MID | YTD Volume | YTD Txns | Avg Ticket |
|---|---|---|---|---|---|
| 1 | Harbor View Hotel | 4892 | $3,241,880 | 14,312 | $226.50 |
| 2 | Summit Auto Group | 3317 | $2,918,440 | 1,047 | $2,787.00 |
| 3 | Coastal Fresh Market | 7823 | $2,104,320 | 41,208 | $51.06 |
| 4 | Pinnacle Dental Group | 5509 | $1,876,200 | 3,881 | $483.40 |
| 5 | Pacific Rim Restaurant | 8812 | $1,203,440 | 19,872 | $60.56 |
| 6 | Riviera Day Spa Chain | 6641 | $1,188,100 | 10,341 | $114.90 |
| 7 | Blue Oak Brewing Co. | 2284 | $1,044,780 | 22,104 | $47.26 |
| 8 | Greenfield Hardware | 1193 | $887,330 | 9,812 | $90.43 |
| 9 | Westside CrossFit | 4470 | $701,240 | 5,440 | $128.90 |
| 10 | Canyon Road Bakery | 9934 | $618,770 | 24,908 | $24.84 |

These 10 merchants account for $15.9M of your portfolio's $28.4M YTD volume — about 56% of total.

---

#### Which merchants haven't processed in the last 7 days?

**Answer:**

12 merchants in your portfolio haven't submitted a batch since May 14:

| Merchant | MID | Last Batch | Days Inactive | Status |
|---|---|---|---|---|
| Sunrise Yoga Studio | 2241 | May 13 | 8 days | Open |
| Elm Street Deli | 4417 | May 12 | 9 days | Open |
| Bayside Florist | 8803 | May 11 | 10 days | Open |
| Metro Dry Cleaners | 3362 | May 9 | 12 days | Open |
| Southpark Nails | 7718 | May 7 | 14 days | Open |
| Harbor Fish Co. | 5531 | Apr 30 | 21 days | Open |
| Riverbend Antiques | 1124 | Apr 28 | 23 days | Open |
| Park Ave Tailors | 9956 | Apr 22 | 29 days | Open |
| Westlake Pet Grooming | 6673 | Apr 18 | 33 days | Open |
| Dixon Auto Repair | 3389 | Apr 3 | 48 days | Open |
| Old Town Ice Cream | 2256 | Mar 17 | 65 days | Open |
| Brickyard Cafe | 4421 | Feb 28 | 82 days | Open |

The last 3 are worth a check-in — extended inactivity at 65+ days often signals equipment issues, closure, or an account that needs attention.

---

#### How many new merchant activations did I have this month?

**Answer:**

You had **17 new merchant activations** in May so far (through May 21):

| Category | Count |
|---|---|
| Restaurant / Food Service | 6 |
| Retail | 4 |
| Health & Beauty | 3 |
| Auto Services | 2 |
| Professional Services | 2 |
| **Total** | **17** |

For context, you averaged 14 activations per month in Q1. May is pacing ahead of that — you still have the rest of the month to go. The most recent activation was **Lakeview Ramen Bar** (MID 1047), activated May 20. Their first qualifying batch came in the same day.

---

#### What's my total portfolio volume for the last 90 days?

**Answer:**

| Period | Gross Volume | Net Volume | Transactions | Active Merchants |
|---|---|---|---|---|
| Feb 20 – Mar 21 | $7,214,880 | $7,041,200 | 52,341 | 198 |
| Mar 22 – Apr 21 | $7,891,440 | $7,704,100 | 56,812 | 206 |
| Apr 22 – May 21 | $8,340,220 | $8,142,300 | 61,047 | 214 |
| **90-Day Total** | **$23,446,540** | **$22,887,600** | **170,200** | — |

$23.4M gross over 90 days. Volume has been growing consistently — each 30-day period is up roughly 7–9% over the previous one.

---

#### What's the total deposit volume for my portfolio today?

**Answer:**

Today's deposit data as of 3:42 PM:

| Metric | Amount |
|---|---|
| Total Deposits | $284,112 |
| Deposit Count | 148 merchants |
| Avg Deposit per Merchant | $1,919 |
| Largest Single Deposit | $41,880 (Harbor View Hotel — MID 4892) |
| Pending / In Transit | $38,440 (21 merchants) |

Deposit volume is tracking about 6% above your 30-day daily average of $268K.

---

#### Are any merchants missing batches from yesterday?

**Answer:**

Yes — **9 merchants** that were active the prior week did not submit a batch yesterday (May 20):

| Merchant | MID | Last Batch | Normal Batch Day |
|---|---|---|---|
| Canyon Road Bakery | 9934 | May 18 | Daily |
| Pacific Rim Restaurant | 8812 | May 19 | Daily |
| Sunrise Yoga Studio | 2241 | May 13 | Mon–Sat |
| Elm Street Deli | 4417 | May 19 | Daily |
| Westside CrossFit | 4470 | May 18 | Daily |
| Blue Oak Brewing Co. | 2284 | May 19 | Daily |
| Greenfield Hardware | 1193 | May 18 | Mon–Sat |
| Riviera Day Spa Chain | 6641 | May 19 | Tue–Sat |
| Harbor Fish Co. | 5531 | Apr 30 | Daily |

Canyon Road Bakery and Harbor Fish Co. are the most notable — both are daily bathers with gaps of 2+ days.

---

#### Which merchants have the most non-qualifying transactions?

**Answer:**

Top merchants by non-qualifying transaction count, MTD (May 1–21):

| Merchant | MID | Non-Qual Txns | Total Txns | NQ Rate | Top Reason |
|---|---|---|---|---|---|
| Summit Auto Group | 3317 | 312 | 489 | 63.8% | Business/reward cards |
| Pinnacle Dental Group | 5509 | 208 | 1,102 | 18.9% | Card-not-present |
| Harbor View Hotel | 4892 | 194 | 4,218 | 4.6% | Internationally issued |
| Coastal Fresh Market | 7823 | 143 | 13,204 | 1.1% | Business cards |
| Pacific Rim Restaurant | 8812 | 118 | 6,841 | 1.7% | Reward cards |

Summit Auto Group's rate stands out — at 63.8%, over half their volume is non-qualifying.

---

#### Show me authorization trends for the past 30 days.

**Answer:**

| Week | Auth Count | Auth Amount | Approval Rate | Avg Auth Amount |
|---|---|---|---|---|
| Apr 22–28 | 14,204 | $1,812,440 | 94.1% | $127.60 |
| Apr 29–May 5 | 15,881 | $2,014,330 | 94.8% | $126.84 |
| May 6–12 | 16,340 | $2,188,110 | 95.2% | $133.91 |
| May 13–19 | 17,012 | $2,341,880 | 95.6% | $137.66 |

Authorization volume is up **+19.8%** over the 30-day window. Approval rate has improved from 94.1% → 95.6%, and average authorization amount is climbing (+7.9%).

---

#### Which merchants have unusually high keyed transaction rates?

**Answer:**

Merchants with keyed transaction rates above 20% (portfolio average is 4.2%), MTD:

| Merchant | MID | Keyed Rate | Keyed Txns | Total Txns | Note |
|---|---|---|---|---|---|
| Pinnacle Dental Group | 5509 | 61.4% | 677 | 1,102 | Phone/online billing |
| Summit Auto Group | 3317 | 48.2% | 236 | 489 | Deposits, remote sales |
| Westlake Pet Grooming | 6673 | 34.7% | 89 | 256 | Possible terminal issue |
| Old Town Ice Cream | 2256 | 28.1% | 43 | 153 | Seasonal staff, manual entry |
| Riverbend Antiques | 1124 | 24.6% | 31 | 126 | Custom orders |

Westlake Pet Grooming at 34.7% is worth a follow-up — their rate jumped from 8% last month, which could indicate a card reader malfunction.

---

#### Which merchants had their largest batch ever this week?

**Answer:**

**4 merchants** set new all-time batch records this week (May 15–21):

| Merchant | MID | Record Batch | Previous Record | Date | Likely Cause |
|---|---|---|---|---|---|
| Harbor View Hotel | 4892 | $41,880 | $38,240 | May 17 | Tech conference (500+ attendees) |
| Blue Oak Brewing Co. | 2284 | $18,440 | $16,910 | May 18 | Craft beer festival |
| Canyon Road Bakery | 9934 | $9,220 | $8,780 | May 16 | Mother's Day weekend catering |
| Westside CrossFit | 4470 | $7,340 | $6,890 | May 19 | Annual membership drive |

---

#### Which merchants have the highest chargeback ratio this month?

**Answer:**

| Merchant | MID | CB Ratio | CBs | Sales Volume | Threshold |
|---|---|---|---|---|---|
| Riverbend Antiques | 1124 | 1.84% | 4 | $21,740 | ⚠️ Near 2% |
| Old Town Ice Cream | 2256 | 1.42% | 3 | $21,126 | Monitoring |
| Brickyard Cafe | 4421 | 1.21% | 5 | $41,322 | Monitoring |
| Metro Dry Cleaners | 3362 | 0.98% | 2 | $20,408 | Normal |
| Bayside Florist | 8803 | 0.91% | 2 | $21,978 | Normal |

Portfolio average is **0.27%**. Riverbend Antiques is the one to watch — at 1.84% they're approaching the 2% threshold.

---

#### How many retrievals are still unresolved in my portfolio?

**Answer:**

| Age | Count | Amount |
|---|---|---|
| 0–10 days | 11 | $4,218 |
| 11–20 days | 7 | $2,891 |
| 21–30 days | 4 | $1,640 |
| 31+ days (at risk) | 1 | $440 |

**Total unresolved:** $9,189. The 1 retrieval at 31+ days is on **Elm Street Deli** (MID 4417) for $440 — if not responded to soon it will likely convert to a chargeback.

---

#### Show me chargeback trends over the last 6 months.

**Answer:**

| Month | Chargeback Count | CB Amount | CB Ratio | Retrieval Count |
|---|---|---|---|---|
| Dec 2025 | 48 | $28,440 | 0.38% | 31 |
| Jan 2026 | 52 | $31,120 | 0.41% | 36 |
| Feb 2026 | 44 | $26,880 | 0.35% | 28 |
| Mar 2026 | 41 | $24,340 | 0.32% | 24 |
| Apr 2026 | 38 | $21,440 | 0.29% | 22 |
| May 2026 (MTD) | 27 | $18,920 | 0.27% | 23 |

Clear downward trend — chargebacks are down 44% from the December peak. Your CB ratio has improved from 0.38% to 0.27%.

---

#### Which merchants are approaching chargeback thresholds?

**Answer:**

| Merchant | MID | Current CB Ratio | Visa/MC Threshold | Status |
|---|---|---|---|---|
| Riverbend Antiques | 1124 | 1.84% | 1.0% / 2.0% | 🔴 Above Early Warning |
| Old Town Ice Cream | 2256 | 1.42% | 1.0% / 2.0% | 🔴 Above Early Warning |
| Brickyard Cafe | 4421 | 1.21% | 1.0% / 2.0% | 🔴 Above Early Warning |

All three are above the **1.0% Early Warning threshold**. Riverbend Antiques at 1.84% is close to the 2.0% Standard Program level.

---

#### What are the most common chargeback reason codes this quarter?

**Answer:**

| Reason Code | Description | Count | Amount | % of CBs |
|---|---|---|---|---|
| 83 | Merchandise not as described | 24 | $14,220 | 36.9% |
| 53 | Not as described / defective | 18 | $10,840 | 27.7% |
| 41 | Cancelled recurring transaction | 9 | $3,120 | 13.8% |
| 10.4 | Fraud — card absent | 7 | $5,880 | 10.8% |
| 13.1 | Merchandise / service not received | 5 | $2,440 | 7.7% |
| Other | — | 2 | $860 | 3.1% |

Codes 83 and 53 together account for **64.6% of chargebacks**. Riverbend Antiques accounts for 11 of the 24 code-83 chargebacks alone.

---

#### How does my portfolio chargeback rate compare to industry average?

**Answer:**

| Metric | Your Portfolio | Industry Avg | Status |
|---|---|---|---|
| Overall CB Ratio (MTD) | 0.27% | 0.60% | ✅ Well below average |
| CB Ratio (Last 90 days) | 0.31% | 0.60% | ✅ Well below average |
| Fraud CBs as % of Total | 10.8% | 22.0% | ✅ Low fraud exposure |
| Retrieval-to-CB Conversion | 18.2% | 28.0% | ✅ Good resolution rate |
| Merchants Above 1% CB Ratio | 3 (1.4%) | — | ⚠️ 3 merchants to monitor |

---

#### How many open cases are past their SLA deadline?

**Answer:**

**7 open cases** have exceeded their SLA deadline as of today:

| Case # | Merchant | Issue | Opened | SLA Expired | Priority | Assigned To |
|---|---|---|---|---|---|---|
| CS-4412 | Riverbend Antiques | Chargeback dispute | May 8 | May 13 | High | Sarah M. |
| CS-4398 | Elm Street Deli | Terminal replacement | May 7 | May 12 | High | James T. |
| CS-4371 | Metro Dry Cleaners | Funding discrepancy | May 4 | May 11 | Medium | Sarah M. |
| CS-4340 | Harbor Fish Co. | Account reactivation | Apr 30 | May 7 | High | Unassigned |
| CS-4318 | Brickyard Cafe | Chargeback response | Apr 28 | May 5 | Medium | James T. |
| CS-4301 | Old Town Ice Cream | Rate change request | Apr 25 | May 2 | Low | Lisa K. |
| CS-4288 | Westlake Pet Grooming | Equipment issue | Apr 22 | Apr 29 | Medium | Unassigned |

CS-4340 and CS-4288 are both unassigned and past SLA — those should be the immediate priority.

---

#### Which ownership group has the most unresolved cases?

**Answer:**

| Ownership Group | Open Cases | Avg Age (days) | Past SLA | Unassigned |
|---|---|---|---|---|
| West Region Support | 18 | 8.4 | 3 | 2 |
| Merchant Services Tier 1 | 14 | 5.2 | 1 | 0 |
| Risk & Compliance | 11 | 12.1 | 2 | 1 |
| East Region Support | 9 | 4.8 | 1 | 0 |
| Technical Support | 7 | 6.3 | 0 | 0 |
| Unassigned | 4 | 11.2 | 2 | 4 |

**West Region Support** has the most open cases. **Risk & Compliance** has the oldest average age at 12.1 days.

---

#### Show me cases opened this week sorted by priority.

**Answer:**

Cases opened May 15–21, sorted by priority:

**High Priority (4)**

| Case # | Merchant | Issue | Opened | Assigned To |
|---|---|---|---|---|
| CS-4501 | Summit Auto Group | Funding hold — $41K batch | May 21 | Sarah M. |
| CS-4488 | Pinnacle Dental | Suspected fraud — 12 txns | May 19 | Risk & Compliance |
| CS-4471 | Harbor View Hotel | Chargeback — $3,240 | May 18 | James T. |
| CS-4462 | Coastal Fresh Market | Terminal down — 3 locations | May 17 | Tech Support |

**Medium Priority (6)**

| Case # | Merchant | Issue | Opened |
|---|---|---|---|
| CS-4499 | Blue Oak Brewing | Batch discrepancy $184 | May 21 |
| CS-4487 | Canyon Road Bakery | Rate inquiry | May 19 |
| CS-4478 | Greenfield Hardware | Address update | May 18 |
| CS-4465 | Westside CrossFit | ACH return question | May 17 |
| CS-4458 | Pacific Rim Restaurant | Card reader pairing | May 17 |
| CS-4451 | Riviera Day Spa | Statement access | May 16 |

**Low Priority (3)** — routine inquiries, all assigned.

---

#### What's the average age of open cases by issue type?

**Answer:**

| Issue Type | Open Cases | Avg Age (days) | Oldest Case |
|---|---|---|---|
| Chargeback Dispute | 11 | 14.2 | 23 days (CS-4288) |
| Funding / Deposit Issue | 8 | 9.7 | 18 days (CS-4318) |
| Equipment / Terminal | 7 | 6.4 | 15 days (CS-4340) |
| Account Maintenance | 6 | 4.1 | 9 days |
| Fraud Review | 4 | 11.8 | 19 days (CS-4488) |
| Rate / Fee Inquiry | 4 | 3.2 | 6 days |
| Compliance / Risk | 3 | 16.4 | 22 days |
| Other | 4 | 5.0 | 8 days |

**Chargeback Disputes** and **Compliance / Risk** cases are aging the most — both averaging 14+ days.

---

#### Which merchants have the most open cases right now?

**Answer:**

| Merchant | MID | Open Cases | Oldest Case | Past SLA | Top Issue |
|---|---|---|---|---|---|
| Harbor View Hotel | 4892 | 5 | 18 days | 1 | Chargebacks (3 cases) |
| Brickyard Cafe | 4421 | 4 | 23 days | 2 | Funding disputes |
| Riverbend Antiques | 1124 | 4 | 13 days | 1 | Merchandise chargebacks |
| Pinnacle Dental Group | 5509 | 3 | 2 days | 0 | Fraud review |
| Coastal Fresh Market | 7823 | 3 | 17 days | 1 | Terminal / equipment |

---

#### How many cases were closed vs opened in the last 30 days?

**Answer:**

| Metric | Count |
|---|---|
| Cases Opened | 47 |
| Cases Closed | 51 |
| Net Change | −4 (backlog shrinking) |
| Currently Open | 47 |
| Reopened Cases | 3 |
| Avg Time to Close | 6.8 days |

Good trend — you've been closing more than you open for three consecutive weeks.

---

#### Which merchants triggered a risk alert this week?

**Answer:**

| Merchant | MID | Alert Type | Triggered | Severity |
|---|---|---|---|---|
| Summit Auto Group | 3317 | Funding hold — batch exceeds 3× daily avg | May 21 | 🔴 High |
| Pinnacle Dental Group | 5509 | Potential fraud — 12 declined, then approved txns | May 19 | 🔴 High |
| Westlake Pet Grooming | 6673 | Keyed rate spike: 8% → 35% in 7 days | May 18 | 🟡 Medium |
| Riverbend Antiques | 1124 | CB ratio approaching 2.0% threshold | May 17 | 🟡 Medium |
| Harbor Fish Co. | 5531 | Processing gap — 21 days with no batch | May 16 | 🟡 Medium |
| Old Town Ice Cream | 2256 | Velocity anomaly — 3× normal txn count in 2 hrs | May 15 | 🔴 High |

Summit Auto and Pinnacle Dental are the two high-severity alerts requiring immediate review.

---

#### Show me all merchants flagged for velocity anomalies.

**Answer:**

| Merchant | MID | Anomaly | Normal Avg | Flagged Value | Flagged On |
|---|---|---|---|---|---|
| Old Town Ice Cream | 2256 | Txn burst — 94 txns in 90 min | 8–12/hr | 63/hr | May 15 |
| Pinnacle Dental Group | 5509 | Small-dollar cycling — 12 txns $1–$5 | Rare | 12 in 22 min | May 19 |
| Canyon Road Bakery | 9934 | Batch amount 4.1× 30-day avg | $2,240/day | $9,220 | May 16 |
| Blue Oak Brewing Co. | 2284 | Batch amount 3.9× 30-day avg | $4,720/day | $18,440 | May 18 |

Old Town Ice Cream and Pinnacle Dental show patterns consistent with fraud or account misuse.

---

#### What's the fraud exposure across my portfolio this month?

**Answer:**

| Category | Count | Amount |
|---|---|---|
| Confirmed fraud chargebacks (code 10.x) | 7 | $5,880 |
| Open fraud retrievals (unresolved) | 4 | $1,940 |
| Suspected fraud — under review | 3 | $2,210 |
| Fraud-related funding holds | 2 | $41,880 |
| **Total Exposure** | **16 incidents** | **$51,910** |

| Merchant | MID | Fraud Exposure | Type |
|---|---|---|---|
| Summit Auto Group | 3317 | $41,880 | Funding hold pending review |
| Pinnacle Dental Group | 5509 | $4,120 | Card testing + chargeback |
| Old Town Ice Cream | 2256 | $3,440 | Velocity fraud, disputed txns |
| Harbor View Hotel | 4892 | $2,470 | Confirmed fraud CBs |

Summit Auto's $41.9K funding hold represents 80% of total exposure.

---

#### Which merchants had their risk classification change recently?

**Answer:**

**Upgraded to Higher Risk (4)**

| Merchant | MID | From | To | Date | Reason |
|---|---|---|---|---|---|
| Old Town Ice Cream | 2256 | Standard | High Risk | May 9 | CB threshold exceeded |
| Dixon Auto Repair | 3389 | Standard | Suspended | May 15 | Processing gap + keyed rate |
| Riverbend Antiques | 1124 | Standard | Elevated | May 2 | CB ratio trend |
| Westlake Pet Grooming | 6673 | Standard | Elevated | May 18 | Keyed rate spike |

**Downgraded to Lower Risk (3)**

| Merchant | MID | From | To | Date | Reason |
|---|---|---|---|---|---|
| Pacific Rim Restaurant | 8812 | Elevated | Standard | May 14 | 90-day CB improvement |
| Greenfield Hardware | 1193 | Elevated | Standard | May 7 | Risk score dropped to 41 |
| Westside CrossFit | 4470 | High Risk | Standard | Apr 28 | 6-month clean record |

---

#### Show me merchants with suspicious transaction patterns.

**Answer:**

**Card Testing (small-dollar cycling)**
- **Pinnacle Dental Group** (MID 5509) — 12 transactions between $1.00–$4.99 processed in a 22-minute window on May 19.

**Unusual Transaction Velocity**
- **Old Town Ice Cream** (MID 2256) — 94 transactions in 90 minutes on May 15, average ticket $36.60.

**Split Ticket Pattern**
- **Riverbend Antiques** (MID 1124) — 6 transactions of exactly $499.99 on May 17, same card prefix (424242).

**Refund-to-Sale Ratio**
- **Brickyard Cafe** (MID 4421) — Refund volume is 14.2% of gross sales MTD vs. portfolio average of 2.4%.

**After-Hours Transactions**
- **Metro Dry Cleaners** (MID 3362) — 31% of transactions are processed between 11 PM–5 AM. Business hours on file: 7 AM–7 PM.

---

#### What's my portfolio's overall risk score distribution?

**Answer:**

Risk score distribution across **214 active merchants** as of today:

| Risk Tier | Score Range | Merchants | % of Portfolio | MTD Volume |
|---|---|---|---|---|
| Low Risk | 0–30 | 89 | 41.6% | $8,214,440 |
| Standard | 31–50 | 74 | 34.6% | $7,108,320 |
| Elevated | 51–70 | 36 | 16.8% | $4,812,110 |
| High Risk | 71–80 | 7 | 3.3% | $1,240,880 |
| Critical | 81–100 | 8 | 3.7% | $1,470,220 |

**Portfolio Average Risk Score: 38.4** — in the Standard range. The 15 merchants in High Risk and Critical tiers are generating $2.7M in MTD volume, about 12.1% of total.

---

#### How many merchants are pending approval right now?

**Answer:**

**23 merchants in the approval pipeline** as of today:

| Stage | Count | Avg Time in Stage |
|---|---|---|
| Application received | 6 | 1.2 days |
| Underwriting review | 9 | 3.4 days |
| Approval pending DDA verification | 5 | 2.1 days |
| Conditionally approved | 3 | 4.8 days |

**Oldest pending application:** Harborside Gym & Spa (submitted May 12 — 9 days). Currently stuck in underwriting review.

---

#### Which merchants were boarded this month but haven't run their first batch yet?

**Answer:**

| Merchant | MID | Approved | Days Since Activation | SIC/MCC |
|---|---|---|---|---|
| Eastside Barbershop | 1052 | May 19 | 2 days | 7230 (Beauty/Barber) |
| Lakeside Brewing Taproom | 1058 | May 15 | 6 days | 5812 (Restaurant) |
| Pacific Coast Pilates | 1061 | May 13 | 8 days | 7941 (Sports/Recreation) |
| Northgate Auto Detail | 1067 | May 10 | 11 days | 7542 (Auto Services) |
| Mesa Flower Studio | 1071 | May 8 | 13 days | 5992 (Florists) |

**Mesa Flower Studio** at 13 days without a batch is worth a follow-up.

---

#### Show me my boarding pipeline for the last 30 days.

**Answer:**

| Stage | Applications | Approved | Declined | Withdrawn |
|---|---|---|---|---|
| Restaurants / Food Service | 9 | 7 | 1 | 1 |
| Retail | 7 | 5 | 2 | 0 |
| Health & Beauty | 6 | 6 | 0 | 0 |
| Auto Services | 4 | 3 | 1 | 0 |
| Professional Services | 3 | 2 | 0 | 1 |
| Other | 4 | 4 | 0 | 0 |
| **Total** | **33** | **27** | **4** | **2** |

**Approval rate: 81.8%**. Of the 27 approved, 22 have submitted at least one qualifying batch.

---

#### How long does it take from application to first batch for new merchants?

**Answer:**

Time-to-first-batch for merchants activated Apr 22 – May 21 (22 merchants):

| Time to First Batch | Merchants | % |
|---|---|---|
| Same day as activation | 4 | 18.2% |
| 1–3 days | 9 | 40.9% |
| 4–7 days | 6 | 27.3% |
| 8–14 days | 3 | 13.6% |

**Median: 3 days** / **Average: 4.1 days**

| Stage | Avg Days |
|---|---|
| Application → Approval | 5.6 days |
| Approval → Equipment delivery | 2.8 days |
| Equipment delivery → First batch | 1.3 days |
| **Total: Application → First batch** | **9.7 days** |

---

#### Which new merchants have the highest volume in their first 30 days?

**Answer:**

| Merchant | MID | Activated | 30-Day Volume | Txn Count | Avg Ticket | SIC/MCC |
|---|---|---|---|---|---|---|
| Oceanfront Gifts | 3348 | May 12 | $84,320 | 1,204 | $70.03 | 5947 (Gift/Card/Novelty) |
| Mesa Verde Catering | 4415 | May 8 | $71,440 | 312 | $228.97 | 5812 (Restaurant) |
| Sunrise Pilates Studio | 2291 | May 17 | $58,880 | 984 | $59.84 | 7941 (Sports/Recreation) |
| Northpark Nail Salon | 5562 | May 3 | $48,210 | 1,641 | $29.38 | 7230 (Beauty/Barber) |
| Hillcrest Pet Supply | 6619 | Apr 25 | $41,770 | 887 | $47.09 | 5995 (Pet Shops) |

---

#### Show me the approval history and status for a specific merchant application.

| Turn | Message |
|------|---------|
| Nanci | Which merchant are you looking up? You can search by application number, business name, or the owner's name. |
| User | Harborside Gym & Spa |
| Nanci | **Application Status — Harborside Gym & Spa** · App #APP-2026-0841 · Submitted May 12, 2026 · Business Type: Health Club / Spa (MCC 7997) · Legal Name: Harborside Wellness LLC · Owner: Marcus T. Reyes · TIN: Verified ✅ · DDA: On file — pending micro-deposit verification ⏳ · **Current Status: Underwriting Review** (9 days) · Assigned Underwriter: Dana L. · **Blocker:** DDA micro-deposit confirmation not received. Merchant contacted May 17, no response. Recommend follow-up today. |

---

#### Pull up the profile for merchant ID 4892.

**Answer:**

**Merchant Profile — Harbor View Hotel** (MID 4892)

- Legal Name: Harbor View Hospitality LLC
- DBA: Harbor View Hotel
- Address: 1200 Harbor Drive, San Diego, CA 92101
- Phone: (619) 555-0142
- SIC/MCC: 7011 (Hotels & Motels)
- Status: Open — Active
- Approved: March 14, 2019
- Program: Interchange Plus · Processor: TSYS
- ISO: Pacific Coast Payments · Agent: Westfield Sales Group · Chain: Harbor Hospitality Group

**Processing MTD:** Gross Sales $284,310 · Net Volume $277,880 · Txns 1,204 · Avg Ticket $236.14 · CB Ratio 0.34%

**Open Cases:** 5 (1 past SLA) · **Last Batch:** May 21 — $41,880 (record)

---

#### Which merchants changed status in the last 30 days?

**Answer:**

**Newly Activated (6)**

| Merchant | MID | Activated | First Batch |
|---|---|---|---|
| Lakeview Ramen Bar | 1047 | May 20 | May 20 |
| Sunrise Pilates Studio | 2291 | May 17 | May 18 |
| Oceanfront Gifts | 3348 | May 12 | May 14 |
| Mesa Verde Catering | 4415 | May 8 | May 10 |
| Northpark Nail Salon | 5562 | May 3 | May 4 |
| Hillcrest Pet Supply | 6619 | Apr 25 | Apr 28 |

**Closed / Terminated (5)**

| Merchant | MID | Closed | Reason |
|---|---|---|---|
| Silverline Drycleaners | 7726 | May 19 | Merchant request |
| Corner Deli & Market | 8883 | May 11 | Business closed |
| Portside Barber | 9940 | May 6 | Non-performance |
| Bay Area Bookstore | 1114 | Apr 30 | Merchant request |
| Lakewood Florist | 2271 | Apr 24 | Business closed |

**Hold / Suspended (3)**

| Merchant | MID | Date | Reason |
|---|---|---|---|
| Dixon Auto Repair | 3389 | May 15 | Risk review |
| Old Town Ice Cream | 2256 | May 9 | Chargeback threshold |
| Brickyard Cafe | 4421 | Apr 29 | Funding dispute |

---

#### Show me all merchants in the Southwest region.

**Answer:**

**Southwest Region** — 38 merchants across AZ, NM, NV, and UT:

| State | Merchant Count | MTD Volume | Active |
|---|---|---|---|
| Arizona | 16 | $1,241,880 | 15 |
| Nevada | 11 | $984,440 | 10 |
| New Mexico | 7 | $412,320 | 7 |
| Utah | 4 | $218,770 | 4 |
| **Total** | **38** | **$2,857,410** | **36** |

**Top 5 by MTD Volume:**

| Merchant | MID | State | MTD Volume |
|---|---|---|---|
| Desert Ridge Resort | 5574 | AZ | $318,440 |
| Vegas Strip Steakhouse | 3312 | NV | $241,880 |
| Scottsdale Med Spa | 6631 | AZ | $198,220 |
| Red Rock Canyon Tours | 7788 | NV | $164,110 |
| Albuquerque Auto Center | 2245 | NM | $141,330 |

---

#### Which merchants are in the same chain as MID 7823?

**Answer:**

MID 7823 is Coastal Fresh Market — part of the **Fresh Coast Grocery Group** chain (Chain ID: CFG-001). 6 merchant IDs total:

| Merchant | MID | Location | Status | MTD Volume |
|---|---|---|---|---|
| Coastal Fresh Market *(HQ)* | 7823 | San Diego, CA | Active | $198,740 |
| Coastal Fresh — Mission Valley | 7824 | San Diego, CA | Active | $144,320 |
| Coastal Fresh — La Jolla | 7825 | La Jolla, CA | Active | $161,880 |
| Coastal Fresh — Chula Vista | 7826 | Chula Vista, CA | Active | $118,440 |
| Coastal Fresh — Escondido | 7827 | Escondido, CA | Active | $98,110 |
| Coastal Fresh — Oceanside | 7828 | Oceanside, CA | Active | $87,440 |

**Chain Total MTD:** $808,930 — your **#2 chain** by volume this month.

---

#### Find merchants with a risk score above 80.

**Answer:**

| Merchant | MID | Risk Score | CB Ratio | Keyed % | Status | Primary Flag |
|---|---|---|---|---|---|---|
| Riverbend Antiques | 1124 | 94 | 1.84% | 24.6% | Open | CB ratio + merchandise disputes |
| Old Town Ice Cream | 2256 | 91 | 1.42% | 28.1% | On Hold | CB threshold |
| Brickyard Cafe | 4421 | 88 | 1.21% | 12.4% | On Hold | Funding disputes, CB ratio |
| Dixon Auto Repair | 3389 | 87 | 0.44% | 38.2% | Suspended | High keyed rate, batch gap |
| Westlake Pet Grooming | 6673 | 85 | 0.31% | 34.7% | Open | Sudden keyed rate spike |
| Harbor Fish Co. | 5531 | 84 | 0.28% | 6.1% | Open | 21-day processing gap |
| Metro Dry Cleaners | 3362 | 83 | 0.98% | 11.2% | Open | CB trend increasing |
| Bayside Florist | 8803 | 81 | 0.91% | 8.4% | Open | CB ratio trending up |

Riverbend Antiques (94) and Old Town Ice Cream (91) are the highest-risk accounts.

---

#### Which merchants have been inactive for more than 60 days?

**Answer:**

| Merchant | MID | Last Batch | Days Inactive | MTD (Prior) | Notes |
|---|---|---|---|---|---|
| Old Town Ice Cream | 2256 | Mar 17 | 65 days | $14,880 | Account on hold since May 9 |
| Brickyard Cafe | 4421 | Feb 28 | 82 days | $41,320 | Funding dispute, on hold |
| Sunrise Yoga Studio | 2241 | Feb 12 | 98 days | $8,440 | No response to outreach |
| Dixon Auto Repair | 3389 | Jan 28 | 113 days | $22,100 | Suspended — risk review |

Sunrise Yoga Studio is the most concerning — 98 days with no response and no documented closure.
