import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { collectIssues, watchCsp } from "./helpers";

test("an unknown address is a real 404 with a readable page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("body")).toContainText("This page could not be found");
});

test("the 404 page is on-brand and the CSP does not break it", async ({ page }) => {
  // Regression: Next.js's built-in 404 uses inline styles that the CSP blocks, leaving it unstyled.
  const readCsp = await watchCsp(page);
  // The browser itself logs "Failed to load resource ... 404" for the 404 navigation; anything else is a problem.
  const issues = collectIssues(page, { allow: [/HTTP 404/, /status of 404/] });
  for (const url of ["/this-page-does-not-exist", "/trend/1999-01-01", "/hobby/nobody", "/work/unknown"]) {
    const response = await page.goto(url);
    expect(response?.status(), url).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page could not be found.");
    await expect(page.getByRole("link", { name: /Back to home/ })).toBeVisible();
    // Styled with the site's font, not the browser default serif.
    const font = await page.getByRole("heading", { level: 1 }).evaluate((node) => getComputedStyle(node).fontFamily);
    expect(font, url).not.toMatch(/^(Times|serif)/i);
    const enforced = (await readCsp()).filter((v) => v.disposition === "enforce");
    expect(enforced, `${url}: ${JSON.stringify(enforced)}`).toEqual([]);
  }
  expect(issues, issues.join("\n")).toEqual([]);
});

test("the 404 page has no accessibility violations", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});

test("unknown nested addresses and file-like probes are 404, never 500", async ({ request }) => {
  for (const url of ["/research/nope", "/work/unknown", "/hobby/nobody", "/.env", "/.git/config", "/package.json", "/scripts/fetch-digest.mjs", "/content/digest/sources.json", "/app/layout.tsx", "/.github/workflows/daily-digest.yml"]) {
    const response = await request.get(url, { maxRedirects: 0 });
    expect(response.status(), url).toBe(404);
  }
});

test("source maps are not published", async ({ page, request }) => {
  await page.goto("/");
  const scripts = await page.locator("script[src]").evaluateAll((nodes) => nodes.map((n) => n.getAttribute("src")!));
  expect(scripts.length).toBeGreaterThan(0);
  for (const src of scripts.slice(0, 5)) {
    const response = await request.get(`${src}.map`);
    expect(response.status(), `${src}.map`).not.toBe(200);
  }
});

test("unusual query strings and paths are handled without errors", async ({ page }) => {
  const issues = collectIssues(page, { allow: [/HTTP 404/, /status of 404/] });
  for (const url of ["/?a=1&a=2&b[]=3", "/research?x=%00", "/cv#%3Cb%3E", "/trend?date=../../etc/passwd", "/hobby//", "/%E0%A4%A"]) {
    try {
      const response = await page.goto(url);
      expect([200, 308, 400, 404], url).toContain(response?.status());
    } catch (error) {
      // A hosting edge may refuse a malformed request before it reaches the app; that is a safe outcome.
      if (!/ERR_HTTP2_PROTOCOL_ERROR|ERR_INVALID_URL|ERR_CONNECTION_RESET/.test(String(error))) throw error;
    }
  }
  expect(issues.filter((i) => i.startsWith("uncaught")), issues.join("\n")).toEqual([]);
});

test("only GET and HEAD are accepted; writes are refused with 405", async ({ request }) => {
  for (const path of ["/", "/trend", "/research"]) {
    for (const method of ["post", "put", "delete", "patch"] as const) {
      const response = await request[method](path, { data: { x: 1 }, failOnStatusCode: false });
      expect(response.status(), `${method.toUpperCase()} ${path}`).toBe(405);
    }
    expect((await request.get(path)).status()).toBe(200);
    expect((await request.head(path)).status()).toBe(200);
  }
});
