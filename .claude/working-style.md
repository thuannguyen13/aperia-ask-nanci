# Working style on this repo

**Read when:** any multi-step task, staging, subagents, git actions, or visual direction

- **Ask before every push, and never touch `main`.** It deploys to production via the `ask-nanci` Vercel project. Staging is `embed`; branch new work off it. A past yes is not standing permission.
- **Skip code-quality review.** Verify spec compliance only: does the diff match what was asked, nothing missing, nothing extra. A demonstrable state beats review ceremony.
- **Almost every file has uncommitted WIP.** Before staging, `git diff <file>` and stage only the hunks for the current task. A file is not clean because your task touches two lines of it. Tell implementer subagents this explicitly.
- **Take spatial instructions literally.** "Down below" means vertical stacking, even if the codebase already splits horizontally. Re-read the words before defaulting to the existing pattern.
- **Don't switch CSS approach on an ambiguous screenshot.** A cut-off column is not proof the CSS is broken. Check the viewport width or reproduce it first.
- **After building from Figma screenshots, re-open them and compare element by element before saying done.** Past misses: a copied Export button, a hardcoded header title, an icon-in-circle rendered as a bare icon.

## Helping them decide on visuals

They find visual problems hard to put into words and want a named design language so words become *pointers* rather than descriptions rebuilt from memory. The agreed direction itself is Read-when **picking a pattern**; this is how to get there.

Don't ask them to describe from imagination. Point, don't describe (screenshots). Compare, don't characterize ("why does A differ from B"). Treat a named feeling ("feels cheap", "cluttered") as data, not vagueness. Generate the checklist for them to react to — reacting beats authoring. Run a drift audit before demos.
