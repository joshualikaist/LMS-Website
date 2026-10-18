import { createServer, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { expect, test } from "@playwright/test";
import { PAGES, watchCsp } from "./helpers";

const parse = (policy: string) =>
  Object.fromEntries(
    policy
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [name, ...values] = part.split(/\s+/);
        return [name, values];
      }),
  ) as Record<string, string[]>;

test.describe("response headers", () => {
  test("every page carries the hardening headers", async ({ request }) => {
    for (const path of ["/", "/research", "/trend", "/hobby/babdoduk", "/no-such-page"]) {
      const headers = (await request.get(path)).headers();
      expect(headers["x-content-type-options"], path).toBe("nosniff");
      expect(headers["x-frame-options"], path).toBe("DENY");
      expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
      expect(headers["cross-origin-opener-policy"], path).toBe("same-origin");
      expect(headers["permissions-policy"], path).toMatch(/camera=\(\)/);
      expect(headers["permissions-policy"], path).toMatch(/microphone=\(\)/);
      expect(headers["permissions-policy"], path).toMatch(/geolocation=\(\)/);
      expect(headers["content-security-policy"], path).toBeTruthy();
    }
  });

  test("static files are covered too", async ({ request }) => {
    for (const path of ["/icon.svg", "/og.jpg", "/robots.txt", "/llms.txt"]) {
      const headers = (await request.get(path)).headers();
      expect(headers["x-content-type-options"], path).toBe("nosniff");
      expect(headers["content-security-policy"], path).toBeTruthy();
    }
  });

  test("the enforced CSP blocks framing, plugins, and third-party loads", async ({ request }) => {
    const csp = parse((await request.get("/")).headers()["content-security-policy"]);
    expect(csp["default-src"]).toEqual(["'self'"]);
    expect(csp["frame-ancestors"]).toEqual(["'none'"]);
    expect(csp["object-src"]).toEqual(["'none'"]);
    expect(csp["base-uri"]).toEqual(["'self'"]);
    expect(csp["form-action"]).toEqual(["'self'"]);
    for (const directive of ["img-src", "font-src", "media-src", "connect-src"]) {
      expect(csp[directive].filter((v) => /^https?:|^\*$/.test(v) && !/vercel/.test(v)), directive).toEqual([]);
    }
    // Never allow eval, and never allow a wildcard script source.
    expect(csp["script-src"]).not.toContain("'unsafe-eval'");
    expect(csp["script-src"]).not.toContain("*");
    expect(csp["script-src"]).not.toContain("data:");
  });

  test("the Report-Only policy has no directive that browsers ignore in that mode", async ({ request }) => {
    // Regression: `upgrade-insecure-requests` in a Report-Only policy makes every page log a console error.
    const headers = (await request.get("/")).headers();
    test.skip(!headers["content-security-policy-report-only"], "production publishes no Report-Only policy");
    const names = Object.keys(parse(headers["content-security-policy-report-only"]));
    for (const ignored of ["upgrade-insecure-requests", "sandbox", "block-all-mixed-content"]) {
      expect(names, ignored).not.toContain(ignored);
    }
  });

  test("inline styles are not allowed in production-like policies", async ({ request, baseURL }) => {
    const csp = parse((await request.get("/")).headers()["content-security-policy"]);
    // Previews add the Vercel toolbar, which needs inline styles; production and local builds do not.
    test.skip(/-lab\.vercel\.app|vercel\.app.*git-/.test(baseURL ?? ""), "preview deployment allows the Vercel toolbar");
    expect(csp["style-src"]).toEqual(["'self'"]);
  });

  test("HSTS is present on deployed https sites", async ({ request, baseURL }) => {
    test.skip(!baseURL?.startsWith("https://"), "local server is http");
    expect((await request.get("/")).headers()["strict-transport-security"]).toMatch(/max-age=\d{7,}/);
  });
});

test.describe("CSP in a real browser", () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`no enforced violations while browsing every page (${scheme})`, async ({ browser }) => {
      test.setTimeout(120_000);
      const context = await browser.newContext({ colorScheme: scheme });
      const page = await context.newPage();
      const read = await watchCsp(page);
      const enforced: string[] = [];
      const strictOnly: string[] = [];

      for (const entry of PAGES) {
        await page.goto(entry.path);
        await page.waitForLoadState("load");
        // Exercise client-side behaviour that may touch styles or scripts.
        for (const link of await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link").all()) await link.hover();
        await page.mouse.wheel(0, 1200);
        await page.waitForTimeout(150);
        for (const v of await read()) {
          const line = `${entry.path}: ${v.directive} blocked=${v.blocked}`;
          (v.disposition === "enforce" ? enforced : strictOnly).push(line);
        }
      }
      await context.close();

      expect(enforced, `enforced CSP violations:\n${enforced.join("\n")}`).toEqual([]);
      // The stricter Report-Only candidate (published on lab/previews) may only object to Next.js's own
      // inline bootstrap scripts. Anything else - styles, images, fonts - would mean the strict policy is
      // closer to enforceable than it looks, or that something regressed.
      const unexpected = strictOnly.filter((line) => !/script-src(-elem)? blocked=inline/.test(line));
      expect(unexpected, `unexpected strict-policy violations:\n${unexpected.join("\n")}`).toEqual([]);
    });
  }

  test("an injected inline handler and an injected foreign script are both refused", async ({ page }) => {
    const read = await watchCsp(page);
    await page.goto("/research");
    const result = await page.evaluate(async () => {
      const outcome: Record<string, unknown> = {};
      window.addEventListener("message", () => (outcome.messaged = true));
      // Foreign script origin: must be blocked by script-src 'self'.
      const foreign = document.createElement("script");
      foreign.src = "https://example.com/evil.js";
      document.head.appendChild(foreign);
      // Foreign image beacon: must be blocked by img-src.
      const beacon = new Image();
      beacon.src = "https://example.com/pixel.gif";
      // Foreign connection: must be blocked by connect-src.
      outcome.fetch = await fetch("https://example.com/").then(() => "allowed", () => "blocked");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return outcome;
    });
    expect(result.fetch).toBe("blocked");
    const blocked = (await read()).filter((v) => v.disposition === "enforce").map((v) => v.directive);
    expect(blocked.some((d) => d.startsWith("script-src"))).toBe(true);
    expect(blocked.some((d) => d.startsWith("img-src"))).toBe(true);
    expect(blocked.some((d) => d.startsWith("connect-src"))).toBe(true);
  });

  test("another website cannot frame the site (clickjacking)", async ({ page, baseURL }) => {
    // Two real servers on other local ports act as "another website". They must be real (not page.route):
    // Chrome blocks frames from route-fulfilled pages to a local target by its own local-network check,
    // which would hide a missing frame-ancestors / X-Frame-Options. The target's own frame-src would also
    // hide it if the frame were opened from the site itself, hence a different origin.
    const listen = (handler: (res: ServerResponse) => void) =>
      new Promise<{ server: Server; origin: string }>((resolve) => {
        const server = createServer((_req, res) => {
          res.writeHead(200, { "content-type": "text/html" });
          handler(res);
        });
        server.listen(0, "127.0.0.1", () => resolve({ server, origin: `http://localhost:${(server.address() as AddressInfo).port}` }));
      });

    const control = await listen((res) => res.end("<h1>control</h1>"));
    const attacker = await listen((res) =>
      res.end(`<iframe src="${control.origin}/"></iframe><iframe src="${baseURL}/research"></iframe>`),
    );
    try {
      await page.goto(`${attacker.origin}/`);
      await expect.poll(() => page.frames().length, { timeout: 10_000 }).toBeGreaterThanOrEqual(3);
      await page.waitForTimeout(800);

      const urls = page.frames().map((frame) => frame.url());
      // Positive control: a page without protective headers does render inside the attacker page.
      expect(urls.some((url) => url.startsWith(`${control.origin}/`)), `control frame did not load: ${urls.join(", ")}`).toBe(true);
      // The site must be refused: the browser shows an error page instead of /research.
      expect(urls.some((url) => url.startsWith(`${baseURL}/research`)), `site rendered inside a foreign frame: ${urls.join(", ")}`).toBe(false);
      expect(urls.some((url) => url.startsWith("chrome-error://")), `expected the browser to refuse the frame: ${urls.join(", ")}`).toBe(true);
    } finally {
      control.server.close();
      attacker.server.close();
    }
  });
});

test.describe("injection probes", () => {
  const probes = [
    "/?q=%3Cscript%3Ealert(1)%3C/script%3E",
    "/research?name=%22%3E%3Csvg%20onload=alert(1)%3E",
    "/trend/%3Cimg%20src=x%20onerror=alert(1)%3E",
    "/hobby/%27%22%3E%3Cscript%3Ealert(1)%3C/script%3E",
    "/cv#%3Cimg%20src=x%20onerror=alert(1)%3E",
  ];
  for (const probe of probes) {
    test(`does not execute or reflect ${probe}`, async ({ page }) => {
      let dialog = false;
      page.on("dialog", async (d) => {
        dialog = true;
        await d.dismiss();
      });
      await page.goto(probe);
      await page.waitForTimeout(200);
      expect(dialog).toBe(false);
      // Next.js echoes the requested path inside its data payload, URL-encoded and inside a script string:
      // inert. What must never happen is the probe becoming live markup.
      const html = await page.content();
      expect(html).not.toMatch(/<script>\s*alert\(1\)/i);
      expect(html).not.toMatch(/<img[^>]+onerror/i);
      expect(html).not.toMatch(/<svg[^>]+onload/i);
      expect(await page.locator("img[onerror], svg[onload], [onclick]").count()).toBe(0);
    });
  }
});
