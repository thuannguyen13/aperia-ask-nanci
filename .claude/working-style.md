# Working style on this repo

**Read when:** any multi-step task, staging, subagents, or visual direction

- **Skip the code-quality review round.** When running subagent-driven development here, do spec-compliance verification only: does the diff match what was asked, nothing missing or extra. They said plainly: "i don't care about code quality review, the demo is missing panels." Getting to a demonstrable state beats review ceremony.
- **The working tree carries pre-existing uncommitted WIP in almost every file.** Before staging, `git diff <file>` against HEAD and stage only the hunks belonging to the current task. Warn implementer subagents explicitly; never assume a file is clean because your task touches two lines of it.
- **Take spatial instructions literally.** "Down below and share half of Pending Deposits" meant vertical stacking; the existing horizontal-split precedent in the codebase was allowed to override their actual words, and the layout had to be rebuilt. Re-read what they said before defaulting to what the code already does.
- **Don't abandon a CSS approach on an ambiguous screenshot.** A cut-off "Change" column looked like `table-fixed` was broken; it was a ~758px test viewport, and the same code was perfect at ~2000px. Check viewport width or reproduce it before concluding which mechanism is at fault.
- **After building from Figma screenshots, re-diff element by element before saying done.** On Account Change (Flow 16) an Export button was copied in reflexively, the header title was hardcoded across steps that show different titles, and an icon-in-circle became a bare icon, all visible in screenshots already saved locally, never re-opened.

## Helping them decide on visuals

They find visual problems hard to put into words and want a named design language so words become *pointers* rather than descriptions rebuilt from memory. The agreed direction itself is Read-when **picking a pattern**; this is how to get there.

Don't ask them to describe from imagination. Point, don't describe (screenshots). Compare, don't characterize ("why does A differ from B"). Treat a named feeling ("feels cheap", "cluttered") as data, not vagueness. Generate the checklist for them to react to — reacting beats authoring. Run a drift audit before demos.
