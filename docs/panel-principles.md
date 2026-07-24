# Panel principles

The foundation: **what a panel is, when it opens, who drives it, when it closes, and where it lives.**
This is the *why*. How a panel should look is in `.claude/rules/panel-design.md`; how to register
and open one is in `CLAUDE.md` ("Side Panels").

Every rule here is settled — either it comes straight from the production vision
(`docs/demo-context/product-vision.mhtml`) or it's a decision already made. A scripted flow that
breaks one of these is a bug, not an exception.

---

## North star

> **Ask Nanci is a layer, not a chatbot.** The platform's surfaces already exist — queues, cases,
> risk tools, reports. Nanci doesn't replace them. She removes the navigation tax.

**Intent replaces navigation. Nanci carries the intent; the panel is where the work happens.**

Everything below follows from that one sentence.

---

## 1. What a panel is

A panel is **a workspace summoned by intent** — the right surface for what was just asked, brought
to you instead of navigated to.

A panel is **not**:
- a destination you navigate to from a menu
- a generic dashboard with search / filter / sort / export bolted on
- a place Nanci merely *displays* — it's a place you *work* (you can act inside it)

**Test:** if two different questions would open the same panel, it's too generic. Scope it to the
question, not to a schema.

---

## 2. When a panel opens — automatic, never chosen

The user never decides how much UI to summon. Nanci reads the intent and picks the level.

| Level | Intent | Panels |
|---|---|---|
| **Simple** | A fact, a confirmation, a one-value change | **0** — answered inline in the thread |
| **Structured** | One form, one table, one report, one case | **1** panel |
| **Compound** | An investigation across related surfaces | **parallel** panels |

If the answer fits in a sentence, it stays a sentence. A panel is earned by *shape* — a table, a
trend, a form, a queue — not summoned by default.

---

## 3. Who drives

Both Nanci and the user, and they share one truth.

- **Nanci opens.** She summons the panel and can update it as the conversation moves.
- **The user works inside.** Buttons, forms, sorting, stepping through — the panel is interactive.
- **Either can act; the panel reflects it once.** Confirm in the chat *or* in the panel — never
  make the user confirm the same thing twice on two surfaces.

**The one line that can't be crossed:** the user *works* a panel; the user never *assembles* one.
No affordance lets someone build a view Nanci didn't offer — that's the portal we exist to replace.
A user may choose *when* an already-offered view appears; never *what* it contains.

---

## 4. When a panel closes

**Panels are a working set, not a history.** They arrive with a topic and leave with it.

- The user can dismiss any panel (the header ✕).
- Starting a new topic clears the set.
- Old panels don't pile up as tabs to scroll back through. What's on screen is what's relevant
  *now*. Nanci holds the rest of the context in the thread.

---

## 5. Where panels live — three zones

```
┌────────┬─────────────────────┬──────────────────┐
│  LEFT  │       CENTER        │      RIGHT       │
│ chrome │       focus         │     support      │
│  nav + │   (the one thing    │  (context for    │
│  Teach │    you're working)  │   the focus)     │
│  Nanci │                     │                  │
└────────┴─────────────────────┴──────────────────┘
```

- **Left is chrome, not a panel.** Navigation and *Teach Nanci* (where you manage what Nanci knows)
  live here. It's always there and it doesn't count as a work panel.
- **Center is the focus.** Always exactly one — the thing you're working on right now.
- **Right is support** — context for the focus (Nanci's answer beside the surface you're on).
- **Center ⇄ Right can swap** (promote a support panel to focus). **Left never moves.**
- **Two work panels are visible at once** (focus + support). Compound investigations go *deeper*,
  not *wider*: Nanci holds the further surfaces in the thread and brings each forward as you move to
  it — you promote and swap, you don't tile the screen past what stays legible.

---

## Never

The guardrails. Each one keeps the layer from decaying back into a portal.

- **Never** let the user assemble a view Nanci didn't offer (see §3).
- **Never** open a panel for an answer that fits in a sentence (see §2).
- **Never** tile more than the focus + its support on screen (see §5).
- **Never** ask the user to confirm the same action on two surfaces (see §3).
- **Never** ship a generic all-rows table with filter/sort/export as a panel (see §1).
- **Never** treat Left (nav / Teach Nanci) as a work panel or count it against the visible pair.
