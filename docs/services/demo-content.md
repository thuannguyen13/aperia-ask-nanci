# Demo content

**Read when:** changing demo data, or debugging what the assistant said

All demo data lives in `lib/ask-nanci/data/`. **Never put mock content in component files.**

Some values are calculated from others so the arithmetic stays consistent. Where a calculation exists, such as `sales / transactions`, edit the inputs rather than the result: never replace a calculation with a typed number. A figure appearing in both the chat and its panel should be derived in one place, not typed twice.

## Three dispatch paths

Everything the assistant "answers" comes from one of three mocked paths in `handlePrompt` (`contexts/AskNanciContext.tsx`). Start here when output looks wrong.

1. `playConceptScripted` — concept autoplay flows with panels (`?mode=concept`, `concept-embed`)
2. `playScripted` over `SCRIPTED_CONVERSATIONS` — pre-authored clover/ISO persona conversations
3. `sendMessage` → `streamChat` → `findResponse` — keyword-matched canned fallback

## Where content lives

- `data/responses.clover.ts` / `data/prompts.clover.ts` / `data/flows.clover.ts` — clover persona
- `data/flows.iso.ts` / `data/prompts.iso.ts` — ISO persona
- `data/flows.concept.ts` — concept demo flows and constants
- `data/overrides.ts` — per-variant content overrides, keyed by variant in `VARIANT_CONTENT_OVERRIDES`
- `data/sources.ts` — embed source arrays per variant
- `data/account.ts` — mock usage, plan tiers, activity, current user
- `data/merchants.ts` — merchant volume table data
- `data/panel-ui.ts` — mobile panel presentation candidates (see Read-when **panel layout**)
- `data/panels/` — per-panel data (timeline rows, risk flags, batch lines, etc.); one file per panel

The lib shells (`mock-data.ts`, `embed-demo-config.ts`) contain logic alongside re-exports: edit the `data/` files for content, these for routing/merge logic.

## Personas are deliberately separate

**Do not merge persona content.** ISO, clover and concept are different personas on purpose.

## Financing flows target Mastercard

The audience is Mastercard itself, so these show a single product, not a comparison list: Flow 20 (Credit Card Offer) shows one card, "Silicon Valley Bank Business Card"; Flow 21 (Business Loan) one product, "Mastercard Business Installments" ($5M / 9.75% / 5–7 days / up to 25 yr). Data lives in `lib/ask-nanci/data/panels/{credit-card,business-loan}-offer.ts` as single-element `*_OFFERS` arrays; card/loan art is pasted in by the user under `public/{credit-card,business-loan}-offer/` (monogram fallback until then), not fetched. Both flows open their panel directly on "Yes, show me", with no intermediate assistant bubble.
