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
    for (const { label, name, filename } of [
      { label: "English", name: "Download English resume (PDF)", filename: "Minseok_Li_Resume.pdf" },
      { label: "한국어", name: "한국어 이력서 다운로드 (PDF)", filename: "이민석_이력서.pdf" },
    ]) {
      const link = page.getByRole("link", { name });
      await expect(link, label).toBeVisible();
      await expect(link).toContainText(label);
      await expect(link).toHaveAttribute("download", filename);
      const response = await request.get((await link.getAttribute("href"))!);
      expect(response.status(), label).toBe(200);
      expect(response.headers()["content-type"], label).toContain("pdf");
      const body = await response.body();
      expect(body.subarray(0, 5).toString("latin1"), label).toBe("%PDF-");
      expect(body.length, label).toBeGreaterThan(20_000);
    }
  });

  // The hosting platform sends its own Content-Disposition for static files; the site overrides it so the
  // saved name is the intended one on every host (this failed on a real deployment while passing locally).
  for (const { name, filename } of [
    { name: "Download English resume (PDF)", filename: "Minseok_Li_Resume.pdf" },
    { name: "한국어 이력서 다운로드 (PDF)", filename: "이민석_이력서.pdf" },
  ]) {
    test(`clicking "${name}" saves ${filename}`, async ({ page }) => {
      await page.goto("/cv");
      const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name }).click()]);
      expect(download.suggestedFilename()).toBe(filename);
    });
  }
});

test.describe("Research", () => {
  test("lists the projects and every link on the page resolves", async ({ page, request }) => {
    const issues = collectIssues(page);
    await page.goto("/research");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "MOTAR", exact: true })).toBeVisible();
    await expect(main.locator("article")).toHaveCount(1);
    await expect(main.getByText("ONGOING")).toBeVisible();

    // The live status page opens in a new tab, safely.
    const status = main.getByRole("link", { name: /Website/ });
    await expect(status).toHaveAttribute("href", "https://joshualikaist.github.io/MOTAR/status/");
    await expect(status).toHaveAttribute("target", "_blank");
    await expect(status).toHaveAttribute("rel", /noopener/);

    const hrefs = await main.locator("a[href^='/']").evaluateAll((nodes) => [...new Set(nodes.map((n) => n.getAttribute("href")!))]);
    expect(hrefs.length).toBeGreaterThanOrEqual(1);
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
