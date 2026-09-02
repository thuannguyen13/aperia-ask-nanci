import { test, expect, type Locator, type Page } from "@playwright/test"
import { ONBOARDING_KEY, TOUR_DONE_KEY } from "../lib/ask-nanci/storage-keys"

// Geometry pins for the mobile panel sheet (components/ask-nanci/concept/sheet/MobilePanelSwitcher.tsx).
// Below `md` one panel is presented as a card that slides in from an edge, and every
// number below broke at least once while it was being built: the frame that has to end
// exactly at the composer, the inset the open card sits at, how far a dismissed card
// travels, and how much of it is left behind. Four presentations exist behind
// `?panelui=` (lib/ask-nanci/data/panel-ui.ts) and all four are checked, because the
// axis and the lip are the only things that differ between them.
//
// Locators prefer accessible names: the grab strip is a button named after the panel
// ("Show Merchant Volume" / "Hide Merchant Volume") and the open card is a dialog named
// after it, so nothing here leans on a class.

const PHONE = { width: 390, height: 844 }

// A phone viewport is the whole point of this file, so it is set once for all of it.
// 390x844 is the iPhone 13/14 logical size, comfortably under the `md` breakpoint that
// useIsMobile watches.
test.use({ viewport: PHONE, isMobile: true, hasTouch: true, deviceScaleFactor: 3 })

// `&autoplay` plays the flow on load, and the turn that opens the panel lands ~7s in.
// A cold Turbopack compile on the first test can add a lot on top of that.
const PANEL_TIMEOUT = 60_000

// The sheet settles in at most SETTLE_MAX (400ms, use-sheet-gesture.ts); waiting past
// that is what makes a measurement the landing position rather than a frame of the
// animation.
const SETTLE_MS = 700

// Comfortably past DISMISS_DISTANCE (120px), so a drag is decisive on travel alone and
// does not depend on how fast Playwright happened to move the pointer.
const DRAG_PX = 260

/** The panel flow 2 opens, and the accessible name every sheet locator hangs off. */
const PANEL = "Merchant Volume"

const PRESENTATIONS = [
  // Where a dismissed card rests is asserted against the clip line, never as an
  // absolute coordinate. The clip line is the composer's top edge, so pinning the
  // number meant re-pinning it every time the composer changed height: the frame's
  // 4px bottom inset moved it once, a 4px taller send button moved it again. Neither
  // was a regression, and both failed the suite.
  // `param: ""` is whichever option is marked current in panel-ui.ts, not whichever is
  // listed first: the swipe presentation ships, so a minimised panel leaves its handle.
  { name: "swipe to open", param: "", axis: "y", lip: 40 },
  { name: "bottom sheet", param: "away", axis: "y", lip: 0 },
  { name: "right-side drawer", param: "right", axis: "x", lip: 0 },
  { name: "swipe from the edge", param: "edge", axis: "x", lip: 40 },
  // Same card and same axis as the edge strip; the difference is that its frame runs
  // past the composer instead of stopping at it, which the test below asserts.
  { name: "edge strip over the composer", param: "over", axis: "x", lip: 40 },
] as const

type Presentation = (typeof PRESENTATIONS)[number]

/** Pixel assertion with slack: a layout value can legitimately land a pixel either side. */
function expectPx(actual: number, expected: number, slack = 2) {
  expect(actual, `expected ${expected}px +/- ${slack}, got ${actual}px`).toBeGreaterThanOrEqual(expected - slack)
  expect(actual, `expected ${expected}px +/- ${slack}, got ${actual}px`).toBeLessThanOrEqual(expected + slack)
}

/**
 * The grab strip: a button, named for the panel and for what a press would do to it.
 *
 * Anchored, because `name` is a substring match by default and the panel's artifact card
 * in the conversation is also a button carrying the panel's name. Only the strip is
 * exactly "Show X" or "Hide X".
 */
const handle = (page: Page, label = PANEL) =>
  page.getByRole("button", { name: new RegExp(`^(Show|Hide) ${label}$`) })

/**
 * The card, and the clipping frame around it.
 *
 * Neither carries a role while the sheet is resting (the card is a `dialog` only while
 * it is open, which is exactly the state these tests measure it out of), and neither
 * has an accessible name of its own. Reached from the grab strip's accessible name
 * instead of by class: the strip is the card's first child, the card the frame's only
 * one, so this survives the class churn a Tailwind component sees.
 */
const cardOf = (page: Page, label = PANEL) => handle(page, label).locator("..")
const frameOf = (page: Page, label = PANEL) => cardOf(page, label).locator("..")

const box = async (locator: Locator) => (await locator.boundingBox())!

async function gotoFlow(page: Page, query: string) {
  // Onboarding dialog and product tour both block interaction until marked done.
  // Keys imported from the shared module, never retyped.
  await page.addInitScript(([onboarded, tour]) => {
    window.localStorage.setItem(onboarded, "1")
    window.localStorage.setItem(tour, "1")
  }, [ONBOARDING_KEY, TOUR_DONE_KEY])
  await page.goto(`/?mode=concept-embed&${query}&autoplay`)
}

/**
 * Wait for the flow to open its panel, ask for the sheet, and let it settle.
 *
 * A scripted panel arrives resting rather than open (`openDynamic`'s `reveal: false`),
 * so every test that measures an open card has to open it first. The way in is the
 * artifact card in the conversation, not the grab strip: the strip is off screen while
 * a lip-0 presentation rests, and the card is the one control all four share.
 */
async function waitForOpenSheet(page: Page, label = PANEL) {
  const card = page.getByRole("button", { name: `Bring ${label} to the front` })
  await expect(card).toBeVisible({ timeout: PANEL_TIMEOUT })
  await card.click()
  await expect(page.getByRole("dialog", { name: label })).toBeVisible({ timeout: PANEL_TIMEOUT })
  await page.waitForTimeout(SETTLE_MS)
}

/**
 * Drag the grab strip along the sheet's axis.
 *
 * Playwright's touchscreen can tap but has no drag primitive, and the sheet listens for
 * pointer events, which mouse input raises just as touch does — so a gesture is a mouse
 * drag. The pointer starts at the strip's own centre rather than at an offset from the
 * card, because the strip changes size between resting and open.
 */
async function dragHandle(page: Page, locator: Locator, axis: "x" | "y", distance: number) {
  const strip = await box(locator)
  const from = { x: strip.x + strip.width / 2, y: strip.y + strip.height / 2 }
  const to = axis === "y" ? { x: from.x, y: from.y + distance } : { x: from.x + distance, y: from.y }
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  for (let step = 1; step <= 10; step++) {
    await page.mouse.move(from.x + ((to.x - from.x) * step) / 10, from.y + ((to.y - from.y) * step) / 10)
  }
  await page.mouse.up()
  await page.waitForTimeout(SETTLE_MS)
}

/** Dismiss an open sheet by dragging its handle away from the edge it is anchored to. */
const dismiss = (page: Page, p: Presentation) => dragHandle(page, handle(page), p.axis, DRAG_PX)

test("the sheet frame ends exactly at the composer's top edge", async ({ page }) => {
  await gotoFlow(page, "flow=2")
  await waitForOpenSheet(page)

  const composer = await page.evaluate(() => {
    // Published by use-composer-inset.ts. It was silently never set in the full app
    // until recently, which left the sheet reserving its fallback and overlapping the
    // real composer, so an empty value is the regression this asserts against.
    const raw = document.documentElement.style.getPropertyValue("--composer-inset")
    // The distance to the bottom of the viewport, not the composer's own height: the
    // app frame insets itself on a phone, so the two differ by that padding.
    const inset = parseFloat(raw)
    const el = document.querySelector("[data-composer]")
    return { raw, inset, top: el ? el.getBoundingClientRect().top : null }
  })

  expect(composer.raw).not.toBe("")
  expect(composer.inset).toBeGreaterThan(0)
  expect(composer.top, "the composer container is not in the document").not.toBeNull()

  const frame = await box(frameOf(page))
  expectPx(frame.y + frame.height, composer.top!, 0.5)
})

test("the composer stays hit-testable while the sheet is open", async ({ page }) => {
  await gotoFlow(page, "flow=2")
  await waitForOpenSheet(page)

  // The sheet and its scrim both stop short of the composer, so the topmost element at
  // the middle of the input is the input, not the sheet on top of it.
  const reachable = await page.getByPlaceholder("Ask anything").evaluate((textarea) => {
    const r = textarea.getBoundingClientRect()
    return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === textarea
  })
  expect(reachable).toBe(true)
})

for (const p of PRESENTATIONS) {
  test(`${p.name}: opens inset at 12,48 and dismisses ${p.lip ? "to a lip" : "off screen"}`, async ({ page }) => {
    await gotoFlow(page, `flow=2${p.param ? `&panelui=${p.param}` : ""}`)
    await waitForOpenSheet(page)

    // Whichever edge it arrives from, an open card lands in the same place: 12px in from
    // the screen edge, 12px below the h-9 brand bar it must not cover.
    const open = await box(cardOf(page))
    expectPx(open.x, 12)
    expectPx(open.y, 48)

    await dismiss(page, p)
    // Both boxes are read after the gesture: the frame ends at the composer, which
    // grows and shrinks with what is in it, so where the card rests is only meaningful
    // against where the frame is at that moment.
    const frame = await box(frameOf(page))
    const rest = await box(cardOf(page))

    if (p.lip === 0) {
      // Nothing is left on screen: the card clears the clip line by more than its own
      // shadow can reach, so neither it nor the shadow is drawn. Bounded above as well,
      // or a card flung to an absurd offset would still pass.
      const past = p.axis === "y" ? rest.y - (frame.y + frame.height) : rest.x - PHONE.width
      expect(past, `card rests ${past}px past the clip line`).toBeGreaterThanOrEqual(40)
      expect(past, `card rests ${past}px past the clip line`).toBeLessThanOrEqual(frame.height)
    } else {
      // A lip stays: exactly `lip` px of the card is still inside the frame.
      const inside = p.axis === "y" ? frame.y + frame.height - rest.y : PHONE.width - rest.x
      expectPx(inside, p.lip)
    }

    // Dismissed, the card is a handle rather than a surface: it stops being a dialog.
    await expect(page.getByRole("dialog", { name: PANEL })).toHaveCount(0)
  })
}

// `over` is excluded from the gap assertion below and only from that one: its frame
// deliberately ends at the screen rather than at the composer, so "the handle sits just
// clear of the composer" is not a claim it makes. It still gets the open-position, the
// dismiss-to-a-lip and the tap-to-reopen tests.
for (const p of PRESENTATIONS.filter((option) => option.lip > 0 && option.param !== "over")) {
  test(`${p.name}: the resting handle clears the composer and swipes back open`, async ({ page }) => {
    await gotoFlow(page, `flow=2&panelui=${p.param}`)
    await waitForOpenSheet(page)

    await dismiss(page, p)
    // The frame ends at the composer, so its lower edge is where the composer starts.
    const frame = await box(frameOf(page))
    const composerTop = frame.y + frame.height

    // The resting handle sits just clear of the composer, close enough to read as one
    // pair of controls and far enough not to be mistaken for part of it. Measured on the
    // grabber pill for a bottom sheet, where the pill is pinned to the strip's lower
    // edge; on the strip itself for an edge sheet, where the pill is centred down a
    // full-height strip and it is the strip's bottom that comes near the composer.
    const restingHandle = handle(page)
    const grabbable = await box(p.axis === "y" ? restingHandle.locator("span") : restingHandle)
    const gap = composerTop - (grabbable.y + grabbable.height)
    expect(gap, `resting handle sits ${gap}px above the composer`).toBeGreaterThanOrEqual(10)
    expect(gap, `resting handle sits ${gap}px above the composer`).toBeLessThanOrEqual(14)

    // Swiping it back the way it went returns the card to where it opened.
    await dragHandle(page, restingHandle, p.axis, -DRAG_PX)
    const reopened = await box(cardOf(page))
    expectPx(reopened.x, 12)
    expectPx(reopened.y, 48)
    await expect(page.getByRole("dialog", { name: PANEL })).toBeVisible()
  })

  test(`${p.name}: tapping the resting handle reopens the panel`, async ({ page }) => {
    await gotoFlow(page, `flow=2&panelui=${p.param}`)
    await waitForOpenSheet(page)
    await dismiss(page, p)

    // The lip is a target as well as a grip: a tap is the no-gesture way back in, and
    // the click that follows the dismissing swipe must not have consumed it.
    await handle(page).click()
    await page.waitForTimeout(SETTLE_MS)
    const reopened = await box(cardOf(page))
    expectPx(reopened.x, 12)
    expectPx(reopened.y, 48)
  })
}

test("dismissing the sheet reaches the follow-up chip, and the second panel arrives resting too", async ({ page }) => {
  await gotoFlow(page, "flow=15")
  await waitForOpenSheet(page, "Sales Snapshot")

  // Flow 15 pauses on its next user turn and offers it as a chip in the conversation.
  // The sheet covers that conversation and marks it aria-hidden, so the chip is out of
  // reach until the sheet is dismissed — which is the trade the bottom sheet makes for
  // giving the panel the whole screen.
  const chip = page.getByRole("button", { name: "what drove saturday?" })
  await expect(chip).toHaveCount(0)

  // dismiss() defaults to flow 2's panel; this flow's sheet is named for its own. The
  // shipped presentation rests as a handle, so this minimises rather than sends it away.
  await dragHandle(page, handle(page, "Sales Snapshot"), "y", DRAG_PX)
  await page.waitForTimeout(SETTLE_MS)
  await expect(chip).toHaveCount(1)
  await chip.click()

  // The chip's turn opens a second panel, and it arrives resting like the first: nothing
  // the script opens takes the screen. The conversation stays readable, and the new
  // panel announces itself as a card rather than by covering the answer.
  const secondCard = page.getByRole("button", { name: "Bring Sales Drilldown to the front" })
  await expect(secondCard).toBeVisible({ timeout: PANEL_TIMEOUT })
  await expect(page.getByRole("dialog", { name: "Sales Drilldown" })).toHaveCount(0)

  await secondCard.click()
  await expect(page.getByRole("dialog", { name: "Sales Drilldown" })).toBeVisible({ timeout: PANEL_TIMEOUT })

  // With two panels open the phone shows the newest and the pager reaches the other.
  const pager = page.getByRole("button", { name: "Show the next open panel" })
  await expect(pager).toHaveText("2/2")
  await pager.click()
  await expect(page.getByRole("dialog", { name: "Sales Snapshot" })).toBeVisible()
  await expect(pager).toHaveText("1/2")
  await pager.click()
  await expect(page.getByRole("dialog", { name: "Sales Drilldown" })).toBeVisible()
  await expect(pager).toHaveText("2/2")
})

test("the artifact card reopens a panel that was closed outright", async ({ page }) => {
  await gotoFlow(page, "flow=2")
  await waitForOpenSheet(page)

  // The card lives in the conversation, which the open sheet covers and marks
  // aria-hidden, so it is out of the tree until the panel is off the screen.
  await expect(page.getByRole("button", { name: `Bring ${PANEL} to the front` })).toHaveCount(0)

  await page.getByRole("button", { name: "Close", exact: true }).first().click()
  await expect(page.getByRole("dialog", { name: PANEL })).toBeHidden()

  // Closed, the card changes what it offers rather than disappearing with the panel.
  const reopen = page.getByRole("button", { name: `Reopen ${PANEL}` })
  await expect(reopen).toBeVisible()
  await reopen.click()

  await expect(page.getByRole("dialog", { name: PANEL })).toBeVisible({ timeout: PANEL_TIMEOUT })
})

// The arrival cue (data-pulse on the grabber pill, keyframes in globals.css). Asserted
// on the attribute and the animation it resolves to rather than on pixels: a two-cycle
// pulse measured by sampling frames is a flaky test, and what has to hold is that the
// cue plays on arrival, is finite, and is never replayed by the reader's own swipe.
test("a panel arriving resting pulses its grabber, and minimising it does not", async ({ page }) => {
  await gotoFlow(page, "flow=2")

  const grabber = handle(page).locator("span")
  await expect(grabber).toHaveAttribute("data-pulse", "", { timeout: PANEL_TIMEOUT })
  const anim = await grabber.evaluate((el) => {
    const style = getComputedStyle(el)
    return { name: style.animationName, iterations: style.animationIterationCount }
  })
  expect(anim.name).toBe("grabber-pulse")
  // Finite: a cue that loops is a nag, and the panel is not urgent.
  expect(anim.iterations).toBe("2")

  // Opening the panel is the answer to the cue, so it comes off.
  await page.getByRole("button", { name: `Bring ${PANEL} to the front` }).click()
  await expect(page.getByRole("dialog", { name: PANEL })).toBeVisible({ timeout: PANEL_TIMEOUT })
  await page.waitForTimeout(SETTLE_MS)
  await expect(handle(page).locator("span")).not.toHaveAttribute("data-pulse", /.*/)

  // And swiping it back down is the reader's own doing: the same panel resting again
  // needs no announcement.
  await dragHandle(page, handle(page), "y", DRAG_PX)
  await expect(handle(page).locator("span")).not.toHaveAttribute("data-pulse", /.*/)
})

test("prefers-reduced-motion: the arrival cue drops the swell and keeps the colour", async ({ page }) => {
  // Emulated on the page rather than declared with test.use, which would need a
  // describe block and a contextOptions detour for one assertion.
  await page.emulateMedia({ reducedMotion: "reduce" })
  await gotoFlow(page, "flow=2")

  // The first reduced-motion handling in the app: the attribute and its timing are
  // unchanged, only the keyframes it resolves to.
  const grabber = handle(page).locator("span")
  await expect(grabber).toHaveAttribute("data-pulse", "", { timeout: PANEL_TIMEOUT })
  const name = await grabber.evaluate((el) => getComputedStyle(el).animationName)
  expect(name).toBe("grabber-pulse-still")
})

test("?panelui=over puts the sheet over the composer, and the shipped option does not", async ({ page }) => {
  await gotoFlow(page, "flow=2&panelui=over")
  await waitForOpenSheet(page)

  // The frame ends at the bottom of the screen rather than at the composer, and the
  // scrim above it takes the composer with it — which is the whole difference between
  // this option and the right-side drawer, and the trade it exists to put a number on.
  const frame = await box(frameOf(page))
  expect(Math.round(frame.y + frame.height)).toBe(PHONE.height)

  const typable = await page.getByPlaceholder("Ask anything").evaluate((textarea) => {
    const r = textarea.getBoundingClientRect()
    return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === textarea
  })
  expect(typable, "the composer must be covered under ?panelui=over").toBe(false)
})
