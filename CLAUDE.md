# Ask Nanci

## Finding the rules

This file holds no paths. Every doc declares its own trigger, so ask the filesystem:

```sh
grep -rn --include='*.md' '^\*\*Read when:\*\*' docs .claude | sort
```

Run that before starting work and open only the rows that match the task. Do it again whenever the task changes — you will not have the right file loaded from last time.

- `.claude/` is how to work here.
- `docs/` is what the project is, in three deliberately broad categories:
  - **core** — the engine: flows, dispatch, state
  - **ui** — anything rendered
  - **services** — data and integration seams
- Step-by-step recipes live in each category's `actions/`.
- `docs/artifacts/` is generated output and raw source material, excluded from the grep on purpose.

No file stores a path to a doc, this one included. A doc's address is its trigger, so one doc
points at another by citing the phrase and letting you re-run the grep:

> The recipe for building one is Read-when **adding a panel**.

Moving a doc between categories therefore breaks nothing, because nothing recorded where it was.

`npm run check:docs` enforces the contract: every doc carries a marker, no file hardcodes a path
to one, every cited trigger matches a real marker, and this file stays path-free.

## Writing here

Concise and clear, in docs and in replies. Open with the answer. Cut preamble, restatements of the
request, and closing recaps: nobody reads them. Say the thing once, at full detail if the thing
needs it, and stop.