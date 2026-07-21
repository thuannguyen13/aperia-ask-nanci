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

// Single Mastercard-branded offer — the demo targets one card, not a ranked list.
// Drop the card art at public/credit-card-offer/svb-business-card.png (monogram fallback until then).
export const CREDIT_CARD_OFFERS: CardOffer[] = [
  { id: "svb-business", name: "Silicon Valley Bank Business Card", bestFor: "Overall business credit card", annualFee: "$0", rewardsRate: "1.5%-5% | Cashback", introOffer: "$100,000", logo: "/credit-card-offer/svb-business-card.png", mark: "SVB", color: "#1B4D6B" },
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
  " Running that spend through the Silicon Valley Bank Business Card earns 1.5%–5% cashback — about $276/mo back at the base rate — with no annual fee and a $100,000 intro offer."

export const CARD_PREFILL_NOTE = {
  title: "Data is pre-filled.",
  body: "Your application is pre-filled from your connected account data.",
}

export const CARD_REQUEST_REF = "AD-3308"
export const CARD_SUCCESS_MESSAGE =
  "Your credit card application request has been submitted for review. Once it's approved, you'll get a confirmation email — and your new card will arrive in the mail within 7–10 business days."
