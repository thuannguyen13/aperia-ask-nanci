// Flow 21: Business Loan Offer — single pre-filled loan application.
// ponytail: illustrative offer data only; not live lender terms.

interface LoanOffer {
  id: string;
  product: string; // what the merchant is offered, e.g. "Loan on Card"
  note: string; // what the product actually is, in the merchant's terms
  logo: string; // /business-loan-offer/<file>.png — optional at runtime (monogram fallback if missing)
  mark: string; // brand monogram label shown until the logo image loads
  color: string; // brand color behind the monogram
}

// Single offer — the demo targets one product, not a ranked list.
// Drop the card art at public/business-loan-offer/mastercard-installments.png (monogram fallback until then).
export const LOAN_OFFERS: LoanOffer[] = [
  {
    id: "mastercard-installments",
    product: "Loan on Card",
    note: "Financing provided by a participating lending partner. Funds delivered to your Business Mastercard, usable the moment they land. Fixed installments, no revolving balance.",
    logo: "/business-loan-offer/mastercard-installments.png",
    mark: "MC",
    color: "#EB001B",
  },
];

// The offer sized to THIS shortfall. The program maximums stay in `range` fine print —
// leading with $5M would make a $4,230 need look like a rounding error.
export const LOAN_SUGGESTED = {
  eyebrow: "Suggested for you",
  amount: "$4,500",
  cadence: "· 12 monthly payments",
  why: "Covers Friday's payroll with $270 left over. First payment due after your invoices clear.",
  range: "Program range: $2,500–$5,000,000, terms up to 25 years. Final rate and terms confirmed at approval.",
};

// "What this costs", shown above Submit — the cost of the money before the commit,
// not on a confirmation screen after it. Total and per-payment are derived so the
// figures can't drift apart; the APR is quoted rather than derived.
export const LOAN_COST = {
  title: "What this costs",
  principal: 4500,
  payments: 12,
  cadence: "monthly",
  perPayment: 423.9,
  // 12 x $423.90 = $5,086.80 on $4,500 borrowed → 1.938%/mo, i.e. 23.3% nominal APR
  // (25.9% effective). Quoted rather than solved for at render — see the panel.
  apr: "23.3%",
  note: "These figures are an estimate based on your pre-qualified terms. Final cost is confirmed before you accept.",
};
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
  requestedAmount: "$4,500",
  repaymentTerm: "12 monthly payments",
  purpose: "Payroll",
  avgMonthlyRevenue: "$32,500",
  fundingAccount: "Business Mastercard ···· 4821",
};

// The shortfall renders bold mid-sentence (see BusinessLoanOfferPanel).
export const LOAN_INSIGHT_PRE = "You're ";
export const LOAN_INSIGHT_BOLD = "$4,230 short";
export const LOAN_INSIGHT_POST =
  " for Friday's payroll. Based on your processing history you're pre-qualified for short-term financing that can help you manage this spend. I've sized it to your gap and scheduled repayment around the $6,800 landing Tuesday.";

export const LOAN_PREFILL_NOTE = {
  title: "Data is pre-filled.",
  body: "Your business information has been securely verified and pre-filled using your connected financial accounts.",
};

export const LOAN_CONSENT = "I authorize the participating lending partner to review my business information for pre-qualification and financing eligibility.";

// Step-up gate shown before the offer itself — see CARD_VERIFY for the reasoning.
export const LOAN_VERIFY = {
  title: "Verify it's you",
  body: "Your pre-qualified amount is based on your processing history. Confirm it's you and I'll show the terms.",
};

export const LOAN_REQUEST_REF = "AD-3307";
export const LOAN_SENT_TO = "Mastercard Loan Team";
export const LOAN_SUBMITTED_TITLE = "Loan Application Submitted";
export const LOAN_SUCCESS_MESSAGE = "Your loan request has been submitted for review. Once it's approved, you'll get a confirmation email at your primary address.";
