---
description: Ship lab to production (joshualisky.vercel.app) with every gate and post-deploy checks
allowed-tools: Bash, PowerShell, Read
---

Deploy the `lab` branch to production by fast-forwarding `main`. Typing `/deploy` is the explicit approval
to deploy. Work through the steps in order and stop at the first failure: never report success after a
failed gate, and never "fix" a failure by skipping a check.

Hard rules: never run `vercel alias`, never add or change a VERCEL_TOKEN or any environment variable or
domain setting, never force-push, never edit `main` directly except the fast-forward below, and never change
GitHub branch protection. The production domain follows new deployments by itself.

## 1. Before merging
1. Work from the repo root on branch `lab` with a clean tree (`git status --short` empty). Stop if not.
2. `git fetch origin`. Record `origin/main` and `origin/lab` SHAs.
3. If `git log origin/lab..origin/main` shows commits other than `github-actions[bot]` digest snapshots,
   stop and report them. If it shows only digest snapshots, run `git merge --ff-only origin/main` on
   `lab`, rerun step 2 and continue (lab must contain everything on main).
4. Confirm `git merge-base --is-ancestor origin/main origin/lab` succeeds (a fast-forward is possible).
   Show `git log --oneline origin/main..origin/lab` so the user sees what ships.
5. Note the current production deployment (`vercel ls` first Production row) as the rollback target.
6. Free ports first: stop anything listening on 3100 and 3123 (PowerShell `Get-NetTCPConnection`).

## 2. Gates, on the exact commit being shipped (`lab` HEAD)
Run and report each result; all must pass:
- `npm run audit:prod` (production dependencies: 0 vulnerabilities, exit code 0)
- `npm run lint` (0 errors), `npm run typecheck`, `npm run test:unit`, `npm run build`
- `PW_CHANNEL=chrome npx playwright test` (the whole suite, 0 failed, 0 flaky)
- GitHub CI for this SHA: `gh run list --branch lab --workflow CI --limit 1` must be `completed success`
  for the same SHA as `lab` HEAD (wait for it if still running).

## 3. Merge
Re-fetch; if `origin/main` moved since step 2, stop and start over. Then:
`git checkout main && git merge --ff-only origin/main && git merge --ff-only origin/lab && git push origin main`,
and switch back to `lab` afterwards (`git checkout lab`).

## 4. After deploying
1. Wait for the new Production deployment (`vercel ls`): `Ready`, target `production`, built from the new SHA
   (`gh api repos/joshualikaist/LMS-Website/deployments`). `vercel inspect https://joshualisky.vercel.app`
   must show that same deployment with the domain attached. If the domain still serves the old deployment,
   do NOT change aliases: investigate why and report.
2. Production response headers: `curl -sI https://joshualisky.vercel.app/` must include Content-Security-Policy
   (with `frame-ancestors 'none'` and `style-src 'self'`, no vercel.live), X-Content-Type-Options,
   X-Frame-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy, Strict-Transport-Security,
   and no Report-Only header.
3. `E2E_BASE_URL=https://joshualisky.vercel.app PW_CHANNEL=chrome npx playwright test` (stay on the same
   branch while it runs). 0 failed, 0 flaky.
4. Pages return 200: `/ /research /work/motar /research/motar /cv /hobby /hobby/shelton-lms /hobby/babdoduk /trend`,
   and `/trend` shows the newest edition date from `content/digest/editions`.
5. Lab is still its own environment: `https://joshualisky-lab.vercel.app` is a preview deployment, robots
   `Disallow: /`, and has a Report-Only header.

## 5. Report
Give PASS, FAIL or NOT VERIFIED with: shipped SHA, deployment id and state, production E2E counts, header
check result, production vulnerability count, anything skipped and why. On any failure say so first, keep
production as it is, and offer the rollback target from step 1.5 (restore only after confirming the cause).
