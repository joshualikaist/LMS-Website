---
name: morning-trend
description: Fetch, curate, and update the daily Trend board on this site (trend / economy / design / tech). Use when the user asks to refresh Trend, change digest sources, write comments, or debug the morning snapshot.
---

# Morning Trend

This repo already has a scheduled snapshot. Do not invent a second pipeline.

## Layout

- Page: `/trend` (legacy `/digest` redirects here)
- Sources: `content/digest/sources.json`
- Interest boost terms: `content/digest/interests.json`
- Snapshot files: `content/digest/editions/YYYY-MM-DD.json`
- Fetcher: `scripts/fetch-digest.mjs`
- Cron: `.github/workflows/daily-digest.yml` at 10:00 KST

## Refresh locally

```bash
npm run digest
```

Then check `/trend`. Each lane keeps **five** items. Matching keywords (UAV, robot, PPO, Isaac, Next.js, design system) get a boost and a `comment` line.

## When adding a source

1. Prefer public RSS or unauthenticated JSON (HN, Lobsters, Dev.to, arXiv, GitHub Search with `GITHUB_TOKEN`).
2. Set `lane` to one of `trend | economy | design | tech`.
3. Keep `limit` small (6–10). The board still trims to five per lane.
4. Re-run `npm run digest`. If a source fails, leave it in `failures` rather than crashing the edition.

## Comments

`comment` is generated in the fetcher:

- Keyword hit → `Watch — matches …`
- Else clipped `summary`
- Else `From {source}.`

Do not hand-write comments into old JSON unless the user asks. Change `interests.json` or the annotate() logic instead.

## Deploy

Digest snapshots always ship. Do not wait for 배포.

The GitHub Action writes the edition on `main`, copies the JSON onto `lab`, pushes both, then points `joshualisky.vercel.app` and `joshualisky-lab.vercel.app` at those deploys. Do not merge other homepage / nav commits just to move a snapshot. Do not run a separate `vercel deploy` unless the Git deploy failed.

If today’s board is missing on a live URL: confirm the date’s JSON is on that branch, then re-alias.
