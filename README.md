# LMS Website

Personal academic portfolio for Minseok Li — robotics, autonomous systems, and learning-based UAV navigation at KAIST.

**Trend** (`/trend`) is a separate daily board: trend, economy, design, and tech. Fetched at 10:00 KST.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Set `NEXT_PUBLIC_SITE_URL` from `.env.example` on a custom domain.

## Trend

Linked from the homepage **Study** block and the nav.

```bash
npm run digest
```

Writes `content/digest/editions/YYYY-MM-DD.json` from `content/digest/sources.json`. Keyword boosts live in `content/digest/interests.json`.

- Latest: `http://localhost:3000/trend`
- Archive: `http://localhost:3000/trend/YYYY-MM-DD`
- Legacy `/digest` redirects to `/trend`

GitHub Action `.github/workflows/daily-digest.yml` runs daily at **10:00 KST**. If Vercel is not connected to GitHub, also run `npx vercel deploy --prod`.

Optional later: `NEXT_PUBLIC_DIGEST_URL=https://digest.example.com`

## Notes

Published field notes under `/notes`. Bodies live in `content/notes.ts`.

## Still by hand

These need files or account URLs before they can go live:

- Profile photo (upload on the homepage in local/dev, or add under `public/`)
- CV PDF → `public/cv/` then set `cvPdf` in `content/site.ts`
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
