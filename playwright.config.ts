import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
// E2E_BASE_URL runs the same suite against a deployed site (lab or production) instead of a local build.
const external = process.env.E2E_BASE_URL?.replace(/\/$/, "");
const baseURL = external ?? `http://127.0.0.1:${PORT}`;
// PW_CHANNEL=chrome reuses an installed Chrome locally; CI installs Playwright's own Chromium.
const channel = process.env.PW_CHANNEL || undefined;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI
    ? [["list"], ["github"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL,
    channel,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel } },
  ],
  // Serves the production build (`npm run build` first). Not started when testing a deployed URL.
  webServer: external
    ? undefined
    : {
        command: `npm run start -- --port ${PORT} --hostname 127.0.0.1`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
