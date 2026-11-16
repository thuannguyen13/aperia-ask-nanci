# Add a concept flow

**Read when:** adding or editing a concept flow

The recurring work in this repo, and the task every architectural decision is scored against.

1. Add a flow definition to `FLOW_DEFS` in `lib/ask-nanci/data/flows.concept.ts`. The prompt lists are all *derived* from it, so do not hand-edit them: `CONCEPT_ALL_PROMPTS` (from each flow's `key`, the list `check:flows` resolves), `CONCEPT_NO_RESET_PROMPTS` (from `keepSession` + `followups`), `CONCEPT_MANUAL_PROMPTS` (from `manual`/`section` + `followups`), and `CONCEPT_LOOP_PROMPTS` (from `loop`).
2. A partner's flow in the full catalog sits beside flows that partner has nothing to do with. Set `scope` on its definition so it shows only in the mode with that scope. Cards and Marketplace listings filter with `inScope`, and question lists and chips come from `promptsInScope`. Routing goes through `CONCEPT_FLOW_SLUGS` and the scripted conversations in every mode, so its embed slug keeps working.
3. Add the full turn sequence to `CONCEPT_SCRIPTED_CONVERSATIONS`, keyed by the flow's `key`.
4. Wire panel effects in the turn objects: `panel`, `view`, `closePanel`, `filterDeclineReport`, `closeAllPanels`. See "Turn effects" below.
5. If the flow needs a new panel, do Read-when **adding a panel** first.
6. Run `npm run check:flows`.
7. If the flow should be reachable as an embed, add its slug and rerun `npm run demo:urls` (see Read-when **running checks**).

## Reaching non-embeddable flows locally

To reach a flow with no URL of its own (Case, Bulk, Risk, form, step-up) in `?mode=concept`, pre-set `localStorage.ask_nanci_onboarded = "1"` in the browser console — `OnboardingDialog` otherwise covers the welcome cards — then click the flow card's "Try it".

## Turn effects

The contract between a scripted flow and the panel stack. These are the real fields on `ConceptScriptedTurn` in `lib/ask-nanci/types.ts`, consumed by `applyTurnEffects` in `contexts/AskNanciContext.tsx`. Set them on turns in `CONCEPT_SCRIPTED_CONVERSATIONS`.

| Field | Effect |
|---|---|
| `panel: "panel-id"` | Ensures that panel is open. Idempotent push onto the `dynamicPanels` stack. |
| `view: "view-name"` | Sets that panel's view. If omitted when `panel` is set, the panel resets to its own default view on open. Use together with `panel`. |
| `revealPanel: true` | On a phone, brings the sheet up with the panel instead of leaving it resting as a handle, also when the panel is already open. For a turn whose point is the panel being seen. Desktop ignores it. |
| `closePanel: "panel-id"` | Closes one panel, e.g. to replace it with another. |
| `filterDeclineReport: true` | Switches the decline-report panel into its filtered view. |
| `closeAllPanels: true` | Resets all open panels (staggered close animation), plus panel views and the decline-report filter. |

## Nanci speaks first

A flow that opens on a question cannot show Nanci reaching the owner unasked. Set `proactive: true` on the definition and start the script with a text turn, and give the flow an id for its `key` rather than a prompt.

Follow the text with the owner's question, not with Nanci. A chat that opens on an answer nobody asked for reads as the app talking to itself. The text is Nanci starting the conversation, and the owner picks it up from there.

| Field | Effect |
|---|---|
| `textFrom: "Sender"` | Plays the turn as a phone notification outside the app, then opens the chat with the same words as Nanci's first message. |
| `textReason` | Why Nanci reached out, such as "Mozzarella runs out before your next delivery". It sits above Nanci's first message after "Ask Nanci reached out". A scheduled send cannot say why, so the reason is what shows Nanci decided. |
| `source` | On the text turn, what Nanci checked before reaching out, cited under its first message with the usual source pill. |
| `textLink` | The link the text ends with, shown on the notification only. The notification shows it being tapped, which is what opens the chat. Build it with `nanciLink(code)`. |
| `pauseBefore` | Holds before the turn arrives, so time passing reads. Put it on the owner's question when time passes between the text and the reply. |

## Looping demos

Set `loop: true` on the flow def for a demo that runs unattended on a screen. It changes nothing about the script: the auto player reaches the last turn, holds on it, then rewinds and plays again.

The rewind is an animation, not a reset. The phone's sheet goes down to its handle, the panels stagger out, the conversation fades, and only then are the messages cleared, behind a screen that is already empty. `conversationFading` on the context is what the fade rides; `ChatView` is its only reader.

Two limits. The loop runs only under `?autoplay`, so a flow someone opened from a card still ends where its script ends. A looping flow never sets `flowFinished`, so it shows no Restart button: it is about to restart itself.

## Autoplay

Nobody taps a chip or fills in a panel on an `?autoplay` link, so a flow stalls at the first one it reaches. The script runs on into each of the flow's `followups` that its last answer offers as a chip, through `getAutoplayScript`. A panel the flow hands over to plays its own steps through `usePanelAutoplay`, typing sample values and pressing its buttons.

Give a new panel step its own autoplay steps. Without them the flow stalls at that step under `?autoplay`.

Adding a declarative field here is nearly always better than adding an imperative branch in `playConceptScripted`: the whole point is that a flow is data, not code.
