import { expect, test } from "@playwright/test";
import { collectIssues, editionDates } from "./helpers";

const LANES = ["trend", "economy", "design", "tech"];

test("the latest edition shows all four lanes with the newest date", async ({ page }) => {
  const issues = collectIssues(page);
  const [latest] = editionDates();
  await page.goto("/trend");

  for (const lane of LANES) {
    await expect(page.locator(`section#lane-${lane}`), `lane ${lane}`).toBeVisible();
    expect(await page.locator(`section#lane-${lane} a[target='_blank']`).count(), `articles in ${lane}`).toBeGreaterThanOrEqual(1);
  }
  // The edition date is printed as 2026.10.18 on the page.
  await expect(page.locator("main")).toContainText(latest.replaceAll("-", "."));
  expect(issues, issues.join("\n")).toEqual([]);
});

test("every article link is https, opens a new tab, and cannot reach back into the site", async ({ page }) => {
  await page.goto("/trend");
  const links = await page.locator("main a[target='_blank']").evaluateAll((nodes) =>
    nodes.map((node) => ({ href: node.getAttribute("href") ?? "", rel: node.getAttribute("rel") ?? "", text: (node.textContent ?? "").trim().slice(0, 40) })),
  );
  expect(links.length).toBeGreaterThanOrEqual(10);
  for (const link of links) {
    expect(link.href, link.text).toMatch(/^https:\/\//);
    expect(link.href, link.text).not.toMatch(/^https:\/\/[^/]*@/); // no credentials
    expect(link.rel, link.text).toContain("noopener");
    expect(link.rel, link.text).toContain("noreferrer");
  }
});

test("no link on the board uses a script, data, or plain-http address", async ({ page }) => {
  for (const date of editionDates().slice(0, 5)) {
    await page.goto(`/trend/${date}`);
    const hrefs = await page.locator("a[href]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href") ?? ""));
    for (const href of hrefs) expect(href, `${date}: ${href}`).not.toMatch(/^\s*(javascript|data|vbscript|file|http):/i);
  }
});

test("older editions are reachable from the calendar", async ({ page }) => {
  const dates = editionDates();
  expect(dates.length).toBeGreaterThan(1);
  await page.goto("/trend");
  const calendar = page.getByRole("group", { name: "Morning editions" });
  const links = calendar.getByRole("link");
  expect(await links.count()).toBeGreaterThan(0);

  const target = await links.last().getAttribute("href");
  expect(target).toMatch(/^\/trend(\/\d{4}-\d{2}-\d{2})?$/);
  await links.last().click();
  await expect(page).toHaveURL(new RegExp(`${target}$`));
  await expect(page.locator("h1")).toHaveCount(1);
});

test("an unknown edition date is a 404, not an error page", async ({ page }) => {
  const response = await page.goto("/trend/1999-01-01");
  expect(response?.status()).toBe(404);
});

test("a malformed edition date cannot read other files", async ({ request }) => {
  for (const attempt of ["..%2F..%2Fpackage", "%2e%2e/%2e%2e/package.json", "2026-10-18.json", "2026-10-18/../../x"]) {
    const response = await request.get(`/trend/${attempt}`, { maxRedirects: 0 });
    expect([308, 400, 404]).toContain(response.status());
    expect(await response.text()).not.toContain("minseok-li-site");
  }
});
