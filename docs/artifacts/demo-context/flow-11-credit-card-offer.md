# Credit Card Offer

**Flow name:** `credit-card-offer`
**Audience:** Merchant
**Description:** Nanci identifies a top vendor cost spike from live data, softly nudges toward a card option, and opens a sidebar panel on confirmation — leading to an application form and a fake pending-review state.

---

**User:** Who am I paying the most on food cost?

**Nanci:** Your largest food-cost vendor over the last 30 days is **Sysco Foodservice** — $18,420, about 34% of total food spend, up 6% from last month.
It might help to manage your spend with a business card built for this kind of purchasing — want me to show you what's available?
`[Source: Vendor Spend Breakdown]` `[Buttons: Yes → / No thanks]`

**User:** *(taps Yes)*
**← opens sidebar with card offer directly, no additional chat message**

---

### Sidebar: Credit Card Offer Card
- Rewards: **3% cashback** on food & vendor purchases, 1% on everything else
- Annual fee: **Free first year**, $95 after
- Cashback cap: $2,000/month in the 3% category
- Link: `View Terms`
- CTA: `Apply Now`

---

### Sidebar: Credit Card Application Form

**Business Info**
- Business Name
- Business Type (dropdown: LLC / Sole Prop / Corp / Partnership)
- Years in Business
- Industry (dropdown)
- EIN (Tax ID)

**Contact Info**
- Owner Full Name
- Email
- Phone Number
- Business Address

**Card Details**
- Requested Credit Limit (pre-filled from offer, editable)

**Financials**
- Average Monthly Revenue
- Estimated Monthly Card Spend

**Consent**
- Checkbox: "I authorize a credit check for this application"
- Submit button: `Apply Now`

---

### Sidebar: Success State
- Status badge: `Pending Review`
- Message: "Your application has been submitted for review. Nanci can surface offers like this, but the card issuer makes the final call — you'll hear back within 1–2 business days."
- Secondary line: "Application ID: `#CC-{random}`"
- Button: `Back to Chat`
