# Ask Nanci

## Finding the rules

This file holds no paths. Every doc declares its own trigger, so ask the filesystem:

```sh
grep -rn --include='*.md' '^\*\*Read when:\*\*' docs .claude | sort
```

Run it before starting and again whenever the task changes; open only the rows that match.

- `.claude/` is how to work here.
- `docs/` is what the project is: **core** (the engine: flows, dispatch, state), **ui** (anything rendered), **services** (data and integration seams).
- Step-by-step recipes live in each category's `actions/`.
- `docs/generated/` is output this repo produces (regenerate it, never hand-edit) and `docs/source/` is raw material that came from elsewhere (read it, never regenerate it). Both are excluded from the grep on purpose.

Nothing stores a path to a doc, this file included. Cite the trigger and let the reader re-grep:

> The recipe for building one is Read-when **adding a panel**.

`npm run check:docs` enforces all of it.

## Output style

Open with the answer. No preamble, no restating the request, no closing recap. Say it once, in full if the thing needs it, then stop.

## Writing here

Never hard-wrap prose: one paragraph, list item or table row per line. Hard wraps reflow on every edit and bury the real change in the diff.
