import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { safeHttpsUrl } from "./safe-url.mjs";
import type { DigestEdition } from "./types";

const EDITIONS_DIR = path.join(process.cwd(), "content/digest/editions");
const DATE_FILE = /^\d{4}-\d{2}-\d{2}\.json$/;

export function listEditionDates(): string[] {
  if (!existsSync(EDITIONS_DIR)) return [];
  return readdirSync(EDITIONS_DIR)
    .filter((file) => DATE_FILE.test(file))
    .map((file) => file.replace(/\.json$/, ""))
    .sort()
    .reverse();
}

export function getEdition(date: string): DigestEdition | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const file = path.join(EDITIONS_DIR, `${date}.json`);
  if (!existsSync(file)) return null;
  const edition = JSON.parse(readFileSync(file, "utf8")) as DigestEdition;
  // Never render a link that is not a plain https URL, whatever the JSON on disk says.
  const items = edition.items.flatMap((item) => {
    const url = safeHttpsUrl(item.url);
    return url ? [{ ...item, url }] : [];
  });
  return { ...edition, items };
}

export function getLatestEdition(): DigestEdition | null {
  const dates = listEditionDates();
  return dates[0] ? getEdition(dates[0]) : null;
}
