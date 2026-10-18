# LMS Website

Personal academic portfolio for Minseok Li — robotics, autonomous systems, and learning-based UAV navigation at KAIST.

**Trend** (`/trend`) is a separate daily board: trend, economy, design, and tech. Fetched at 10:00 KST.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The production URL lives in `content/site.ts`; set `NEXT_PUBLIC_SITE_URL` only when moving to a custom domain.

Only production (`VERCEL_ENV=production`) is indexable. The `lab` branch is a preview: `noindex`, `robots.txt` disallows everything, and Trend editions are not mirrored onto it.

## Trend

Linked from the footer on every page.

```bash
npm run digest
```

Writes `content/digest/editions/YYYY-MM-DD.json` from `content/digest/sources.json`. Keyword boosts live in `content/digest/interests.json`.

- Latest: `http://localhost:3000/trend`
- Archive: `http://localhost:3000/trend/YYYY-MM-DD`
- Legacy `/digest` redirects to `/trend`

GitHub Action `.github/workflows/daily-digest.yml` runs daily at **10:00 KST**. A push to `main` deploys production on Vercel. The digest job also pings a deploy hook so the bot commit still goes live.

Optional later: `NEXT_PUBLIC_DIGEST_URL=https://digest.example.com`

## Still by hand

These need files or account URLs before they can go live:

- CV PDF → `public/cv/` then set `cvPdf` in `content/site.ts` (the download button stays hidden until then)
- MESC screenshot, live URL, and stack → constants at the top of `app/(site)/work/mesc/page.tsx`
- Google Scholar and ORCID URLs in `content/site.ts`

## Cursor skills

Project skills in `.cursor/skills/`:

- `morning-trend` — refresh and curate `/trend`
- `news-aggregator` — wider news scan; optional community packs
- `academic-research` — MOTAR-scoped literature loop; optional [academic-research-skills](https://github.com/Imbad0202/academic-research-skills)

```bash
npx skills add Imbad0202/academic-research-skills --agent cursor
npx @stevegogogo/news-aggregator-skill install --target cursor
```
