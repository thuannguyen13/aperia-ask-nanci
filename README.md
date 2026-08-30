# Ask Nanci

A demo of an AI assistant for payment-processing customers, used in sales meetings and pitches.

There is no AI and no server in this project. Every answer is text written by hand and played back on a timer. Changing what Nanci says means editing a text file.

## Setup

```bash
npm install
npm run dev
```

The dev server prints the address it runs on. Leave it running while you work: saved files reload automatically. No credentials, environment variables or database are required. Use `npm`, not `pnpm` or `yarn`.

## Running a demo

Every demo is a relative path, appended to the dev server address or to the deployed host. `?mode=` selects the layout and branding, `&flow=` selects the story:

- `/` — full app: sidebar, knowledge base panel, chat history
- `/?mode=concept` — every demo story as selectable cards
- `/?mode=concept-embed&flow=18` — one story, no sidebar
- `&autoplay` — start the story on load instead of waiting for the Ask button

`docs/artifacts/demo-urls.md` is the full catalogue: every mode, which URLs are embedded in production, and the rest of the params. It is generated from the flow registry by `npm run demo:urls`, so never edit it by hand.

### Demo stories


| URL | Story |
|---|---|
| `/?mode=concept-embed&flow=1` | Simple Update |
| `/?mode=concept-embed&flow=2` | Data Lookup |
| `/?mode=concept-embed&flow=5` | Error Recovery |
| `/?mode=concept-embed&flow=6` | Proactive Surfacing |
| `/?mode=concept-embed&flow=11` | Detection Queue, alternate entry |
| `/?mode=concept-embed&flow=12` | Detection Queue |
| `/?mode=concept-embed&flow=13` | Deposit Tracker |
| `/?mode=concept-embed&flow=14` | Fee Change Explainer |
| `/?mode=concept-embed&flow=15` | Sales Snapshot |
| `/?mode=concept-embed&flow=16` | Account Change |
| `/?mode=concept-embed&flow=17` | Escalation |
| `/?mode=concept-embed&flow=18` | Running Low |
| `/?mode=concept-embed&flow=19` | Address Change |
| `/?mode=concept-embed&flow=20` | Credit Card Offer |
| `/?mode=concept-embed&flow=21` | Business Loan Offer |
| `/?mode=concept-embed&flow=22` | Service Marketplace |

Six further stories have no URL and are reachable only from the `?mode=concept` cards: Panel as Form, Step-up Auth, Case Management, Bulk Action, Risk Investigation, Work Queue.

## Where things live

| Path | Contents |
|---|---|
| `lib/ask-nanci/data/` | Every demo text and number, including one file per panel under `data/panels/` |
| `components/ask-nanci/` | On-screen components; panels under `concept/` |
| `docs/` | Technical detail, split into `core` (the engine), `ui` (anything rendered) and `services` (data seams) |
| `docs/artifacts/demo-context/` | Background on the customers and their workflows |
| `CLAUDE.md` | How to find the right doc for a task |