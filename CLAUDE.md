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

### Prose style

Applies to every document this repo produces, `docs/generated/` included.

**Voice.** Plain and declarative. State what is true, not what is always true: "Controls are sized for touch", not "Every control is built for a thumb". No slogans, no absolutes used for emphasis, nothing that reads as selling a decision that has already been made.

**Order.** The failure comes before the fix. A reader who does not yet know what goes wrong has no reason to care about the remedy.

**Shape.** Two short sentences per item, the claim then its reason. Keep them roughly parallel in length across a list, because the longest one reads as the most important whether or not it is.

**Sentences.** Straight ones. No opening subordinate clause hung off a comma, and no comma where a rewrite removes it: a comma interrupts the reading flow of an instruction. A thought that needs two parts needs two sentences.

**Address.** Where there is something to do, write it as an instruction rather than a description of what the thing does.

**Scope.** General statements stay general. A principle does not name the specific mechanism that answers it; that belongs to the section that owns it.

**Economy.** Nothing is said twice. A word in a heading does not reappear in the line beneath it. Where two blocks overlap, merge them rather than trimming both. Where something is not earning its place, cut it rather than soften it.
