# Embed Optimization — Roadmap

Branch: `embed-optimization` (from `embed`). Context: architecture audit found the app
is disciplined on the surface (strict types, clean `api.ts` seam, registry-driven panels)
but sits on one monolithic `AskNanciContext`. The safe/verifiable remediation is DONE
(commits below); this doc stages the three large refactors that were intentionally NOT
done blind because they'd break the working demo without a runtime test net.

## Done (committed on this branch)
- CI gate (`.github/workflows/ci.yml`) — typecheck/lint/check:flows/test on push & PR.
- Removed dead code: orphaned `charts` route, unused `playwright`, hardcoded LAN IP → `DEV_ORIGIN` env.
- App Router boundaries: `error.tsx` / `loading.tsx` / `not-found.tsx` / `global-error.tsx`.
- +34 tests (49 total): flow registry, keyword engine, `usePanelStack`, formatters.
- Fixed stale `CLAUDE.md` panel-wiring API.

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

## P1 — Panel-action protocol (the real fake→real bridge)

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
