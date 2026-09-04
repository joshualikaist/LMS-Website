---
name: news-aggregator
description: Scan today's tech, finance, design, and open-source news across many sources. Use when the user wants a briefing beyond the site Trend board, or says daily scan, AI news, finance updates, or 전세계 핫이슈.
---

# News aggregator

The live website board is still `/trend` via `morning-trend`. Use this skill for a **wider scan** in chat (more sources, deeper read), then optionally promote a feed into `content/digest/sources.json`.

## Install the full community skill (optional)

```bash
npx @stevegogogo/news-aggregator-skill install --target cursor
```

or

```bash
npx skills add cclank/news-aggregator-skill --agent cursor
```

Those packs pull HN, GitHub Trending, Product Hunt, arXiv, BBC/Guardian, Chinese tech/finance lists, etc.

## Scan without extra installs

Fetch in parallel, then rank:

| Lane | Sources |
|---|---|
| Trend | `https://hacker-news.firebaseio.com/v0/topstories.json`, `https://lobste.rs/hottest.json`, TechCrunch RSS |
| Economy | BBC / NPR / Guardian / Reuters business RSS |
| Design | Smashing, CSS-Tricks, NN/g, UX Collective |
| Tech | Dev.to API, arXiv `cs.RO` + `cs.LG` RSS, Hugging Face papers feed, GitHub Search |

Output for the user:

1. Title + URL
2. Source and time
3. One-line why it matters for **this** reader (UAV / robot learning / web design)
4. Mark anything that should be added to `sources.json`

Do not paste full article text. Do not invent headlines. If a feed 404s, skip it and say so.

## After a useful scan

If the user wants it on the site, add the RSS/API to `content/digest/sources.json`, run `npm run digest`, and follow `morning-trend`.
