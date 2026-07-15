import { test, expect, type Page } from "@playwright/test"

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
  // The non-embed concept view shows a blocking onboarding dialog until accounts
  // are linked; this localStorage flag marks onboarding done so the welcome view
  // is interactive. (Same key AskNanciContext checks on mount.)
  await page.addInitScript(() => {
    window.localStorage.setItem("ask_nanci_onboarded", "1")
  })
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

test("sales flow opens the weekly sales panel", async ({ page }) => {
  await askPrompt(page, "how'd this week go vs last week?")

  // Streamed answer text (unique phrasing from the scripted turn).
  await expect(page.getByText(/\$18,240 this week against \$15,900 last week/)).toBeVisible({
    timeout: STREAM_TIMEOUT,
  })

  // Panel heading confirms the side panel mounted.
  await expect(page.getByText("Weekly Sales Trend")).toBeVisible({ timeout: STREAM_TIMEOUT })
})
