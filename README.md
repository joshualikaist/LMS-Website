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

## Tests and checks

```bash
npm run lint          # ESLint (next/core-web-vitals + typescript)
npm run typecheck     # tsc --noEmit
npm run test:unit     # link policy, page loader, existing editions, daily refresh against a fake feed server
npm run audit:prod    # npm audit for production dependencies, fails on high or critical
npm run build && npm run test:e2e   # Playwright against a local production build
```

`test:e2e` runs on desktop and phone viewports, in light and dark mode: page loading and console errors,
navigation, Trend (links, calendar, editions), CV and Research, responsive widths, WCAG A/AA with axe,
keyboard access, 404s, security headers, CSP in a real browser, clickjacking, and injection probes.

- Locally, set `PW_CHANNEL=chrome` to reuse an installed Chrome; otherwise run `npx playwright install chromium` once.
- `E2E_BASE_URL=https://joshualisky-lab.vercel.app npm run test:e2e` runs the same suite against a deployed site.
- A failed run leaves `playwright-report/` and `test-results/` (screenshots and traces).

`.github/workflows/ci.yml` runs all of this on pull requests and on pushes to `lab`, plus weekly. The three
jobs are named `audit`, `lint-and-unit` and `e2e`; mark them as required status checks in the branch
protection rule for `main` to block merges when they fail. CI only reads the repository and is independent of
the daily Trend workflow.

## Security notes

- **Headers** (`next.config.ts`): a Content-Security-Policy that allows only same-origin resources, plus
  `X-Content-Type-Options`, `X-Frame-Options`, `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy` and
  `Cross-Origin-Opener-Policy`. HSTS is left to Vercel.
- **Why `script-src` has `'unsafe-inline'`:** Next.js writes its page data into every statically rendered page as
  inline scripts, and a per-request nonce would make every page render dynamically. `'unsafe-eval'` is not used.
  Outside production a stricter Report-Only policy without the exception is also published; the E2E suite fails if
  it reports anything other than those inline scripts.
- **Trend links:** `content/digest/safe-url.mjs` is the single rule (https only, no credentials, odd ports or local
  hosts). The collector drops anything else, and `content/digest/load.ts` filters again before rendering.
- **Dependencies:** `overrides.postcss` pins the patched PostCSS because Next 15 pins an old one.

## Still by hand

These need files or account URLs before they can go live:

- Resumes: PDFs in `public/cv/`, listed in `site.resumes` (`content/site.ts`). The Word originals stay out of the repo (`/*.docx` is ignored); web copies have the phone number removed and clean author metadata.
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
