# Business Loan Offer

**Flow name:** `business-loan-offer`
**Audience:** Merchant
**Description:** Nanci flags a payroll cash shortfall from live data, softly nudges toward a loan option, and opens a sidebar panel on confirmation — leading to an application form and a fake pending-review state.

---

**User:** Do I have enough money for payroll?

**Nanci:** Looking at your current balance and upcoming payroll run, you're projected to be **$4,230 short** on Friday. Two open invoices ($6,800 total) aren't expected to land until early next week — after payroll is due.
It might help to manage your spend with a short-term option — want me to show you what's available?
`[Source: Cash Flow Forecast]` `[Buttons: Yes → / No thanks]`

**User:** *(taps Yes)*
**← opens sidebar with loan offer directly, no additional chat message**

---

### Sidebar: Loan Offer Card
- Amount available: **$5,000**
- Funding timeline: **Funds within 72 hours**
- Fee: **6.9% flat**, repaid over 90 days from daily card sales
- Link: `View Terms`
- CTA: `Apply Now`

---

### Sidebar: Loan Application Form

**Business Info**
- Business Name
- Business Type (dropdown: LLC / Sole Prop / Corp / Partnership)
- Years in Business
- Industry (dropdown, e.g. Restaurant / Retail / Services)
- EIN (Tax ID)

**Contact Info**
- Owner Full Name
- Email
- Phone Number

**Loan Details**
- Requested Amount (pre-filled $5,000, editable)
- Purpose of Loan (dropdown: Payroll / Inventory / Equipment / Other)
- Preferred Repayment Term (dropdown: 60 / 90 / 120 days)

**Financials**
- Average Monthly Revenue
- Bank Account for Funding (masked/last 4 digits)

**Consent**
- Checkbox: "I authorize a review of my business financials"
- Submit button: `Submit Application`

---

### Sidebar: Success State
- Status badge: `Pending Review`
- Message: "Your application has been submitted. Nanci flags opportunities like this, but final approval happens through your lender partner — you'll hear back within 1–2 business days."
- Secondary line: "Application ID: `#LN-{random}`"
- Button: `Back to Chat`
