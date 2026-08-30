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

`docs/artifacts/demo-urls.md` is the full catalogue: every mode and flow, which ones are embedded in production, and the rest of the URL params. It is generated from the flow registry by `npm run demo:urls`, so never edit it by hand.

## Where things live

| Path | Contents |
|---|---|
| `lib/ask-nanci/data/` | Every demo text and number, including one file per panel under `data/panels/` |
| `components/ask-nanci/` | On-screen components; panels under `concept/` |
| `docs/` | Technical detail, split into `core` (the engine), `ui` (anything rendered) and `services` (data seams) |
| `docs/artifacts/demo-context/` | Background on the customers and their workflows |
| `CLAUDE.md` | How to find the right doc for a task |

Docs are found by trigger rather than by path. Grep for the `**Read when:**` line matching your task:

```sh
grep -rn --include='*.md' '^\*\*Read when:\*\*' docs .claude | sort
```
