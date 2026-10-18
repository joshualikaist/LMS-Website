// content/digest/load.ts is the last line of defence: even if an unsafe link got into an edition
// file on disk, the page must never receive it.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const sandbox = mkdtempSync(path.join(tmpdir(), "digest-loader-"));
const editions = path.join(sandbox, "content", "digest", "editions");
mkdirSync(editions, { recursive: true });

const item = (id, url) => ({ id, lane: "tech", source: "t", sourceId: "t", title: id, url, summary: null, comment: null, score: null, scoreLabel: null, author: null, publishedAt: null, interestHits: [] });
writeFileSync(
  path.join(editions, "2099-01-01.json"),
  JSON.stringify({
    date: "2099-01-01",
    fetchedAt: "2099-01-01T00:00:00Z",
    timezone: "Asia/Seoul",
    failures: [],
    items: [
      item("good", "https://example.com/a"),
      item("upgraded", "http://example.com/b"),
      item("js", "javascript:alert(1)"),
      item("data", "data:text/html,x"),
      item("creds", "https://u:p@example.com/"),
    ],
  }),
);

// load.ts resolves the editions directory from process.cwd() when it is imported.
const previousCwd = process.cwd();
process.chdir(sandbox);
const { getEdition, listEditionDates } = await import(pathToFileURL(path.join(root, "content", "digest", "load.ts")).href);
process.chdir(previousCwd);

after(() => rmSync(sandbox, { recursive: true, force: true }));

test("unsafe links are dropped and http is upgraded before rendering", () => {
  const edition = getEdition("2099-01-01");
  assert.deepEqual(edition.items.map((i) => [i.id, i.url]), [
    ["good", "https://example.com/a"],
    ["upgraded", "https://example.com/b"],
  ]);
});

test("edition lookup only accepts date-shaped names", () => {
  assert.deepEqual(listEditionDates(), ["2099-01-01"]);
  assert.equal(getEdition("../../etc/passwd"), null);
  assert.equal(getEdition("2099-1-1"), null);
  assert.equal(getEdition("2099-01-02"), null);
});
