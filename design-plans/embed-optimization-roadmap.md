# Embed Optimization — Roadmap

Branch: `embed-optimization` (from `embed`). Context: architecture audit found the app
is disciplined on the surface (strict types, clean `api.ts` seam, registry-driven panels)
but sits on one monolithic `AskNanciContext`. The safe/verifiable remediation is DONE
(commits below); this doc stages the three large refactors that were intentionally NOT
done blind because they'd break the working demo without a runtime test net.

## Done (committed on this branch)
- CI gate (`.github/workflows/ci.yml`) — typecheck/lint/check:flows/test + a separate E2E job on push & PR.
- Removed dead code: orphaned `charts` route, unused `playwright`, hardcoded LAN IP → `DEV_ORIGIN` env.
- App Router boundaries: `error.tsx` / `loading.tsx` / `not-found.tsx` / `global-error.tsx`.
- +34 unit tests (49 total): flow registry, keyword engine, `usePanelStack`, formatters.
- Fixed stale `CLAUDE.md` panel-wiring API.
- Fixed 2 dead pills (proactive-flow) → registered as fake follow-ups; guard test tightened to zero.
- **E2E safety net:** Playwright smoke suite (`e2e/concept-flows.spec.ts`, 3 tests) covering streaming +
  panel-open, wired into CI. Local runs need the default dev server free (shared Turbopack `.next` lock).
- **P0 step 1 (done, e2e-verified):** deduped `runConceptStep`/`runConceptAuto` into one `playAssistantTurn`.
- **P0 step 2 (done, e2e-verified):** `pendingBot` moved to a dedicated `ChatStreamProvider`
  (state/setter split-context) — kills the per-token re-render fan-out across ~40 consumers.

## Remaining (lower value now / separate projects)
The per-token perf problem — the headline of the P0 section below — is SOLVED. What's left of the context
split (extract the playback engine to its own module; carve Session/Sources/UI providers; memoize provider
values; relocate interactive-panel handlers) is now tidiness with diminishing returns, since `chatState`
only re-renders on phase boundaries (3–4×/message). P1 and P2 remain genuine follow-on projects.

---

## P0 — Split & de-monolith `AskNanciContext` (697 lines, ~50 fields, 0 useMemo)

**Why:** the provider passes an inline object literal, so **every streamed token
re-renders all ~43 consumers** (sidebar, settings, every panel). It also conflates chat +
sessions + sources + usage + 6 UI dialogs + ~250 lines of demo-playback engine, so every
interactive panel edits this one file. This is the true ceiling — perf, coupling, and
merge-conflict risk in one place.

**Do NOT do it in one sweep.** Incremental, each step independently shippable + verifiable:

1. **Extract the playback engine first (lowest risk, no consumer changes).** Move
   `runConceptStep` / `runConceptAuto` / `playConceptScripted` / `applyTurnEffects` and the
   duplicated close-ordering array (`["coastal-risk", …]` at ~:401 and ~:461) into
   `lib/ask-nanci/use-concept-playback.ts`, taking the setters it needs as params. Dedupe
   the ~90% overlap between `runConceptStep` and `runConceptAuto`. Shrinks the god-file by
   ~250 lines with the public context API unchanged. *Accept:* every concept flow still
   plays identically; `check:flows` + tests green.
2. **Carve the hot state into its own narrow provider.** `pendingBot` + `chatState` (the
   per-token churn) move into a `ChatStreamProvider` consumed ONLY by `ChatView` /
   `ChatMessage` / `ThinkingIndicator`. This is what kills the fan-out: token updates stop
   touching the sidebar/panels. *Blast radius:* find every `chatState`/`pendingBot` reader
   (grep) and repoint. *Accept:* streaming a long answer re-renders only the message list
   (verify with React DevTools "highlight updates"), sidebar/panels stay static.
3. **Split the rest by concern** — `Session`, `Sources`, `UI-dialogs` providers — and
   `useMemo` each provider value + `useCallback` all handlers. Interactive-panel handlers
   (`submitDisputeDraft`, `confirmAccountChange`, …) move next to the state they own.
4. Add integration tests around each new provider as you split (currently zero).

**Guardrail:** this must be driven in a running browser — the demo's streaming is core and
there's no test that catches a behavior regression yet. Do step 2 only with the dev server
open. If a step can't be verified live, stop.

## STATUS UPDATE

- **P0:** high-value work DONE + e2e-verified (playback dedup `52dcfa2`; `pendingBot` split
  `c368ae6` kills the per-token fan-out). Remaining P0 (Session/UI provider splits, memoization)
  is optional tidiness — deferred.
- **P1:** DONE + e2e-verified (`0e07067`). Panel effects normalized into a `PanelAction` protocol:
  pure `turnToPanelActions()` mapper + single `applyPanelAction()` applier back `applyTurnEffects`;
  `ChatStreamChunk` gained an `action` variant as the backend seam. The one remaining wire (a real
  backend emitting `action` chunks → one `applyPanelAction` call in the `sendMessage` stream loop)
  is intentionally NOT added — there is no emitter yet, so it would be dead code.
- **P2 — BLOCKED (not built, by design).** Verified: all 24 concept panels are `"use client"` and
  read client context (`usePanelView`/`useAskNanci`); zero server data fetching. RSC only helps a
  component that renders server-fetched data and sheds interactivity — none of these do. Their data
  IS client mock state mutated by the scripted flows. RSC migration requires a real backend/data
  model to exist first; forcing it now would hardcode data into server components and break the
  interactive demo. Revisit only after a real API exists (which also connects P1's `action` seam).

---

## P1 — Panel-action protocol (the real fake→real bridge)  ✅ done, see status above

**Why:** the concept flows open panels / set views by directly mutating React state; the
`ChatStreamChunk` protocol has no vocabulary for "open panel / set view / filter." So
"replace the mock with a real LLM" is easy for the keyword/table personas (they already map
to `streamChat`) but a redesign for the concept flows.

**Shape:** extend `ChatStreamChunk` with a typed `action` variant
(`{ type: "panel", op: "open"|"close"|"setView"|"reset", id?: PanelId, view?: string }`) that
a real tool-calling LLM emits and the stream consumer applies via the same `applyTurnEffects`
path. Then the scripted turns and a real backend share ONE action pipeline. *Accept:* a
scripted flow can be re-expressed as a stream of action chunks with no direct state mutation.

## P2 — Move read-only panels toward RSC

**Why:** 61/62 components are `"use client"`; `0` RSC/server fetch. Every panel ships to the
browser. Read-only panels (no interaction) are candidates once data comes from a real
backend. *Defer* until P0/P1 land — premature while everything is client mock state.

---

## Small follow-up (cheap)
- **Two dead pills** (`"Show my statement"`, `"Show me the transaction"`) in the auto-play
  proactive flow (`__proactive__` / `CONCEPT_FLOW6_KEY`) are alternate-branch pills on
  non-final turns; if clicked in their brief window they fall through to `sendMessage`. Fix:
  add both to `CONCEPT_FAKE_FOLLOWUPS` (or give them real branches). Note: a guard test in
  `flows.concept.test.ts` currently locks the exact set of unrouted pills — update it when
  fixing.
