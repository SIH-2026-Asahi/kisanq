# KisanQ — Mandi Slot Booking & Live Token Queue

Multilingual (English / Hindi / Punjabi) mandi slot booking and live token
queue for farmers, with a farmer portal and an admin dashboard. Runs entirely
client-side (state is kept in `localStorage`) — no backend needed.

## Run locally

```bash
npm install
npm run dev
```

Open the printed `localhost` URL.

## Build

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## Deploy to GitHub Pages

1. In `vite.config.ts`, set `base` to `"/<your-repo-name>/"` (already set to
   `"/kisanq/"` — change it if you rename the repo).
2. Push this repo to GitHub with the default branch named `main`.
3. In the repo settings → **Pages**, set **Source** to **GitHub Actions**.
4. Push to `main` — the included workflow
   (`.github/workflows/deploy.yml`) builds and deploys automatically.

Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.

(Alternative: `npm run deploy` uses the `gh-pages` package to push `dist/` to
a `gh-pages` branch instead, if you'd rather not use Actions.)

## What was wrong with the previous export

The earlier zip only contained the `src/` folder from a TanStack Start
project (a full-stack SSR framework) — no `package.json`, no build config,
and no HTML entry point, so there was nothing for a laptop to actually run.
It also pulled in server rendering, routing, and a large shadcn/radix UI
library that the app's actual code never used.

Since every screen here is plain client-side React reading/writing
`localStorage` (no server functions, no extra routes), this version drops
all of that and rebuilds it as a standard Vite + React SPA — the same UI
and logic, but a project that installs, runs, and deploys cleanly, and is
far simpler to host as a static GitHub Pages site.
