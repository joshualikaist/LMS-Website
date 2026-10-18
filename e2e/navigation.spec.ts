import { expect, test } from "@playwright/test";
import { PAGES } from "./helpers";

const NAV = [
  { name: "Research", url: "/research", h1: /^Research$/ },
  { name: "CV", url: "/cv", h1: /^Minseok Li$/ },
  { name: "Hobby", url: "/hobby", h1: /^Hobby$/ },
  { name: "Trend", url: "/trend", h1: /\S/ },
];

test("the primary navigation lists the five destinations in order", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link");
  await expect(links).toHaveCount(5);
  await expect(links.nth(0)).toHaveAccessibleName("Home");
  for (const [index, item] of NAV.entries()) await expect(links.nth(index + 1)).toHaveText(item.name);
});

test("clicking through the navigation reaches every section and back home", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  for (const item of NAV) {
    await nav.getByRole("link", { name: item.name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${item.url}$`));
    await expect(page.locator("h1").first()).toHaveText(item.h1);
    await expect(nav.getByRole("link", { name: item.name, exact: true })).toHaveAttribute("aria-current", "page");
  }
  await nav.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("Research stays highlighted on its detail pages", async ({ page }) => {
  for (const url of ["/work/motar", "/research/motar", "/work/mesc"]) {
    await page.goto(url);
    await expect(page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Research", exact: true })).toHaveAttribute("aria-current", "page");
  }
});

test("the navigation sits in the same place on every page", async ({ page }) => {
  // Regression: the home page once used a different top offset than every other page.
  const boxes: { path: string; x: number; y: number; width: number; height: number }[] = [];
  for (const entry of PAGES) {
    await page.goto(entry.path);
    const box = await page.getByRole("navigation", { name: "Primary navigation" }).boundingBox();
    expect(box, entry.path).not.toBeNull();
    boxes.push({ path: entry.path, ...box! });
  }
  const [first, ...rest] = boxes;
  for (const box of rest) {
    expect(Math.abs(box.y - first.y), `${box.path} top offset`).toBeLessThanOrEqual(1);
    expect(Math.abs(box.height - first.height), `${box.path} height`).toBeLessThanOrEqual(1);
    expect(Math.abs(box.width - first.width), `${box.path} width`).toBeLessThanOrEqual(2);
    expect(Math.abs(box.x - first.x), `${box.path} horizontal position`).toBeLessThanOrEqual(2);
  }
});

test("browser back and forward keep working", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "CV", exact: true }).click();
  await expect(page).toHaveURL(/\/cv$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/cv$/);
});

test("footer profile links open in a new tab safely", async ({ page }) => {
  await page.goto("/research");
  const links = page.locator("footer a");
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener|noreferrer/);
  }
});

test("retired and legacy addresses still land somewhere useful", async ({ page, request }) => {
  await page.goto("/digest");
  await expect(page).toHaveURL(/\/trend$/);
  await page.goto("/notes");
  await expect(page).toHaveURL(/\/$/);

  const icon = await request.get("/favicon.ico");
  expect(icon.ok()).toBe(true);
});
