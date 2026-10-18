import { readdirSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

export type SitePage = { path: string; name: string; h1: RegExp | null };

/** Every page that is meant to be reachable. The Trend board has a headline-per-day h1, so it is not pinned. */
export const PAGES: SitePage[] = [
  { path: "/", name: "home", h1: /Minseok Li/ },
  { path: "/research", name: "research", h1: /^Research$/ },
  { path: "/work/motar", name: "motar story", h1: /^MOTAR$/ },
  { path: "/research/motar", name: "motar technical", h1: /Technical Notes/ },
  { path: "/work/mesc", name: "mesc", h1: /^MESC$/ },
  { path: "/cv", name: "cv", h1: /^Minseok Li$/ },
  { path: "/hobby", name: "hobby", h1: /^Hobby$/ },
  { path: "/hobby/shelton-lms", name: "shelton", h1: /Shelton LMS/ },
  { path: "/hobby/babdoduk", name: "babdoduk", h1: /밥도둑/ },
  { path: "/trend", name: "trend", h1: null },
];

const EDITIONS_DIR = path.join(process.cwd(), "content", "digest", "editions");

/** Edition dates on disk, newest first. Read at test time so the daily refresh never needs a test edit. */
export function editionDates(): string[] {
  return readdirSync(EDITIONS_DIR)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .map((file) => file.replace(".json", ""))
    .sort()
    .reverse();
}

/**
 * Collects everything that should never happen on a healthy page: console errors, uncaught exceptions,
 * failed requests, and HTTP errors. `[Report Only]` CSP notices are ignored here (see security.spec.ts).
 */
export function collectIssues(page: Page, { allow = [] as RegExp[] } = {}) {
  const issues: string[] = [];
  const keep = (text: string) => !allow.some((pattern) => pattern.test(text));
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" && !text.includes("[Report Only]") && keep(text)) issues.push(`console error: ${text}`);
  });
  page.on("pageerror", (error) => issues.push(`uncaught exception: ${error.message}`));
  page.on("requestfailed", (request) => {
    const reason = request.failure()?.errorText ?? "";
    // Navigating away aborts in-flight media requests; that is not a failure.
    if (!reason.includes("ERR_ABORTED")) issues.push(`request failed: ${request.url()} (${reason})`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      const text = `HTTP ${response.status()}: ${response.url()}`;
      if (keep(text)) issues.push(text);
    }
  });
  return issues;
}

type CspRecord = { directive: string; disposition: string; blocked: string };

/** Records securitypolicyviolation events from the very start of every document. */
export async function watchCsp(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __csp: CspRecord[] }).__csp = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      (window as unknown as { __csp: CspRecord[] }).__csp.push({
        directive: event.violatedDirective,
        disposition: event.disposition,
        blocked: event.blockedURI,
      });
    });
  });
  return () => page.evaluate(() => (window as unknown as { __csp: CspRecord[] }).__csp ?? []);
}

/** Relative luminance (WCAG) of a computed colour: `rgb()/rgba()`, or `color(srgb r g b)` from color-mix(). */
export function luminance(color: string): number {
  const scale = color.startsWith("color(") ? 255 : 1; // color(srgb ...) channels are 0-1
  const [r, g, b] = (color.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).map((n) => Number(n) * scale).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
