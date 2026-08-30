# Ask Nanci

**Read when:** starting work on this repo, or scoping any change

A conversational analytics demo for payment processing, built for Aperia sales pitches.
**Front-end prototype, not real AI:** no backend, `lib/ask-nanci/api.ts` is the stub seam.
Next.js 16 + React 19 + TypeScript, `aperia-ds5`, Tailwind 4, all state in React Context.
One codebase serving many personas and URL modes.

**Acceptance test for every change: does adding the next concept flow get easier?**
If a change makes future flows harder to author, it's the wrong change no matter how clean it
looks in isolation. The recurring work here *is* authoring flows, so prefer declarative,
data-driven authoring over imperative wiring scattered across files.
