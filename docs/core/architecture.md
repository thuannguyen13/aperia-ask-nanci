# Core architecture: verdict, known debt, adjacent work

**Read when:** proposing a refactor, or asking why something was not done

Read this before proposing a refactor. Most of the obvious targets here have already been considered and deliberately declined; the reasons are below.

## Verdict

A disciplined surface — strict types (0 `any`/`ts-ignore`), a clean `api.ts` backend seam, registry-driven panels — sitting on **one monolithic `contexts/AskNanciContext.tsx`** (~880 lines as of 2026-08-29, ~50 fields, 0 `useMemo`) that every interactive panel must edit. This is a well-organized *demo* being judged as a product; the demo-first mocking is load-bearing debt, and it's a stakeholder constraint — not the developer's fault, so don't frame it that way.

- **The per-token re-render fan-out is already fixed — don't re-plan it.** `pendingBot` lives in `contexts/ChatStreamContext.tsx`, split into separate state/setter contexts: the provider writes through the stable setter (never re-renders on a token), `ChatView` reads the state (re-renders per token, correctly). Wired at both entry points — `AppShell.tsx` and `app/risk/page.tsx`. Splitting anything *further* out of the god-context is tidiness only.
- **Memoizing the mega-context was deliberately not done** — a fragile 45-item `useMemo` deps array risks stale values for no real gain on a scripted demo.
- fallow will keep ranking `AskNanciContext.tsx` its #1 refactoring target on cognitive complexity alone. That signal is now spent: the perf win is banked, and what's left is a large diff with no user-facing gain. Skip it unless the file becomes hard to *author flows* in.
- A `PanelAction` protocol (pure `turnToPanelActions` mapper + one `applyPanelAction`, with an `action` seam on `ChatStreamChunk`) is the right shape for panel side effects. Nothing emits them yet; that wiring waits for a backend.
- **RSC is blocked by design, not effort** — all panels are client/mock-state-driven. Don't fake it.
- Live status for this work lives in `design-plans/embed-optimization-roadmap.md` **on the `embed-optimization` branch** (not present on `main`), not here.


## Adjacent work

- **Aperia Risk** (`risk-module` branch) — a risk-ops platform for payment-risk analysts (persona: Teresa Walker), built as a **skin of this concept app**, not a new codebase: reuse `AskNanciProvider`, `ChatView`, `ChatInput`, `ExplorePrompts`, recent chats, the concept-flow engine and generative panels; add an `aperia-risk` shell plus risk flows in the `flows.concept.ts` pattern. Figma: "[102137][60175] VisionWeb Risk — MC Brighterion", file `vBntDNzUNbsBIfK6MlhTas` (Ask Nanci landing `857:27832`, Dashboard `741:31171`, Workflows `626:43223`). **Ask Nanci appears in two placements** — the "Ask Nanci" nav item is the full-center home/chat, while Dashboard and Detection Queue get it as a **right-side drawer** over the data. An early `/risk` MVP inverted this and was wrong.
- **Financing flows target Mastercard.** See Read-when **changing demo data** for the flow 20 / 21 single-product rule.
- **The marketing decks are a different repo** — `../webflow` (remote `aperia-ask-nanci-marketing`), checked out locally as `~/Documents/code/aperia-ask-nanci-marketing`. Same product, static HTML embedded in Webflow. See its own CLAUDE.md.
