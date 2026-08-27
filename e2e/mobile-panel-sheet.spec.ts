import { test, expect, type Locator, type Page } from "@playwright/test"

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
  // `rest` is the card's x (horizontal) or y (vertical) once dismissed. The two
  // vertical values carry the app frame's 4px bottom inset on a phone (AppFrame.tsx):
  // the composer sits that far off the screen edge, the clip line follows it up, and a
  // card resting past that line lands 4px higher than the viewport alone would put it.
  { name: "bottom sheet", param: "", axis: "y", lip: 0, rest: 766 },
  { name: "right-side drawer", param: "right", axis: "x", lip: 0, rest: 438 },
  { name: "swipe to open", param: "swipe", axis: "y", lip: 40, rest: 678 },
  { name: "swipe from the edge", param: "edge", axis: "x", lip: 40, rest: 350 },
] as const

type Presentation = (typeof PRESENTATIONS)[number]

/** Pixel assertion with slack: a layout value can legitimately land a pixel either side. */
function expectPx(actual: number, expected: number, slack = 2) {
  expect(actual, `expected ${expected}px +/- ${slack}, got ${actual}px`).toBeGreaterThanOrEqual(expected - slack)
  expect(actual, `expected ${expected}px +/- ${slack}, got ${actual}px`).toBeLessThanOrEqual(expected + slack)
}

/** The grab strip: a button, named for the panel and for what a press would do to it. */
const handle = (page: Page, label = PANEL) => page.getByRole("button", { name: label })

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
  // The concept demo blocks on an onboarding dialog until this flag is set — same key
  // AskNanciContext reads on mount (and the same beforeEach concept-flows.spec.ts uses).
  await page.addInitScript(() => {
    window.localStorage.setItem("ask_nanci_onboarded", "1")
  })
  await page.goto(`/?mode=concept-embed&${query}&autoplay`)
}

/** Wait for the flow to open its panel, and for the card to finish sliding in. */
async function waitForOpenSheet(page: Page, label = PANEL) {
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
    expectPx(p.axis === "y" ? rest.y : rest.x, p.rest)

    if (p.lip === 0) {
      // Nothing is left on screen: the card clears the clip line by more than its own
      // shadow can reach, so neither it nor the shadow is drawn.
      if (p.axis === "y") expect(rest.y).toBeGreaterThanOrEqual(frame.y + frame.height + 40)
      else expect(rest.x).toBeGreaterThanOrEqual(PHONE.width + 40)
    } else {
      // A lip stays: exactly `lip` px of the card is still inside the frame.
      const inside = p.axis === "y" ? frame.y + frame.height - rest.y : PHONE.width - rest.x
      expectPx(inside, p.lip)
    }

    // Dismissed, the card is a handle rather than a surface: it stops being a dialog.
    await expect(page.getByRole("dialog", { name: PANEL })).toHaveCount(0)
  })
}

for (const p of PRESENTATIONS.filter((option) => option.lip > 0)) {
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

test("a second panel is reachable through the pager, and the follow-up chip stays tappable", async ({ page }) => {
  await gotoFlow(page, "flow=15")
  await waitForOpenSheet(page, "Sales Snapshot")

  // Flow 15 pauses on its next user turn and offers it as a chip. The conversation is
  // behind the sheet and marked aria-hidden with it, so the only copy of the chip in the
  // accessibility tree is the one MobileFlowChips lifts into the composer.
  const chip = page.getByRole("button", { name: "what drove saturday?" })
  await expect(chip).toHaveCount(1)
  // click() fails if anything is covering it, which is the assertion: the sheet must not
  // be able to swallow the only control that advances the flow.
  await chip.click()

  await expect(page.getByRole("dialog", { name: "Sales Drilldown" })).toBeVisible({ timeout: PANEL_TIMEOUT })

  // The brand-bar toggle counts what is open, badge included.
  const badge = page.getByRole("button", { name: "Show 2 panels", exact: true })
  await expect(badge).toHaveText("2")

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
