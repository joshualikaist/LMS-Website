// Guards the content that the daily Trend workflow commits: every edition on disk must be
// well-formed and every link must already satisfy the https-only policy.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { safeHttpsUrl } from "../content/digest/safe-url.mjs";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "digest", "editions");
const files = readdirSync(DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
const LANES = new Set(["trend", "economy", "design", "tech"]);

test("there are editions", () => {
  assert.ok(files.length > 0);
});

for (const file of files) {
  test(`edition ${file} is well-formed and its links are safe`, () => {
    const edition = JSON.parse(readFileSync(path.join(DIR, file), "utf8"));
    assert.equal(edition.date, file.replace(".json", ""));
    assert.equal(edition.timezone, "Asia/Seoul");
    assert.ok(Array.isArray(edition.items) && edition.items.length > 0, "has items");
    assert.ok(Array.isArray(edition.failures));

    const ids = new Set();
    for (const item of edition.items) {
      assert.ok(LANES.has(item.lane), `lane ${item.lane}`);
      assert.ok(typeof item.title === "string" && item.title.trim(), "title");
      assert.ok(typeof item.id === "string" && !ids.has(item.id), `unique id ${item.id}`);
      ids.add(item.id);
      assert.ok(safeHttpsUrl(item.url), `unsafe url in ${file}: ${item.url}`);
      assert.ok(item.url.startsWith("https://"), `not https: ${item.url}`);
    }
  });
}
