// End-to-end regression test for the daily Trend refresh: it runs the real collector
// (scripts/fetch-digest.mjs) against a local fake feed server and checks the edition it writes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const script = path.join(root, "scripts", "fetch-digest.mjs");

const rss = (items) =>
  `<?xml version="1.0"?><rss version="2.0"><channel><title>t</title>${items
    .map(([title, link]) => `<item><title>${title}</title><link>${link}</link><description>d</description></item>`)
    .join("")}</channel></rss>`;

const FEED = rss([
  ["Safe item", "https://example.com/safe"],
  ["Upgrade me", "http://example.com/http"],
  ["Script link", "javascript:alert(1)"],
  ["Data link", "data:text/html,hi"],
  ["Credentials link", "https://user:pass@example.com/x"],
  ["Loopback link", "https://127.0.0.1/x"],
  ["Local file link", "file:///etc/passwd"],
]);

let server;
let base;
let sandbox;
let sourcesPath;
let interestsPath;
let editionsDir;

before(async () => {
  server = createServer((req, res) => {
    if (req.url === "/feed.xml") {
      res.writeHead(200, { "content-type": "application/rss+xml" }).end(FEED);
    } else {
      res.writeHead(500).end("boom");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;

  sandbox = mkdtempSync(path.join(tmpdir(), "digest-refresh-"));
  sourcesPath = path.join(sandbox, "sources.json");
  interestsPath = path.join(sandbox, "interests.json");
  editionsDir = path.join(sandbox, "editions");
  writeFileSync(
    sourcesPath,
    JSON.stringify({
      sources: [
        { id: "good", name: "Good feed", lane: "tech", kind: "rss", url: `${base}/feed.xml`, limit: 20 },
        { id: "broken", name: "Broken feed", lane: "design", kind: "rss", url: `${base}/missing.xml`, limit: 5 },
      ],
    }),
  );
  writeFileSync(interestsPath, JSON.stringify({ keywords: [] }));
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  rmSync(sandbox, { recursive: true, force: true });
});

// Must be async: the fake feed server lives in this process, so blocking here would starve it.
const run = () =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      cwd: root,
      env: { ...process.env, DIGEST_SOURCES_PATH: sourcesPath, DIGEST_INTERESTS_PATH: interestsPath, DIGEST_EDITIONS_DIR: editionsDir },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (status) => resolve({ status, stdout, stderr }));
  });

test("the collector writes an edition and keeps only safe https links", async () => {
  const result = await run();
  assert.equal(result.status, 0, result.stderr);

  const files = readdirSync(editionsDir);
  assert.equal(files.length, 1);
  assert.match(files[0], /^\d{4}-\d{2}-\d{2}\.json$/);

  const edition = JSON.parse(readFileSync(path.join(editionsDir, files[0]), "utf8"));
  assert.equal(edition.date, files[0].replace(".json", ""));
  assert.equal(edition.timezone, "Asia/Seoul");
  assert.deepEqual(
    edition.items.map((item) => [item.title, item.url]),
    [
      ["Safe item", "https://example.com/safe"],
      ["Upgrade me", "https://example.com/http"],
    ],
  );
  // Each unsafe link is reported, not silently swallowed.
  assert.match(result.stderr, /unsafe url/);
});

test("a failing source is recorded without stopping the refresh", () => {
  const [file] = readdirSync(editionsDir);
  const edition = JSON.parse(readFileSync(path.join(editionsDir, file), "utf8"));
  assert.deepEqual(edition.failures.map((f) => f.sourceId), ["broken"]);
});

test("running again on the same day leaves the edition untouched", async () => {
  const [file] = readdirSync(editionsDir);
  const before = readFileSync(path.join(editionsDir, file), "utf8");
  const result = await run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /already exists/);
  assert.equal(readFileSync(path.join(editionsDir, file), "utf8"), before);
});
