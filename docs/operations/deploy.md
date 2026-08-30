# Operational constraints

**Read when:** any git action, deploy, or edit to a URL-mode code path

Read before any git action, deploy, or change to a URL-mode code path.

## Branches and deploys

- **`main` is the deployment branch as of 2026-08-29.** It was previously pinned at `d718bba` (2026-05-22) for another team; that pin was abandoned on the remote three months earlier and is no longer in force. `embed` is still the working branch, and its content is merged into `main` to ship. Anything that moves `main` reaches production on the next push.
- **Never `git push` without an explicit go-ahead.**
- **Two Vercel projects build this repo.** `ask-nanci` deploys `main` and serves **`https://ask-nanci.vercel.app`**, the host every production embed points at. The older `aperia-ask-nanci-embed` project deploys `embed` and is no longer referenced by anything; treat it as a stale fallback, not a target.

## The live embeds

**38 embeds across 11 pages of a live client site (`asknanci.ai`) load this app in an iframe.** Anything touching their code paths is production-facing, so verify in a browser, not just `next build`.

Seven modes are live: `?mode=business-owner`, `?mode=clover`, `?mode=vw` and `?mode=abc` (non-concept embeds, real chat app via the legacy `playScripted`/`sendMessage` path), `?mode=concept-embed`, `?mode=titan-embed` (concept-embed with the titan theme), and `?mode=onboarding`. The route `/risk` is embedded too. Flow numbers in production use: 1, 2, 5, 11, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23.

- **The URLs live in Webflow, in two components, not in this repo.** `Browser` and `Ask Nanci Demo Wrapper` each expose a `Demo URL` prop; most instances override it per embed. Changing the host means editing every override plus both prop defaults, so prefer never changing it.
- **A `?flow=` embed does not play on load.** It sits idle until the **Ask** button in the top bar is clicked. Add `&autoplay` to play on mount instead: opt-in and mode-agnostic (`?mode=tib&flow=2&autoplay` works), so no existing embed URL changes behavior. This doc claimed flow=2 "autoplays" until 2026-08-06; it hadn't for some time.
- **`flow=11` is NOT the Work Queue panel.** `CONCEPT_FLOW_SLUGS["11"]` maps to `CONCEPT_DETECT_WELCOME_KEY`, the Detection Queue greeting path. The welcome-grid "Work Queue" card (`num: 11`) and the embed slug `11` are different things.
- **Embeds render `children` only:** no `Sidebar`, `UsageCard`, `SettingsDialog`, `DarkModeToggle`. Bugs confined to those (or to non-embedded flows 1, 5, 7) can't affect prod.

`parseMode` in `lib/ask-nanci/embed-demo-config.ts` is the one place that resolves every mode.
