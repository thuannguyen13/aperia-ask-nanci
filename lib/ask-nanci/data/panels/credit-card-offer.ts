// Flow 20: Credit Card Offer — single pre-filled card application.
// ponytail: illustrative offer data only; not live issuer terms.

export interface CardOffer {
  id: string
  name: string
  bestFor: string
  annualFee: string
  rewardsRate: string
  introOffer: string
  logo: string // /credit-card-offer/<file>.png — optional at runtime (monogram fallback if missing)
  mark: string // brand monogram label shown until the logo image loads
  color: string // brand color behind the monogram
}

// Single offer — the demo targets one card, not a ranked list. Terms are the real
// published Citi Double Cash terms (citi.com, July 2026).
export const CREDIT_CARD_OFFERS: CardOffer[] = [
  { id: "citi-double-cash", name: "Citi Double Cash® Card", bestFor: "Flat-rate cash back on every purchase", annualFee: "$0", rewardsRate: "2% | Cashback", introOffer: "$200", logo: "/credit-card-offer/citi-double-cash.png", mark: "CITI", color: "#056DAE" },
]

// Pre-filled from the merchant's connected data (see CARD_APPLICANT usage in the form view).
export const CARD_APPLICANT = {
  businessName: "Sunrise Bistro LLC",
  ein: "84-1029384",
  industry: "Restaurant",
  businessType: "LLC",
  ownerName: "Teresa Walker",
  businessAddress: "128 Main St, Allen, TX 75013",
  email: "teresawalker@example.com",
  phone: "(214) 555-0148",
  requestedLimit: "$0",
  avgMonthlyCardSpend: "$0",
}

// Lead sentence renders bold, the rest regular (see CreditCardOfferPanel).
export const CARD_INSIGHT_LEAD = "Sysco is your top food-cost vendor at $18,420/mo."
export const CARD_INSIGHT_BODY =
  " Running that spend through the Citi Double Cash Card earns 2% back — 1% when you buy, 1% as you pay — about $368/mo on Sysco alone, with no annual fee and a $200 bonus after $1,500 in purchases in your first 6 months."

export const CARD_PREFILL_NOTE = {
  title: "Data is pre-filled.",
  body: "Your application is pre-filled from your connected account data.",
}

export const CARD_REQUEST_REF = "AD-3308"
export const CARD_SENT_TO = "Citi"
export const CARD_SUCCESS_MESSAGE =
  "Your credit card application request has been submitted for review. Once it's approved, you'll get a confirmation email — and your new card will arrive in the mail within 7–10 business days."
