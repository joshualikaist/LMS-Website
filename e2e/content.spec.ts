import { expect, test } from "@playwright/test";
import { collectIssues } from "./helpers";

test.describe("CV", () => {
  test("shows the sections and never offers a broken PDF", async ({ page, request }) => {
    await page.goto("/cv");
    for (const heading of ["Education", "Experience", "Projects"]) {
      await expect(page.getByRole("heading", { name: heading, level: 2 })).toBeVisible();
    }
    await expect(page.locator("main")).toContainText("KAIST");
    await expect(page.locator("main")).toContainText("Field AI & Robotics Lab");

    // Regression: the download button once pointed at an empty 412-byte PDF.
    const download = page.getByRole("link", { name: /CV Download/ });
    if (await download.count()) {
      const response = await request.get((await download.getAttribute("href"))!);
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toContain("pdf");
      expect((await response.body()).length).toBeGreaterThan(5_000);
    }
  });
});

test.describe("Research", () => {
  test("lists the projects and every link on the page resolves", async ({ page, request }) => {
    const issues = collectIssues(page);
    await page.goto("/research");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "MOTAR", exact: true })).toBeVisible();
    await expect(main.getByRole("link", { name: "MESC Website", exact: true })).toBeVisible();
    await expect(main.getByText("ONGOING")).toBeVisible();

    const hrefs = await main.locator("a[href^='/']").evaluateAll((nodes) => [...new Set(nodes.map((n) => n.getAttribute("href")!))]);
    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
    }
    expect(issues, issues.join("\n")).toEqual([]);
  });

  test("the MOTAR story links to the technical notes and back", async ({ page }) => {
    await page.goto("/work/motar");
    await page.getByRole("link", { name: "Technical notes" }).click();
    await expect(page).toHaveURL(/\/research\/motar$/);
    await expect(page.locator("h1")).toHaveText(/Technical Notes/);
    await page.getByRole("link", { name: /Back to the case study/ }).click();
    await expect(page).toHaveURL(/\/work\/motar$/);
  });

  test("the technical notes render their system diagram and contract table", async ({ page }) => {
    await page.goto("/research/motar");
    await expect(page.locator("main svg, main table").first()).toBeVisible();
  });
});

test.describe("Hobby", () => {
  test("project pages show their screens when they have them", async ({ page }) => {
    await page.goto("/hobby/babdoduk");
    await expect(page.getByRole("heading", { name: /Screens/ })).toBeVisible();
    const screens = page.locator("figure img");
    expect(await screens.count()).toBeGreaterThanOrEqual(6);
    for (const image of await screens.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
    }
    for (const link of await page.locator("main a[target='_blank']").all()) {
      await expect(link).toHaveAttribute("rel", /noopener|noreferrer/);
    }
  });

  test("the list links to both projects", async ({ page }) => {
    await page.goto("/hobby");
    await page.locator("a[href='/hobby/shelton-lms']").first().click();
    await expect(page).toHaveURL(/\/hobby\/shelton-lms$/);
    await expect(page.getByText("Yanggu Rookie Division Team Runner-up")).toBeVisible();
  });
});
