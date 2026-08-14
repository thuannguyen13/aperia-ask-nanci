// Flow 20: Credit Card Offer — single pre-filled card application.
// ponytail: illustrative offer data only; not live issuer terms.

interface CardOffer {
  id: string;
  bestFor: string;
  annualFee: string;
  rewardsRate: string;
  introOffer: string;
  purchaseApr: string;
}

/**
 * Everything that names the issuer, in one object per variant. `?brand=generic`
 * swaps the whole object, so an unbranded demo cannot half-rebrand — the logo,
 * the monogram, the colour and the "sent to" line move together or not at all.
 *
 * The terms below are unchanged either way: rates and fees are the product, not
 * the brand, and a demo that quietly altered them would be lying about the offer.
 */
interface CardBrand {
  name: string;
  logo: string; // optional at runtime — OfferLogo falls back to the monogram
  mark: string; // monogram label shown until the logo image loads
  color: string; // colour behind the monogram
  sentTo: string; // who the application goes to, on the audit record
}

const CARD_BRANDED: CardBrand = {
  name: "Citi Double Cash® Card",
  logo: "/credit-card-offer/citi-double-cash.png",
  mark: "CITI",
  color: "#056DAE",
  sentTo: "Citi",
};

// Named for what it is rather than who issues it, so nothing reads as a partner
// the audience does not have. Slate, because a brand colour would invent one.
const CARD_GENERIC: CardBrand = {
  name: "Business Rewards Card",
  logo: "/credit-card-offer/generic-credit-card.png",
  mark: "CARD",
  color: "#64748B",
  sentTo: "the issuer",
};

export const getCardBrand = (generic: boolean): CardBrand => (generic ? CARD_GENERIC : CARD_BRANDED);

// Single offer — the demo targets one card, not a ranked list. Terms are the real
// published Citi Double Cash terms (citi.com, July 2026).
export const CREDIT_CARD_OFFERS: CardOffer[] = [
  {
    id: "citi-double-cash",
    bestFor: "Flat 2% back on every purchase — 1% when you buy, 1% as you pay. No category caps or enrollment.",
    annualFee: "$0",
    rewardsRate: "2%",
    introOffer: "$200",
    purchaseApr: "18.24%–26.99%",
  },
];

// "What this is worth to you" — the reason to switch, in dollars. Stored as numbers
// so the monthly return, annual total and first-year value are derived, not retyped.
//
// Scale check, because these figures sit next to the sales flows: the demo merchant
// turns over $18,240/wk (WEEK_COMPARE in panels/sales-snapshot), so ~$79k/mo. Sysco at
// `monthlySpend` and `foodSpendShare` implies a total food spend of ~$23.7k, or ~30% of
// revenue — where a restaurant should sit (28–35% is the normal band). It used to read
// $18,420 at 34%, which implied ~$54k of food on $79k of sales: a 69% food-cost ratio no
// operator would survive, and obvious to anyone in the room who does the division.
export const CARD_VALUE = {
  title: "What this is worth to you",
  vendor: "Sysco",
  monthlySpend: 8050,
  /** Sysco's share of total food spend — a broadline distributor being the top third is normal. */
  foodSpendShare: 0.34,
  rate: 0.02,
  introBonus: 200,
  introThreshold: "$1,500 spend in 6 mo.",
  caveat:
    "You would clear the $1,500 bonus threshold in your first three days. This assumes you pay the balance in full each month — carrying a balance at 18.24%–26.99% costs more than 2% returns. Sysco may charge a card-acceptance fee; check before switching from ACH.",
};

// The disclosures a merchant should see before applying, not after.
export const CARD_FEES: { label: string; value: string }[] = [
  { label: "Purchase APR", value: "18.24%–26.99% variable" },
  { label: "Annual fee", value: "$0" },
  { label: "Employee cards", value: "$0" },
  { label: "Foreign transaction fee", value: "3%" },
  { label: "Late payment fee", value: "Up to $39" },
  { label: "Cash advance APR", value: "29.99% variable" },
];
export const CARD_FEES_TITLE = "Rates and fees";

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
  requestedLimit: "$45,000",
  requestedLimitHint: "Suggested: ~2× your monthly card-eligible spend",
  avgMonthlyCardSpend: "$31,800",
  avgMonthlyCardSpendHint: "From your connected vendor payments",
  employeeCards: "3 cards (kitchen, FOH, admin)",
};

export const CARD_EMPLOYEE_CARD_OPTIONS = ["3 cards (kitchen, FOH, admin)", "1 card", "None for now"];

/**
 * The three figures the merchant hears twice: once in the chat answer, once in the
 * panel that opens after it. Formatted here so both read from the same arithmetic —
 * they were typed out separately before, which is how a $368/mo return ended up
 * quoted beside an $18,420 spend at a 2% rate.
 */
const money = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;

export const CARD_FIGURES = {
  monthlySpend: money(CARD_VALUE.monthlySpend),
  foodSpendShare: `${Math.round(CARD_VALUE.foodSpendShare * 100)}%`,
  rewardsRate: `${Math.round(CARD_VALUE.rate * 100)}%`,
  monthlyReturn: money(CARD_VALUE.monthlySpend * CARD_VALUE.rate),
};

// Two paragraphs: the finding, then the offer. Lead sentence of each renders bold.
export const CARD_INSIGHT_LEAD = `Sysco is your top food-cost vendor at ${CARD_FIGURES.monthlySpend}/mo`;
export const CARD_INSIGHT_BODY = ` — ${CARD_FIGURES.foodSpendShare} of food spend, up 6% from last month. You're currently paying that by ACH, so it isn't earning anything.`;
export const CARD_INSIGHT_OFFER_PRE = `A business card with ${CARD_FIGURES.rewardsRate} cash back would return about `;
export const CARD_INSIGHT_OFFER_BOLD = `${CARD_FIGURES.monthlyReturn}/mo`;
export const CARD_INSIGHT_OFFER_POST = " on Sysco alone. Here's an offer you're pre-qualified for.";

export const CARD_PREFILL_NOTE = {
  title: "Data is pre-filled.",
  body: "Your business information has been securely verified and pre-filled using your connected financial accounts.",
};

export const CARD_CONSENT = "I authorize a credit check. I understand this is an application, not a guaranteed approval, and that it may result in a hard inquiry on my personal and business credit.";

// Step-up gate shown before the offer itself. Pre-qualified terms are derived from
// the merchant's own financial data, so the panel confirms who is asking before it
// shows them — the same reason the deposit-account change is gated.
export const CARD_VERIFY = {
  title: "Verify it's you",
  body: "Your pre-qualified terms are based on your connected account data. Confirm it's you and I'll show the offer.",
};

export const CARD_REQUEST_REF = "AD-3308";
export const CARD_SUCCESS_MESSAGE =
  "Your credit card application has been submitted for review. Once it's approved, you'll get a confirmation email and your new card will arrive in the mail within 7–10 business days.";
