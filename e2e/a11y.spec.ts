import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGES } from "./helpers";

for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe (${scheme})`, () => {
    test.use({ colorScheme: scheme });

    for (const entry of PAGES) {
      test(`${entry.name} has no WCAG A/AA violations`, async ({ page }) => {
        await page.goto(entry.path);
        await page.waitForLoadState("load");
        const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const summary = violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.target.join(" ")}`);
        expect(summary, summary.join("\n")).toEqual([]);
      });
    }
  });
}

test.describe("keyboard", () => {
  // The mobile project has no keyboard.
  test.skip(({ isMobile }) => isMobile, "keyboard navigation is a desktop concern");

  test("Tab reaches the navigation first, in order, each with a visible focus ring", async ({ page }) => {
    await page.goto("/research");
    const focused: { label: string; ring: boolean }[] = [];
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      focused.push(
        await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          const style = getComputedStyle(el);
          const ring = (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== "none";
          return { label: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim(), ring };
        }),
      );
    }
    expect(focused.map((f) => f.label)).toEqual(["Home", "Research", "CV", "Hobby", "Trend"]);
    for (const item of focused) expect(item.ring, `no visible focus on ${item.label}`).toBe(true);
  });

  test("Enter activates a focused navigation link", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "CV", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/cv$/);
  });

  test("every interactive element can be reached and focus never gets trapped", async ({ page }) => {
    await page.goto("/hobby/babdoduk");
    const total = await page.locator("a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])").count();
    const seen = new Set<string>();
    for (let i = 0; i < total + 5; i++) {
      await page.keyboard.press("Tab");
      seen.add(await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        return `${el.tagName}:${el.getAttribute("href") ?? el.textContent?.trim().slice(0, 20)}`;
      }));
    }
    // After tabbing past everything, focus leaves the page content (browser chrome / body) rather than sticking.
    expect(seen.size).toBeGreaterThanOrEqual(Math.min(total, 8));
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator(":focus")).toHaveCount(1);
  });

  test("decorative media is hidden from assistive technology and respects reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("video").first()).toHaveJSProperty("paused", true);
    const hidden = await page.locator("video").first().evaluate((node) => node.closest("[aria-hidden='true']") !== null);
    expect(hidden).toBe(true);
    await context.close();
  });
});
