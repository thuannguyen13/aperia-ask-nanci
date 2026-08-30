# Ask Nanci

A demo of an AI assistant for payment-processing customers, used in sales meetings and pitches.

There is no AI and no server in this project. Every answer is text written by hand and played back on a timer. Changing what Nanci says means editing a text file.

---

## 1. Setup

```bash
npm install
npm run dev
```

The dev server prints the address it runs on. Leave it running while you work: saved files reload automatically. No credentials, environment variables or database are required.

---

## 2. Running a demo

Every demo is a relative path: append it to the dev server address or to the deployed host.

**live** marks a URL currently embedded on the production site. Changes affecting those pages are customer-facing.

### Modes

The `?mode=` value selects the layout and branding.

| URL | Shows |
|---|---|
| `/` | Full app: sidebar, knowledge base panel, chat history |
| `/?mode=concept` | All demo stories as selectable cards |
| `/?mode=concept-embed` **live** | A single demo story, no sidebar |
| `/?mode=titan-embed` **live** | As `concept-embed`, with the Titan theme |
| `/?mode=clover` **live** | Chat-only embed, Clover persona |
| `/?mode=business-owner` **live** | Chat-only embed, business owner persona |
| `/?mode=vw` **live** | Chat-only embed, VisionWeb persona |
| `/?mode=abc` **live** | Chat-only embed, ABC persona |
| `/?mode=iso` | Chat-only embed, ISO persona |
| `/?mode=tib` | Full app with TIB branding |
| `/?mode=woodforest` | Full app with Woodforest branding |
| `/?mode=placeholder` | Full app with white-label branding |
| `/?mode=onboarding` **live** | Full app with the onboarding dialog on every load |
| `/?mode=concept-nav` | Alias of `concept`, kept so older links keep working |
| `/risk` **live** | Aperia Risk shell, a separate product surface |

Any other `?mode=` value loads the full app.

### Demo stories

Add `&flow=` and a number to `?mode=concept-embed`. **Automatic** stories play every turn on their own. **Manual** stories stop at each customer turn and wait for the suggestion chip to be clicked.

| URL | Story | Type |
|---|---|---|
| `/?mode=concept-embed&flow=1` | Simple Update | Automatic |
| `/?mode=concept-embed&flow=2` **live** | Data Lookup | Automatic |
| `/?mode=concept-embed&flow=5` **live** | Error Recovery | Manual |
| `/?mode=concept-embed&flow=6` | Proactive Surfacing | Automatic |
| `/?mode=concept-embed&flow=11` **live** | Detection Queue, alternate entry | Automatic |
| `/?mode=concept-embed&flow=12` | Detection Queue | Automatic |
| `/?mode=concept-embed&flow=13` **live** | Deposit Tracker | Manual |
| `/?mode=concept-embed&flow=14` **live** | Fee Change Explainer | Manual |
| `/?mode=concept-embed&flow=15` **live** | Sales Snapshot | Manual |
| `/?mode=concept-embed&flow=16` **live** | Account Change | Manual |
| `/?mode=concept-embed&flow=17` **live** | Escalation | Manual |
| `/?mode=concept-embed&flow=18` **live** | Running Low | Manual |
| `/?mode=concept-embed&flow=19` **live** | Address Change | Manual |
| `/?mode=concept-embed&flow=20` **live** | Credit Card Offer | Manual |
| `/?mode=concept-embed&flow=21` **live** | Business Loan Offer | Manual |
| `/?mode=concept-embed&flow=22` **live** | Service Marketplace | Opens a page, not a story |

Six further stories have no URL and are reachable only from the `?mode=concept` cards: Panel as Form, Step-up Auth, Case Management, Bulk Action, Risk Investigation, Work Queue.

### Extra settings

Both can be added to any of the URLs above.

| Setting | Effect |
|---|---|
| `&autoplay` | Starts the story on load. Without it, the story waits for the "Ask" button |
| `&brand=generic` | Removes partner branding from flows 20 and 21 for sales demos. Amounts and terms are unchanged. Other flows ignore it |

Example: `/?mode=concept-embed&flow=18&autoplay`

---

## 3. How the demo is structured

Five building blocks. Most edits touch the first two rows only.

| Piece | What it is | Where it lives |
|---|---|---|
| **Flow** | One demo story, start to finish. Has a number used in the URL as `flow=13` | `lib/ask-nanci/data/flows.concept.ts` |
| **Turn** | One message inside a flow, either from the customer or from Nanci. A turn can also open or close a panel | Same file, under `CONCEPT_SCRIPTED_CONVERSATIONS` |
| **Panel** | A box that appears beside the chat, such as a table or a form | Appearance in `components/ask-nanci/concept/`, numbers in `lib/ask-nanci/data/panels/` |
| **Panel registry** | The list of panels a flow is allowed to open. A panel must be listed here to be usable | `components/ask-nanci/concept/panel-registry.ts` |
| **Mode** | The `?mode=` part of the URL. Selects the layout and the branding around the chat | `lib/ask-nanci/embed-demo-config.ts` |

A flow opens a panel by naming it on a turn, for example `panel: "running-low"`. Up to three panels can be open at once.

Whether a flow is Manual or Automatic is decided by its `section`, not set per flow by hand. Most are Manual, the Merchant Money group.

---

## 4. Common tasks

### Changing wording

Text lives in two places depending on where it appears on screen.

| Text location | File |
|---|---|
| Chat messages and suggestion chips | `lib/ask-nanci/data/flows.concept.ts` |
| Anything inside a panel | The matching file in `lib/ask-nanci/data/panels/` |

Search the sentence in that file, or across `lib/ask-nanci/data/` if you aren't sure which.

Some lists in `flows.concept.ts` are marked "Derived, do not hand-maintain". Those are built from `FLOW_DEFS`. Edit `FLOW_DEFS` and the lists update on their own.

### Changing a number in a panel

One file per panel: `inventory.ts` holds the "Running Low" panel.

Some values are calculated from others so the arithmetic stays consistent. Where a calculation exists, such as `sales / transactions`, edit the inputs rather than the result. Do not replace a calculation with a typed number.

### Adding a new demo story

Follow Read-when **adding or editing a concept flow**, which lists the required steps in order. Docs are cited by their "Read when" trigger rather than by path: grep `docs/` for that phrase to find the file.

---

## 5. Verification

Run all four before committing. All four must pass.

```bash
npm run typecheck     # type errors
npm run check:flows   # broken demo routes
npm run check:docs    # doc paths that no longer exist
npm run lint          # code style
```

These checks do not detect visual problems. Confirm the result in a browser as well.

When checking a story that has no URL of its own, open `?mode=concept` and run this in the browser console first, otherwise the onboarding dialog covers the story cards:

```js
localStorage.ask_nanci_onboarded = "1"
```

---

## 6. Constraints

- Never push without an explicit go-ahead. `main` ships to production on the next push, via the `ask-nanci` Vercel project.
- The embed URLs live in Webflow, not here: a `Demo URL` prop on the `Browser` and `Ask Nanci Demo Wrapper` components, overridden per instance. Changing the host means editing every override.
- `docs/artifacts/demo-urls.md` is generated. After adding a demo URL, rerun `npm run demo:urls` rather than editing it.
- Demo text and numbers belong in `lib/ask-nanci/data/`, not in component files.
- Use `npm`. This project does not use `pnpm` or `yarn`.
- Stop the dev server before running `npm run e2e`. Both use the same lock file.

---

## 7. Project layout

| Path | Contents |
|---|---|
| `lib/ask-nanci/data/` | All demo text and numbers |
| `components/ask-nanci/` | On-screen components |
| `docs/artifacts/demo-context/` | Background on the customers and their workflows |
| `docs/` | Full technical detail, split into `core`, `ui` and `services` |
| `CLAUDE.md` | How to find the right doc for a task |
