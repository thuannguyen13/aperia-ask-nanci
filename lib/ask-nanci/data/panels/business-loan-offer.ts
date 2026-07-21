// Flow 21: Business Loan Offer — single pre-filled loan application.
// ponytail: illustrative offer data only; not live lender terms.

export interface LoanOffer {
  id: string
  product: string // full display name, e.g. "SBA 7(a) Loan"
  note: string // one-line terms caveat shown under the product name
  maxAmount: string
  minRate: string
  fundsIn: string
  termLength: string
  logo: string // /business-loan-offer/<file>.png — optional at runtime (monogram fallback if missing)
  mark: string // brand monogram label shown until the logo image loads
  color: string // brand color behind the monogram
}

// Single Mastercard-branded offer — the demo targets one product, not a ranked list.
// Drop the card art at public/business-loan-offer/mastercard-installments.png (monogram fallback until then).
export const LOAN_OFFERS: LoanOffer[] = [
  { id: "mastercard-installments", product: "Instant Funds via Loan on Card", note: "Up to $5,000,000, funded by a participating lender through Mastercard's card network. Terms confirmed at approval.", maxAmount: "$5,000,000", minRate: "9.75%", fundsIn: "5–7 days", termLength: "Up to 25 years", logo: "/business-loan-offer/mastercard-installments.png", mark: "MC", color: "#EB001B" },
]

// Pre-filled from the merchant's connected data (see LOAN_APPLICANT usage in the form view).
export const LOAN_APPLICANT = {
  businessName: "Sunrise Bistro LLC",
  ein: "84-1029384",
  industry: "Restaurant",
  businessType: "LLC",
  ownerName: "Teresa Walker",
  businessAddress: "128 Main St, Allen, TX 75013",
  email: "teresawalker@example.com",
  phone: "(214) 555-0148",
  requestedAmount: "$",
  repaymentTerm: "",
  purpose: "",
  avgMonthlyRevenue: "$32,500",
  fundingAccount: "•••• 4821",
}

// The shortfall renders bold mid-sentence (see BusinessLoanOfferPanel).
export const LOAN_INSIGHT_PRE = "You're "
export const LOAN_INSIGHT_BOLD = "$4,230 short"
export const LOAN_INSIGHT_POST =
  " for Friday's payroll. Loan on Card can cover it — up to $5,000,000 available through Mastercard's network, funds in 5–7 days. Repay once your $6,800 in invoices land next week."

export const LOAN_PREFILL_NOTE = {
  title: "Data is pre-filled.",
  body: "Your application is pre-filled from your connected accounts.",
}

export const LOAN_REQUEST_REF = "AD-3307"
export const LOAN_SENT_TO = "Mastercard Loan Team"
export const LOAN_SUBMITTED_TITLE = "Loan Application Submitted"
export const LOAN_SUCCESS_MESSAGE =
  "Your loan request has been submitted for review. Once it's approved, you'll get a confirmation email at your primary address."
