# Smoke Test Checklist

Run `npm run dev` then visit each URL. Mark each item ✅ before merging.

## Gates (run after every task)

```
npm run typecheck   # must exit 0
npm run build       # must exit 0
npm run lint        # no new errors
```

---

## Mode: clover (default — `http://localhost:3000`)

- [ ] Welcome view renders (Ask Nanci logo, ExplorePrompts cards, ChatInput)
- [ ] Click an ExplorePrompts prompt → transitions to chat view, answer streams in
- [ ] Streamed answer renders correctly (markdown, suggestions, chart if applicable)
- [ ] ChatInput Common Questions button (?) opens dialog with prompts; click one → starts new chat + streams answer
- [ ] Active sources pill shows Clover icon
- [ ] Settings dialog opens (`/settings` or gear icon)
- [ ] Onboarding dialog fires on first visit (clear localStorage first)
- [ ] Session saved; sidebar shows session; clicking it resumes the chat

---

## Mode: business-owner (`?mode=business-owner`)

- [ ] Embed frame renders (AccessOne logo, orange gradient header)
- [ ] Welcome + ExplorePrompts visible inside embed
- [ ] "bank-match" prompt returns AccessOne wording (not "Clover sales") — the one content override
- [ ] Submit button is disabled (read-only embed)

---

## Mode: iso (`?mode=iso`)

- [ ] Embed frame renders (Titan logo, blue gradient header)
- [ ] ISO prompt categories render (Portfolio, Boarding, Processing, Chargebacks, Cases, Risk, Merchants tabs)
- [ ] Click an ISO prompt → scripted flow plays (user + assistant turns)
- [ ] Merchant tables in ISO responses render (bold headers, formatted numbers)
- [ ] Submit button is disabled (read-only embed)

---

## Mode: concept (`?mode=concept`)

- [ ] ConceptWelcomeView renders (flow cards grid, ChatInput)
- [ ] **Flow 2 (Data Lookup)** — click "Show me the 10 merchants with the highest transaction volume" → MerchantVolumePanel slides in, table renders
- [ ] **Flow 4 (Step-up Auth)** — click "I need to change my deposit account to a new bank" → Step-up panel opens, advances through 3 steps
- [ ] **Flow 7 (Case Management)** — click "Pull up the case for Oak Street Coffee" → multi-panel layout opens (Case + Dispute Draft)
- [ ] **Flow 8 (Bulk Action)** — click "Show me merchants with decline rates above 15% last week" → Decline Report + Email Draft panels
- [ ] **Flow 12 (Detection Queue)** — click "Show me the detection queue" → Barometer + Coastal Risk + Detection Queue panels; loops automatically
- [ ] Panel close (X button) slides panel out with animation; staggered close (right column first) works
- [ ] Proactive notification (Flow 6) — "Simulate login" → amber banner → "Open Nanci" → scripted flow plays

---

## Mode: detect (`?mode=detect`)

- [ ] Embed frame renders (Aperia logo, blue gradient)
- [ ] Auto-play starts within ~1s: welcome message streams in
- [ ] DQ flow plays: Detection Queue panel opens, barometer + coastal risk populate
- [ ] Loop: after DQ flow completes, waits ~3s then loops back to welcome
- [ ] Chat messages persist across loop cycles (no blank reset)
- [ ] Input enabled: type a question, ArrowUp button active, pressing Enter or clicking sends it
- [ ] Add New Source popover opens, shows source list
- [ ] Panels close with animation before each new loop cycle

---

## Cross-cutting

- [ ] Dark mode toggle works (colors flip, persists on refresh)
- [ ] Mobile sidebar toggle shows/hides (narrow viewport)
- [ ] ResizableHandle drag works between panels
- [ ] Token limit dialog: trigger via `/usage` slash command in ChatInput
- [ ] Slash command popover: type `/` in ChatInput → popover appears with actions

---

## Baseline notes (Task 0 — captured 2026-05-30)

- `tsc --noEmit`: 1 pre-existing error in `app/charts/page.tsx:194` (`percent` possibly undefined) — fixed in Task 0 fix before establishing baseline.
- `next build`: passes with workspace root warning (safe to ignore, two lockfiles detected).
- All five modes verified functional on `embed` branch commit `3c8b807`.
