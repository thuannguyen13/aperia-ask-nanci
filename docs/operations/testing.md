# Checks and verification

**Read when:** running checks, and before and after any cleanup or refactor sweep

No `paths:` trigger on purpose — these are commands you choose to run, not rules that fire when you open a file. CLAUDE.md points here.

- `npm run check:flows` (`scripts/check-flows.ts`) — validates the flow registry is internally consistent: every routed key resolves to a conversation, nums and slugs unique. **Run it after touching flows.**
- `npm run check:docs` (`scripts/check-docs.ts`) — validates the discovery contract: every doc carries a `**Read when:**` marker, no file hardcodes a path to a doc, every trigger citation matches a real marker, no doc is hard-wrapped, and CLAUDE.md stays path-free. It scans README.md, CLAUDE.md, the docs tree and every `.ts`/`.tsx` comment, because source comments are where stale paths hid longest. **Run it after moving or renaming a doc, and after editing any `Read when` line** — a reworded trigger orphans the citations that named it, which is the one thing this design can still break.
- `npm run demo:urls` (`scripts/demo-urls.ts`) — regenerates `docs/artifacts/demo-urls.md`, the catalog of every demo URL (modes, embeddable flow slugs, layout-only entries, flows with no embed URL). Generated from `FLOW_DEFS` / `EMBED_VARIANTS`, so never hand-edit the doc — add a slug and rerun. `BASE=https://... npm run demo:urls` writes deployed URLs instead of localhost.
- `npm run lint` — ESLint is alive again via `eslint.config.mjs` (flat config, typescript-eslint + react-hooks; *not* `eslint-config-next`, which isn't flat-compatible under ESLint 9). Currently 0 errors; `exhaustive-deps` and set-state-in-effect are `warn` on purpose. tsconfig sets `noUnusedLocals` / `noUnusedParameters`.
- `npm run typecheck`, `npm run test` / `test:watch`, `npm run e2e` / `e2e:ui`.
- e2e shares the Turbopack `.next` lock, so running it means briefly stopping and restarting the user's `:3000` dev server. They've okayed doing that here — it's the one place that overrides the usual "never kill a dev server" rule.

## `npm run fallow`

Static analysis for dead code, duplication and complexity. **Run it before and after any cleanup or refactor**, and when the repo feels bloated — it answers that with data instead of instinct. The `fallow` skill carries the usage; what follows is only what this repo learned the hard way.

- **It sees what grep cannot** — its import graph resolves name shadowing, barrel re-exports and transitive deps. A hand-rolled grep sweep missed 15 dead exports it caught, including three in `api.ts` shadowed by same-named functions in `source-store.ts`. Use `fallow dead-code --trace <file>:<export>` before deleting anything it calls unused.
- **Never run `fallow fix` unreviewed here.** Its proposed config guesses `src/index` entry points (wrong for App Router) and writes blanket `"*"` suppressions.
- **One standing false positive:** `tailwindcss` as a prod dependency (build-time only under Tailwind 4). `formatPercent` used to be listed here too — that was wrong. It wasn't an intentional-API export awaiting a consumer, it had three call sites hand-rolling `.toFixed(n) + "%"` because nobody knew it existed. **Before exempting an "unused" shared primitive, grep for hand-rolled versions of what it does** — an unused primitive plus duplicated inline logic is adoption drift, not a false positive.
- **Deliberate, do not "fix":** the unused types in `api-types.ts` are the documented backend seam, and the cross-product clones (`HighRiskTable`/`RealertTable`, `page.tsx`/`RiskLanding`) keep Ask Nanci and Risk separable. Prefer `/** @expected-unused */` over deleting a seam type — it silences the finding and gets flagged if it ever goes stale.
- Before hand-unexporting constants used only in their own file, check `ignoreExportsUsedInFile: true` — it covers that whole category as config.
