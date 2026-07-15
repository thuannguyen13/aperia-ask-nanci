import { defineConfig, devices } from "@playwright/test"

// Dedicated port so the E2E dev server never collides with a dev server
// already running on :3000.
const PORT = 3100
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  expect: {
    // Streaming is word-by-word (~50-120ms/word), so give assertions room.
    timeout: 15_000,
  },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    env: { PORT: String(PORT) },
    reuseExistingServer: !process.env.CI,
    // dev + turbopack first compile is slow.
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
})
