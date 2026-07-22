# Flow System Cleanup Plan

Status: **proposed, not started** · Branch: `embed` · Last updated: 2026-07-13

A staged plan to remove the drift in the concept-demo flow system. The panels
and `data/` layout are already clean; the mess is concentrated in **flow
identity being spread across ~12 sites in 5 files**, three disagreeing
numbering schemes, per-flow state sprawl in the context, and some dead code.

Do **T0 + T1**, then stop for review. T2/T3 only when they next cause friction.

---

## Findings (evidence)

### 1. A flow has no single home (~12 edit sites for one stateful flow)

| Site | File:line |
|---|---|
| `FLOWxx` prompt const | `lib/ask-nanci/data/flows.concept.ts:9-34` (Flow 5 has **no const** — inline string) |
| Barrel re-export | `lib/ask-nanci/concept-config.ts:7-32` |
| `CONCEPT_SCRIPTED_CONVERSATIONS` entry | `flows.concept.ts:115-454` |
| `CONCEPT_FLOW_SLUGS` (embed `?flow=N`) | `flows.concept.ts:38-50` |
| `CONCEPT_ALL_PROMPTS` (routing guard + recycled as end chips) | `flows.concept.ts:53-70` |
| `CONCEPT_NO_RESET_PROMPTS` (forget → history-reset bug) | `flows.concept.ts:72-93` |
| `FLOWS` / `MONEY_FLOWS` welcome cards | `components/ask-nanci/concept/ConceptWelcomeView.tsx:12-152` |
| `PanelId` union | `lib/ask-nanci/types.ts:27-44` |
| Panel import + `PanelContent` switch + `mapPanelsToSlots` | `components/ask-nanci/concept/ConceptPanelArea.tsx:20-127` |
| `applyTurnEffects` if-branch | `contexts/AskNanciContext.tsx:317-336` |
| Phase state reset in 3 funcs | `AskNanciContext.tsx:462-473`, `:550-572`, `:574-596` |
| Flow-12-specific `DQ_PANELS` hardcode | `components/ask-nanci/AppShell.tsx:23` |

### 2. Three numbering schemes disagree
- Escalation is `9` in const/slug but renders as card **num 17** (`ConceptWelcomeView.tsx:129`); 17 exists nowhere else.
- `?flow=11` → Detection welcome (`flows.concept.ts:43`), but UI **num 11 = Work Queue**. Live collision.
- Header says *"Ten interaction patterns"* (`ConceptWelcomeView.tsx:193`) — there are **19 cards**.
- Menu Margin has no flow number in code (const `CONCEPT_MENU_MARGIN_PROMPT`, no digit) but slug/card say 18.

### 3. Per-flow state sprawl
16 `useState` slices (`AskNanciContext.tsx:135-150`), ~10 one-per-flow phase enums
(`escalationPhase`, `menuMarginPhase`, `merchantVolumePhase`, `workQueuePhase`,
`accountChangeStep`, `stepUpPanelStep`…), each reset in **three** places that are
**already inconsistent** (escalation/menu reset on close but not on new-chat) → latent bug.

### 4. 13 turn fields do one job
`ConceptScriptedTurn` (`types.ts:46-67`): 5 ways to open a panel
(`openPanel`/`openDynamicPanel`/`openFormPanel`/`openStepUpPanel`/`openBatchPanel`)
+ 8 bespoke `advance*`/flag fields, consumed as a flat if-ladder. Plus a 4th
advance style: direct callbacks for Account Change (`AskNanciContext.tsx:505-526`).

### 5. Dead code
- `loopToPrompt` — declared (`types.ts:58`) + consumed (`AskNanciContext.tsx:423-425`) but **never set anywhere**. Flow 12 card claims "Loops automatically" — untrue.
- `CONCEPT_WELCOME_KEY` — orphan conversation (`flows.concept.ts:12`, `:285-291`), imported (`AskNanciContext.tsx:21`) but never used, no trigger path.

---

## Plan — effort / gain / risk

| # | Cleanup | Effort | Gain | Risk |
|---|---------|--------|------|------|
| **T0a** | Delete `CONCEPT_WELCOME_KEY` orphan + unused import | ~5 min | Removes dead conversation & import | None |
| **T0b** | Delete `loopToPrompt` (dead field + branch) | ~10 min | Removes lying "loops automatically" path | Low (confirm Flow 12 never loops) |
| **T0c** | Fix "Ten interaction patterns" copy | ~2 min | Header no longer wrong | None |
| **T1a** ✅ done | **Flow registry** (`FLOW_DEFS` in flows.concept.ts) — derive slugs/all-prompts/welcome-cards from one record array | ~1 hr | add a showcased flow = 1 registry row + its conversation | Low — verified byte-identical (data + cards), tsc clean, embed smoke green |
| **T1b** | Numbering normalization — make `num` authoritative (Escalation 17→9), model Detection as one flow w/ two entries, renumber cards to match slugs | ~1 hr | kills num-vs-slug drift | Low-Med — visible card-number change; verify via card-snapshot allowlist. NOTE: ALL_PROMPTS is num-sorted, so renumbering reorders the end-of-flow chips — intended, allowlist it |
| **T2** | Generic `phase` mechanism — ~10 phase `useState`s → 1 map, 8 `advance*` fields → 1 field | ~3–4 hr | Kills triple-reset drift; shrinks 660-line context | Medium (touches every stateful flow) |
| **T3** | Unify panel mounting — form/stepup/batch onto dynamic stack; retire dead `mapPanelsToSlots` | ~2–3 hr | One panel system instead of four | Medium (reworks Flows 3/4/6) |

### Target registry shape (T1)
```ts
// lib/ask-nanci/data/flows.registry.ts
export interface FlowDef {
  num: number            // authoritative — no UI-only numbers ever again
  key: string            // CONCEPT_SCRIPTED_CONVERSATIONS key
  title: string
  section: "pattern" | "merchant"
  badge: string
  description: string
  panel?: DynamicPanelId
  embeddable?: boolean   // exposed via ?flow=num
  proactive?: boolean
  followups?: string[]   // continuation keys kept out of session reset
}
export const FLOWS: FlowDef[] = [ /* one row per flow */ ]
```
Derive everything else:
```ts
export const CONCEPT_FLOW_SLUGS = Object.fromEntries(
  FLOWS.filter(f => f.embeddable).map(f => [String(f.num), f.key]))
export const CONCEPT_ALL_PROMPTS = FLOWS.filter(f => !f.proactive).map(f => f.key)
export const CONCEPT_NO_RESET_PROMPTS = new Set(FLOWS.flatMap(f => f.followups ?? []))
```

---

## Test plan (run before committing)

Only Playwright is installed; use `npx tsx` for data checks. Capture baseline
**before** any edit.

1. **Static data-equality (primary, diff must be empty).** Snapshot
   `CONCEPT_FLOW_SLUGS`, `CONCEPT_ALL_PROMPTS` (order matters — chips),
   `[...CONCEPT_NO_RESET_PROMPTS].sort()`, and
   `Object.keys(CONCEPT_SCRIPTED_CONVERSATIONS).sort()` before/after. Diff empty
   ⇒ no consumer can observe a change. (The conversation-keys diff also proves
   T0a removed exactly one key.)
2. **Welcome-card snapshot (expected-diff allowlist).** Playwright reads card
   num/title/badge/section before/after. Diff must contain **only**: Escalation
   `num 17→9`, header copy fix. Anything else = regression.
3. **Runtime smoke.** For every slug number (`2,5,6,9,11,12,13,14,15,16,18`):
   load `?mode=concept-embed&flow=N`, click Ask, wait for idle, assert ≥1 user +
   ≥1 assistant bubble, expected panel opened, Ask button reappears, zero console
   errors. Plus one welcome load asserting all 19 cards render.
4. **Type gate:** `npx tsc --noEmit` clean.

Rollback: all on branch `embed`; no commit until all four pass.

---

## Numbering decision (resolved)
`?flow=11` is **intentionally** the Detection Queue *entry*, not a mislabeled
Work Queue. Verified chain: slug `11` → `CONCEPT_DETECT_WELCOME_KEY`
(`flows.concept.ts:43`) autoplays only the greeting + `ai-triage-summary` widget
(`:296-302`); the widget's "Detection Queue" button calls
`handlePrompt(CONCEPT_FLOW12_CONTINUE_KEY)` (`AiTriageSummaryWidget.tsx:71`),
which opens the `detection-queue` panel and continues Barometer → Coastal →
Escalate (`:305-345`). It's in `CONCEPT_NO_RESET_PROMPTS`, so the greeting stays.
So flows 11 + 12 are two stages of one experience.

**Resolution:** keep slug `11` = Detection entry (preserve the 11→12 chain). The
only thing to fix is the **UI welcome cards**, which number Work Queue as 11 and
Detection as 12 while the embed slug 11 is the Detection greeting (and Work Queue
has no slug). In the registry, give the Detection *entry* `num 11` and renumber
the Work Queue card off 11 — do **not** change embed behavior.

### Detection Queue modeling (decided)
Flows 11 and 12 are **one Detection Queue flow with two entry framings**, not two
sibling flows:
- `flow=11` — *proactive* entry (login greeting + triage widget → click into assignment).
- `flow=12` — *direct-ask* entry ("Show me the detection queue" → straight into assignment).

Both converge on the same panels (Barometer → Coastal → Escalate). In the
registry, model **one "Detection Queue" flow with two embed entry keys** (one card
in the welcome list, two embeddable entries) rather than two cards. Keep both
conversations — do not merge them (the proactive greeting is a distinct pattern
worth showing). Open sub-question for later: whether the proactive greeting should
*also* surface as its own showcased card like Flow 6 "Proactive Surfacing".
