# Demo content

**Read when:** changing demo data, or debugging what the assistant said

All demo data lives in `lib/ask-nanci/data/`. **Never put mock content in component files.**

## Three dispatch paths

Everything the assistant "answers" comes from one of three mocked paths in `handlePrompt`
(`contexts/AskNanciContext.tsx`). Start here when output looks wrong.

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

The lib shells (`mock-data.ts`, `embed-demo-config.ts`) contain logic alongside re-exports: edit
the `data/` files for content, these for routing/merge logic. `concept-config.ts` was removed;
import directly from `data/flows.concept.ts` and `data/merchants.ts`.

## Personas are deliberately separate

**Do not merge persona content.** ISO, clover and concept are different personas on purpose.

## Financing flows target Mastercard

Flow 20 (Credit Card Offer) is reduced to one card, "Silicon Valley Bank Business Card"; Flow 21
(Business Loan) to one product, "Mastercard Business Installments" ($5M / 9.75% / 5–7 days / up to
25 yr). The audience is Mastercard itself, so these show a single product, not a comparison list.
Data lives in `lib/ask-nanci/data/panels/{credit-card,business-loan}-offer.ts` as single-element
`*_OFFERS` arrays; card/loan art is pasted in by the user under
`public/{credit-card,business-loan}-offer/` (monogram fallback until then), not fetched. Both flows
open their panel directly on "Yes, show me", with no intermediate assistant bubble.
