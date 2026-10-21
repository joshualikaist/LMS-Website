// The resume PDFs are public downloads. These checks keep the published copies intact and clean.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const files = { en: "public/cv/Minseok_Li_Resume_EN.pdf", ko: "public/cv/Minseok_Li_Resume_KO.pdf" };
const PROFILES = ["https://www.linkedin.com/in/minseokli", "https://www.instagram.com/joshualisky/", "https://github.com/joshualikaist"];

for (const [lang, file] of Object.entries(files)) {
  const bytes = readFileSync(path.join(root, file));
  const text = bytes.toString("latin1");

  test(`${lang}: is a real, reasonably small PDF`, () => {
    assert.equal(bytes.subarray(0, 5).toString("latin1"), "%PDF-");
    assert.ok(bytes.length > 20_000 && bytes.length < 400_000, `size ${bytes.length}`);
  });

  test(`${lang}: the profile icons are clickable`, () => {
    const uris = [...text.matchAll(/\/URI\s*\(([^)]+)\)/g)].map((match) => match[1]);
    for (const url of PROFILES) assert.ok(uris.includes(url), `missing link ${url}; found ${uris.join(", ")}`);
  });

  test(`${lang}: carries no leftover author metadata`, () => {
    for (const name of ["Alex Park", "python-docx"]) {
      assert.ok(!text.includes(name), `${name} found in ${file}`);
      assert.ok(!bytes.includes(Buffer.from(name, "utf16le").swap16()), `${name} (UTF-16) found in ${file}`);
    }
  });
}

test("Word originals are ignored by git (they contain a phone number)", () => {
  const ignore = readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(ignore, /^\/\*\.docx$/m);
});
