import { expect, test } from "@playwright/test";
import { PAGES, collectIssues, luminance } from "./helpers";

for (const scheme of ["light", "dark"] as const) {
  test.describe(`${scheme} mode`, () => {
    test.use({ colorScheme: scheme });

    test("follows the system setting on every inner page", async ({ page }) => {
      const issues = collectIssues(page);
      for (const entry of PAGES.filter((p) => p.path !== "/")) {
        await page.goto(entry.path);
        const colours = await page.evaluate(() => ({
          background: getComputedStyle(document.body).backgroundColor,
          text: getComputedStyle(document.querySelector("main")!).color,
          scheme: getComputedStyle(document.documentElement).colorScheme,
        }));
        const bg = luminance(colours.background);
        const fg = luminance(colours.text);

        if (scheme === "dark") expect(bg, `${entry.path} background`).toBeLessThan(0.1);
        else expect(bg, `${entry.path} background`).toBeGreaterThan(0.8);
        // Body text and background must differ enough to read (WCAG AA for normal text is 4.5:1).
        const ratio = (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05);
        expect(ratio, `${entry.path} text contrast`).toBeGreaterThanOrEqual(4.5);
        expect(colours.scheme).toContain(scheme);
      }
      expect(issues, issues.join("\n")).toEqual([]);
    });

    test("keeps the navigation and footer legible", async ({ page }) => {
      await page.goto("/research");
      for (const selector of ["nav[aria-label='Primary navigation'] a[aria-current='page']", "footer a"]) {
        const colours = await page.locator(selector).first().evaluate((node) => {
          const style = getComputedStyle(node);
          // Walk up to the first opaque background behind the element.
          let el: Element | null = node;
          let background = "rgba(0, 0, 0, 0)";
          while (el) {
            background = getComputedStyle(el).backgroundColor;
            if (!/(rgba\(.*,\s*0\)|\/\s*0\))$/.test(background) && background !== "transparent") break;
            el = el.parentElement;
          }
          return { text: style.color, background };
        });
        const a = luminance(colours.text);
        const b = luminance(colours.background);
        expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), selector).toBeGreaterThanOrEqual(3);
      }
    });

    test("does not overflow on a phone", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      for (const entry of PAGES) {
        await page.goto(entry.path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(overflow, `${entry.path} (${scheme})`).toBe(false);
      }
    });
  });
}
