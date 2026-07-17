// Flow 20: Credit Card Offer — ranked business-card list + pre-filled application.
// ponytail: illustrative offer data only; not live issuer terms.

export type ApprovalChance = "High" | "Medium" | "Low"

export interface CardOffer {
  id: string
  name: string
  bestFor: string
  annualFee: string
  rewardsRate: string
  introOffer: string
  approvalChance: ApprovalChance
  logo: string // /logos/<id>.png — optional at runtime (monogram fallback if missing)
  mark: string // brand monogram label shown until the logo image loads
  color: string // brand color behind the monogram
}

export const CREDIT_CARD_OFFERS: CardOffer[] = [
  { id: "ink-unlimited",   name: "Ink Business Unlimited® Credit Card",          bestFor: "Overall business credit card",     annualFee: "$0",                         rewardsRate: "1.5%–5% Cashback", introOffer: "$1,000",         approvalChance: "High",   logo: "/logos/ink-unlimited.png",   mark: "Chase", color: "#117ACA" },
  { id: "spark-cash-plus", name: "Capital One Spark Cash Plus",                  bestFor: "No preset spending limit",          annualFee: "$150",                       rewardsRate: "2%–5% Cashback",   introOffer: "$2,000",         approvalChance: "High",   logo: "/logos/spark-cash-plus.png", mark: "C1",    color: "#004977" },
  { id: "spark-cash",      name: "Capital One Spark Cash",                       bestFor: "No foreign transaction fees",       annualFee: "$0 first year, then $95",    rewardsRate: "2%–5% Cashback",   introOffer: "$1,000",         approvalChance: "Medium", logo: "/logos/spark-cash.png",      mark: "C1",    color: "#004977" },
  { id: "amex-blue",       name: "The American Express Blue Business Cash™ Card", bestFor: "New businesses",                    annualFee: "$0",                         rewardsRate: "1%–2% Cashback",   introOffer: "$250",           approvalChance: "Medium", logo: "/logos/amex-blue.png",       mark: "AmEx",  color: "#006FCF" },
  { id: "ink-preferred",   name: "Ink Business Preferred® Credit Card",          bestFor: "Bonus category travel rewards",     annualFee: "$95",                        rewardsRate: "1x–5x Points",     introOffer: "100,000 Points", approvalChance: "Low",    logo: "/logos/ink-preferred.png",   mark: "Chase", color: "#117ACA" },
  { id: "spark-select",    name: "Capital One Spark Cash Select",                bestFor: "Unlimited 1.5% cash back",          annualFee: "$0",                         rewardsRate: "1.5%–5% Cashback", introOffer: "$750",           approvalChance: "Low",    logo: "/logos/spark-select.png",    mark: "C1",    color: "#004977" },
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
  requestedLimit: "$50,000",
  avgMonthlyCardSpend: "$18,420",
}

export const CARD_LIST_INSIGHT =
  "Based on what we know about your business, here are cards you may qualify for. Estimated cashback uses each card's lowest published rate against your $18,420/mo Sysco spend, since exact category bonuses vary by issuer. Actual returns could be higher."

export const CARD_REQUEST_REF = "AD-3308"
export const CARD_SUCCESS_MESSAGE =
  "Your card request has been submitted for review. Once it's approved, you'll get a confirmation email at your primary address."
