// Content overrides for embed variants.
// Keys match MockResponse.id. Only responses listed here get alternate text;
// all others fall through to the default Clover content.

function makeBankMatchOverride(sourceName: string): Record<string, string> {
  return {
    "bank-match":
      `Two deposits from Friday ($847 and $456) are still in transit and will post Monday. Once they post, the gap between your ${sourceName} sales and your bank balance narrows to $12 — which is your processing fee for the period.\n\n**Reconciliation summary**\n\n- ${sourceName} sales: $4,827\n- Bank deposits: $3,512\n- Difference: $1,315 (in-transit + fees)`,
  }
}

export const BUSINESS_OWNER_CONTENT_OVERRIDES: Record<string, string> = makeBankMatchOverride("AccessOne")
export { makeBankMatchOverride }
