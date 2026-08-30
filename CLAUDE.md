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

`npm run check:docs` enforces the contract: every doc carries a marker, every cross-reference
resolves, and this file stays path-free.