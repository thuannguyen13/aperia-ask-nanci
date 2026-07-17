// Flow 21: Business Loan Offer — ranked lender list + pre-filled application.
// ponytail: illustrative offer data only; not live lender terms.

export interface LoanOffer {
  id: string
  product: string // full display name, e.g. "SBA 7(a) Loan"
  maxAmount: string
  minRate: string
  fundsIn: string
  termLength: string
  logo: string // /logos/<id>.png — optional at runtime (monogram fallback if missing)
  mark: string // brand monogram label shown until the logo image loads
  color: string // brand color behind the monogram
}

export const LOAN_OFFERS: LoanOffer[] = [
  { id: "sba-7a",       product: "SBA 7(a) Loan",                                          maxAmount: "$5,000,000", minRate: "9.75%", fundsIn: "5–7 days",   termLength: "Up to 25 years",       logo: "/logos/sba-7a.png",      mark: "SBA",  color: "#002E6D" },
  { id: "fundbox",      product: "Fundbox - Line of Credit",                               maxAmount: "$250,000",   minRate: "36%",   fundsIn: "5–7 days",   termLength: "3 to 24 months",       logo: "/logos/fundbox.png",     mark: "FB",   color: "#1A6DFF" },
  { id: "bluevine",     product: "Bluevine - Line of Credit",                              maxAmount: "$200,000",   minRate: "14%",   fundsIn: "5–7 days",   termLength: "6 to 12 months",       logo: "/logos/bluevine.png",    mark: "BV",   color: "#1F6FEB" },
  { id: "wells-fargo",  product: "Wells Fargo BusinessLine® Line of Credit",               maxAmount: "$150,000",   minRate: "8.5%",  fundsIn: "5–10 days",  termLength: "Undisclosed",          logo: "/logos/wells-fargo.png", mark: "WF",   color: "#D71E28" },
  { id: "headway",      product: "Headway Capital - Line of Credit",                       maxAmount: "$100,000",   minRate: "39%",   fundsIn: "24–72 hrs",  termLength: "12 to 24 months",      logo: "/logos/headway.png",     mark: "HC",   color: "#0E7C61" },
  { id: "accion",       product: "Accion Opportunity Fund Small Business Working Capital Loan", maxAmount: "$250,000", minRate: "9.99%", fundsIn: "5–10 days", termLength: "18 mo. to 3 years", logo: "/logos/accion.png",      mark: "AOF",  color: "#E23A2E" },
  { id: "bofa",         product: "Bank of America Business Advantage Unsecured Term Loan",  maxAmount: "$100,000",   minRate: "9.5%",  fundsIn: "5–10 days",  termLength: "12 months to 5 years", logo: "/logos/bofa.png",        mark: "BofA", color: "#E31837" },
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
  requestedAmount: "$10,000",
  repaymentTerm: "6 months",
  purpose: "Capital Funding",
  avgMonthlyRevenue: "$62,500",
  fundingAccount: "•••• 4821",
}

export const LOAN_LIST_INSIGHT =
  "Rates range 8.5%–39%. Loans with lower rates (Wells Fargo 8.5%, SBA 9.75%) need longer time in business and slower funding. Higher rates (Fundbox 36%, Headway 39%) fund fast with easier qualification."

export const LOAN_REQUEST_REF = "AD-3307"
export const LOAN_SENT_TO = "Account Services team"
export const LOAN_SUCCESS_MESSAGE =
  "Your loan request has been submitted for review. Once it's approved, you'll get a confirmation email at your primary address."
