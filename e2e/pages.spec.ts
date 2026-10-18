import { expect, test } from "@playwright/test";
import { PAGES, collectIssues, editionDates } from "./helpers";

for (const page of PAGES) {
  test(`${page.name} (${page.path}) loads cleanly`, async ({ page: browser }) => {
    const issues = collectIssues(browser);
    const response = await browser.goto(page.path);
    expect(response?.status()).toBe(200);

    await expect(browser).toHaveTitle(/\S/);
    await expect(browser.locator("html")).toHaveAttribute("lang", "en");
    await expect(browser.locator("h1")).toHaveCount(1);
    if (page.h1) await expect(browser.locator("h1")).toHaveText(page.h1);

    // Every <img> decoded and has an alt attribute (empty alt is fine for decoration).
    await browser.waitForLoadState("load");
    const images = await browser.$$eval("img", (nodes) =>
      nodes.map((node) => ({ src: node.src, alt: node.getAttribute("alt"), loaded: node.complete && node.naturalWidth > 0, lazy: node.loading === "lazy" })),
    );
    for (const image of images) {
      expect(image.alt, `missing alt on ${image.src}`).not.toBeNull();
      if (!image.lazy) expect(image.loaded, `image failed to load: ${image.src}`).toBe(true);
    }

    expect(issues, issues.join("\n")).toEqual([]);
  });
}

test("the latest Trend editions load cleanly", async ({ page }) => {
  const issues = collectIssues(page);
  for (const date of editionDates().slice(0, 3)) {
    const response = await page.goto(`/trend/${date}`);
    expect(response?.status(), date).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  }
  expect(issues, issues.join("\n")).toEqual([]);
});

test("no page ships placeholder or unfinished text", async ({ page }) => {
  const unfinished = /PLACEHOLDER|\[ADD |\[FRAMEWORK\]|\[RUNTIME|\[DATABASE\]|\[HOSTING\]|lorem ipsum|TODO|undefined|\[object Object\]/i;
  for (const entry of PAGES) {
    await page.goto(entry.path);
    const text = await page.locator("body").innerText();
    expect(text, `${entry.path} contains unfinished text`).not.toMatch(unfinished);
  }
});
