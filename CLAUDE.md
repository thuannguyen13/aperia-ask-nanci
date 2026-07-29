# Project Rules

## What this is

Ask Nanci is a conversational analytics assistant for business owners and ISOs in payment
processing — built for Aperia sales demos and leadership pitches.

**It is a front-end prototype, not real AI.** There is no backend anywhere: `lib/ask-nanci/api.ts`
is a documented stub over localStorage and is the sole swap-seam. Concept flows are hand-authored
product-story moments — closer to an interactive pitch than an app. UX polish and scripted-flow
fidelity matter more than data realism.

Stack: Next.js 16 + React 19 + TypeScript, `aperia-ds5`, Tailwind 4, Recharts, Lottie. All state is
React Context (no Redux/Zustand); sessions and sources persist to localStorage
(`asknanci_chats`, `asknanci_sources`, `ask_nanci_onboarded`).

**Three dispatch paths** in `handlePrompt` (`contexts/AskNanciContext.tsx`), all mocked:
1. `playConceptScripted` — concept autoplay flows with panels (`?mode=concept`, `concept-embed`)
2. `playScripted` over `SCRIPTED_CONVERSATIONS` — pre-authored clover/ISO persona conversations
3. `sendMessage` → `streamChat` → `findResponse` — keyword-matched canned fallback

**URL modes, one codebase:** default (sidebar + KB panel + sessions);
`?mode=clover|business-owner|iso` (chat-only embeds); `?mode=concept` (the panel demo).
Do not merge persona content — ISO, clover and concept are deliberately different personas.

## North star: adding a concept flow must get easier

Every change is scored by one acceptance test — **does adding the next concept flow get simpler and
more predictable?** If a change makes future flows harder to author, it's the wrong change no
matter how clean it looks in isolation. The recurring work here *is* authoring flows.

Prefer declarative, data-driven authoring (registry row + conversation + declarative turn effects)
over imperative wiring scattered across files. Hold senior/principal-level quality: established
patterns over clever ones, predictable file structure, consistent self-explanatory naming.
De-prioritize refactors that don't reduce flow-adding friction, however tempting architecturally.

## Operational constraints — read before any git or deploy action

- **`main` is intentionally pinned at `d718bba`** ("feat: render markdown tables in bot messages",
  2026-05-22). Another team develops against that exact baseline. Warn and get explicit
  confirmation before any `merge`, `reset`, or `push` that would move `main` past it — even if the
  request sounds casual. Working branch is `embed`.
- **Five URL modes are embedded on a live production site.** Anything touching their code paths is
  production-facing — verify in a browser, not just `next build`:
  `?mode=business-owner`, `?mode=clover`, `?mode=vw` (the three non-concept embeds, real chat app
  via the legacy `playScripted`/`sendMessage` path), `?mode=concept-embed&flow=2` (autoplays to
  **MerchantVolumePanel**), and `?mode=concept-embed&flow=11`.
  - **`flow=11` is NOT the Work Queue panel.** `CONCEPT_FLOW_SLUGS["11"]` maps to
    `CONCEPT_DETECT_WELCOME_KEY` — the Detection Queue greeting path. The welcome-grid "Work Queue"
    card (`num: 11`) and the embed slug `11` are different things.
  - **Embeds render `children` only** — no `Sidebar`, `UsageCard`, `SettingsDialog`,
    `DarkModeToggle`. Bugs confined to those (or to non-embedded flows 1, 5, 7) can't affect prod.
- Never `git push` without an explicit go-ahead.

## How to work with the user on this repo

- **Skip the code-quality review round.** When running subagent-driven development here, do
  spec-compliance verification only — does the diff match what was asked, nothing missing or extra.
  They said plainly: "i don't care about code quality review, the demo is missing panels." Getting
  to a demonstrable state beats review ceremony.
- **The working tree carries pre-existing uncommitted WIP in almost every file.** Before staging,
  `git diff <file>` against HEAD and stage only the hunks belonging to the current task. Warn
  implementer subagents explicitly — never assume a file is clean because your task touches two
  lines of it.
- **Take spatial instructions literally.** "Down below and share half of Pending Deposits" meant
  vertical stacking; the existing horizontal-split precedent in the codebase was allowed to
  override their actual words, and the layout had to be rebuilt. Re-read what they said before
  defaulting to what the code already does.
- **Don't abandon a CSS approach on an ambiguous screenshot.** A cut-off "Change" column looked
  like `table-fixed` was broken; it was a ~758px test viewport, and the same code was perfect at
  ~2000px. Check viewport width or reproduce it before concluding which mechanism is at fault.
- **After building from Figma screenshots, re-diff element by element before saying done.** On
  Account Change (Flow 16) an Export button was copied in reflexively, the header title was
  hardcoded across steps that show different titles, and an icon-in-circle became a bare icon — all
  visible in screenshots already saved locally, never re-opened.

## Side Panels

**Foundational principles live in `public/panels/index.html`** — the *why*: what a panel is,
the Four Parts layout (Navigation / Primary / Secondary / Tertiary), the three triggers (navigate,
summon, drill), the four rules of getting around, ship tests and open questions, with a playable
prototype. Derived from the production vision (`docs/demo-context/product-vision.mhtml`). Read it
first if you're deciding *whether* a panel is the right answer at all. It is the single source for
panel interaction principles (`panel-principles.md` was removed 2026-07-28).

It moved out of `docs/` on 2026-07-29 so the same Next app serves it: **`/panels`** alongside the
live console. Its "See it running" link points at **`/risk-phase1`** (the assistant-free Phase 1
console). The link is one-way: the console's top bar has no link back.
It is still one self-contained file with no local
asset dependencies (inline SVG, Google-hosted fonts), so it stays portable to the `../webflow`
marketing repo. `/panels` needs the rewrite in `next.config.mjs` because Next's static handler
serves exact paths only; `/panels/index.html` works without it.

**Design rules live in `.claude/rules/panel-design.md`** — content rules, the nine-shape pattern
library, visual rules, component structure and open/close animation. That file loads automatically
when you read anything under `components/ask-nanci/`. Read it directly if you're designing a panel
without opening one first. What stays here is the wiring: the stack, and how to register and open a
panel from a flow.

<!-- Split out 2026-07-22: CLAUDE.md was 393 lines against a 200-line guideline. The design
     material only matters when writing a panel component, so it became a path-scoped rule.
     The authoring/wiring material below deliberately stayed — the north star is that adding a
     flow gets easier, and that must not depend on having read a matching file first. -->

### One unified panel stack

There is no longer a "simple vs multi" split — every concept panel goes through one path.

- **Registry.** Every panel is an entry in the `PANELS` map in `components/ask-nanci/concept/panel-registry.ts`. `PanelId` is derived from its keys (`export type PanelId = keyof typeof PANELS`), so adding a key is all it takes to make a panel referenceable everywhere — there is no separate union to keep in sync. Panels that used to be one-off "simple" panels (`bank-account-form`, `step-up-auth`, `batch-detail`) are ordinary entries in this same map.
- **Open stack.** The open panels are an ordered `PanelId[]` managed by `usePanelStack` (`lib/ask-nanci/use-panel-stack.ts`) and exposed from `AskNanciContext` as `dynamicPanels`. Insertion order is render order; the stack is capped at 3 (chat is the conceptual 4th slot). Helpers: `openDynamic(id)` pushes a panel (idempotent — no-op if already open), `closeDynamicPanel(id)` / `closePanel(id)` removes one, `closeAllNewPanels()` / `resetDynamic()` clears the stack (and also resets per-panel views + the decline-report filter).
- **Layout.** `ConceptPanelArea` (`components/ask-nanci/concept/ConceptPanelArea.tsx`) renders `dynamicPanels`: each panel is one equal-height `PanelBox`, looked up by ID in `PANELS` and stacked vertically with a gap, in open order. There are no A/B/C/D grid slots and no `ResizablePanelGroup` in this layout.
- **Per-panel view state.** A separate `panelViews` record (`PanelId → view string`) is set by `setPanelView(id, view)` and cleared by `clearPanelView(id)`. This is what a turn's `view` field drives — the same panel component can render different views over the flow without being reopened.

### Opening panels from scripted flows

In `CONCEPT_SCRIPTED_CONVERSATIONS` turns, these fields drive panel effects (the real fields on `ConceptScriptedTurn` in `lib/ask-nanci/types.ts`). They're consumed by `applyTurnEffects` in `AskNanciContext.tsx`:

- `panel: "panel-id"` — ensures that panel is open (idempotent push onto the `dynamicPanels` stack)
- `view: "view-name"` — sets that panel's view; if omitted when `panel` is set, the panel resets to its own default view on open. Use together with `panel`.
- `closePanel: "panel-id"` — closes one panel (e.g. to replace it with another)
- `filterDeclineReport: true` — switches the decline-report panel into its filtered view
- `closeAllPanels: true` — resets all open panels (with a staggered close animation), plus panel views and the decline-report filter

### Adding a new panel

1. Create the panel component in `components/ask-nanci/concept/`
2. Import it and add a key + `{ component }` entry to the `PANELS` map in `panel-registry.ts` — `PanelId` updates automatically. There is no `PanelId` union to edit, no `PanelContent` switch, and no slot mapping.
3. To open it from a script, set `panel: "<its-key>"` on a turn (see above). No per-panel `case` in `playConceptScripted` is needed — `applyTurnEffects` opens any registered panel generically.

### Adding a new concept scripted flow

1. Add a flow definition to `FLOW_DEFS` in `lib/ask-nanci/data/flows.concept.ts`. The prompt lists are all *derived* from it — do not hand-edit them: `CONCEPT_ALL_PROMPTS` (from each flow's `key`), `CONCEPT_NO_RESET_PROMPTS` (from `keepSession` + `followups`), and `CONCEPT_MANUAL_PROMPTS` (from `manual`/`section` + `followups`).
2. Add the full turn sequence to `CONCEPT_SCRIPTED_CONVERSATIONS` keyed by the flow's `key`.
3. Wire panel effects in the turn objects with the real fields (see "Opening panels from scripted flows" above):
   - `panel: "panel-id"` to open a panel, optionally with `view: "view-name"`
   - `closePanel: "panel-id"` to close one, `filterDeclineReport: true` for the decline-report filter
   - `closeAllPanels: true` to reset at end of flow
4. If the flow needs a new panel, follow "Adding a new panel" above first

## Demo content

All demo data lives in `lib/ask-nanci/data/`. Never put mock content in component files.

- `data/responses.clover.ts` / `data/prompts.clover.ts` / `data/flows.clover.ts` — clover persona
- `data/flows.iso.ts` / `data/prompts.iso.ts` — ISO persona
- `data/flows.concept.ts` — concept demo flows and constants
- `data/overrides.business-owner.ts` — business-owner content overrides
- `data/sources.ts` — embed source arrays per variant
- `data/account.ts` — mock usage, plan tiers, activity, current user
- `data/merchants.ts` — merchant volume table data
- `data/panels/` — per-panel data (timeline rows, risk flags, batch lines, etc.); one file per panel

The lib shells (`mock-data.ts`, `embed-demo-config.ts`) contain logic alongside re-exports — edit
the `data/` files for content, these for routing/merge logic. `concept-config.ts` was removed;
import directly from `data/flows.concept.ts` and `data/merchants.ts`.

## Shared panel primitives

`components/ask-nanci/shared/` — import from `@/components/ask-nanci/shared`.

- `PanelShell` — the outer `flex h-full flex-col overflow-hidden` wrapper; replaces the raw div
- `PanelHeader` — shrink-0 header with title and close button built in
- `ScoreBadge` — colored score chip (used in BarometerReportPanel)
- `StatCard` — label/value/sublabel stat block, optional `emphasis` variant (used in SalesSnapshotPanel)
- `Callout` — severity callout box (`border-{color}-200 bg-{color}-50` pattern)
- `NanciInsight` — the blue "Nanci says" insight line (logomark + one paragraph) that leads a generative panel; borderless blue tint
- `PanelTable` / `Th` / `Td` — the one table recipe every panel table uses. `PanelTable` is the rounded-bordered `border-separate` `<table>` (text-xs, auto row dividers); wrap the header row in `<tr className="border-b bg-muted/40">` and use `<Th align>` (sentence-case, foreground, medium) for headers, `<Td align mono>` for cells. Never hand-roll a `<table>` or header `<th>` styling in a panel — the chat markdown table in `ChatMessage.tsx` is the only intentional exception (inline, borderless).
- `formatCurrency` / `formatPercent` — shared number formatters from `format.ts`

Use these instead of re-implementing the header/scroll structure, severity box, or table chrome in each panel.

## Naming conventions

Audited 2026-07-22 against the standard React conventions. The repo follows them, with one
deliberate divergence worth not re-litigating.

- **Components:** PascalCase file named for the component (`PanelTable.tsx` → `PanelTable`).
  Multi-component modules are named for their role instead (`offer-shared.tsx`, `charts.tsx`,
  `ChatMessage.tsx` → `UserMessage`/`BotMessage`) — that's intentional, not drift.
- **Non-component files: kebab-case** — `stream-words.ts`, `panel-actions.ts`, `use-panel-stack.ts`.
  **Not camelCase.** The generic React convention says camelCase, but that's the Create-React-App
  rule; the Next.js ecosystem is kebab, and so is this stack: Next.js core ships
  `add-base-path.js`/`app-bootstrap.js`, `aperia-ds5` ships `theme-provider.ts`, and the App
  Router *mandates* lowercase for `page.tsx`/`not-found.tsx`/`global-error.tsx`. All 47
  non-component files are kebab as of 2026-07-22. Don't convert to camelCase — it would put the
  repo out of step with both Next.js and our own design system.
- **Identifiers stay camelCase** — only filenames are kebab. `use-chat-scroll.ts` exports
  `useChatScroll`.
- **Filenames mirror what the file *is*, so the verb rule does not apply to them.** A file whose
  only export is one function takes that function's name (`stream-words.ts` → `streamWords`), and
  reads verb-first because the *function* does. A module or collection takes the domain noun
  (`session-store.ts`, `source-store.ts`, `panel-actions.ts`, `mock-data.ts`). An executable in
  `scripts/` is named for the action it performs (`check-flows.ts`). Next.js splits it the same
  way: `add-base-path.js` exports the single `addBasePath`; `app-bootstrap.js` is a module. So
  `session-store.ts` is correct and `store-session.ts` would not be — it has three exports, and
  "store" there is the noun (*the store for sessions*), not the verb.
- **Functions are verbs, values are nouns.** A non-component function name starts with a verb
  describing what it does (`fetchSessions`, `parseMode`, `turnToPanelActions`, `formatCurrency`);
  variables, objects and data exports are nouns or adjectives (`userData`, `FLAGS`, `isActive`).
  Boolean-returning helpers keep the `is`/`has`/`should` predicate form (`isAtBottom`,
  `hasRoomForAnswer`, `shouldFollowToBottom`) — that is the intended exception, not a violation.
  **Exempt:** terse fixture builders inside `*.test.ts` (`bank()`, `user()`, `turn()`, `p()`) and
  local helpers inside one-off `scripts/` — renaming those adds noise without adding clarity.
  Audited 2026-07-22: production code follows this. The one exported violation is `themeLogos(id)`
  in `data/theme-logos.ts`, a getter named as a noun — should be `getThemeLogos`, 6 call sites.
- **Hooks** `use*` (7/7), **callback props** `on*` (13/13), **constants** `UPPER_SNAKE_CASE`,
  **contexts** suffixed `Context` (never `Ctx`).
- **Known gap, deliberately not fixed:** 0 of 34 boolean states use an `is`/`has`/`should` prefix.
  There is a consistent internal pattern instead (`kbOpen`, `settingsOpen`, `sheetOpen`), which is
  fine. Bulk-renaming them is a large diff with no user-facing gain — same call as the panel
  type-tier drift.

## Components

### Resizable panels (`ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`)

Imported from `aperia-ds5`.

- `ResizablePanelGroup` requires an `orientation` prop (`"horizontal"` or `"vertical"`)
- `ResizablePanel` takes `defaultSize` and `minSize` as percentages — sibling sizes must sum to 100
- `ResizableHandle` goes between panels; use `withHandle` to show the drag grip
- Add `key={layoutKey}` on the group whenever the panel set can change at runtime — forces a remount to avoid stale size state
- Groups can nest: a `ResizablePanel` can contain another `ResizablePanelGroup` with a different orientation

**Example — 2-column layout with vertical split in the left column:**
```tsx
<ResizablePanelGroup key={layoutKey} orientation="horizontal" className="h-full">
  <ResizablePanel defaultSize={50} minSize={20}>
    <ResizablePanelGroup orientation="vertical" className="h-full">
      <ResizablePanel defaultSize={55} minSize={15}>
        <TopContent />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45} minSize={15}>
        <BottomContent />
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={50} minSize={20}>
    <RightContent />
  </ResizablePanel>
</ResizablePanelGroup>
```

## Knowledge Base

Domain background (personas, merchant flows, demo questions) lives in `./docs/demo-context/`.
Read the relevant file there before answering questions about Ask Nanci's domain or workflows.

## Checks and verification

- `npm run check:flows` (`scripts/check-flows.ts`) — validates the flow registry is internally
  consistent: every routed key resolves to a conversation, nums and slugs unique. **Run it after
  touching flows.**
- `npm run fallow` — static analysis for dead code, duplication and complexity. **Run it before
  and after any cleanup or refactor**, and when the repo feels bloated — it answers that with data
  instead of instinct. The `fallow` skill carries the usage; what follows is only what this repo
  learned the hard way.
  - **It sees what grep cannot** — its import graph resolves name shadowing, barrel re-exports and
    transitive deps. A hand-rolled grep sweep missed 15 dead exports it caught, including three in
    `api.ts` shadowed by same-named functions in `sourceStore.ts`. Use
    `fallow dead-code --trace <file>:<export>` before deleting anything it calls unused.
  - **Never run `fallow fix` unreviewed here.** Its proposed config guesses `src/index` entry
    points (wrong for App Router) and writes blanket `"*"` suppressions.
  - **One standing false positive:** `tailwindcss` as a prod dependency (build-time only under
    Tailwind 4). `formatPercent` used to be listed here too — that was wrong. It wasn't an
    intentional-API export awaiting a consumer, it had three call sites hand-rolling
    `.toFixed(n) + "%"` because nobody knew it existed. **Before exempting an "unused" shared
    primitive, grep for hand-rolled versions of what it does** — an unused primitive plus
    duplicated inline logic is adoption drift, not a false positive.
  - **Deliberate, do not "fix":** the unused types in `api-types.ts` are the documented backend
    seam, and the cross-product clones (`HighRiskTable`/`RealertTable`, `page.tsx`/`RiskLanding`)
    keep Ask Nanci and Risk separable. Prefer `/** @expected-unused */` over deleting a seam
    type — it silences the finding and gets flagged if it ever goes stale.
  - Before hand-unexporting constants used only in their own file, check
    `ignoreExportsUsedInFile: true` — it covers that whole category as config.
- `npm run demo:urls` (`scripts/demo-urls.ts`) — regenerates `docs/demo-urls.md`, the catalog of
  every demo URL (modes, embeddable flow slugs, layout-only entries, flows with no embed URL).
  Generated from `FLOW_DEFS` / `EMBED_VARIANTS`, so never hand-edit the doc — add a slug and rerun.
  `BASE=https://... npm run demo:urls` writes deployed URLs instead of localhost.
- `npm run lint` — ESLint is alive again via `eslint.config.mjs` (flat config, typescript-eslint +
  react-hooks; *not* `eslint-config-next`, which isn't flat-compatible under ESLint 9). Currently 0
  errors; `exhaustive-deps` and set-state-in-effect are `warn` on purpose. tsconfig sets
  `noUnusedLocals` / `noUnusedParameters`.
- To reach non-embeddable flows (Case, Bulk, Risk, form, step-up) in `?mode=concept`, pre-set
  `localStorage.ask_nanci_onboarded = "1"` — `OnboardingDialog` otherwise blocks the welcome cards
  — then click the flow card's "Try it".
- e2e shares the Turbopack `.next` lock, so running it means briefly stopping and restarting the
  user's `:3000` dev server. They've okayed doing that here — it's the one place that overrides the
  usual "never kill a dev server" rule.

## Architecture verdict and known debt

A disciplined surface — strict types (0 `any`/`ts-ignore`), a clean `api.ts` backend seam,
registry-driven panels — sitting on **one monolithic `contexts/AskNanciContext.tsx`** (~729 lines,
~50 fields, 0 `useMemo`) that every interactive panel must edit. This is a well-organized *demo*
being judged as a product; the demo-first mocking is load-bearing debt, and it's a stakeholder
constraint — not the developer's fault, so don't frame it that way.

- **The per-token re-render fan-out is already fixed — don't re-plan it.** `pendingBot` lives in
  `contexts/ChatStreamContext.tsx`, split into separate state/setter contexts: the provider writes
  through the stable setter (never re-renders on a token), `ChatView` reads the state (re-renders
  per token, correctly). Wired at both entry points — `AppShell.tsx` and `app/risk/page.tsx`.
  Splitting anything *further* out of the god-context is tidiness only.
- **Memoizing the mega-context was deliberately not done** — a fragile 45-item `useMemo` deps array
  risks stale values for no real gain on a scripted demo.
- fallow will keep ranking `AskNanciContext.tsx` its #1 refactoring target on cognitive complexity
  alone. That signal is now spent: the perf win is banked, and what's left is a large diff with no
  user-facing gain. Skip it unless the file becomes hard to *author flows* in.
- A `PanelAction` protocol (pure `turnToPanelActions` mapper + one `applyPanelAction`, with an
  `action` seam on `ChatStreamChunk`) is the right shape for panel side effects. Nothing emits them
  yet; that wiring waits for a backend.
- **RSC is blocked by design, not effort** — all panels are client/mock-state-driven. Don't fake it.
- Live status for this work lives in `design-plans/embed-optimization-roadmap.md` **on the
  `embed-optimization` branch** (not present on `embed`), not here.

**Panel drift:** a 2026-07-22 audit of all 26 concept panels against the visual rules above found
132 findings — see `docs/panel-design-audit-2026-07-22.md`. Summary: the two-type-tier rule
is effectively unenforced (22 of 25 panels), and `Callout` / `PanelHeader` / `Td` are rebuilt inline
in 4–7 panels each. Treat the inline rebuilds as safe pure-deletion sweeps; **do not** bulk-fix the
type-tier drift unless asked — large diff, no user-facing gain. One real bug is open:
`MerchantVolumePanel.tsx` tints the "reason this opened" row off a static `rank === 1`, so after the
user hits a sort chip it highlights the wrong row.

## Visual DNA

The user finds visual problems hard to put into words and wants a named design language so words
become *pointers* rather than descriptions rebuilt from memory. Agreed direction:

- **Feel — precise & trustworthy.** Bank/analytics-tool rigor: tight, exact, monospace figures,
  restrained color. Confidence through rigor, not friendliness. (Closest to what the code already
  does.)
- **Density — adaptive.** Dense and efficient for data panels (tables, queues); calm and spacious
  for answer/summary panels. Density follows the data shape.

**How to help them decide:** don't ask them to describe from imagination. Point, don't describe
(screenshots). Compare, don't characterize ("why does A differ from B"). Treat a named feeling
("feels cheap", "cluttered") as data, not vagueness. Generate the checklist for them to react to —
reacting beats authoring. Run a drift audit before demos.

A rendered design-language reference page (every token, pattern and state side by side) is agreed
but deferred until after the current demo.

## Adjacent work

- **Aperia Risk** (`risk-module` branch) — a risk-ops platform for payment-risk analysts (persona:
  Teresa Walker), built as a **skin of this concept app**, not a new codebase: reuse
  `AskNanciProvider`, `ChatView`, `ChatInput`, `ExplorePrompts`, recent chats, the concept-flow
  engine and generative panels; add an `aperia-risk` shell plus risk flows in the `flows.concept.ts`
  pattern. Figma: "[102137][60175] VisionWeb Risk — MC Brighterion", file `vBntDNzUNbsBIfK6MlhTas`
  (Ask Nanci landing `857:27832`, Dashboard `741:31171`, Workflows `626:43223`).
  **Ask Nanci appears in two placements** — the "Ask Nanci" nav item is the full-center home/chat,
  while Dashboard and Detection Queue get it as a **right-side drawer** over the data. An early
  `/risk` MVP inverted this and was wrong.
- **Financing flows target Mastercard.** Flow 20 (Credit Card Offer) is reduced to one card,
  "Silicon Valley Bank Business Card"; Flow 21 (Business Loan) to one product, "Mastercard Business
  Installments" ($5M / 9.75% / 5–7 days / up to 25 yr) — the audience is Mastercard itself, so
  these show a single product, not a comparison list. Data lives in
  `lib/ask-nanci/data/panels/{credit-card,business-loan}-offer.ts` as single-element `*_OFFERS`
  arrays; card/loan art is pasted in by the user under `public/{credit-card,business-loan}-offer/`
  (monogram fallback until then) — not fetched. Both flows open their panel directly on
  "Yes, show me", with no intermediate assistant bubble.
- **The marketing decks are a different repo** — `../webflow` (remote `aperia-ask-nanci-marketing`).
  Same product, static HTML embedded in Webflow. See its own CLAUDE.md.
