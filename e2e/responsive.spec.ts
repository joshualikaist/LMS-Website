import { expect, test } from "@playwright/test";
import { PAGES } from "./helpers";

// The width sweep sets its own viewports, so it only needs to run once.
test.skip(({ isMobile }) => isMobile, "covered by the desktop project's explicit widths");

const WIDTHS = [320, 360, 390, 768, 1024, 1440, 1920];

for (const width of WIDTHS) {
  test(`no page overflows horizontally at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const entry of PAGES) {
      await page.goto(entry.path);
      const { scroll, inner } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: window.innerWidth }));
      expect(scroll, `${entry.path} at ${width}px`).toBeLessThanOrEqual(inner);

      const nav = await page.getByRole("navigation", { name: "Primary navigation" }).boundingBox();
      expect(nav, entry.path).not.toBeNull();
      expect(nav!.x, `${entry.path} nav left edge at ${width}px`).toBeGreaterThanOrEqual(0);
      expect(nav!.x + nav!.width, `${entry.path} nav right edge at ${width}px`).toBeLessThanOrEqual(width);
    }
  });
}

test("tap targets in the navigation are at least 28px tall on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/research");
  for (const link of await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link").all()) {
    expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(28);
  }
});

test("the home hero keeps the name and tagline readable on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const name = page.getByRole("heading", { level: 1, name: "Minseok Li" });
  await expect(name).toBeVisible();
  const box = (await name.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  await expect(page.getByText("Mechanical Engineering,")).toBeVisible();
  await expect(page.getByText("Field Robotics")).toBeVisible();
});
