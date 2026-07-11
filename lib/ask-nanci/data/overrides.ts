// Content overrides for embed variants. Keys match MockResponse.id.
// Only responses listed here get alternate text; all others fall through to the
// default Clover content. business-owner and vw are Clover re-skins that only
// differ by brand name in the bank-match reconciliation answer.

const bankMatch = (brand: string): Record<string, string> => ({
  "bank-match":
    `Two deposits from Friday ($847 and $456) are still in transit and will post Monday. Once they post, the gap between your ${brand} sales and your bank balance narrows to $12 — which is your processing fee for the period.\n\n**Reconciliation summary**\n\n- ${brand} sales: $4,827\n- Bank deposits: $3,512\n- Difference: $1,315 (in-transit + fees)`,
})

export const VARIANT_CONTENT_OVERRIDES: Record<string, Record<string, string>> = {
  "business-owner": bankMatch("AccessOne"),
  "vw": bankMatch("VisionWeb"),
}
