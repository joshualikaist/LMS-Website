/**
 * Morning digest snapshot.
 * Writes content/digest/editions/YYYY-MM-DD.json (Asia/Seoul date).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES_PATH = path.join(ROOT, "content/digest/sources.json");
const INTERESTS_PATH = path.join(ROOT, "content/digest/interests.json");
const EDITIONS_DIR = path.join(ROOT, "content/digest/editions");
const UA = "MinseokLiDigest/1.0 (+https://github.com/joshualikaist)";
const TIMEOUT_MS = 12_000;
const ITEMS_PER_LANE = 5;
const LANES = ["trend", "economy", "design", "tech"];

const seoulDate = (value = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(value);

const daysAgoSeoul = (days) => seoulDate(new Date(Date.now() - days * 86_400_000));

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const decodeEntities = (raw) =>
  raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));

const clip = (text, max = 180) => {
  const clean = stripTags(decodeEntities(text || "")).trim();
  if (!clean) return null;
  return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
};

async function http(url, headers = {}) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json, application/rss+xml, application/xml, text/xml, */*", ...headers },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} for ${url}`);
  }
  return res;
}

function item({ source, sourceId, lane, title, url, summary = null, score = null, scoreLabel = null, author = null, publishedAt = null }) {
  const cleanTitle = stripTags(decodeEntities(title || "")).trim();
  const cleanUrl = (url || "").trim();
  if (!cleanTitle || !cleanUrl) return null;
  return {
    id: `${sourceId}:${slug(cleanUrl)}`,
    lane,
    source,
    sourceId,
    title: cleanTitle,
    url: cleanUrl,
    summary,
    comment: null,
    score: typeof score === "number" && Number.isFinite(score) ? score : null,
    scoreLabel,
    author: author ? String(author) : null,
    publishedAt,
    interestHits: [],
  };
}

function haystack(entry) {
  return `${entry.title} ${entry.summary || ""} ${entry.source}`.toLowerCase();
}

function annotate(entry, keywords) {
  const text = haystack(entry);
  const hits = [];
  let boost = 0;
  for (const { term, weight } of keywords) {
    if (text.includes(term.toLowerCase())) {
      hits.push(term);
      boost += weight;
    }
  }
  const comment = hits.length
    ? `Watch — matches ${hits.slice(0, 3).join(", ")}.`
    : entry.summary
      ? clip(entry.summary, 110)
      : `From ${entry.source}.`;
  return { ...entry, interestHits: hits, comment, _boost: boost };
}

function extractTag(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i"));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (plain) return plain[1].trim();
  return "";
}

function extractLink(block) {
  const href = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  if (href) return href[1].trim();
  return extractTag(block, "link");
}

function parseFeed(xml, limit) {
  const blocks = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) || [];
  const items = [];
  for (const block of blocks) {
    const title = extractTag(block, "title");
    const url = extractLink(block);
    const summary = extractTag(block, "description") || extractTag(block, "summary") || extractTag(block, "content");
    const published =
      extractTag(block, "pubDate") || extractTag(block, "published") || extractTag(block, "updated") || extractTag(block, "dc:date");
    const author = extractTag(block, "dc:creator") || extractTag(block, "author") || extractTag(block, "name");
    let publishedAt = null;
    if (published) {
      const ms = Date.parse(published);
      if (Number.isFinite(ms)) publishedAt = new Date(ms).toISOString();
    }
    const parsed = {
      title,
      url,
      summary: clip(summary),
      publishedAt,
      author: stripTags(decodeEntities(author)) || null,
    };
    items.push(parsed);
    if (items.length >= limit) break;
  }
  return items;
}

async function fetchHn(source) {
  const ids = await (await http("https://hacker-news.firebaseio.com/v0/topstories.json")).json();
  const picked = ids.slice(0, Math.max(source.limit * 2, 20));
  const stories = await Promise.all(
    picked.map(async (id) => {
      const data = await (await http(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)).json();
      if (!data || data.type !== "story" || !data.title) return null;
      return item({
        source: source.name,
        sourceId: source.id,
        lane: source.lane,
        title: data.title,
        url: data.url || `https://news.ycombinator.com/item?id=${data.id}`,
        score: data.score ?? null,
        scoreLabel: "pts",
        author: data.by ?? null,
        publishedAt: data.time ? new Date(data.time * 1000).toISOString() : null,
      });
    }),
  );
  return stories.filter(Boolean).slice(0, source.limit);
}

async function fetchLobsters(source) {
  const rows = await (await http("https://lobste.rs/hottest.json")).json();
  return rows
    .slice(0, source.limit)
    .map((row) =>
      item({
        source: source.name,
        sourceId: source.id,
        lane: source.lane,
        title: row.title,
        url: row.url || `https://lobste.rs/s/${row.short_id}`,
        score: row.score ?? null,
        scoreLabel: "pts",
        author: row.submitter_user?.username || row.submitter_user || null,
        publishedAt: row.created_at || null,
      }),
    )
    .filter(Boolean);
}

async function fetchGithubSearch(source) {
  const since = daysAgoSeoul(7);
  const q = `language:${source.language} created:>=${since}`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${source.limit}`;
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const data = await (await http(url, headers)).json();
  return (data.items || [])
    .map((repo) =>
      item({
        source: source.name,
        sourceId: source.id,
        lane: source.lane,
        title: repo.full_name,
        url: repo.html_url,
        summary: clip(repo.description || "", 160),
        score: repo.stargazers_count ?? null,
        scoreLabel: "stars",
        author: repo.owner?.login ?? null,
        publishedAt: repo.created_at || null,
      }),
    )
    .filter(Boolean);
}

async function fetchDevto(source) {
  const rows = await (await http(`https://dev.to/api/articles?top=1&per_page=${source.limit}`)).json();
  return rows
    .map((row) =>
      item({
        source: source.name,
        sourceId: source.id,
        lane: source.lane,
        title: row.title,
        url: row.url,
        summary: clip(row.description || "", 180),
        score: row.positive_reactions_count ?? null,
        scoreLabel: "rxn",
        author: row.user?.name || row.user?.username || null,
        publishedAt: row.published_at || null,
      }),
    )
    .filter(Boolean);
}

async function fetchRss(source) {
  const xml = await (await http(source.url, { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" })).text();
  return parseFeed(xml, source.limit)
    .map((row) =>
      item({
        source: source.name,
        sourceId: source.id,
        lane: source.lane,
        title: row.title,
        url: row.url,
        summary: row.summary,
        author: row.author,
        publishedAt: row.publishedAt,
      }),
    )
    .filter(Boolean);
}

async function runSource(source) {
  switch (source.kind) {
    case "hn":
      return fetchHn(source);
    case "lobsters":
      return fetchLobsters(source);
    case "github-search":
      return fetchGithubSearch(source);
    case "devto":
      return fetchDevto(source);
    case "rss":
      return fetchRss(source);
    default:
      throw new Error(`Unknown source kind: ${source.kind}`);
  }
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((entry) => {
    const key = entry.url.replace(/\/+$/, "").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rankByScore(items) {
  return [...items].sort((a, b) => {
    const boostDiff = (b._boost ?? 0) - (a._boost ?? 0);
    if (boostDiff !== 0) return boostDiff;
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });
}

function stripRankFields(entry) {
  const { _boost, ...rest } = entry;
  return rest;
}

function trimByLane(items, keywords) {
  const unique = dedupe(items).map((entry) => annotate(entry, keywords));
  return LANES.flatMap((lane) =>
    rankByScore(unique.filter((item) => item.lane === lane)).slice(0, ITEMS_PER_LANE).map(stripRankFields),
  );
}

async function main() {
  const { sources } = JSON.parse(await readFile(SOURCES_PATH, "utf8"));
  const { keywords } = JSON.parse(await readFile(INTERESTS_PATH, "utf8"));
  const date = seoulDate();
  const fetchedAt = new Date().toISOString();
  const failures = [];
  const collected = [];

  const results = await Promise.allSettled(sources.map((source) => runSource(source)));
  results.forEach((result, i) => {
    const source = sources[i];
    if (result.status === "fulfilled") {
      collected.push(...result.value);
      if (result.value.length === 0) {
        failures.push({ sourceId: source.id, error: "no items" });
      }
    } else {
      failures.push({ sourceId: source.id, error: result.reason?.message || String(result.reason) });
      console.error(`[digest] ${source.id} failed:`, result.reason?.message || result.reason);
    }
  });

  const edition = {
    date,
    fetchedAt,
    timezone: "Asia/Seoul",
    items: trimByLane(collected, keywords),
    failures,
  };

  await mkdir(EDITIONS_DIR, { recursive: true });
  const outPath = path.join(EDITIONS_DIR, `${date}.json`);
  await writeFile(outPath, `${JSON.stringify(edition, null, 2)}\n`, "utf8");

  console.log(
    `[digest] ${date} · ${edition.items.length} items · ${failures.length} source failure(s) → ${path.relative(ROOT, outPath)}`,
  );
  if (failures.length) {
    for (const failure of failures) console.log(`  - ${failure.sourceId}: ${failure.error}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
