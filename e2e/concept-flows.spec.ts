import { test, expect, type Page } from "@playwright/test"
import { ONBOARDING_KEY, TOUR_DONE_KEY } from "../lib/ask-nanci/storage-keys"

// Smoke net for the concept demo flows (`/?mode=concept`). These exercise the two
// things a later context refactor must not break: (1) an assistant answer streams
// into the chat, and (2) a scripted turn opens a side panel. Selectors lean on
// visible text / roles / the "Ask anything" input so they survive markup churn.

const CONCEPT_URL = "/?mode=concept"

// Streaming is word-by-word; the last words land ~10-15s after send on a cold-ish
// dev server, so assertions get a generous window.
const STREAM_TIMEOUT = 20_000

// Trigger a flow by typing its prompt into the chat input and pressing Enter —
// more stable than the welcome cards, whose buttons all read "Try it".
async function askPrompt(page: Page, prompt: string) {
  const input = page.getByPlaceholder("Ask anything")
  await expect(input).toBeVisible()
  await input.click()
  await input.fill(prompt)
  await input.press("Enter")
}

test.beforeEach(async ({ page }) => {
  // The non-embed concept view blocks on two things: the link-accounts dialog,
  // then the product tour. Both must be marked done or their overlay swallows
  // every click. Keys are imported, never retyped — adding the tour is exactly
  // what silently broke this file before.
  await page.addInitScript(([onboarded, tour]) => {
    window.localStorage.setItem(onboarded, "1")
    window.localStorage.setItem(tour, "1")
  }, [ONBOARDING_KEY, TOUR_DONE_KEY])
  await page.goto(CONCEPT_URL)
  // Welcome view is up once the chat input has rendered.
  await expect(page.getByPlaceholder("Ask anything")).toBeVisible({ timeout: 30_000 })
})

test("chat-only flow streams a text answer", async ({ page }) => {
  await askPrompt(page, "Update my phone number")

  // The user's message echoes into the transcript...
  await expect(page.getByText("Update my phone number").first()).toBeVisible({ timeout: STREAM_TIMEOUT })
  // ...then Nanci's scripted answer streams in (distinctive to this flow only).
  await expect(page.getByText(/current phone number on file is \(512\) 334-7821/)).toBeVisible({
    timeout: STREAM_TIMEOUT,
  })
})

test("data-lookup flow streams an answer and opens the volume panel", async ({ page }) => {
  await askPrompt(page, "Show me merchant volume for this week")

  // Streamed answer text (unique to the message, not repeated in the panel).
  await expect(page.getByText(/merchant volume for the week/)).toBeVisible({ timeout: STREAM_TIMEOUT })

  // The side panel opens with its heading — the panel-open assertion.
  await expect(page.getByText("Volume by Merchant")).toBeVisible({ timeout: STREAM_TIMEOUT })
})

// Offer flows are manual-step: the answer shows Yes/No pills, tapping "Yes, show me"
// opens the ranked offer list, then Apply → pre-filled form → Submit drops a
// pending-review request card into chat. Exercises the whole panel→form→success path.
test("credit-card offer flow: list → application → pending-review card", async ({ page }) => {
  await askPrompt(page, "Who am I paying the most on food cost?")
  await expect(page.getByText(/largest food-cost vendor/)).toBeVisible({ timeout: STREAM_TIMEOUT })

  await page.getByRole("button", { name: "Yes, show me" }).click()
  await expect(page.getByText("Best Business Credit Cards of July 2026")).toBeVisible({ timeout: STREAM_TIMEOUT })

  // Apply on the first card → pre-filled form (business name is pre-populated).
  await page.getByRole("button", { name: /Apply Now/ }).first().click()
  await expect(page.locator('input[value="Sunrise Bistro LLC"]')).toBeVisible()

  await page.getByRole("button", { name: "Submit Application" }).click()
  await expect(page.getByText("Credit card request submitted")).toBeVisible({ timeout: STREAM_TIMEOUT })
})

test("business-loan offer flow: list → application → pending-review card", async ({ page }) => {
  await askPrompt(page, "Do I have enough money for payroll?")
  await expect(page.getByText(/projected to be/)).toBeVisible({ timeout: STREAM_TIMEOUT })

  await page.getByRole("button", { name: "Yes, show me" }).click()
  await expect(page.getByText("Best Small Business Loans of July 2026")).toBeVisible({ timeout: STREAM_TIMEOUT })

  await page.getByRole("button", { name: /See Loan Options/ }).first().click()
  await expect(page.locator('input[value="Sunrise Bistro LLC"]')).toBeVisible()

  await page.getByRole("button", { name: "Submit Application" }).click()
  await expect(page.getByText("Loan request submitted")).toBeVisible({ timeout: STREAM_TIMEOUT })
})

test("sales flow opens the weekly sales panel", async ({ page }) => {
  await askPrompt(page, "how'd this week go vs last week?")

  // Streamed answer text (unique phrasing from the scripted turn).
  await expect(page.getByText(/\$18,240 this week against \$15,900 last week/)).toBeVisible({
    timeout: STREAM_TIMEOUT,
  })

  // Panel heading confirms the side panel mounted.
  await expect(page.getByText("Weekly Sales Trend")).toBeVisible({ timeout: STREAM_TIMEOUT })
})
