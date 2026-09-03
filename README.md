# LMS Website

Personal academic portfolio for Minseok Li, focused on robotics, autonomous systems, and learning-based UAV navigation at KAIST.

Includes a separate **Morning Digest** feed at `/digest` — trend, tech, and design, fetched daily at 10:00 KST.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser. Set `NEXT_PUBLIC_SITE_URL` from `.env.example` when deploying to a custom domain.

## Morning Digest

The digest is a separate section of the site (own nav and layout), linked from the homepage **Study** block.

### Fetch an edition locally

```bash
npm run digest
```

This writes `content/digest/editions/YYYY-MM-DD.json` using the sources in `content/digest/sources.json`.

### View it

- Latest edition: `http://localhost:3000/digest`
- Archive: `http://localhost:3000/digest/YYYY-MM-DD`

### Automatic daily updates

After you push to GitHub, the workflow in `.github/workflows/daily-digest.yml` runs every day at **10:00 KST** (01:00 UTC):

1. Fetches all configured sources
2. Saves the day's JSON edition
3. Commits and pushes
4. Triggers a Vercel redeploy

You can also run it manually from **Actions → Daily digest → Run workflow**.

### Optional: separate subdomain later

To host Digest on its own URL later (e.g. `https://digest.example.com`), set:

```bash
NEXT_PUBLIC_DIGEST_URL=https://digest.example.com
```

The portfolio homepage will then link out to that URL instead of `/digest`.
